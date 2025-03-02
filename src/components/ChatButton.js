"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const ChatButton = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Hide tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 glass-panel p-4 rounded-lg shadow-lg text-sm w-64 mb-2 font-medium border border-white/20 dark:border-gray-800/20"
          >
            <div className="absolute bottom-0 right-5 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-r border-b border-white/20 dark:border-gray-800/20"></div>
            <p className="text-center text-base">Ask our AI assistant about your interest rates!</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => {
          setShowTooltip(false);
          onClick();
        }}
        className="w-16 h-16 rounded-full glass-card flex items-center justify-center shadow-xl border border-white/20 dark:border-gray-800/20"
        aria-label="Open chat assistant"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setTimeout(() => setShowTooltip(false), 1000)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17,
          duration: 0.3
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "loop", 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <MessageSquare className="h-8 w-8 text-primary" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ChatButton; 