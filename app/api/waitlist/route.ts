import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

// Slack webhook URL - Replace with your actual webhook URL
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

// Zoho CRM configuration
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET
const ZOHO_DOMAIN = "https://www.zohoapis.in"

// Function to validate Zoho credentials
function validateZohoCredentials() {
  const missingCredentials = [];
  
  if (!ZOHO_CLIENT_ID) missingCredentials.push('ZOHO_CLIENT_ID');
  if (!ZOHO_CLIENT_SECRET) missingCredentials.push('ZOHO_CLIENT_SECRET');
  if (!process.env.ZOHO_REFRESH_TOKEN) missingCredentials.push('ZOHO_REFRESH_TOKEN');
  
  if (missingCredentials.length > 0) {
    return {
      valid: false,
      error: `Missing Zoho credentials: ${missingCredentials.join(', ')}`
    };
  }
  
  return { valid: true };
}

// Function to refresh Zoho token
async function refreshZohoToken() {
  try {
    console.log('🔐 Starting Zoho token refresh...');
    
    // Validate credentials first
    const credentialCheck = validateZohoCredentials();
    if (!credentialCheck.valid) {
      throw new Error(credentialCheck.error);
    }
    
    console.log('✅ Zoho credentials validated');
    console.log('🔄 Refreshing Zoho access token...');
    
    const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: ZOHO_CLIENT_ID!,
        client_secret: ZOHO_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: process.env.ZOHO_REFRESH_TOKEN!
      })
    });

    const data = await response.json();
    console.log('📡 Zoho token refresh response status:', response.status);
    console.log('📡 Zoho token refresh response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      throw new Error(`Token refresh failed with status ${response.status}: ${JSON.stringify(data)}`);
    }
    
    if (!data.access_token) {
      throw new Error(`No access token in response: ${JSON.stringify(data)}`);
    }

    console.log('✅ Zoho access token refreshed successfully');
    return data.access_token;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    return null;
  }
}

