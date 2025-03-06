// Test script to validate OpenAI API key
// Run with: node src/lib/testOpenAI.js YOUR_API_KEY

const { OpenAI } = require('openai');

async function testOpenAI() {
  const apiKey = process.argv[2];
  
  if (!apiKey) {
    console.error('Please provide your OpenAI API key as an argument');
    console.error('Example: node testOpenAI.js sk-your-api-key');
    process.exit(1);
  }
  
  console.log('Testing OpenAI API key...');
  console.log('Key format check:', apiKey.startsWith('sk-') ? 'Valid prefix' : 'Invalid prefix');
  console.log('Key length:', apiKey.length);
  
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    console.log('Initialized OpenAI client, attempting API call...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, this is a test message to verify API connectivity.' }
      ],
      max_tokens: 50
    });
    
    console.log('API call successful!');
    console.log('Response:', completion.choices[0].message);
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.status === 401) {
      console.error('Authentication error: Your API key may be invalid or expired');
    } else if (error.status === 429) {
      console.error('Rate limit exceeded: You have exceeded your quota or rate limit');
    } else if (error.status === 500) {
      console.error('Server error: OpenAI servers are experiencing issues');
    }
    
    process.exit(1);
  }
}

testOpenAI(); 