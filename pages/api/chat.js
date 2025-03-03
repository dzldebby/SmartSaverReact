import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This will be set in .env.local
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
      Be concise, friendly, and provide specific advice based on the calculation results when available.`
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