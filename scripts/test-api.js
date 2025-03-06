/**
 * Test script for API endpoints
 * 
 * Usage:
 * node scripts/test-api.js
 */

// Use dynamic import for node-fetch (ESM module)
async function runTests() {
  const { default: fetch } = await import('node-fetch');
  
  console.log('Testing API endpoints...');
  
  const endpoints = [
    { url: 'http://localhost:3002/api/test', method: 'GET' },
    { 
      url: 'http://localhost:3002/api/chat', 
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
        calculationResults: [],
        context: {}
      }
    },
    { 
      url: 'http://localhost:3002/api/direct-chat', 
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
        calculationResults: [],
        context: {}
      }
    },
    { 
      url: 'http://localhost:3002/api/local-chat', 
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
        calculationResults: [],
        context: {}
      }
    },
    { url: 'http://localhost:3001/api/chat', method: 'GET' },
    { 
      url: 'http://localhost:3001/chat', 
      method: 'POST',
      body: {
        messages: [{ role: 'user', content: 'Hello, this is a test message.' }]
      }
    }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.method} ${endpoint.url}...`);
      
      const options = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(endpoint.url, options);
      const contentType = response.headers.get('content-type');
      
      console.log(`Response status: ${response.status}`);
      console.log(`Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        console.log('Response text:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
      }
    } catch (error) {
      console.error(`Error testing ${endpoint.url}:`, error.message);
    }
    
    console.log('-----------------------------------');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 