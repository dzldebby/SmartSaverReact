"use client";

// A simple toast hook for notifications
export function useToast() {
  const toast = (message: string) => {
    // In a real implementation, this would use a toast library
    console.log('Toast:', message);
    
    // Create a simple toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-black text-white p-4 rounded-md shadow-lg z-50';
    toastElement.textContent = message;
    
    document.body.appendChild(toastElement);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toastElement.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => {
        document.body.removeChild(toastElement);
      }, 300);
    }, 3000);
  };
  
  return { toast };
} 