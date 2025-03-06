const express = require('express');
const cors = require('cors');
require('dotenv').config();
const openai = require('./config/openai');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3000', process.env.FRONTEND_URL || '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
    port: port,
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
}); 