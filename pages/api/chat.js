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
    console.log('Request body:', JSON.stringify(req.body));
    const { query, context } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({ 
        error: 'OpenAI API key is missing. Please set OPENAI_API_KEY in your environment variables.' 
      });
    }
    
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    console.log('Query:', query);
    
    // Extract key information from context
    const { depositAmount, hasSalary, salaryAmount, cardSpend, giroCount, hasInsurance, hasInvestments } = context;
    
    // Find highest interest bank
    let highestInterestBank = '';
    let highestInterest = 0;
    
    if (context.calculationResults) {
      Object.entries(context.calculationResults).forEach(([bankId, result]) => {
        if (result.annualInterest > highestInterest) {
          highestInterest = result.annualInterest;
          highestInterestBank = bankId;
        }
      });
    }
    
    // Format bank name for display
    const bankName = highestInterestBank ? 
      highestInterestBank.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
    
    // Prepare the system message with context about the banks and the user's profile
    const systemMessage = `You are a helpful banking assistant for SmartSaverSG, a tool that helps users compare interest rates from different banks in Singapore.
    
The user has calculated interest rates with the following profile:
- Deposit amount: $${depositAmount.toLocaleString()}
- ${hasSalary ? `Salary credit: $${salaryAmount.toLocaleString()}` : 'No salary credit'}
- Card spend: $${cardSpend.toLocaleString()}
- Bill payments/GIRO: ${giroCount}
- ${hasInsurance ? 'Has insurance products' : 'No insurance products'}
- ${hasInvestments ? 'Has investments' : 'No investments'}

Based on these inputs, ${bankName} offers the highest interest at $${highestInterest.toFixed(2)} per year.

Here's information about the main banks:
1. UOB One: Offers tiered interest rates (3.00% on first $75K, 4.50% on next $50K, 6.00% on next $25K) with salary + $500 card spend.
2. OCBC 360: Offers 2.00% on first $75K and 4.00% on next $25K with salary of $1,800+, plus 0.60% for $500 card spend.
3. SC BonusSaver: Offers 1.00% for salary credit of $3,000+ and 1.00% for card spend of $1,000+.
4. DBS Multiplier: Offers 1.80% on first $50,000 with one category (like salary), higher rates with more categories.
5. BOC SmartSaver: Has tiered base interest (0.15%-0.40%) plus bonuses: 2.50% for salary of $2,000+, 0.50-0.80% for card spend, 0.90% for bill payments.

Provide helpful, concise answers about these banks, interest calculations, and recommendations based on the user's profile. If asked about specific numbers, use the context provided.`;

    try {
      // Call OpenAI API
      console.log('Calling OpenAI API...');
      console.log('OpenAI client initialized with API key:', openai.apiKey ? 'Key exists' : 'No key');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      console.log('OpenAI API response received');
      
      // Extract the response
      const response = completion.choices[0].message.content;
      
      console.log('Sending response back to client');
      return res.status(200).json({ response });
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);
      return res.status(500).json({ 
        error: 'Error calling OpenAI API', 
        details: apiError.message,
        stack: apiError.stack
      });
    }
  } catch (error) {
    console.error('Error processing chat:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request', 
      details: error.message,
      stack: error.stack
    });
  }
} 