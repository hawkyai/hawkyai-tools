import { NextResponse } from "next/server"
import { z } from "zod"

// Slack webhook URL
const PROSP_SLACK_WEBHOOK_URL = process.env.PROSP_SLACK_WEBHOOK_URL

// Error alert Slack webhook
const ERROR_SLACK_WEBHOOK_URL = process.env.ERROR_SLACK_WEBHOOK_URL

/**
 * Sends an error alert to the error Slack channel
 */
async function sendErrorAlert(title: string, details: string, context?: string) {
    if (!ERROR_SLACK_WEBHOOK_URL) return
    try {
        await fetch(ERROR_SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                blocks: [
                    {
                        type: "header",
                        text: { type: "plain_text", text: `🚨 Prosp Webhook Error`, emoji: true },
                    },
                    {
                        type: "section",
                        fields: [
                            { type: "mrkdwn", text: `*Error:*\n${title}` },
                            { type: "mrkdwn", text: `*Time:*\n${new Date().toLocaleString("en-US", { timeZoneName: "short" })}` },
                        ],
                    },
                    {
                        type: "section",
                        text: { type: "mrkdwn", text: `*Details:*\n\`\`\`${details}\`\`\`` },
                    },
                    ...(context ? [{
                        type: "section",
                        text: { type: "mrkdwn", text: `*Context:*\n${context}` },
                    }] : []),
                ],
            }),
        })
    } catch (err) {
        console.error("❌ Failed to send error alert to Slack:", err)
    }
}

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
 * Generates an AI suggested reply using Gemini
 */
async function generateGeminiReply(content: string, leadName: string): Promise<string | null> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.warn("⚠️ GEMINI_API_KEY not configured")
        await sendErrorAlert(
            "GEMINI_API_KEY not configured",
            "The GEMINI_API_KEY environment variable is missing on this server.",
            `Lead: ${leadName}\nMessage: ${content.substring(0, 100)}...`
        )
        return null
    }

    const prompt = `You are a professional sales assistant helping with LinkedIn outreach.
A lead named "${leadName}" replied with this message:

"${content}"

Write a short, friendly, professional reply (2-3 sentences max).
Return ONLY the reply text — no subject line, no preamble, no sign-off.`

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        )

        if (!response.ok) {
            const errText = await response.text()
            console.error("Gemini API error:", response.status, errText)
            await sendErrorAlert(
                `Gemini API returned ${response.status}`,
                errText,
                `Lead: ${leadName}`
            )
            return null
        }

        const data = await response.json()
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null

        if (!reply) {
            await sendErrorAlert(
                "Gemini returned empty response",
                JSON.stringify(data, null, 2).substring(0, 500),
                `Lead: ${leadName}`
            )
        }

        return reply
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error("❌ Error calling Gemini API:", error)
        await sendErrorAlert(
            "Gemini API call failed (network/exception)",
            message,
            `Lead: ${leadName}`
        )
        return null
    }
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
function buildSlackMessage(data: ProspWebhookData, aiReply?: string) {
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

    // Add AI suggested reply + action buttons for has_msg_replied events
    if (aiReply) {
        const buttonValue = JSON.stringify({
            lead: eventData.lead,
            leadName,
            campaignId: eventData.campaignId,
            campaignName: eventData.campaignName,
            sender: eventData.sender,
            aiReply,
            content: eventData.content,
            linkedinUrl: profileInfo.linkedinUrl,
            jobTitle: profileInfo.jobTitle,
            company: profileInfo.company,
            email: profileInfo.email,
            headline: profileInfo.headline,
            timestamp: eventData.timestamp,
        })

        blocks.push({
            type: "divider",
        })

        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*🤖 AI Suggested Reply:*\n${aiReply}`,
            },
        })

        blocks.push({
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: { type: "plain_text", text: "✅ Send This Reply", emoji: true },
                    style: "primary",
                    action_id: "send_ai_reply",
                    value: buttonValue,
                    confirm: {
                        title: { type: "plain_text", text: "Send this reply?" },
                        text: {
                            type: "mrkdwn",
                            text: `This will send the AI-suggested message to *${leadName}* via Prosp.`,
                        },
                        confirm: { type: "plain_text", text: "Yes, Send It" },
                        deny: { type: "plain_text", text: "Cancel" },
                    },
                },
                {
                    type: "button",
                    text: { type: "plain_text", text: "✏️ Edit & Send", emoji: true },
                    action_id: "edit_reply",
                    value: buttonValue,
                },
            ],
        })
    }

    return { blocks }
}

/**
 * Sends notification to Slack
 */
async function sendSlackNotification(data: ProspWebhookData, aiReply?: string) {
    if (!PROSP_SLACK_WEBHOOK_URL) {
        console.warn("⚠️ PROSP_SLACK_WEBHOOK_URL environment variable not configured")
        return { 
            success: false, 
            error: "Slack webhook URL not configured. Please set PROSP_SLACK_WEBHOOK_URL environment variable." 
        }
    }

    try {
        const message = buildSlackMessage(data, aiReply)
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

        // Generate AI suggested reply for incoming lead replies
        let aiReply: string | undefined
        if (webhookData.eventData.content) {
            const profileInfo = webhookData.eventData.profileInfo || {}
            const leadName = profileInfo.firstName && profileInfo.lastName
                ? `${profileInfo.firstName} ${profileInfo.lastName}`
                : profileInfo.firstName || profileInfo.lastName || "Unknown"

            const reply = await generateGeminiReply(webhookData.eventData.content, leadName)
            if (reply) aiReply = reply
        }

        // Send to Slack
        const slackResult = await sendSlackNotification(webhookData, aiReply)

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
            await sendErrorAlert(
                "Slack notification failed",
                slackResult.error ?? "Unknown error",
                `Event: ${webhookData.eventType} · Lead: ${webhookData.eventData.lead ?? "unknown"}`
            )
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
        await sendErrorAlert(
            "Unhandled server error in prosp-response",
            errorMessage,
            error instanceof Error ? error.stack?.substring(0, 500) : undefined
        )
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

