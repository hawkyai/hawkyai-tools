import { NextResponse } from "next/server"
import { createHmac } from "crypto"

/**
 * Verifies that the request genuinely came from Slack
 * using HMAC-SHA256 signature verification
 */
function verifySlackSignature(headers: Headers, rawBody: string): boolean {
    const timestamp = headers.get("x-slack-request-timestamp")
    const slackSig = headers.get("x-slack-signature")
    const signingSecret = process.env.SLACK_SIGNING_SECRET

    if (!timestamp || !slackSig || !signingSecret) return false

    // Reject requests older than 5 minutes (replay attack prevention)
    if (Math.floor(Date.now() / 1000) - parseInt(timestamp) > 300) return false

    const sigBase = `v0:${timestamp}:${rawBody}`
    const myHash = "v0=" + createHmac("sha256", signingSecret).update(sigBase).digest("hex")
    return myHash === slackSig
}

/**
 * Sends a reply via Prosp API
 */
async function sendProspReply(lead: string, sender: string, message: string) {
    const prospRes = await fetch("https://prosp.ai/api/v1/leads/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: process.env.PROSP_API_KEY,
            linkedin_url: lead,
            sender,
            message,
        }),
    })

    if (!prospRes.ok) {
        const errText = await prospRes.text()
        throw new Error(`Prosp API error ${prospRes.status}: ${errText}`)
    }
}

/**
 * Rebuilds the original Slack message blocks with buttons replaced by a status line
 */
function buildSentBlocks(data: {
    leadName?: string; campaignName?: string; campaignId?: string
    content?: string; headline?: string; linkedinUrl?: string
    jobTitle?: string; company?: string; email?: string
    timestamp?: number; aiReply?: string; sentMessage?: string
}) {
    const fields: any[] = [
        { type: "mrkdwn", text: `*Event Type:*\n↩️ Message Replied` },
        { type: "mrkdwn", text: `*Campaign:*\n${data.campaignName ?? "N/A"}` },
        { type: "mrkdwn", text: `*Lead Name:*\n${data.leadName ?? "Unknown"}` },
    ]
    if (data.jobTitle) fields.push({ type: "mrkdwn", text: `*Job Title:*\n${data.jobTitle}` })
    if (data.company) fields.push({ type: "mrkdwn", text: `*Company:*\n${data.company}` })
    if (data.email) fields.push({ type: "mrkdwn", text: `*Email:*\n${data.email}` })
    if (data.linkedinUrl) fields.push({ type: "mrkdwn", text: `*LinkedIn:*\n<${data.linkedinUrl}|View Profile>` })

    const blocks: any[] = [
        { type: "header", text: { type: "plain_text", text: `↩️ Prosp Message Replied`, emoji: true } },
        { type: "section", fields },
    ]

    if (data.content) {
        blocks.push({
            type: "section",
            text: { type: "mrkdwn", text: `*Reply Content:*\n\`\`\`${data.content}\`\`\`` },
        })
    }

    if (data.headline) {
        blocks.push({
            type: "section",
            text: { type: "mrkdwn", text: `*Headline:*\n${data.headline}` },
        })
    }

    const contextElements: any[] = [
        { type: "mrkdwn", text: `*Timestamp:* ${data.timestamp ? new Date(data.timestamp).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }) : "N/A"}` },
    ]
    if (data.campaignId) contextElements.push({ type: "mrkdwn", text: `*Campaign ID:* ${data.campaignId}` })
    blocks.push({ type: "context", elements: contextElements })

    blocks.push({ type: "divider" })
    blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: `*🤖 AI Suggested Reply:*\n${data.aiReply}` },
    })

    // Sent confirmation in place of buttons
    const sentText = data.sentMessage
        ? `✅ *Edited reply sent via Prosp:*\n> ${data.sentMessage}`
        : `✅ *Reply sent to lead via Prosp*`

    blocks.push({
        type: "context",
        elements: [{ type: "mrkdwn", text: sentText }],
    })

    return blocks
}

/**
 * POST handler for Slack interactivity (button clicks + modal submissions)
 */
