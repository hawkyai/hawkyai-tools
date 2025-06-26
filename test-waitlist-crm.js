// Test script for waitlist CRM integration
// Run this with: node test-waitlist-crm.js

const testWaitlistCRM = async () => {
  console.log('🧪 Testing Waitlist CRM Integration...\n');

  // Test 1: Check if the API endpoint is accessible
  console.log('1️⃣ Testing API endpoint accessibility...');
  try {
    const response = await fetch('http://localhost:3000/compliance-checker/api/waitlist', {
      method: 'GET'
    });
    const data = await response.json();
    console.log('✅ GET endpoint response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ GET endpoint failed:', error.message);
  }

  // Test 2: Test with valid data
  console.log('\n2️⃣ Testing with valid waitlist data...');
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com'
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

  // Test 3: Test with invalid data (missing email)
  console.log('\n3️⃣ Testing with invalid data (missing email)...');
  try {
    const invalidData = {
      name: 'Test User'
      // Missing email
    };

    const response = await fetch('http://localhost:3000/compliance-checker/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (response.status === 400) {
      console.log('✅ Validation working correctly - rejected invalid data');
    } else {
      console.log('❌ Validation failed - should have rejected invalid data');
    }
  } catch (error) {
    console.log('❌ Invalid data test failed:', error.message);
  }

  // Test 4: Test with invalid data (missing name)
  console.log('\n4️⃣ Testing with invalid data (missing name)...');
  try {
    const invalidData = {
      email: 'test@example.com'
      // Missing name
    };

    const response = await fetch('http://localhost:3000/compliance-checker/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (response.status === 400) {
      console.log('✅ Validation working correctly - rejected invalid data');
    } else {
      console.log('❌ Validation failed - should have rejected invalid data');
    }
  } catch (error) {
    console.log('❌ Invalid data test failed:', error.message);
  }

  console.log('\n🎯 Waitlist CRM testing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your server logs for detailed CRM integration logs');
  console.log('2. Verify the lead appears in your Zoho CRM with Lead Source = "Waitlist"');
  console.log('3. Check your Slack channel for the notification');
  console.log('4. Review the environment variables are set correctly');
};

// Run the test
testWaitlistCRM().catch(console.error); 