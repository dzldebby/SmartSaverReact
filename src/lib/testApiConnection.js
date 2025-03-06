// Test script to check API connectivity
// Run with: node src/lib/testApiConnection.js https://your-vercel-deployment-url.vercel.app

const fetch = require('node-fetch');

async function testApiConnection() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('Please provide your Vercel deployment URL as an argument');
    console.error('Example: node testApiConnection.js https://your-app.vercel.app');
    process.exit(1);
  }
  
  console.log(`Testing API connectivity to: ${baseUrl}`);
  
  try {
    // Test debug endpoint
    console.log('\nTesting debug endpoint...');
    const debugResponse = await fetch(`${baseUrl}/api/debug`);
    const debugData = await debugResponse.json();
    console.log('Debug response:', debugData);
    
    // Test chat endpoint with a simple message
    console.log('\nTesting chat endpoint...');
    const chatResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello, this is a test message' }
        ],
        calculationResults: [],
        context: {}
      }),
    });
    
    console.log('Chat response status:', chatResponse.status);
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('Chat response data:', chatData);
    } else {
      const errorText = await chatResponse.text();
      console.error('Chat error response:', errorText);
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testApiConnection(); 