export async function POST(request: Request) {
    const rawBody = await request.text()

    // Verify the request came from Slack
    if (!verifySlackSignature(request.headers as Headers, rawBody)) {
        console.warn("⚠️ Invalid Slack signature — request rejected")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const params = new URLSearchParams(rawBody)
    const payload = JSON.parse(params.get("payload") || "{}")

    // ── Handle modal submission ────────────────────────────────────────────
    if (payload.type === "view_submission") {
        const metadata = JSON.parse(payload.view?.private_metadata || "{}")
        const { lead, sender, campaignId, campaignName, leadName, linkedinUrl,
                jobTitle, company, email, headline, content, timestamp, aiReply,
                responseUrl } = metadata

        const editedReply = payload.view?.state?.values?.reply_block?.reply_input?.value ?? ""

        console.log("📝 Modal submitted — edited reply:", editedReply)

        // Fire Prosp call in background — don't await, so we respond to Slack within 3s
        sendProspReply(lead, sender, editedReply)
            .then(async () => {
                console.log("✅ Edited reply sent to lead via Prosp:", lead)
                // Update the original Slack message to reflect the sent edited reply
                if (responseUrl) {
                    await fetch(responseUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            replace_original: true,
                            blocks: buildSentBlocks({
                                leadName, campaignName, campaignId, content, headline,
                                linkedinUrl, jobTitle, company, email, timestamp,
                                aiReply, sentMessage: editedReply,
                            }),
                        }),
                    })
                }
            })
            .catch((err: unknown) => {
                console.error("❌ Failed to send edited reply:", err instanceof Error ? err.message : err)
            })

        // Acknowledge Slack immediately — closes the modal
        return NextResponse.json({ response_action: "clear" })
    }

    // ── Handle button clicks ───────────────────────────────────────────────
    const action = payload.actions?.[0]
    if (!action) return new Response("", { status: 200 })

    let parsedValue: {
        lead?: string; leadName?: string; campaignId?: string; campaignName?: string
        sender?: string; aiReply?: string; content?: string; linkedinUrl?: string
        jobTitle?: string; company?: string; email?: string; headline?: string
        timestamp?: number
    } = {}
    try {
        parsedValue = JSON.parse(action.value || "{}")
    } catch {
        console.error("❌ Failed to parse action value:", action.value)
        return new Response("", { status: 200 })
    }

    const { lead, leadName, campaignId, campaignName, sender, aiReply,
            content, linkedinUrl, jobTitle, company, email, headline, timestamp } = parsedValue
    const actionId: string = action.action_id
    const responseUrl: string = payload.response_url

    console.log(`📥 Slack action received: ${actionId}`, { lead, sender, campaignId })

    // ── Send AI reply directly ─────────────────────────────────────────────
    if (actionId === "send_ai_reply") {
        try {
            await sendProspReply(lead ?? "", sender ?? "", aiReply ?? "")
            console.log("✅ Reply sent to lead via Prosp:", lead)

            await fetch(responseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    replace_original: true,
                    blocks: buildSentBlocks({ leadName, campaignName, campaignId, content, headline, linkedinUrl, jobTitle, company, email, timestamp, aiReply }),
                }),
            })
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            console.error("❌ Failed to send reply:", message)

            await fetch(responseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    replace_original: false,
                    text: `❌ Failed to send reply: ${message}`,
                }),
            })
        }
    }

    // ── Open edit modal ────────────────────────────────────────────────────
    if (actionId === "edit_reply") {
        const triggerId: string = payload.trigger_id

        const modalRes = await fetch("https://slack.com/api/views.open", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`,
            },
            body: JSON.stringify({
                trigger_id: triggerId,
                view: {
                    type: "modal",
                    callback_id: "edit_reply_modal",
                    title: { type: "plain_text", text: "Edit Reply" },
                    submit: { type: "plain_text", text: "Send" },
                    close: { type: "plain_text", text: "Cancel" },
                    private_metadata: JSON.stringify({
                        lead, leadName, campaignId, campaignName, sender,
                        aiReply, content, linkedinUrl, jobTitle, company,
                        email, headline, timestamp, responseUrl,
                    }),
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*Replying to:* ${leadName ?? lead}\n*Campaign:* ${campaignName ?? campaignId}`,
                            },
                        },
                        {
                            type: "input",
                            block_id: "reply_block",
                            label: { type: "plain_text", text: "Your reply" },
                            element: {
                                type: "plain_text_input",
                                action_id: "reply_input",
                                multiline: true,
                                initial_value: aiReply ?? "",
                                placeholder: { type: "plain_text", text: "Edit your reply..." },
                            },
                        },
                    ],
                },
            }),
        })

        const modalData = await modalRes.json()
        if (!modalData.ok) {
            console.error("❌ Failed to open modal:", modalData.error)
        } else {
            console.log("✅ Edit modal opened for:", lead)
        }
    }

    return new Response("", { status: 200 })
}
