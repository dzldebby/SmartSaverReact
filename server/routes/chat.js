const express = require('express');
const router = express.Router();
const openai = require('../config/openai');

router.post('/', async (req, res) => {
  console.log('Chat API route handler called');
  console.log('Request body:', req.body);

  try {
    const { messages, calculationResults } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

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
      4. BOC SmartSaver: Has tiered base interest (0.15%-0.40%) plus bonuses: 2.50% for salary of $2,000+, 0.50-0.80% for card spend, 0.90% for bill payments, and 2.40% Wealth Bonus for insurance.`
    };

    // Add calculation results as context if available
    if (calculationResults && calculationResults.length > 0) {
      const resultsContext = {
        role: 'system',
        content: `Current calculation results:\n${JSON.stringify(calculationResults, null, 2)}`
      };
      messages.unshift(resultsContext);
    }

    // Add system message at the start
    messages.unshift(systemMessage);

    console.log('Calling OpenAI API with messages:', messages);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
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
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

module.exports = router; 