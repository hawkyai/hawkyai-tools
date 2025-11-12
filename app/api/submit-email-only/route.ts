
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { z } from "zod"

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Attio CRM configuration
const ATTIO_API_KEY = process.env.ATTIO_API_KEY
const ATTIO_API_URL = "https://api.attio.com/v2"

// Form validation schema
const formSchema = z.object({
    email: z.string().email(),
})

type CRMResult<T = unknown> = {
    success: boolean
    data?: T
    error?: string
    alreadyExists?: boolean
}

type EmailOnlyFormData = {
    email: string
    text?: string
    [key: string]: unknown
}

// Function to handle OAuth callback and token exchange
export async function POST(request: Request) {
    try {
        // Debug environment variables
        console.log('Environment check:')
        console.log('ATTIO_API_KEY:', process.env.ATTIO_API_KEY ? 'Set' : 'Not set')

        // Get form data from request
        const rawRequestData = await request.json()
        console.log("Received formData:", rawRequestData); // Debug log

        const validationResult = formSchema.safeParse(rawRequestData)
        if (!validationResult.success) {
            console.warn("Form data validation failed:", validationResult.error.flatten())
            return NextResponse.json({
                success: false,
                error: "Invalid form submission",
                issues: validationResult.error.flatten()
            }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            })
        }

        const formData: EmailOnlyFormData = {
            ...rawRequestData,
            email: validationResult.data.email,
            text: typeof rawRequestData?.text === 'string' ? rawRequestData.text : undefined,
        }

        // Generate submission ID and timestamp
        const submissionId = uuidv4()

        // Check if this is a compliance checker email submission
        const isComplianceCheckerSubmission = typeof formData.text === 'string' && formData.text.includes('compliance checker')

        if (isComplianceCheckerSubmission) {
            // Handle compliance checker email submission - only send to Slack
            const slackResult = await sendComplianceCheckerSlackNotification(formData, submissionId)
            if (slackResult.success) {
                return NextResponse.json({ 
                    success: true, 
                    slackSuccess: slackResult.success
                }, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                })
            } else {
                return NextResponse.json({ 
                    success: false, 
                    error: "Slack notification failed",
                    slackError: slackResult.error
                }, { 
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                })
            }
        } else {
            // Handle regular form submission - send to Attio and Slack
            const slackResult = await sendSlackNotification(formData, submissionId)
            if (!slackResult.success) {
                console.error("Slack notification error:", slackResult.error)
            }

            // Submit to Attio CRM when API key is available
            const email = formData.email
            const emailDomain = extractDomainFromEmail(email)
            let attioCompanyResult: CRMResult | null = null
            let attioPersonResult: CRMResult | null = null

            if (ATTIO_API_KEY) {
                if (emailDomain) {
                    attioCompanyResult = await createAttioCompany(emailDomain, submissionId)
                    if (!attioCompanyResult.success) {
                        console.error("Attio Company CRM error:", attioCompanyResult.error)
                    }
                } else {
                    console.warn("Unable to extract domain from email for Attio company creation")
                }

                attioPersonResult = await createAttioPerson(email, submissionId, emailDomain)
                if (!attioPersonResult.success) {
                    console.error("Attio Person CRM error:", attioPersonResult.error)
                }
            } else {
                console.warn("ATTIO_API_KEY not configured; skipping Attio CRM submission")
            }

            const attioSuccess =
                Boolean(attioPersonResult?.success) ||
                Boolean(attioCompanyResult?.success)

            // Return success if any downstream system succeeded
            if (slackResult.success || attioSuccess) {
                return NextResponse.json({ 
                    success: true, 
                    slackSuccess: slackResult.success,
                    attioPersonSuccess: attioPersonResult?.success ?? false,
                    attioCompanySuccess: attioCompanyResult?.success ?? false,
                    attioPersonData: attioPersonResult?.data,
                    attioCompanyData: attioCompanyResult?.data
                }, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                })
            } else {
                return NextResponse.json({ 
                    success: false, 
                    error: "Both Attio CRM and Slack notifications failed",
                    slackError: slackResult.error,
                    attioErrors: {
                        person: attioPersonResult?.error,
                        company: attioCompanyResult?.error
                    }
                }, { 
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                })
            }
        }
    } catch (error: any) {
        console.error("Server error:", error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        return NextResponse.json({ 
            success: false, 
            error: errorMessage || "Server error processing your request",
            details: error instanceof Error ? error.stack : undefined
        }, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    }
}

// Handle CORS preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

/**
 * Extracts the domain part from an email address.
 * @param email - The email address received from the form.
 * @returns The domain string or null when unavailable.
 */
function extractDomainFromEmail(email: string): string | null {
    if (!email || typeof email !== 'string') {
        return null;
    }
    const atIndex = email.indexOf('@');
    if (atIndex === -1 || atIndex === email.length - 1) {
        return null;
    }
    return email.slice(atIndex + 1).toLowerCase();
}

/**
 * Derives a human-readable name from an email local-part.
 * @param email - The email address used to build the name.
 * @returns A title-cased name string.
 */
function deriveNameFromEmail(email: string): string {
    const localPart = email.split('@')[0] ?? '';
    if (!localPart) {
        return '';
    }
    const normalized = localPart.replace(/[._-]+/g, ' ').trim();
    return normalized
        .split(' ')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

/**
 * Extracts the Attio record ID from an API response.
 * @param data - The response payload returned by Attio.
 * @returns The record identifier or null when missing.
 */
function extractRecordIdFromResponse(data: unknown): string | null {
    if (!data || typeof data !== 'object') {
        return null;
    }
    const candidate = data as {
        data?: { id?: { record_id?: string } }
        id?: { record_id?: string }
    };
    if (candidate.data?.id?.record_id) {
        return candidate.data.id.record_id;
    }
    if (candidate.id?.record_id) {
        return candidate.id.record_id;
    }
    return null;
}

/**
 * Fetches an Attio company by domain.
 * @param domain - The domain used to search within Attio.
 */
async function fetchCompanyByDomain(domain: string): Promise<CRMResult> {
    try {
        if (!ATTIO_API_KEY) {
            return { success: false, error: 'No API key available' };
        }
        const response = await fetch(`${ATTIO_API_URL}/objects/companies/records?filter=domains.eq.${encodeURIComponent(domain)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ATTIO_API_KEY}`,
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        if (!response.ok) {
            return { success: false, error: `Failed to fetch company: ${response.status}` };
        }
        if (Array.isArray(result?.data) && result.data.length > 0) {
            return { success: true, data: result.data[0] };
        }
        return { success: false, error: 'Company not found' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Fetches an Attio person by email address.
 * @param email - The email used to search within Attio.
 */
async function fetchPersonByEmail(email: string): Promise<CRMResult> {
    try {
        if (!ATTIO_API_KEY) {
            return { success: false, error: 'No API key available' };
        }
        const response = await fetch(`${ATTIO_API_URL}/objects/people/records?filter=email_addresses.eq.${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ATTIO_API_KEY}`,
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        if (!response.ok) {
            return { success: false, error: `Failed to fetch person: ${response.status}` };
        }
        if (Array.isArray(result?.data) && result.data.length > 0) {
            return { success: true, data: result.data[0] };
        }
        return { success: false, error: 'Person not found' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Creates or fetches a company record in Attio CRM.
 * @param domain - The domain derived from the email address.
 * @param submissionId - The unique submission identifier.
 */
async function createAttioCompany(domain: string, submissionId: string): Promise<CRMResult> {
    try {
        if (!ATTIO_API_KEY) {
            throw new Error('Authentication failed: No API key available. Please check your Attio credentials.');
        }
        const domainParts = domain.split('.');
        const baseName = domainParts[0] ?? domain;
        const companyName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        const companyData = {
            data: {
                values: {
                    name: companyName,
                    domains: [domain],
                    description: `Company created from email-only submission. Domain: ${domain}. Submission ID: ${submissionId}`
                }
            }
        };
        console.log('Sending company data to Attio CRM:', JSON.stringify(companyData, null, 2));
        const response = await fetch(`${ATTIO_API_URL}/objects/companies/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ATTIO_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(companyData)
        });
        const result = await response.json();
        console.log('Attio Company API response status:', response.status);
        console.log('Attio Company API response:', JSON.stringify(result, null, 2));
        if (!response.ok) {
            const isUniquenessConflict = result?.code === 'uniqueness_conflict';
            if (response.status === 409 || response.status === 422 || isUniquenessConflict) {
                console.warn('Company may already exist in Attio. Fetching existing company...');
                const existingCompany = await fetchCompanyByDomain(domain);
                if (existingCompany.success) {
                    return { success: true, data: existingCompany.data, alreadyExists: true };
                }
                console.warn('Could not retrieve existing company details; returning conflict payload.');
                return { success: true, data: result, alreadyExists: true };
            }
            throw new Error(`Attio Company API error: ${response.status} - ${JSON.stringify(result)}`);
        }
        console.log('Attio CRM company created successfully:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating Attio company:', error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * Creates or fetches a person record in Attio CRM.
 * @param email - The lead email address.
 * @param submissionId - The unique submission identifier.
 * @param domain - Optional domain used for description context.
 */
async function createAttioPerson(email: string, submissionId: string, domain?: string | null): Promise<CRMResult> {
    try {
        if (!ATTIO_API_KEY) {
            throw new Error('Authentication failed: No API key available. Please check your Attio credentials.');
        }
        const derivedName = deriveNameFromEmail(email);
        const personData = {
            data: {
                values: {
                    email_addresses: [email],
                    name: derivedName,
                    phone_numbers: [],
                }
            }
        };
        console.log('Sending person data to Attio CRM:', JSON.stringify(personData, null, 2));
        const response = await fetch(`${ATTIO_API_URL}/objects/people/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ATTIO_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(personData)
        });
        const result = await response.json();
        console.log('Attio Person API response status:', response.status);
        console.log('Attio Person API response:', JSON.stringify(result, null, 2));
        if (!response.ok) {
            const isUniquenessConflict = result?.code === 'uniqueness_conflict';
            if (response.status === 409 || response.status === 422 || isUniquenessConflict) {
                console.warn('Person may already exist in Attio. Fetching existing person...');
                const existingPerson = await fetchPersonByEmail(email);
                if (existingPerson.success) {
                    return { success: true, data: existingPerson.data, alreadyExists: true };
                }
                console.warn('Could not retrieve existing person details; returning conflict payload.');
                return { success: true, data: result, alreadyExists: true };
            }
            throw new Error(`Attio Person API error: ${response.status} - ${JSON.stringify(result)}`);
        }
        console.log('Attio CRM person created successfully:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating Attio person:', error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

async function sendSlackNotification(formData: any, submissionId: string) {
    if (!SLACK_WEBHOOK_URL) {
        console.warn("Slack webhook URL not configured")
        return { success: false, error: "Webhook not configured" }
    }

    // Log the webhook URL (partially masked)
    console.log("Slack webhook starts with:", SLACK_WEBHOOK_URL.slice(0, 40) + '...')

    try {
        const message = {
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🎉 New Vault Form Submission",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${formData.email}`
                        },

                    ]
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `*Submission ID:* ${submissionId}`
                        }
                    ]
                }
            ]
        }

        const slackRes = await fetch(SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        })
        const slackText = await slackRes.text()
        console.log("Slack response status:", slackRes.status)
        console.log("Slack response text:", slackText)
        if (!slackRes.ok) {
            throw new Error(`Slack webhook failed: ${slackRes.status} - ${slackText}`)
        }
        return { success: true }
    } catch (error: unknown) {
        console.error("Error sending Slack notification:", error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

async function sendComplianceCheckerSlackNotification(formData: any, submissionId: string) {
    if (!SLACK_WEBHOOK_URL) {
        console.warn("Slack webhook URL not configured")
        return { success: false, error: "Webhook not configured" }
    }

    try {
        const message = {
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🔍 New Submition from Vault form",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: formData.text || "No message content"
                    }
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `*Submission ID:* ${submissionId} | *Timestamp:* ${new Date().toLocaleString()}`
                        }
                    ]
                }
            ]
        }

        const slackRes = await fetch(SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        })
        const slackText = await slackRes.text()
        console.log("Compliance checker Slack response status:", slackRes.status)
        console.log("Compliance checker Slack response text:", slackText)
        if (!slackRes.ok) {
            throw new Error(`Slack webhook failed: ${slackRes.status} - ${slackText}`)
        }
        return { success: true }
    } catch (error: unknown) {
        console.error("Error sending compliance checker Slack notification:", error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}
