import { OpenAI } from 'openai';

/**
 * Chatbot API handler for Vercel serverless deployment
 * This is the single source of truth for the chatbot API
 */

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This will be set in Vercel environment variables
  });
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

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

export default async function handler(req, res) {
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');

  // Enable CORS for all environments
  enableCors(req, res);

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Chat API handler called in Vercel');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Vercel deployment:', !!process.env.VERCEL);
  console.log('Vercel environment:', process.env.VERCEL_ENV);
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(200).json({
        message: 'OpenAI API key is not configured. This is a fallback response.',
        error: 'OpenAI API key is missing',
        details: 'Please set OPENAI_API_KEY in your Vercel environment variables'
      });
    }

    // Log API key information (without revealing the key)
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
    console.log('API Key format check:', process.env.OPENAI_API_KEY ? 
      (process.env.OPENAI_API_KEY.startsWith('sk-') ? 'Valid prefix' : 'Invalid prefix') : 'No key');

    // Extract request data
    const { messages, calculationResults, context } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Debug logging
    console.log('Request data:', {
      messageCount: messages ? messages.length : 0,
      hasCalculationResults: !!calculationResults,
      hasContext: !!context
    });

    // If OpenAI client is not initialized, return a fallback response
    if (!openai) {
      return res.status(200).json({
        message: 'OpenAI client is not initialized. This is a fallback response.',
        received: {
          messages: messages ? messages.map(msg => ({ role: msg.role, content: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : '') })) : [],
          calculationResults: calculationResults ? 'Provided' : 'Not provided',
          context: context ? 'Provided' : 'Not provided'
        }
      });
    }

    // Prepare conversation history
    const conversationHistory = [];

    // Add system message with context
    conversationHistory.push({
      role: 'system',
      content: `You are a helpful banking assistant that specializes in explaining interest rates and savings accounts.
      You have access to the user's calculation results for various bank accounts.
      
      ${calculationResults && calculationResults.length > 0 ? 
        `Based on the user's calculations:
        ${calculationResults.map(result => {
          const bankId = result.bankId || 'unknown';
          const totalInterest = parseFloat(result.totalInterest || result.annualInterest || 0);
          const interestRate = parseFloat(result.interestRate || 0);
          
          return `- ${bankId}: Total Annual Interest: $${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Rate: ${(interestRate * 100).toFixed(2)}%)`;
        }).join('\n        ')}`
        : 'The user has not performed any calculations yet.'}
      
      ${context ? `Current user context:
      ${context.depositAmount ? `- Deposit amount: $${context.depositAmount.toLocaleString()}` : ''}
      ${context.hasSalary ? `- Has salary credit${context.salaryAmount ? `: $${context.salaryAmount.toLocaleString()}` : ''}` : ''}
      ${context.hasSpending ? `- Has card spending${context.spendingAmount ? `: $${context.spendingAmount.toLocaleString()}` : ''}` : ''}
      ${context.hasInsurance ? '- Has insurance products' : ''}
      ${context.hasBillPayments ? '- Has bill payments/GIRO' : ''}` : ''}
      
      Important instructions:
      1. ALWAYS refer to the actual calculation results when discussing interest rates and amounts.
      2. If a specific bank shows better results in the calculations, mention that instead of giving generic advice.
      3. Be precise with numbers - use the exact interest amounts and rates from the calculations.
      4. If Chocolate bank or any other bank shows higher interest than traditional banks, make sure to highlight that.
      5. Don't make assumptions about which bank is best - use only the calculated results.
      
      Be concise, friendly, and provide specific advice based on the calculation results and user context when available.`
    });

    // Add calculation results as context if available
    if (calculationResults && calculationResults.length > 0) {
      // Find the bank with the highest interest
      const sortedBanks = calculationResults
        .filter(result => (parseFloat(result.totalInterest || result.annualInterest || 0) > 0))
        .sort((a, b) => {
          const interestA = parseFloat(a.totalInterest || a.annualInterest || 0);
          const interestB = parseFloat(b.totalInterest || b.annualInterest || 0);
          return interestB - interestA;
        });

      if (sortedBanks.length > 0) {
        conversationHistory.push({
          role: 'system',
          content: `Current best options based on calculations:
          1. ${sortedBanks[0].bankId}: $${parseFloat(sortedBanks[0].totalInterest || sortedBanks[0].annualInterest || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} annual interest
          ${sortedBanks.length > 1 ? `2. ${sortedBanks[1].bankId}: $${parseFloat(sortedBanks[1].totalInterest || sortedBanks[1].annualInterest || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} annual interest` : ''}
          ${sortedBanks.length > 2 ? `3. ${sortedBanks[2].bankId}: $${parseFloat(sortedBanks[2].totalInterest || sortedBanks[2].annualInterest || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} annual interest` : ''}`
        });
      }
    }

    // Add user messages
    if (messages && Array.isArray(messages)) {
      conversationHistory.push(...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    }

    console.log('Calling OpenAI API...');
    console.log('Conversation history length:', conversationHistory.length);

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      console.log('OpenAI API response received');

      if (completion.choices && completion.choices[0]) {
        return res.status(200).json({ message: completion.choices[0].message.content });
      } else {
        throw new Error('No response from OpenAI');
      }
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);
      
      // Return a fallback response instead of an error
      return res.status(200).json({
        message: `I'm sorry, I couldn't process your request through our AI system. Here's what I understand: You asked about "${messages && messages.length > 0 ? messages[messages.length - 1].content.substring(0, 50) + '...' : 'No message found'}". Please try again later or contact support if this issue persists.`,
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return a fallback response instead of an error
    return res.status(200).json({ 
      message: "I'm sorry, I encountered an unexpected error. Please try again later or contact support if this issue persists.",
      error: error.message
    });
  }
} 