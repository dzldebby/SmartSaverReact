import { OpenAI } from 'openai';

/**
 * Chatbot API handler for Vercel serverless deployment
 * This is the single source of truth for the chatbot API
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
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (enableCors(req, res)) {
    return;
  }
  
  console.log('API chat endpoint called');
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

    // Prepare system message with context and calculation results
    const systemMessage = {
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
    };

    // Add calculation results as context if available
    let conversationHistory = [systemMessage];
    
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
          status: 'success'
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
        status: 'error'
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(200).json({ 
      message: "I'm sorry, I encountered an unexpected error. Please try again later.",
      error: error.message,
      status: 'error'
    });
  }
} 