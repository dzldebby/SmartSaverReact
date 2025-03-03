import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This will be set in .env.local
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('API route handler called');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Environment variables:', {
    OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
    OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    NODE_ENV: process.env.NODE_ENV
  });

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, calculationResults } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Debug information
    console.log('Request received:', {
      messageCount: messages.length,
      hasCalculationResults: !!calculationResults,
      OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
      OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    });

    // Prepare system message with context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful banking assistant that specializes in explaining interest rates and savings accounts. 
      You have access to the user's calculation results for various bank accounts.
      ${calculationResults ? `The user has calculated interest for the following banks: ${calculationResults.map(r => r.bankId).join(', ')}` : 'The user has not performed any calculations yet.'}
      Be concise, friendly, and provide specific advice based on the calculation results when available.
      
      Here's information about the main banks:
      1. UOB One: Offers tiered interest rates (3.00% on first $75K, 4.50% on next $50K, 6.00% on next $25K) with salary + $500 card spend.
      2. OCBC 360: Offers 2.00% on first $75K and 4.00% on next $25K with salary of $1,800+, plus 0.60% for $500 card spend.
      3. SC BonusSaver: Offers 1.00% for salary credit of $3,000+ and 1.00% for card spend of $1,000+.
      4. DBS Multiplier: Offers 1.80% on first $50,000 with one category (like salary), higher rates with more categories.
      5. BOC SmartSaver: Has tiered base interest (0.15%-0.40%) plus bonuses: 2.50% for salary of $2,000+, 0.50-0.80% for card spend, 0.90% for bill payments, and 2.40% Wealth Bonus for insurance.`
    };

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({
        error: 'OpenAI API key is missing. Please set OPENAI_API_KEY in your environment variables.'
      });
    }

    console.log('API Key available:', !!process.env.OPENAI_API_KEY);

    // Prepare the conversation history
    const conversationHistory = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Add calculation results as context if available
    if (calculationResults && calculationResults.length > 0) {
      const resultsContext = {
        role: 'system',
        content: `Current calculation results:\n${JSON.stringify(calculationResults, null, 2)}`
      };
      conversationHistory.push(resultsContext);
    }

    // Call OpenAI API
    console.log('Calling OpenAI API...');
    console.log('OpenAI client initialized with API key:', openai.apiKey ? 'Key exists' : 'No key');

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log('OpenAI API response received');
    
    // Return the assistant's message
    return res.status(200).json({
      message: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      error: 'Error calling OpenAI API',
      details: error.message
    });
  }
} 