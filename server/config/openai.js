const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('OpenAI client initialized successfully');
  console.log('API Key available:', !!process.env.OPENAI_API_KEY);
  console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
  console.log('API Key format check:', process.env.OPENAI_API_KEY ? 
    (process.env.OPENAI_API_KEY.startsWith('sk-') ? 'Valid prefix' : 'Invalid prefix') : 'No key');
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  openai = null;
}

module.exports = openai; 