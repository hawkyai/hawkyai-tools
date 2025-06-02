import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { google } from 'googleapis'

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Google Sheets configuration
const SPREADSHEET_ID = '1iSnkei0DSOGhDEP_mJZDyenRoCF3p5qgFiiMgkaHkYw'
const SHEET_NAME = 'Sheet1' // Replace with your sheet name if different

// Initialize Google Sheets client
let sheets: any = null

try {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  // Log authentication details (safely)
  console.log('Google Auth configured with email:', process.env.GOOGLE_CLIENT_EMAIL)
  console.log('Private key length:', process.env.GOOGLE_PRIVATE_KEY?.length || 0)

  sheets = google.sheets({ version: 'v4', auth })
} catch (error) {
  console.error('Error initializing Google Sheets client:', error)
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

export async function POST(request: Request) {
  try {
    if (!sheets) {
      throw new Error('Google Sheets client not initialized')
    }

    // Get form data from request
    const formData = await request.json()

    // Generate submission ID and timestamp
    const submissionId = uuidv4()
    const timestamp = new Date().toISOString()

    // Format data for Google Sheets
    const values = [
      [
        formData.name,
        formData.email,
        formData.phone,
        formData.referralSource,
        new Date().toISOString().split("T")[0], // Just the date part YYYY-MM-DD
        submissionId,
        timestamp
      ]
    ]

    // First, verify we can access the spreadsheet
    try {
      const metadata = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      })
      console.log('Successfully accessed spreadsheet:', metadata.data.properties?.title)
    } catch (error: any) {
      console.error('Error accessing spreadsheet:', error)
      throw new Error(`Cannot access spreadsheet: ${error.message}`)
    }

    // Append data to Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`, // Adjust range based on your columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    // Log response for debugging
    console.log("Google Sheets response:", response.data)

    if (response.status !== 200) {
      return NextResponse.json(
        {
          success: false,
          error: `Google Sheets API error: ${response.status}`,
          details: response.data,
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
    return NextResponse.json({ success: true, data: response.data })
  } catch (error: any) {
    console.error("Server error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      success: false, 
      error: errorMessage || "Server error processing your request",
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
