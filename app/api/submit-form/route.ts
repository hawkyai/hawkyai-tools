import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { google } from 'googleapis'

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Google Sheets configuration
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1iSnkei0DSOGhDEP_mJZDyenRoCF3p5qgFiiMgkaHkYw'
const SHEET_NAME = 'Sheet1' // Replace with your sheet name if different

// Initialize Google Sheets client
let sheets: any = null

try {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.error('Missing Google credentials:', {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY
    })
    throw new Error('Missing Google credentials')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  // Log authentication details (safely)
  console.log('Google Auth configured with email:', process.env.GOOGLE_CLIENT_EMAIL)
  console.log('Private key length:', process.env.GOOGLE_PRIVATE_KEY.length)

  sheets = google.sheets({ version: 'v4', auth })
} catch (error: unknown) {
  console.error('Error initializing Google Sheets client:', error instanceof Error ? error.message : 'Unknown error')
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
  } catch (error: any) {
    console.error("Error sending Slack notification:", error)
    return { success: false, error: error.message }
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
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error processing request:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

  