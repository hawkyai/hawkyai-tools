import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Zoho CRM configuration
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET
const ZOHO_DOMAIN = "https://www.zohoapis.in"

// Function to refresh Zoho access token
async function refreshZohoToken() {
  try {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
      throw new Error('Missing required Zoho credentials for token refresh');
    }
    
    const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: process.env.ZOHO_REFRESH_TOKEN || ''
      })
    });

    const data = await response.json();
    if (!response.ok || !data.access_token) {
      throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

// Function to initiate OAuth flow
export async function GET(request: Request) {
  const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=ZohoCRM.modules.ALL&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/api/auth/callback`;
  return NextResponse.redirect(authUrl);
}

// Function to handle OAuth callback and token exchange
export async function POST(request: Request) {
  try {
    // Debug environment variables
    console.log('Environment check:')
    console.log('ZOHO_CLIENT_ID:', process.env.ZOHO_CLIENT_ID ? 'Set' : 'Not set')
    console.log('ZOHO_CLIENT_SECRET:', process.env.ZOHO_CLIENT_SECRET ? 'Set' : 'Not set')
    console.log('ZOHO_REFRESH_TOKEN:', process.env.ZOHO_REFRESH_TOKEN ? 'Set' : 'Not set')

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

    // Return success if either Zoho or Slack succeeded
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

// Function to create a lead in Zoho CRM
async function createZohoLead(formData: any, submissionId: string) {
  try {
    const accessToken = await refreshZohoToken();
    if (!accessToken) {
      throw new Error('Authentication failed: No valid token available. Please check your Zoho credentials.');
    }
    console.log('Using access token for API call:', accessToken ? 'Present' : 'Missing');
    
    const leadData = {
      data: [
        {
          id: '1',
          Company: formData.company || 'Unknown',
          Last_Name: formData.name || 'Doe',
          First_Name: formData.firstName || 'John',
          Phone: formData.phone || '9876543210',
          Email: formData.email || 'john.doe@example.com'
        }
      ],
      trigger: [
        'workflow'
      ]
    };

    console.log('Sending data to Zoho CRM:', JSON.stringify(leadData, null, 2));

    const response = await fetch(`${ZOHO_DOMAIN}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();
    console.log('Zoho API response status:', response.status);
    console.log('Zoho API response:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('Zoho CRM lead created successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating Zoho lead:', error);
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