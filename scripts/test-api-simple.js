/**
 * Simple test script for API endpoints
 * 
 * Usage:
 * node scripts/test-api-simple.js
 */

const http = require('http');
const https = require('https');

function makeRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function testEndpoints() {
  console.log('Testing API endpoints...');
  
  const endpoints = [
    { url: 'http://localhost:3002/api/chat', method: 'POST', body: {
      messages: [{ role: 'user', content: 'Hello, this is a test message.' }],
      calculationResults: [],
      context: {}
    }},
    { url: 'http://localhost:3001/api/chat', method: 'GET' },
    { url: 'http://localhost:3001/chat', method: 'POST', body: {
      messages: [{ role: 'user', content: 'Hello, this is a test message.' }]
    }}
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.method} ${endpoint.url}...`);
      
      const response = await makeRequest(endpoint.url, endpoint.method, endpoint.body);
      
      console.log(`Response status: ${response.status}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
      
      if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
        try {
          const jsonData = JSON.parse(response.data);
          console.log('Response data:', JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log('Response data (not valid JSON):', response.data.substring(0, 200) + (response.data.length > 200 ? '...' : ''));
        }
      } else {
        console.log('Response data:', response.data.substring(0, 200) + (response.data.length > 200 ? '...' : ''));
      }
    } catch (error) {
      console.error(`Error testing ${endpoint.url}:`, error.message);
    }
    
    console.log('-----------------------------------');
  }
}

testEndpoints().catch(error => {
  console.error('Error running tests:', error);
}); 