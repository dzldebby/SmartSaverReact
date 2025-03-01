import React, { useState, useEffect } from 'react';

const ChatButton = ({ onClick, isOpen }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  
  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed bottom-6 right-6 z-50 chat-button-enter">
      {showTooltip && (
        <div className="absolute bottom-16 right-0 bg-white p-3 rounded-lg shadow-lg text-sm w-48 mb-2">
          <div className="absolute bottom-0 right-5 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white"></div>
          <p>Chatbot to answer questions</p>
        </div>
      )}
      
      <button
        onClick={() => {
          setShowTooltip(false);
          onClick();
        }}
        className={`w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat assistant"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setTimeout(() => setShowTooltip(false), 1000)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </button>
    </div>
  );
};

export default ChatButton; 