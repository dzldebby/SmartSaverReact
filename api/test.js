/**
 * Simple test API endpoint for Vercel deployment
 * Used to verify that API routes are working
 */

// Helper function to enable CORS
const enableCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
};

export default function handler(req, res) {
  // Enable CORS
  enableCors(req, res);

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return a simple response
  res.status(200).json({
    message: 'API is working!',
    method: req.method,
    path: req.url,
    time: new Date().toISOString(),
    vercel: !!process.env.VERCEL,
    deployment: process.env.VERCEL_ENV || 'local'
  });
} 