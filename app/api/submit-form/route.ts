
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
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    referralSource: z.string().optional(),
})


// Function to handle OAuth callback and token exchange
export async function POST(request: Request) {
    try {
        // Debug environment variables
        console.log('Environment check:')
        console.log('ATTIO_API_KEY:', process.env.ATTIO_API_KEY ? 'Set' : 'Not set')

        // Get form data from request
        const formData = await request.json()
        console.log("Received formData:", formData); // Debug log

        // Generate submission ID and timestamp
        const submissionId = uuidv4()
        const timestamp = new Date().toISOString()

        // Check if this is a compliance checker email submission
        const isComplianceCheckerSubmission = formData.text && formData.text.includes('compliance checker')

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
            // Handle regular form submission - send to both Attio and Slack
            // Extract domain from email and create company in Attio CRM
            let companyResult = null;
            if (formData.email) {
                const domain = extractDomainFromEmail(formData.email);
                if (domain) {
                    companyResult = await createAttioCompany(domain, submissionId);
                    if (!companyResult.success) {
                        console.error("Attio Company CRM error:", companyResult.error);
                        // Continue even if company creation fails
                    }
                }
            }
            
            // Create person in Attio CRM
            const attioResult = await createAttioPerson(formData, submissionId)
            if (!attioResult.success) {
                console.error("Attio CRM error:", attioResult.error)
                // Continue to Slack notification even if Attio fails
            }

            // Create deal in Attio CRM
            // Create deal if we have both person and company data (even if they already existed)
            let dealResult = null;
            if (formData.email) {
                const domain = extractDomainFromEmail(formData.email);
                // Check if we have both person and company data (works even if they already existed)
                const hasPersonData = attioResult.data !== undefined;
                const hasCompanyData = companyResult?.data !== undefined;
                
                if (domain && hasPersonData && hasCompanyData && companyResult) {
                    dealResult = await createAttioDeal(
                        domain,
                        formData.name,
                        attioResult.data,
                        companyResult.data,
                        submissionId
                    );
                    if (!dealResult.success) {
                        console.error("Attio Deal CRM error:", dealResult.error);
                        // Continue even if deal creation fails
                    }
                } else {
                    if (!hasPersonData) {
                        console.warn('Cannot create deal: Missing person data');
                    }
                    if (!hasCompanyData) {
                        console.warn('Cannot create deal: Missing company data');
                    }
                }
            }

            // Send Slack notification
            const slackResult = await sendSlackNotification(formData, submissionId)
            if (!slackResult.success) {
                console.error("Slack notification error:", slackResult.error)
            }

            // Return success if either Attio (person, company, or deal) or Slack succeeded
            if (attioResult.success || companyResult?.success || dealResult?.success || slackResult.success) {
                return NextResponse.json({ 
                    success: true, 
                    data: attioResult.data,
                    companyData: companyResult?.data,
                    dealData: dealResult?.data,
                    attioSuccess: attioResult.success,
                    companySuccess: companyResult?.success || false,
                    dealSuccess: dealResult?.success || false,
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
                    error: "Both Attio CRM and Slack notifications failed",
                    attioError: attioResult.error,
                    companyError: companyResult?.error,
                    dealError: dealResult?.error,
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

// Function to extract domain from email
function extractDomainFromEmail(email: string): string | null {
    if (!email || !email.includes('@')) {
        return null;
    }
    const parts = email.split('@');
    if (parts.length === 2) {
        return parts[1].toLowerCase();
    }
    return null;
}

// Function to fetch existing company by domain
async function fetchCompanyByDomain(domain: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        if (!ATTIO_API_KEY) {
            return { success: false, error: 'No API key available' };
        }

        // Search for company by domain using Attio API
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

        // Check if we found a company
        if (result.data && result.data.length > 0) {
            return { success: true, data: result.data[0] };
        }

        return { success: false, error: 'Company not found' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// Function to fetch existing person by email
async function fetchPersonByEmail(email: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        if (!ATTIO_API_KEY) {
            return { success: false, error: 'No API key available' };
        }

        // Search for person by email using Attio API
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

        // Check if we found a person
        if (result.data && result.data.length > 0) {
            return { success: true, data: result.data[0] };
        }

        return { success: false, error: 'Person not found' };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// Function to create a company in Attio CRM
async function createAttioCompany(domain: string, submissionId: string) {
    try {
        if (!ATTIO_API_KEY) {
            throw new Error('Authentication failed: No API key available. Please check your Attio credentials.');
        }
        
        // Extract company name from domain (e.g., "hawky.ai" -> "Hawky")
        const domainParts = domain.split('.');
        const companyName = domainParts.length > 0 
            ? domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
            : domain;
        
        // Prepare company data according to Attio API structure
        // According to Attio API docs: name is Text, domains is Domain (array)
        const companyData = {
            data: {
                values: {
                    name: companyName,
                    domains: [domain],
                    description: `Company created from form submission. Domain: ${domain}. Submission ID: ${submissionId}`
                }
            }
        };

        console.log('Sending company data to Attio CRM:', JSON.stringify(companyData, null, 2));
        
        // Use Attio API v2 endpoint with Bearer authentication
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
            // If company already exists (409 conflict), fetch the existing company
            if (response.status === 409 || response.status === 422) {
                console.warn('Company may already exist in Attio. Fetching existing company...');
                const existingCompany = await fetchCompanyByDomain(domain);
                if (existingCompany.success) {
                    return { success: true, data: existingCompany.data, alreadyExists: true };
                } else {
                    console.warn('Could not fetch existing company, but continuing...');
                    return { success: true, data: result, alreadyExists: true };
                }
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

// Function to create a deal in Attio CRM
async function createAttioDeal(
    domain: string,
    personName: string,
    personData: any,
    companyData: any,
    submissionId: string
) {
    try {
        if (!ATTIO_API_KEY) {
            throw new Error('Authentication failed: No API key available. Please check your Attio credentials.');
        }
        
        // Extract record IDs from person and company responses
        // Attio returns record IDs in the format: { id: { workspace_id: "...", record_id: "..." } }
        const personRecordId = personData?.data?.id?.record_id || personData?.id?.record_id;
        const companyRecordId = companyData?.data?.id?.record_id || companyData?.id?.record_id;
        
        if (!personRecordId || !companyRecordId) {
            throw new Error('Cannot create deal: Missing person or company record ID');
        }
        
        // Prepare deal data according to Attio API structure
        // According to Attio API docs:
        // - name: Required Text
        // - stage: Required Status ("INBOUNDS")
        // - owner: Required Actor reference (email address)
        // - associated_people: Record reference (array)
        // - associated_company: Record reference
        const dealData = {
            data: {
                values: {
                    name: domain,
                    stage: "INBOUNDS",
                    owner: "hawky@hawky.ai",
                    associated_people: [personRecordId],
                    associated_company: companyRecordId
                }
            }
        };

        console.log('Sending deal data to Attio CRM:', JSON.stringify(dealData, null, 2));
        
        // Use Attio API v2 endpoint with Bearer authentication
        const response = await fetch(`${ATTIO_API_URL}/objects/deals/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ATTIO_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dealData)
        });

        const result = await response.json();
        console.log('Attio Deal API response status:', response.status);
        console.log('Attio Deal API response:', JSON.stringify(result, null, 2));
        
        if (!response.ok) {
            // If deal already exists or similar conflict, log warning but continue
            if (response.status === 409 || response.status === 422) {
                console.warn('Deal may already exist in Attio or conflict. Continuing...');
                return { success: true, data: result, alreadyExists: true };
            }
            throw new Error(`Attio Deal API error: ${response.status} - ${JSON.stringify(result)}`);
        }

        console.log('Attio CRM deal created successfully:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating Attio deal:', error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// Function to create a person in Attio CRM
async function createAttioPerson(formData: any, submissionId: string) {
    try {
        if (!ATTIO_API_KEY) {
            throw new Error('Authentication failed: No API key available. Please check your Attio credentials.');
        }
        
        // Prepare person data according to Attio API structure
        // According to Attio API docs: name is a single "Personal name" field
        // email_addresses is an array of strings
        // phone_numbers is an array of strings
        
        // Handle phone number - combine countryCode and phone if both provided
        // Attio validates phone numbers strictly, so we validate format before sending
        let formattedPhone: string | null = null;
        if (formData.phone) {
            let phoneNumber = formData.phone.trim();
            
            // If phone already includes country code (starts with +), use it as is
            if (phoneNumber.startsWith('+')) {
                formattedPhone = phoneNumber;
            }
            // If countryCode is provided separately, combine them
            else if (formData.countryCode) {
                const countryCode = formData.countryCode.trim();
                formattedPhone = `${countryCode}${phoneNumber}`;
            }
            // Otherwise, use phone as is (may be missing country code)
            else {
                formattedPhone = phoneNumber;
            }
            
            // Validate phone number format before sending to Attio
            // Attio is strict about phone number validation
            if (formattedPhone) {
                const digitsOnly = formattedPhone.replace(/\D/g, '');
                
                // If phone starts with +, it should have country code + valid number
                if (formattedPhone.startsWith('+')) {
                    // US/Canada (+1) needs exactly 11 digits total (1 for country + 10 for number)
                    if (digitsOnly.startsWith('1') && digitsOnly.length !== 11) {
                        console.warn(`Phone number "${formattedPhone}" appears invalid. US/Canada numbers (+1) need exactly 11 digits total. Got ${digitsOnly.length}. Skipping phone number.`);
                        formattedPhone = null; // Skip invalid phone numbers
                    }
                    // Other countries: country code (1-3 digits) + 7-15 digits for the number
                    else if (digitsOnly.length < 8 || digitsOnly.length > 15) {
                        console.warn(`Phone number "${formattedPhone}" appears invalid. Expected 8-15 digits total including country code. Got ${digitsOnly.length}. Skipping phone number.`);
                        formattedPhone = null; // Skip invalid phone numbers
                    }
                } else {
                    // Phone without country code should have at least 7 digits
                    if (digitsOnly.length < 7) {
                        console.warn(`Phone number "${formattedPhone}" appears invalid (too short). Skipping phone number.`);
                        formattedPhone = null; // Skip invalid phone numbers
                    }
                }
            }
        }
        
        const personData = {
            data: {
                values: {
                    email_addresses: formData.email ? [formData.email] : [],
                    name: formData.name || '',
                    phone_numbers: formattedPhone ? [formattedPhone] : [],
                    description: `Submitted via form. Lead Source: ${formData.referralSource || 'Website / Get Demo'}. Submission ID: ${submissionId}`
                }
            }
        };

        console.log('Sending data to Attio CRM:', JSON.stringify(personData, null, 2));
        
        // Use Attio API v2 endpoint with Bearer authentication
        let response = await fetch(`${ATTIO_API_URL}/objects/people/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ATTIO_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(personData)
        });

        let result = await response.json();
        console.log('Attio API response status:', response.status);
        console.log('Attio API response:', JSON.stringify(result, null, 2));
        
        // If phone number validation fails, retry without phone number
        if (!response.ok && formattedPhone && result.code === 'validation_type' && 
            result.message && result.message.includes('phone_numbers')) {
            console.warn('Phone number validation failed. Retrying without phone number...');
            
            // Retry without phone number
            personData.data.values.phone_numbers = [];
            response = await fetch(`${ATTIO_API_URL}/objects/people/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ATTIO_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(personData)
            });
            
            result = await response.json();
            console.log('Attio API retry response status:', response.status);
            console.log('Attio API retry response:', JSON.stringify(result, null, 2));
        }
        
        if (!response.ok) {
            // If person already exists (409 conflict), fetch the existing person
            if (response.status === 409 || response.status === 422) {
                console.warn('Person may already exist in Attio. Fetching existing person...');
                if (formData.email) {
                    const existingPerson = await fetchPersonByEmail(formData.email);
                    if (existingPerson.success) {
                        return { success: true, data: existingPerson.data, alreadyExists: true };
                    } else {
                        console.warn('Could not fetch existing person, but continuing...');
                        return { success: true, data: result, alreadyExists: true };
                    }
                }
                return { success: true, data: result, alreadyExists: true };
            }
            throw new Error(`Attio API error: ${response.status} - ${JSON.stringify(result)}`);
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
                        text: "🎉 New Form Submission",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Name:*\n${formData.name}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Email:*\n${formData.email}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Phone:*\n${formData.phone || 'N/A'}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Source:*\n${formData.referralSource || 'N/A'}`
                        }
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
                        text: "🔍 New Compliance Checker Email",
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
