# Zoho CRM Integration Checklist for Waitlist Route

## 🔧 Environment Variables Check

Make sure these environment variables are set in your `.env.local` file:

```bash
# Zoho CRM Configuration
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token

# Slack Configuration (optional but recommended)
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## 🧪 Testing Steps

### 1. Test API Endpoint Accessibility
```bash
# Test the GET endpoint
curl http://localhost:3000/compliance-checker/api/waitlist
```

**Expected Response:**
```json
{
  "message": "Waitlist API is working!",
  "endpoint": "/compliance-checker/api/waitlist",
  "method": "POST",
  "requiredFields": ["email", "name"],
  "zohoCredentials": {
    "valid": true,
    "error": null
  },
  "environment": {
    "hasSlackWebhook": true,
    "hasZohoClientId": true,
    "hasZohoClientSecret": true,
    "hasZohoRefreshToken": true
  }
}
```

### 2. Test Valid Waitlist Submission
```bash
curl -X POST http://localhost:3000/compliance-checker/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": { /* Zoho CRM response */ },
  "zohoSuccess": true,
  "slackSuccess": true,
  "submissionId": "uuid-here",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Test Invalid Data Validation
```bash
# Test missing email
curl -X POST http://localhost:3000/compliance-checker/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User"}'

# Test missing name
curl -X POST http://localhost:3000/compliance-checker/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Expected Response (400 status):**
```json
{
  "success": false,
  "error": "Email is required" // or "Full Name is required"
}
```

## 📊 Verification Points

### ✅ Zoho CRM Integration
- [ ] Access token is successfully refreshed
- [ ] Zoho CRM connection test passes
- [ ] Lead is created in Zoho CRM with:
  - [ ] Last_Name field populated
  - [ ] Email field populated
  - [ ] Lead_Source = "Waitlist"
  - [ ] Lead_Status = "New"
- [ ] Response contains lead details with ID

### ✅ Slack Integration
- [ ] Slack webhook URL is configured
- [ ] Notification is sent to Slack channel
- [ ] Message contains:
  - [ ] Name
  - [ ] Email
  - [ ] Submission ID

### ✅ Error Handling
- [ ] Missing credentials are properly detected
- [ ] Invalid data is rejected with 400 status
- [ ] Zoho API errors are logged and handled
- [ ] Slack errors don't break the main flow

## 🔍 Debugging Steps

### 1. Check Server Logs
Look for these log messages in your server console:

```
🎯 Waitlist API endpoint called
📝 Received waitlist data: {...}
✅ Input validation passed
🆔 Generated submission ID: uuid-here
🔄 Starting Zoho CRM integration...
🔐 Starting Zoho token refresh...
✅ Zoho credentials validated
🔄 Refreshing Zoho access token...
✅ Zoho access token refreshed successfully
🧪 Testing Zoho CRM connection...
✅ Zoho CRM connection test successful
🚀 Starting Zoho CRM lead creation...
📤 Sending waitlist data to Zoho CRM: {...}
📡 Zoho API response status: 201
✅ Zoho CRM waitlist lead created successfully
🔄 Starting Slack notification...
✅ Slack notification sent successfully
🎉 Waitlist submission completed successfully
```

### 2. Check Zoho CRM
1. Log into your Zoho CRM account
2. Go to Leads module
3. Look for a new lead with:
   - Lead Source = "Waitlist"
   - Email = test email
   - Name = test name
   - Lead Status = "New"

### 3. Check Slack Channel
1. Go to your configured Slack channel
2. Look for a message with:
   - Header: "🎉 New Waitlist Signup"
   - Name and email fields
   - Submission ID

## 🚨 Common Issues & Solutions

### Issue: "Missing Zoho credentials"
**Solution:** Check your `.env.local` file has all required Zoho variables

### Issue: "Token refresh failed"
**Solution:** 
1. Verify your Zoho app credentials are correct
2. Check if refresh token is still valid
3. Generate new refresh token if needed

### Issue: "Zoho API error: 401"
**Solution:** 
1. Check if access token is expired
2. Verify API permissions for your Zoho app
3. Ensure you're using the correct Zoho domain (zohoapis.in)

### Issue: "Zoho API error: 400"
**Solution:**
1. Check the lead data structure
2. Verify required fields are present
3. Check Zoho CRM field mappings

### Issue: "Slack webhook failed"
**Solution:**
1. Verify Slack webhook URL is correct
2. Check if webhook is still active
3. Test webhook URL separately

## 📝 Test Script Usage

Run the provided test script:

```bash
node test-waitlist-crm.js
```

This will automatically test:
- API endpoint accessibility
- Valid data submission
- Invalid data validation
- Response structure

## 🎯 Success Criteria

The CRM integration is working correctly if:

1. ✅ GET endpoint returns configuration status
2. ✅ POST with valid data creates lead in Zoho CRM
3. ✅ POST with invalid data returns 400 error
4. ✅ Slack notification is sent successfully
5. ✅ Server logs show successful flow
6. ✅ Lead appears in Zoho CRM with correct data
7. ✅ Notification appears in Slack channel

## 🔄 Continuous Monitoring

After deployment, monitor:
- Server logs for errors
- Zoho CRM for new leads
- Slack channel for notifications
- API response times
- Error rates 