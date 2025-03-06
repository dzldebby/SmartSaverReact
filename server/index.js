const express = require('express');
const cors = require('cors');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration for better mobile support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://bank-calculator.vercel.app',
      'https://bank-calculator-git-main-debbys-projects.vercel.app'
    ];
    
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'Cache-Control', 'Pragma', 'Expires']
};

app.use(cors(corsOptions));
app.use(express.json());

// Helper function to set CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept, Cache-Control, Pragma, Expires');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  if (req.method !== 'GET') {
    console.log('Request body:', req.body);
  }
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'API is working',
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Routes
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

// Direct chat endpoint that uses OpenAI
app.post('/chat', async (req, res) => {
  console.log('Direct chat endpoint called');
  console.log('Request body:', req.body);
  
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({
        error: 'OpenAI API key is not configured',
        details: 'Please set up your OpenAI API key in the server/.env file'
      });
    }

    // Import OpenAI client
    const openai = require('./config/openai');
    
    // Check if OpenAI client is initialized
    if (!openai) {
      console.error('OpenAI client is not initialized');
      return res.status(500).json({
        error: 'Failed to initialize OpenAI client',
        details: 'Please check the server logs for more information'
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Prepare conversation history
    const conversationHistory = [
      {
        role: 'system',
        content: 'You are a helpful banking assistant that specializes in explaining interest rates and savings accounts. Be concise, friendly, and provide specific advice.'
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log('Calling OpenAI API from direct endpoint...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('OpenAI API response received');

    if (completion.choices && completion.choices[0]) {
      res.json({ message: completion.choices[0].message.content });
    } else {
      throw new Error('No response from OpenAI');
    }
  } catch (error) {
    console.error('Error in direct chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
}); 