import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { z } from "zod"

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Zoho CRM API Configuration
const ZOHO_DOMAIN = "https://www.zohoapis.com"
const ZOHO_API_VERSION = "v8"
const ZOHO_MODULE = "Leads"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  referralSource: z.string().optional(),
})

// Function to refresh Zoho token
async function refreshZohoToken() {
  try {
    // Use accounts.zoho.com for token refresh
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
        client_id: process.env.ZOHO_CLIENT_ID!,
        client_secret: process.env.ZOHO_CLIENT_SECRET!,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Zoho token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        response: errorText
      })
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    if (!data.access_token) {
      throw new Error('No access token in response')
    }

    return data.access_token
  } catch (error) {
    console.error('Error refreshing Zoho token:', error)
    throw error
  }
}

// Function to create a lead in Zoho CRM
async function createZohoLead(formData: any, submissionId: string) {
  try {
    // Refresh the token first
    const accessToken = await refreshZohoToken()
    console.log('Using access token for API call:', accessToken ? 'Present' : 'Missing')
    
    // Prepare lead data according to v8 API structure
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

    // Use the new v8 API endpoint with all required headers
    const response = await fetch(`${ZOHO_DOMAIN}/crm/${ZOHO_API_VERSION}/${ZOHO_MODULE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Version': ZOHO_API_VERSION,
        'X-API-Module': ZOHO_MODULE,
        'X-API-Scope': 'ZohoCRM.modules.ALL'
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
    const body = await request.json()
    
    // Validate form data
    const validatedData = formSchema.parse(body)
    
    // Generate a unique submission ID
    const submissionId = `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create lead in Zoho CRM
    const zohoResult = await createZohoLead(validatedData, submissionId)
    
    if (!zohoResult.success) {
      console.error('Failed to create Zoho lead:', zohoResult.error)
      // Still return success to user but log the error
      return NextResponse.json({ 
        success: true, 
        message: 'Demo request received. We will contact you shortly.',
        submissionId 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Demo request received. We will contact you shortly.',
      submissionId 
    })
  } catch (error) {
    console.error('Error processing form submission:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}