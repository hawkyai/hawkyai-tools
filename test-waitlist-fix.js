// Test script to verify waitlist CRM fix
// Run this with: node test-waitlist-fix.js

const testWaitlistFix = async () => {
  console.log('🧪 Testing Waitlist CRM Fix...\n');

  // Test with valid data
  console.log('1️⃣ Testing waitlist submission with valid data...');
  try {
    const testData = {
      name: 'Test User Fix',
      email: 'testfix@example.com'
    };

    const response = await fetch('http://localhost:3000/compliance-checker/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Waitlist submission successful!');
      console.log('📊 Zoho CRM success:', result.zohoSuccess);
      console.log('📊 Slack success:', result.slackSuccess);
      console.log('🆔 Submission ID:', result.submissionId);
      
      if (result.zohoSuccess) {
        console.log('🎉 Zoho CRM integration is working!');
      } else {
        console.log('⚠️ Zoho CRM failed, but Slack worked. Check debug info:');
        console.log('🔍 Zoho error:', result.debug?.zohoError);
      }
    } else {
      console.log('❌ Waitlist submission failed:', result.error);
      if (result.debug) {
        console.log('🔍 Zoho error:', result.debug.zohoError);
        console.log('🔍 Slack error:', result.debug.slackError);
      }
    }
  } catch (error) {
    console.log('❌ POST request failed:', error.message);
  }

  console.log('\n🎯 Test completed!');
  console.log('\n📋 What to check:');
  console.log('1. If zohoSuccess is true: Check your Zoho CRM for a new lead with Lead Source = "Waitlist"');
  console.log('2. If zohoSuccess is false: Check the debug.zohoError for specific error details');
  console.log('3. Check your Slack channel for the notification');
  console.log('4. Review server logs for detailed debugging information');
};

// Run the test
testWaitlistFix().catch(console.error); 