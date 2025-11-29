import { NextResponse } from "next/server"
import { z } from "zod"

// Slack webhook URL - Replace with your actual webhook URL
const PROSP_SLACK_WEBHOOK_URL = process.env.PROSP_SLACK_WEBHOOK_URL

// Prosp webhook validation schema
const prospWebhookSchema = z.object({
    eventType: z.string(),
    eventData: z.object({
        campaignId: z.string().optional(),
        campaignName: z.string().optional(),
        workspaceId: z.string().optional(),
        lead: z.string().optional(),
        profileInfo: z.object({
            linkedinId: z.string().optional(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            linkedinUrl: z.string().optional(),
            company: z.string().optional(),
            companyUrl: z.string().optional(),
            websiteUrl: z.string().optional(),
            bio: z.string().optional(),
            headline: z.string().optional(),
            jobTitle: z.string().optional(),
            companyOverview: z.string().optional(),
            phoneNumber: z.string().optional(),
            email: z.string().optional(),
        }).optional(),
        sender: z.string().optional(),
        content: z.string().optional(),
        timestamp: z.number().optional(),
    }),
})

type ProspWebhookData = z.infer<typeof prospWebhookSchema>

/**
 * Formats timestamp to human-readable date string
 */
function formatTimestamp(timestamp?: number): string {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
    })
}

/**
 * Truncates long text to a maximum length
 */
function truncateText(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
}

/**
 * Extracts a readable name from a LinkedIn profile URL
 */
function extractNameFromLinkedInUrl(url: string): string {
    try {
        // Extract the profile slug from URLs like:
        // https://www.linkedin.com/in/harish-stoic
        // https://linkedin.com/in/harish-stoic
        const match = url.match(/linkedin\.com\/in\/([^/?]+)/i)
        if (match && match[1]) {
            const slug = match[1]
            // Convert slug to readable name: "harish-stoic" -> "Harish Stoic"
            return slug
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ')
        }
    } catch (error) {
        console.warn("Failed to extract name from LinkedIn URL:", error)
    }
    // Fallback: return a generic label
    return "View Profile"
}

/**
 * Formats the event type for display
 */
function formatEventType(eventType: string): { emoji: string; title: string } {
    switch (eventType.toLowerCase()) {
        case "send_msg":
            return { emoji: "💬", title: "Message Sent" }
        case "accept_invite":
            return { emoji: "✅", title: "Connection Accepted" }
        case "has_msg_replied":
            return { emoji: "↩️", title: "Message Replied" }
        default:
            return { emoji: "📢", title: eventType }
    }
}

/**
 * Builds human-readable Slack message from Prosp webhook data
 */
