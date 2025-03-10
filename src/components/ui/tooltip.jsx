import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

export const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const childRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  // Update tooltip position based on the button's position
  useEffect(() => {
    if (isVisible && childRef.current) {
      const rect = childRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  }, [isVisible]);

  // Render tooltip content using a portal
  const renderTooltip = () => {
    if (!isVisible) return null;
    
    return ReactDOM.createPortal(
      <div 
        ref={tooltipRef}
        className="fixed px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg max-w-xs z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 10}px`,
          transform: 'translate(-50%, -100%)'
        }}
      >
        {text}
        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative inline-flex items-center" ref={childRef}>
      {children}
      <button 
        type="button"
        className="ml-1.5 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-purple-700 rounded-full hover:bg-purple-800 focus:outline-none"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="More information"
      >
        i
      </button>
      
      {renderTooltip()}
    </div>
  );
}; 