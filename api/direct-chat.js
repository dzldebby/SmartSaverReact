/**
 * Direct chat API endpoint that doesn't use OpenAI
 * This is a fallback for testing when the main chat API isn't working
 */

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

export default function handler(req, res) {
  // Enable CORS
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

  console.log('Direct chat API handler called');
  console.log('Request body:', req.body);

  try {
    const { messages, calculationResults, context } = req.body || {};
    
    // Get the last user message
    const lastUserMessage = messages && Array.isArray(messages) 
      ? messages.filter(msg => msg.role === 'user').pop()
      : null;
    
    const userContent = lastUserMessage ? lastUserMessage.content.toLowerCase() : 'No message found';
    
    // Provide different responses based on keywords in the user's message
    let response = "I'm a fallback assistant that can provide basic information about banking and interest rates. For more detailed assistance, please try again later when our AI system is available.";
    
    if (userContent.includes('interest') || userContent.includes('rate')) {
      response = "Interest rates vary between banks and account types. High-yield savings accounts typically offer better rates than standard savings accounts. The best rates often come with certain conditions like maintaining minimum balances or setting up direct deposits.";
    } else if (userContent.includes('savings') || userContent.includes('save')) {
      response = "Savings accounts are a safe way to store your money while earning some interest. For higher returns, consider high-yield savings accounts, certificates of deposit (CDs), or money market accounts.";
    } else if (userContent.includes('bank') || userContent.includes('account')) {
      response = "When choosing a bank account, consider factors like interest rates, fees, minimum balance requirements, and accessibility. Online banks often offer better rates than traditional brick-and-mortar banks.";
    } else if (userContent.includes('invest') || userContent.includes('investment')) {
      response = "Investments can provide higher returns than savings accounts but come with more risk. Common investment options include stocks, bonds, mutual funds, ETFs, and real estate. Consider consulting with a financial advisor for personalized advice.";
    } else if (userContent.includes('hello') || userContent.includes('hi') || userContent.includes('hey')) {
      response = "Hello! I'm a fallback assistant that can provide basic information about banking and interest rates. How can I help you today?";
    }
    
    // Add information about calculation results if available
    if (calculationResults && calculationResults.length > 0) {
      response += "\n\nI notice you've done some calculations. For the most accurate advice based on your specific situation, please try again later when our AI system is available to analyze your results in detail.";
    }
    
    // Return the response
    res.status(200).json({
      message: response
    });
  } catch (error) {
    console.error('Error in direct chat API:', error);
    res.status(200).json({ 
      message: "I'm sorry, I encountered an unexpected error. Please try again later.",
      error: error.message
    });
  }
} 