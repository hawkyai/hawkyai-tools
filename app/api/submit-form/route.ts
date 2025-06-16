import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Zoho CRM configuration
const ZOHO_ACCESS_TOKEN = process.env.ZOHO_ACCESS_TOKEN || "1000.f279d609531e44588ef97388adeed802.8950025b3fa46b92b0f781e11cc29507"
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || "1000.6511c4be281db4faedf344e0b2e857de.3388e9b6215e726b41e4b0916bb72ddb"
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET
const ZOHO_DOMAIN = "https://www.zohoapis.com" // or your specific Zoho domain

// Function to refresh Zoho access token
async function refreshZohoToken() {
  try {
    console.log('=== TOKEN REFRESH DEBUG ===')
    console.log('ZOHO_ACCESS_TOKEN from env:', process.env.ZOHO_ACCESS_TOKEN?.substring(0, 20) + '...')
    console.log('ZOHO_REFRESH_TOKEN from env:', process.env.ZOHO_REFRESH_TOKEN?.substring(0, 20) + '...')
    console.log('ZOHO_ACCESS_TOKEN constant:', ZOHO_ACCESS_TOKEN?.substring(0, 20) + '...')
    console.log('ZOHO_REFRESH_TOKEN constant:', ZOHO_REFRESH_TOKEN?.substring(0, 20) + '...')
    console.log('Client ID present:', !!ZOHO_CLIENT_ID)
    console.log('Client Secret present:', !!ZOHO_CLIENT_SECRET)
    
    // If no refresh token, return current access token
    if (!ZOHO_REFRESH_TOKEN) {
      console.log('No refresh token available, using current access token')
      return ZOHO_ACCESS_TOKEN
    }

    // If no client credentials, use current access token
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
      console.log('No client credentials available, using current access token')
      return ZOHO_ACCESS_TOKEN
    }

    console.log('Attempting to refresh Zoho token...')
    
    const body = new URLSearchParams({
      refresh_token: ZOHO_REFRESH_TOKEN,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
    
    console.log('Request body:', body.toString())
    
    const response = await fetch(`https://accounts.zoho.com/oauth/v2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body
    })

    const responseText = await response.text()
    console.log('Refresh token response status:', response.status)
    console.log('Refresh token response:', responseText)

    if (!response.ok) {
      console.log('Token refresh failed, using current access token')
      return ZOHO_ACCESS_TOKEN
    }

    const data = JSON.parse(responseText)
    
    // Check if response contains an error (even with 200 status)
    if (data.error) {
      console.log('Token refresh returned error:', data.error)
      console.log('Using current access token instead')
      return ZOHO_ACCESS_TOKEN
    }
    
    if (!data.access_token) {
      console.log('No access token in response, using current access token')
      return ZOHO_ACCESS_TOKEN
    }

    console.log('New access token obtained:', data.access_token?.substring(0, 20) + '...')
    return data.access_token
  } catch (error) {
    console.error('Error refreshing Zoho token:', error)
    console.log('Falling back to provided access token:', ZOHO_ACCESS_TOKEN?.substring(0, 20) + '...')
    return ZOHO_ACCESS_TOKEN
  }
}

// Function to create a lead in Zoho CRM
async function createZohoLead(formData: any, submissionId: string) {
  try {
    // Always try to refresh the token first
    const accessToken = await refreshZohoToken()
    console.log('Using access token for API call:', accessToken ? 'Present' : 'Missing')
    
    const leadData = {
      data: [
        {
          Last_Name: formData.name,
          Email: formData.email,
          Phone: formData.phone || null,
          Lead_Source: formData.referralSource || "Website",
          Company: "Unknown", // Required field for leads
          Description: `Demo request submission. ID: ${submissionId}`,
          Lead_Status: "Not Contacted"
        }
      ]
    }

    console.log('Sending data to Zoho CRM:', JSON.stringify(leadData, null, 2))

    const response = await fetch(`${ZOHO_DOMAIN}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    })

    const result = await response.json()
    console.log('Zoho API response status:', response.status)
    console.log('Zoho API response:', JSON.stringify(result, null, 2))
    
    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} - ${JSON.stringify(result)}`)
    }

    console.log('Zoho CRM lead created successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating Zoho lead:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
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

export async function POST(request: Request) {
  try {
    // Debug environment variables
    console.log('Environment check:')
    console.log('ZOHO_ACCESS_TOKEN:', process.env.ZOHO_ACCESS_TOKEN ? 'Set' : 'Not set')
    console.log('ZOHO_REFRESH_TOKEN:', process.env.ZOHO_REFRESH_TOKEN ? 'Set' : 'Not set')
    console.log('ZOHO_CLIENT_ID:', process.env.ZOHO_CLIENT_ID ? 'Set' : 'Not set')
    console.log('ZOHO_CLIENT_SECRET:', process.env.ZOHO_CLIENT_SECRET ? 'Set' : 'Not set')

    // Get form data from request
    const formData = await request.json()

    // Generate submission ID and timestamp
    const submissionId = uuidv4()
    const timestamp = new Date().toISOString()

    // Create lead in Zoho CRM
    const zohoResult = await createZohoLead(formData, submissionId)
    if (!zohoResult.success) {
      console.error("Zoho CRM error:", zohoResult.error)
      // Continue to Slack notification even if Zoho fails
    }

    // Send Slack notification
    const slackResult = await sendSlackNotification(formData, submissionId)
    if (!slackResult.success) {
      console.error("Slack notification error:", slackResult.error)
    }

    // Return success if either Zoho or Slack succeeded, or if both had issues but we want to proceed
    if (zohoResult.success || slackResult.success) {
      return NextResponse.json({ 
        success: true, 
        data: zohoResult.data,
        zohoSuccess: zohoResult.success,
        slackSuccess: slackResult.success
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Both Zoho CRM and Slack notifications failed",
        zohoError: zohoResult.error,
        slackError: slackResult.error
      }, { status: 500 })
    }
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