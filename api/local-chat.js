/**
 * Local development API endpoint that forwards requests to the local server
 * This is used for testing in local development
 */

// Local chat API endpoint that uses OpenAI
import { OpenAI } from 'openai';

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
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Handle CORS preflight requests
  if (enableCors(req, res)) {
    return;
  }
  
  console.log('Local chat API endpoint called');
  console.log('Request method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, calculationResults, context } = req.body;
    
    console.log('Received messages:', messages ? messages.length : 0);
    console.log('Has calculation results:', !!calculationResults);
    console.log('Has context:', !!context);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not defined');
      return res.status(200).json({ 
        message: "I'm sorry, but the OpenAI API key is not configured. Please set up your API key in the environment variables.",
        error: 'OpenAI API key is missing',
        status: 'error'
      });
    }

    // Prepare system message
    const systemMessage = {
      role: 'system',
      content: `You are a helpful banking assistant that specializes in explaining interest rates and savings accounts. 
      You are currently running in local development mode.
      Be concise, friendly, and provide specific advice based on the user's questions.`
    };

    // Combine system message with user messages
    let conversationHistory = [systemMessage];
    
    if (messages && Array.isArray(messages)) {
      conversationHistory = conversationHistory.concat(messages);
    }

    console.log('Calling OpenAI API...');

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500,
      });

      console.log('OpenAI API response received');

      if (completion.choices && completion.choices.length > 0) {
        return res.status(200).json({ 
          message: completion.choices[0].message.content,
          status: 'success',
          environment: 'local'
        });
      } else {
        throw new Error('No response from OpenAI');
      }
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);
      
      // Provide a fallback response with the error details
      return res.status(200).json({
        message: `I'm sorry, I couldn't process your request through our AI system. Please try again later.`,
        error: apiError.message,
        status: 'error',
        environment: 'local'
      });
    }
  } catch (error) {
    console.error('Error in local chat API:', error);
    return res.status(200).json({ 
      message: "I'm sorry, I encountered an unexpected error. Please try again later.",
      error: error.message,
      status: 'error',
      environment: 'local'
    });
  }
} 