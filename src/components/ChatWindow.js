"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { Button, Textarea } from './ui';

const ChatWindow = ({ onClose }) => {
  // Generate welcome message
  const generateWelcomeMessage = () => {
    return "Hi there! I'm your SmartSaver Assistant. How can I help you understand your interest rates and savings options?";
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
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Clear input field
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Simulate API call with a timeout
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: "I'm a demo assistant. In the full version, I would provide personalized advice about your banking options and interest rates. For now, I can tell you that maximizing your interest often involves meeting specific bank requirements like salary crediting, minimum card spend, and bill payments."
          }
        ]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setApiError('Sorry, there was an error processing your request. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          className="glass-card w-full max-w-lg h-[600px] max-h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl"
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 resize-none input-glass"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
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