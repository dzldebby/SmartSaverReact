// Test script to check for CORS issues
// Run with: node src/lib/testCors.js https://your-vercel-deployment-url.vercel.app

const fetch = require('node-fetch');

async function testCors() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('Please provide your Vercel deployment URL as an argument');
    console.error('Example: node testCors.js https://your-app.vercel.app');
    process.exit(1);
  }
  
  console.log(`Testing CORS for: ${baseUrl}`);
  
  try {
    // Test OPTIONS request to check CORS headers
    console.log('\nSending OPTIONS request to check CORS headers...');
    const optionsResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('OPTIONS response status:', optionsResponse.status);
    console.log('CORS Headers:');
    
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Credentials'
    ];
    
    corsHeaders.forEach(header => {
      console.log(`${header}: ${optionsResponse.headers.get(header)}`);
    });
    
    // Test actual POST request
    console.log('\nSending POST request to test actual API call...');
    const postResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'CORS test message' }
        ],
        calculationResults: [],
        context: {}
      })
    });
    
    console.log('POST response status:', postResponse.status);
    
    if (postResponse.ok) {
      const data = await postResponse.json();
      console.log('Response data:', data);
    } else {
      const errorText = await postResponse.text();
      console.error('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('CORS test failed:', error);
  }
}

testCors(); 