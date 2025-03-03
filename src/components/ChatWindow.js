"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { Button, Textarea } from './ui';

const ChatWindow = ({ onClose, calculationResults = [] }) => {
  // Generate welcome message
  const generateWelcomeMessage = () => {
    return "Hi there! I'm your banking assistant. I can help you understand your interest calculations and provide advice on maximizing your returns. What would you like to know about your savings options?";
  };
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! I'm your banking assistant. I can help you understand your interest calculations and provide advice on maximizing your returns. What would you like to know about your savings options?"
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
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Add a function to generate a simulated AI response
  const generateAIResponse = (userMessage, calculationResults) => {
    console.log("Generating simulated AI response for:", userMessage);
    console.log("Based on calculation results:", calculationResults);
    
    // Check if the message contains specific keywords to provide relevant responses
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey")) {
      return "Hello! I'm your banking assistant. How can I help you with your interest calculations today?";
    }
    
    if (msg.includes("thank")) {
      return "You're welcome! Feel free to ask if you have any other questions about your banking options.";
    }
    
    if (msg.includes("interest rate") || msg.includes("rates")) {
      if (calculationResults && calculationResults.length > 0) {
        // Find the bank with the highest interest rate
        const highestInterestBank = calculationResults.reduce((prev, current) => 
          (current.annualInterest > prev.annualInterest) ? current : prev
        );
        
        return `Based on your inputs, ${getBankName(highestInterestBank.bankId)} offers the highest interest rate at ${(highestInterestBank.interestRate * 100).toFixed(2)}%, giving you $${highestInterestBank.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} annually. Would you like to know more about how this is calculated?`;
      } else {
        return "Interest rates vary between banks based on your deposit amount and whether you meet certain criteria like salary crediting, card spending, and bill payments. Try calculating your interest using the calculator to see personalized rates.";
      }
    }
    
    if (msg.includes("which bank") || msg.includes("best bank") || msg.includes("highest")) {
      if (calculationResults && calculationResults.length > 0) {
        // Find the bank with the highest interest
        const highestInterestBank = calculationResults.reduce((prev, current) => 
          (current.annualInterest > prev.annualInterest) ? current : prev
        );
        
        return `Based on your inputs, ${getBankName(highestInterestBank.bankId)} offers the highest interest at $${highestInterestBank.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per year ($${highestInterestBank.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month). This is based on their interest rate of ${(highestInterestBank.interestRate * 100).toFixed(2)}%.`;
      } else {
        return "The best bank depends on your specific financial situation. UOB One, OCBC 360, and BOC SmartSaver often offer competitive rates if you meet their requirements. Try using the calculator to see which bank would give you the highest interest based on your deposit amount and banking habits.";
      }
    }
    
    if (msg.includes("how") && (msg.includes("calculate") || msg.includes("calculated") || msg.includes("computation"))) {
      return "Banks calculate interest based on several factors: 1) Your deposit amount, 2) Whether you credit your salary, 3) Your credit card spending, 4) Bill payments or GIRO transactions, 5) If you have insurance or investments with them. Each bank has different tiers and rates for these criteria. The calculator shows you the breakdown for each bank based on your inputs.";
    }
    
    if (msg.includes("salary") || msg.includes("credit")) {
      return "Crediting your salary to a bank account can significantly boost your interest rates. For example, UOB One offers up to 3.00% on the first $75,000 with salary crediting, while OCBC 360 offers 1.20% for salary crediting of at least $1,800. BOC SmartSaver offers 2.50% bonus interest for salary credit of $2,000 or more.";
    }
    
    if (msg.includes("card") || msg.includes("spend")) {
      return "Card spending is a common way to increase your interest rates. UOB One requires a minimum spend of $500, OCBC 360 offers 0.30% for spending at least $500, and BOC SmartSaver offers between 0.50% to 0.80% depending on your spending amount. Meeting these spending requirements can significantly boost your overall interest.";
    }
    
    if (msg.includes("insurance") || msg.includes("wealth")) {
      return "Having insurance products with your bank can boost your interest rates. For example, BOC SmartSaver offers a 2.40% Wealth Bonus if you have insurance products with them. OCBC 360 also offers 2.40% on the first $75,000 for insurance products. This can be a significant boost to your overall interest earnings.";
    }
    
    // Default response if no specific keywords are matched
    return "I can help you understand how different banks calculate interest and which options might be best for your situation. You can ask me about specific banks, interest calculation methods, or ways to maximize your interest earnings. If you've used the calculator, I can also provide insights based on your results.";
  };
  
  // Helper function to get a readable bank name
  const getBankName = (bankId) => {
    const bankNames = {
      'uob-one': 'UOB One Account',
      'ocbc-360': 'OCBC 360 Account',
      'dbs-multiplier': 'DBS Multiplier Account',
      'sc-bonussaver': 'Standard Chartered BonusSaver',
      'boc-smartsaver': 'BOC SmartSaver',
      'cimb-fastsaver': 'CIMB FastSaver',
      'maybank-saveup': 'Maybank SaveUp Account',
      'hsbc-everyday': 'HSBC Everyday Global Account',
      'chocolate': 'Chocolate Account'
    };
    
    return bankNames[bankId] || bankId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Update the handleSendMessage function to use the new API endpoint
  const handleSendMessage = async (input) => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const updatedMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    setMessages(updatedMessages);
    setInput('');
    
    // Show typing indicator
    setIsLoading(true);
    setApiError(null);
    
    try {
      console.log("Attempting to send chat message...");
      
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          calculationResults: calculationResults
        })
      });
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response data:", data);
      
      if (data && data.message) {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: data.message }
        ]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error("Error in message handling:", error);
      
      // Use fallback response
      const fallbackResponse = generateAIResponse(input, calculationResults);
      console.log("Using fallback response:", fallbackResponse);
      
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: fallbackResponse }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };
  
  // Add API test function
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await fetch('http://localhost:3001/api/test');
      const data = await response.json();
      console.log('API test response:', data);
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  // Add useEffect to test API on mount
  useEffect(() => {
    testApiConnection();
  }, []);
  
  const chatWindowVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };
  
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          ref={chatWindowRef}
          className="glass-card w-full max-w-lg h-[95vh] flex flex-col rounded-xl overflow-hidden shadow-2xl"
          variants={chatWindowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
        >
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gradient-primary text-white">
            <h3 className="font-semibold">SmartSaver Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-tl-none">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p>Thinking...</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {apiError && (
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-start"
              >
                <div className="max-w-[80%] p-3 rounded-lg bg-red-50 text-red-500 border border-red-200 rounded-tl-none">
                  <p>{apiError}</p>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => {
                  const value = e.target.value;
                  setInput(value === '0' ? '' : value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 resize-none input-glass"
                rows={1}
              />
              <Button 
                onClick={() => handleSendMessage(input)} 
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWindow;