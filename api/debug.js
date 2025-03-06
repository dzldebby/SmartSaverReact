/**
 * Debug API endpoint for Vercel deployment
 * Used to check environment variables and deployment status
 */

// Helper function to enable CORS
const enableCors = (req, res) => {
  // Get the origin from the request headers
  const origin = req.headers.origin || '*';
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin'
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

  res.status(200).json({
    envVarsExist: {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
      OPENAI_API_KEY_FORMAT: process.env.OPENAI_API_KEY ? 
        (process.env.OPENAI_API_KEY.startsWith('sk-') ? 'Valid prefix' : 'Invalid prefix') : 'No key',
      OPENAI_MODEL: !!process.env.OPENAI_MODEL,
      NODE_ENV: process.env.NODE_ENV
    },
    time: new Date().toISOString(),
    vercel: !!process.env.VERCEL,
    deployment: process.env.VERCEL_ENV || 'local'
  });
} 