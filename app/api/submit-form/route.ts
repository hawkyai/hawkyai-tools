import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

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
  } catch (error) {
    console.error("Error sending Slack notification:", error)
    return { success: false, error: error.message }
  }
}

export async function POST(request: Request) {
  try {
    // Get form data from request
    const formData = await request.json()

    // Generate submission ID and timestamp
    const submissionId = uuidv4()
    const timestamp = new Date().toISOString()

    // Format data for Sheety API
    const body = {
      sheet1: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.referralSource,
        date: new Date().toISOString().split("T")[0], // Just the date part YYYY-MM-DD
        "submission_id": submissionId,
        timestamp: timestamp
      },
    }

    console.log("Submitting to Sheety:", body)

    // Send data to Sheety API
    const response = await fetch("https://api.sheety.co/a7c2ca819c40cdf7e56412728ce3216f/websiteContact/sheet1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Get response data
    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      console.error("Could not parse response as JSON")
    }

    // Log response for debugging
    console.log("Sheety response status:", response.status)
    console.log("Sheety response:", responseData)

    if (!response.ok) {
      // Return error response
      return NextResponse.json(
        {
          success: false,
          error: `API error: ${response.status}`,
          details: responseData || {},
        },
        { status: 500 },
      )
    }

    // Send Slack notification
    const slackResult = await sendSlackNotification(formData, submissionId)
    if (!slackResult.success) {
      return NextResponse.json({ success: false, error: slackResult.error || "Slack notification failed" }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({ success: true, data: responseData })
  } catch (error) {
    console.error("Server error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: errorMessage || "Server error processing your request" }, { status: 500 })
  }
}
