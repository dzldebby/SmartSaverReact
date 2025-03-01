import React, { useState, useEffect } from 'react';

const ChatButton = ({ onClick, isOpen }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Hide tooltip after 8 seconds (increased from 5)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed bottom-8 right-8 z-50 chat-button-enter">
      {showTooltip && (
        <div className="absolute bottom-20 right-0 bg-white p-4 rounded-lg shadow-lg text-sm w-64 mb-2 font-medium border-2 border-primary">
          <div className="absolute bottom-0 right-5 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r-2 border-b-2 border-primary"></div>
          <p className="text-center text-base text-gray-800">Ask our AI assistant about your interest rates!</p>
        </div>
      )}
      
      <button
        onClick={() => {
          setShowTooltip(false);
          onClick();
        }}
        className={`w-16 h-16 rounded-full bg-white text-primary shadow-xl flex items-center justify-center 
        transition-all hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        animate-pulse-slow border-2 border-primary chat-button-glow`}
        aria-label="Open chat assistant"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setTimeout(() => setShowTooltip(false), 1000)}
      >
        {/* Chatbot icon - robot face with antenna */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Antenna */}
          <line x1="12" y1="1" x2="12" y2="4"></line>
          <circle cx="12" cy="1" r="1" fill="currentColor"></circle>
          
          {/* Head */}
          <rect x="4" y="4" width="16" height="12" rx="2" ry="2"></rect>
          
          {/* Eyes */}
          <circle cx="8" cy="9" r="1.5" fill="currentColor"></circle>
          <circle cx="16" cy="9" r="1.5" fill="currentColor"></circle>
          
          {/* Mouth */}
          <path d="M9 14h6"></path>
          
          {/* Body */}
          <path d="M12 16v3"></path>
          <path d="M8 20h8"></path>
        </svg>
      </button>
    </div>
  );
};

export default ChatButton; 