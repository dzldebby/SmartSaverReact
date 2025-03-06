/**
 * Test script for OpenAI API
 * 
 * Usage:
 * node scripts/test-openai.js [API_KEY]
 * 
 * If API_KEY is not provided, it will use the one from the .env file
 */

require('dotenv').config();
const { OpenAI } = require('openai');

async function testOpenAI() {
  // Get API key from command line or .env file
  const apiKey = process.argv[2] || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('Error: No OpenAI API key provided');
    console.error('Please provide an API key as a command line argument or set it in the .env file');
    process.exit(1);
  }
  
  console.log('Testing OpenAI API with key:', apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 4));
  
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Test API with a simple request
    console.log('Sending test request to OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful banking assistant.' },
        { role: 'user', content: 'Hello, this is a test message.' }
      ],
      max_tokens: 50,
    });
    
    console.log('\n✅ OpenAI API test successful!');
    console.log('Response:');
    console.log(completion.choices[0].message.content);
    console.log('\nAPI key is valid and working correctly.');
    
  } catch (error) {
    console.error('\n❌ OpenAI API test failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('\nPossible issues:');
      console.error('1. The API key is invalid or incorrectly formatted');
      console.error('2. The API key has been revoked or expired');
      console.error('3. The API key does not have the necessary permissions');
    } else if (error.message.includes('rate limit')) {
      console.error('\nYou have exceeded your rate limit. Please try again later.');
    } else if (error.message.includes('quota')) {
      console.error('\nYou have exceeded your quota. Please check your usage limits.');
    }
    
    process.exit(1);
  }
}

testOpenAI(); 