// Function to test Zoho CRM connection
async function testZohoConnection(accessToken: string) {
  try {
    console.log('🧪 Testing Zoho CRM connection...');
    
    // Try a simpler endpoint that doesn't require special scopes
    const response = await fetch(`${ZOHO_DOMAIN}/crm/v8/settings/modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('📡 Zoho connection test response status:', response.status);
    console.log('📡 Zoho connection test response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      throw new Error(`Zoho connection test failed: ${response.status} - ${JSON.stringify(data)}`);
    }

    console.log('✅ Zoho CRM connection test successful');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Zoho CRM connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Function to create a waitlist lead in Zoho CRM
async function createWaitlistLead(formData: any, submissionId: string) {
  try {
    console.log('🚀 Starting Zoho CRM lead creation...');
    console.log('📝 Form data:', JSON.stringify(formData, null, 2));
    
    const accessToken = await refreshZohoToken();
    if (!accessToken) {
      throw new Error('Authentication failed: No valid token available. Please check your Zoho credentials.');
    }
    
    console.log('✅ Access token obtained successfully');
    console.log('Using access token for API call:', accessToken ? 'Present' : 'Missing');
    
    // Prepare lead data with only Full Name and Email, Lead Source as "Waitlist"
    const leadData = {
      data: [
        {
          id: '1',
          Last_Name: formData.name || formData.fullName || '',
          Email: formData.email || '',
          Lead_Source: 'Waitlist',
          Lead_Status: 'New'
        }
      ],
      trigger: [
        'workflow'
      ]
    };

    console.log('📤 Sending waitlist data to Zoho CRM:', JSON.stringify(leadData, null, 2));
    const ZOHO_API_VERSION = "v8"
    const ZOHO_MODULE = "Leads"
    
    // Use the same approach as the working get-data route
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
    });

    const result = await response.json();
    console.log('📡 Zoho API response status:', response.status);
    console.log('📡 Zoho API response:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log('✅ Zoho CRM waitlist lead created successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Error creating Zoho waitlist lead:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function sendWaitlistSlackNotification(formData: any, submissionId: string) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn("⚠️ Slack webhook URL not configured")
    return { success: false, error: "Webhook not configured" }
  }

  // Log the webhook URL (partially masked)
  console.log("📡 Slack webhook starts with:", SLACK_WEBHOOK_URL.slice(0, 40) + '...')

  try {
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎉 New Waitlist Signup",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${formData.name || formData.fullName || 'N/A'}`
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${formData.email || 'N/A'}`
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
    console.log("📡 Slack response status:", slackRes.status)
    console.log("📡 Slack response text:", slackText)
    if (!slackRes.ok) {
      throw new Error(`Slack webhook failed: ${slackRes.status} - ${slackText}`)
    }
    console.log('✅ Slack notification sent successfully');
    return { success: true }
  } catch (error: unknown) {
    console.error("❌ Error sending Slack notification:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function POST(request: Request) {
  try {
    console.log('🎯 Waitlist API endpoint called');
    
    const data = await request.json();
    console.log("📝 Received waitlist data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.email) {
      console.log('❌ Validation failed: Email is required');
      return NextResponse.json({ 
        success: false, 
        error: "Email is required" 
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (!data.name && !data.fullName) {
      console.log('❌ Validation failed: Full Name is required');
      return NextResponse.json({ 
        success: false, 
        error: "Full Name is required" 
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    console.log('✅ Input validation passed');

    // Generate submission ID and timestamp
    const submissionId = uuidv4();
    const timestamp = new Date().toISOString();
    console.log('🆔 Generated submission ID:', submissionId);

    // Store in Zoho CRM as waitlist lead
    console.log('🔄 Starting Zoho CRM integration...');
    const zohoResult = await createWaitlistLead(data, submissionId);
    if (!zohoResult.success) {
      console.error("❌ Zoho CRM error:", zohoResult.error);
      // Continue to Slack notification even if Zoho fails
    } else {
      console.log('✅ Zoho CRM integration successful');
    }

    // Send Slack notification
    console.log('🔄 Starting Slack notification...');
    const slackResult = await sendWaitlistSlackNotification(data, submissionId);
    if (!slackResult.success) {
      console.error("❌ Slack notification error:", slackResult.error);
    } else {
      console.log('✅ Slack notification successful');
    }

    // Return success if either Zoho or Slack succeeded
    if (zohoResult.success || slackResult.success) {
      console.log('🎉 Waitlist submission completed successfully');
      return NextResponse.json({ 
        success: true, 
        data: zohoResult.data,
        zohoSuccess: zohoResult.success,
        slackSuccess: slackResult.success,
        submissionId: submissionId,
        timestamp: timestamp,
        debug: {
          zohoError: zohoResult.error || null,
          slackError: slackResult.error || null
        }
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    } else {
      console.log('❌ Both Zoho CRM and Slack notifications failed');
      return NextResponse.json({ 
        success: false, 
        error: "Both Zoho CRM and Slack notifications failed",
        zohoError: zohoResult.error,
        slackError: slackResult.error
      }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }
  } catch (error: any) {
    console.error("❌ Error in waitlist API (POST):", error);
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      success: false, 
      error: errorMessage || "Failed to process waitlist data",
      details: error instanceof Error ? error.stack : undefined
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

// GET endpoint for testing
export async function GET() {
  console.log('🧪 Waitlist API test endpoint called');
  
  // Test Zoho credentials
  const credentialCheck = validateZohoCredentials();
  
  return NextResponse.json({ 
    message: "Waitlist API is working!",
    endpoint: "/compliance-checker/api/waitlist",
    method: "POST",
    requiredFields: ["email", "name"],
    fieldMapping: {
      "name": "Full Name (can also use 'fullName')",
      "email": "Email Address"
    },
    leadSource: "Waitlist",
    zohoCredentials: {
      valid: credentialCheck.valid,
      error: credentialCheck.error || null
    },
    environment: {
      hasSlackWebhook: !!SLACK_WEBHOOK_URL,
      hasZohoClientId: !!ZOHO_CLIENT_ID,
      hasZohoClientSecret: !!ZOHO_CLIENT_SECRET,
      hasZohoRefreshToken: !!process.env.ZOHO_REFRESH_TOKEN
    }
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}