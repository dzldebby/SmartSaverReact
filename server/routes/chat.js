const express = require('express');
const router = express.Router();
const openai = require('../config/openai');

router.post('/', async (req, res) => {
  console.log('Chat API route handler called');
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

    const { messages, calculationResults, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Debug logging for calculation results and context
    console.log('Calculation results:', JSON.stringify(calculationResults, null, 2));
    console.log('User context:', JSON.stringify(context, null, 2));

    // Prepare conversation history
    const conversationHistory = [];

    // Add system message first with context
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

    // Remove the generic bank information section since we want to focus on actual results
    
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
    conversationHistory.push(...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })));

    console.log('Calling OpenAI API with messages:', conversationHistory);

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      console.log('OpenAI API response:', completion);

      if (completion.choices && completion.choices[0]) {
        res.json({ message: completion.choices[0].message.content });
      } else {
        throw new Error('No response from OpenAI');
      }
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);
      
      // Check for specific API errors
      if (apiError.code === 'invalid_api_key') {
        return res.status(500).json({
          error: 'Invalid OpenAI API key',
          details: 'Please check your OpenAI API key configuration'
        });
      } else if (apiError.code === 'insufficient_quota') {
        return res.status(500).json({
          error: 'OpenAI API quota exceeded',
          details: 'Please check your OpenAI API usage and limits'
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

module.exports = router; 