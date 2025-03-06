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
  
  // Track user inputs and context
  const [chatContext, setChatContext] = useState({
    depositAmount: null,
    hasSalary: false,
    salaryAmount: null,
    hasSpending: false,
    spendingAmount: null,
    hasInsurance: false,
    hasBillPayments: false
  });
  
  // Function to extract context from user message
  const extractContext = (message) => {
    const msg = message.toLowerCase();
    const context = { ...chatContext };
    
    // Extract deposit amount
    const depositMatch = msg.match(/\$?([\d,]+\.?\d*)\s*(dollars?|k)?/);
    if (depositMatch) {
      let amount = parseFloat(depositMatch[1].replace(/,/g, ''));
      if (depositMatch[2] && depositMatch[2].toLowerCase().startsWith('k')) {
        amount *= 1000;
      }
      context.depositAmount = amount;
    }
    
    // Extract salary information
    if (msg.includes('salary')) {
      context.hasSalary = true;
      const salaryMatch = msg.match(/salary.*?\$?([\d,]+\.?\d*)/);
      if (salaryMatch) {
        context.salaryAmount = parseFloat(salaryMatch[1].replace(/,/g, ''));
      }
    }
    
    // Extract spending information
    if (msg.includes('spend') || msg.includes('spending')) {
      context.hasSpending = true;
      const spendMatch = msg.match(/spend.*?\$?([\d,]+\.?\d*)/);
      if (spendMatch) {
        context.spendingAmount = parseFloat(spendMatch[1].replace(/,/g, ''));
      }
    }
    
    // Extract other requirements
    context.hasInsurance = msg.includes('insurance') || msg.includes('insure');
    context.hasBillPayments = msg.includes('bill') || msg.includes('payment') || msg.includes('giro');
    
    return context;
  };
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: generateWelcomeMessage()
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
  
  const handleSendMessage = async (input) => {
    if (!input.trim()) return;
    
    // Extract context from user message
    const newContext = extractContext(input);
    setChatContext(newContext);
    
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
      // Try different API endpoints to see which one works
      const baseUrl = window.location.origin; // Gets the base URL (e.g., http://localhost:3002)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      console.log('Environment info:', {
        isMobile,
        isLocalDevelopment,
        userAgent: navigator.userAgent,
        baseUrl,
        hostname: window.location.hostname
      });
      
      // For local development, prioritize direct server endpoints
      // For production (Vercel), prioritize relative paths
      const possibleEndpoints = isLocalDevelopment
        ? [
            '/api/chat',                       // Standard API endpoint (proxied in development)
            '/api/local-chat',                 // Local chat endpoint
            'http://localhost:3001/api/chat',  // Direct to server - uses OpenAI
            'http://localhost:3001/chat'       // Direct to server alternative
          ]
        : isMobile 
          ? [
              '/api/chat',                     // Standard API endpoint
              '/api/direct-chat'               // Fallback endpoint
            ]
          : [
              '/api/chat',                     // Standard API endpoint
              '/api/direct-chat'               // Fallback endpoint
            ];
      
      let apiUrl = possibleEndpoints[0];
      let response = null;
      let error = null;
      
      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          // For mobile, add cache-busting parameter to avoid caching issues
          const url = endpoint.startsWith('http') 
            ? endpoint 
            : `${baseUrl}${endpoint}${isMobile ? `?t=${Date.now()}` : ''}`;
          
          console.log(`Full URL: ${url}`);
          
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: updatedMessages.map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              calculationResults,
              context: newContext
            }),
          });
          
          console.log(`Response from ${endpoint}:`, response.status);
          
          if (response.ok) {
            apiUrl = endpoint;
            console.log(`Successfully connected to: ${apiUrl}`);
            break;
          }
        } catch (err) {
          console.error(`Error with endpoint ${endpoint}:`, err);
          error = err;
        }
      }
      
      // If no endpoint worked, throw the last error
      if (!response || !response.ok) {
        throw error || new Error('All API endpoints failed');
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data && data.message) {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: data.message }
        ]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      let errorMessage = error.message;
      
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Could not connect to the chat API. Please try again later.';
      } else if (error.message.includes('Expected JSON')) {
        errorMessage = 'Received invalid response from server. Please try again.';
      }
      
      setApiError(errorMessage);
      setMessages(messages);
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