function buildSlackMessage(data: ProspWebhookData) {
    const { eventType, eventData } = data
    const { emoji, title } = formatEventType(eventType)
    const profileInfo = eventData.profileInfo || {}
    const timestamp = formatTimestamp(eventData.timestamp)

    // Build lead information section
    const leadName = profileInfo.firstName && profileInfo.lastName
        ? `${profileInfo.firstName} ${profileInfo.lastName}`
        : profileInfo.firstName || profileInfo.lastName || "Unknown"

    const leadFields: Array<{ type: string; text: string }> = [
        {
            type: "mrkdwn",
            text: `*Event Type:*\n${emoji} ${title}`,
        },
        {
            type: "mrkdwn",
            text: `*Campaign:*\n${eventData.campaignName || "N/A"}`,
        },
        {
            type: "mrkdwn",
            text: `*Lead Name:*\n${leadName}`,
        },
    ]

    if (profileInfo.jobTitle) {
        leadFields.push({
            type: "mrkdwn",
            text: `*Job Title:*\n${profileInfo.jobTitle}`,
        })
    }

    if (profileInfo.company) {
        leadFields.push({
            type: "mrkdwn",
            text: `*Company:*\n${profileInfo.company}`,
        })
    }

    if (profileInfo.email) {
        leadFields.push({
            type: "mrkdwn",
            text: `*Email:*\n${profileInfo.email}`,
        })
    }

    if (profileInfo.phoneNumber) {
        leadFields.push({
            type: "mrkdwn",
            text: `*Phone:*\n${profileInfo.phoneNumber}`,
        })
    }

    if (profileInfo.linkedinUrl) {
        leadFields.push({
            type: "mrkdwn",
            text: `*LinkedIn:*\n<${profileInfo.linkedinUrl}|View Profile>`,
        })
    }

    if (profileInfo.companyUrl) {
        leadFields.push({
            type: "mrkdwn",
            text: `*Company URL:*\n<${profileInfo.companyUrl}|${profileInfo.company || "View Company"}>`,
        })
    }

    if (profileInfo.websiteUrl) {
        leadFields.push({
            type: "mrkdwn",
            text: `*Website:*\n<${profileInfo.websiteUrl}|Visit Website>`,
        })
    }

    // Build message blocks
    const blocks: any[] = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: `${emoji} Prosp ${title}`,
                emoji: true,
            },
        },
        {
            type: "section",
            fields: leadFields,
        },
    ]

    // Add content section for events that have message content
    if (eventData.content && eventData.content.trim() !== "" && eventData.content !== "accepted a connection request") {
        // Determine the content label based on event type
        let contentLabel = "Message Content"
        if (eventType === "has_msg_replied") {
            contentLabel = "Reply Content"
        } else if (eventType === "send_msg") {
            contentLabel = "Message Content"
        }
        
        // Clean up the content - replace escaped newlines with actual newlines for better readability
        let displayContent = eventData.content.replace(/\\n/g, "\n").trim()
        
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*${contentLabel}:*\n\`\`\`${displayContent}\`\`\``,
            },
        })
    }

    // Add sender information if available
    if (eventData.sender) {
        const senderName = extractNameFromLinkedInUrl(eventData.sender)
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Sent by:*\n<${eventData.sender}|${senderName}>`,
            },
        })
    }

    // Add profile details if available
    if (profileInfo.headline) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Headline:*\n${profileInfo.headline}`,
            },
        })
    }

    if (profileInfo.bio) {
        const truncatedBio = truncateText(profileInfo.bio, 300)
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Bio:*\n${truncatedBio}`,
            },
        })
    }

    // Add context footer
    const contextElements: Array<{ type: string; text: string }> = [
        {
            type: "mrkdwn",
            text: `*Timestamp:* ${timestamp}`,
        },
    ]

    if (eventData.campaignId) {
        contextElements.push({
            type: "mrkdwn",
            text: `*Campaign ID:* ${eventData.campaignId}`,
        })
    }

    blocks.push({
        type: "context",
        elements: contextElements,
    })

    return { blocks }
}

/**
 * Sends notification to Slack
 */
async function sendSlackNotification(data: ProspWebhookData) {
    if (!PROSP_SLACK_WEBHOOK_URL) {
        console.warn("⚠️ PROSP_SLACK_WEBHOOK_URL environment variable not configured")
        return { 
            success: false, 
            error: "Slack webhook URL not configured. Please set PROSP_SLACK_WEBHOOK_URL environment variable." 
        }
    }

    try {
        const message = buildSlackMessage(data)
        console.log("📤 Sending message to Slack...")

        const slackRes = await fetch(PROSP_SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        })

        const slackText = await slackRes.text()
        console.log("📥 Slack response status:", slackRes.status)
        console.log("📥 Slack response text:", slackText)

        if (!slackRes.ok) {
            // Provide more helpful error messages based on status code
            let errorMessage = `Slack webhook failed: ${slackRes.status} - ${slackText}`
            
            if (slackRes.status === 403) {
                errorMessage = "Slack webhook authentication failed. Please check that PROSP_SLACK_WEBHOOK_URL contains a valid webhook URL."
            } else if (slackRes.status === 404) {
                errorMessage = "Slack webhook URL not found. Please verify the webhook URL is correct."
            }
            
            throw new Error(errorMessage)
        }

        console.log("✅ Slack notification sent successfully")
        return { success: true }
    } catch (error: unknown) {
        console.error("❌ Error sending Slack notification:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        }
    }
}

/**
 * POST handler for Prosp webhook
 */
export async function POST(request: Request) {
    try {
        // Get raw text first to handle potential JSON parsing issues
        let rawData: any
        const rawText = await request.text()
        
        if (!rawText || rawText.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Empty request body",
                },
                {
                    status: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            )
        }
        
        try {
            rawData = JSON.parse(rawText)
        } catch (jsonError: any) {
            console.error("❌ JSON parsing error:", jsonError.message)
            console.error("📄 Raw request body length:", rawText.length)
            console.error("📄 Raw request body (first 1000 chars):", rawText.substring(0, 1000))
            
            // Try to fix common JSON issues - handle unescaped quotes and newlines in string values
            try {
                let fixedJson = rawText
                let inString = false
                let escapeNext = false
                let result = ''
                
                // Parse character by character and fix unescaped special characters in strings
                for (let i = 0; i < fixedJson.length; i++) {
                    const char = fixedJson[i]
                    
                    if (escapeNext) {
                        // Current char is escaped, add it as-is
                        result += char
                        escapeNext = false
                        continue
                    }
                    
                    if (char === '\\') {
                        result += char
                        escapeNext = true
                        continue
                    }
                    
                    // Handle quote
                    if (char === '"') {
                        if (inString) {
                            // We're in a string, check if this closes it or is content
                            // Look ahead to see if this is likely a closing quote
                            const remaining = fixedJson.substring(i + 1).trim()
                            if (remaining.match(/^[:,}\]]/)) {
                                // This closes the string
                                inString = false
                                result += char
                            } else {
                                // This is likely content that should be escaped
                                result += '\\"'
                            }
                        } else {
                            // Opening a string
                            inString = true
                            result += char
                        }
                        continue
                    }
                    
                    if (inString) {
                        // Inside a string value - escape unescaped control characters
                        if (char === '\n') {
                            result += '\\n'
                        } else if (char === '\r') {
                            result += '\\r'
                        } else if (char === '\t') {
                            result += '\\t'
                        } else {
                            result += char
                        }
                    } else {
                        // Outside string - keep as is
                        result += char
                    }
                }
                
                fixedJson = result
                rawData = JSON.parse(fixedJson)
                console.log("✅ Successfully parsed JSON after fixing unescaped characters")
            } catch (fixError: any) {
                // If fixing didn't work, return a helpful error
                console.error("❌ Failed to fix JSON:", fixError.message)
                return NextResponse.json(
                    {
                        success: false,
                        error: "Invalid JSON in request body",
                        details: jsonError.message,
                        position: jsonError.message.match(/position (\d+)/)?.[1] || "unknown",
                        hint: "The request body contains malformed JSON. Please check for unescaped quotes, newlines, or special characters in string values.",
                    },
                    {
                        status: 400,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type, Authorization",
                        },
                    }
                )
            }
        }
        
        console.log("Received Prosp webhook data:", JSON.stringify(rawData, null, 2))

        // Validate the incoming data
        const validationResult = prospWebhookSchema.safeParse(rawData)
        if (!validationResult.success) {
            console.warn("Prosp webhook validation failed:", validationResult.error.flatten())
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid webhook data",
                    issues: validationResult.error.flatten(),
                },
                {
                    status: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            )
        }

        const webhookData = validationResult.data

        // Send to Slack
        const slackResult = await sendSlackNotification(webhookData)

        if (slackResult.success) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Webhook processed and sent to Slack successfully",
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            )
        } else {
            // Return 200 with warning instead of 500, so webhook is still considered processed
            // This prevents Prosp from retrying the webhook
            console.warn("⚠️ Webhook received but Slack notification failed:", slackResult.error)
            return NextResponse.json(
                {
                    success: true,
                    message: "Webhook processed successfully, but Slack notification failed",
                    warning: "Slack notification could not be sent",
                    slackError: slackResult.error,
                },
                {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            )
        }
    } catch (error: any) {
        console.error("Server error processing Prosp webhook:", error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        return NextResponse.json(
            {
                success: false,
                error: errorMessage || "Server error processing webhook",
                details: error instanceof Error ? error.stack : undefined,
            },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            }
        )
    }
}

/**
 * GET handler for testing/debugging
 */
export async function GET() {
    return NextResponse.json(
        {
            message: "Prosp Response Webhook Endpoint",
            method: "Use POST to send webhook data",
            endpoint: "/api/prosp-response",
            supportedMethods: ["POST", "OPTIONS"],
        },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    )
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    })
}

