// Test script to check which API routes are accessible
// Run with: node src/lib/testApiRoutes.js https://your-vercel-deployment-url.vercel.app

const fetch = require('node-fetch');

async function testApiRoutes() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('Please provide your Vercel deployment URL as an argument');
    console.error('Example: node testApiRoutes.js https://your-app.vercel.app');
    process.exit(1);
  }
  
  console.log(`Testing API routes for: ${baseUrl}`);
  
  // List of potential API routes to test
  const routes = [
    '/api/chat',
    '/api/debug',
    '/pages/api/chat',
    '/src/pages/api/chat'
  ];
  
  for (const route of routes) {
    try {
      console.log(`\nTesting route: ${route}`);
      
      // Test OPTIONS request first
      console.log('Sending OPTIONS request...');
      const optionsResponse = await fetch(`${baseUrl}${route}`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });
      
      console.log(`OPTIONS status: ${optionsResponse.status}`);
      
      // Then test GET request
      console.log('Sending GET request...');
      const getResponse = await fetch(`${baseUrl}${route}`);
      console.log(`GET status: ${getResponse.status}`);
      
      if (getResponse.ok) {
        try {
          const data = await getResponse.json();
          console.log('Response data:', data);
        } catch (e) {
          const text = await getResponse.text();
          console.log('Response text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
        }
      }
      
    } catch (error) {
      console.error(`Error testing ${route}:`, error.message);
    }
  }
}

testApiRoutes(); 