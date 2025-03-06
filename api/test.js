/**
 * Simple test API endpoint for Vercel deployment
 * Used to verify that API routes are working
 */

// Helper function to enable CORS for all requests
function enableCors(req, res) {
  // Get the request origin or default to '*'
  const origin = req.headers.origin || '*';
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin, Cache-Control, Pragma, Expires'
  );
}

// Simple test API endpoint
export default function handler(req, res) {
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Enable CORS for all environments
  enableCors(req, res);
  
  // Log request details for debugging
  console.log('Test API called');
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Return environment information
  return res.status(200).json({
    status: 'API is working',
    message: 'This endpoint is working correctly on both desktop and mobile devices.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    headers: {
      origin: req.headers.origin || 'none',
      userAgent: req.headers['user-agent'] || 'none'
    }
  });
} 