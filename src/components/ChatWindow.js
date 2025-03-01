import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ 
  isOpen, 
  onClose, 
  userInputs, 
  calculationResults,
  selectedBanks 
}) => {
  // Generate welcome message based on calculation results
  const generateWelcomeMessage = () => {
    if (!calculationResults) return "Hi there! I'm your SmartSaver Assistant. Please calculate interest rates first to get personalized help.";
    
    // Find the bank with the highest interest
    let highestInterestBank = null;
    let highestInterest = 0;
    
    Object.entries(calculationResults).forEach(([bankId, result]) => {
      if (result.annualInterest > highestInterest) {
        highestInterest = result.annualInterest;
        highestInterestBank = bankId;
      }
    });
    
    const bankName = highestInterestBank ? 
      highestInterestBank.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
    
    return `Hi there! I'm your SmartSaver Assistant. I see you've calculated interest rates for a deposit of $${userInputs.depositAmount.toLocaleString()}. ${highestInterestBank ? `${bankName} offers the highest interest at $${highestInterest.toFixed(2)} per year.` : ''} How can I help you understand your results?`;
  };
  
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: generateWelcomeMessage()
    },
    {
      role: 'assistant',
      content: 'You can ask me questions like:\n• Why is one bank giving higher interest than another?\n• What would happen if I increased my card spend?\n• How does a specific bank calculate bonus interest?'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Add click outside listener to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        // Check if the click is not on the chat button (which has a class 'chat-button-enter')
        const chatButton = document.querySelector('.chat-button-enter');
        if (!chatButton || !chatButton.contains(event.target)) {
          onClose();
        }
      }
    };

    // Add event listener when chat is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Regenerate welcome message when calculation results change
  useEffect(() => {
    setMessages(prev => [
      { 
        role: 'assistant', 
        content: generateWelcomeMessage()
      },
      {
        role: 'assistant',
        content: 'You can ask me questions like:\n• Why is one bank giving higher interest than another?\n• What would happen if I increased my card spend?\n• How does a specific bank calculate bonus interest?'
      }
    ]);
  }, [calculationResults]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Prepare context for the AI
      const context = {
        depositAmount: userInputs.depositAmount || 0,
        hasSalary: userInputs.hasSalary || false,
        salaryAmount: userInputs.salaryAmount || 0,
        cardSpend: userInputs.cardSpend || 0,
        giroCount: userInputs.giroCount || 0,
        hasInsurance: userInputs.hasInsurance || false,
        hasInvestments: userInputs.hasInvestments || false,
        calculationResults: calculationResults || {},
        selectedBanks: selectedBanks || []
      };
      
      console.log('Sending chat request with context:', JSON.stringify(context, null, 2));
      
      // Use the Next.js server URL directly
      const requestUrl = 'http://localhost:3000/api/chat';
      console.log('Making API request to:', requestUrl);
      
      // Create the request body
      const requestBody = {
        query: input,
        context: context
      };
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      // Call the API endpoint
      console.log('Sending fetch request...');
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response received');
      console.log('Response status:', response.status);
      console.log('Response headers:', JSON.stringify(Object.fromEntries([...response.headers.entries()]), null, 2));
      
      // Get the response text first to debug any issues
      const responseText = await response.text();
      console.log('Raw response text length:', responseText.length);
      console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
      
      // Try to parse as JSON
      let data;
      try {
        console.log('Attempting to parse response as JSON...');
        data = JSON.parse(responseText);
        console.log('JSON parse successful:', data);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Response is not valid JSON');
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        console.error('Response not OK:', response.status);
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      setApiError(error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${error.message}. Please make sure you have set up your OpenAI API key correctly and that both the Next.js API server and React app are running.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={chatWindowRef}
      className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 transition-all z-50"
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-lg">
        <h3 className="font-medium">SmartSaver Assistant</h3>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200 hover:bg-primary-dark p-1 rounded-full transition-colors"
          aria-label="Close chat"
          title="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        {apiError && (
          <div className="text-center p-2 text-xs text-red-500">
            <p>Error: {apiError}</p>
            <p className="mt-1">Please check your OpenAI API key configuration.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary text-white rounded-r-md hover:bg-primary-dark disabled:bg-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;