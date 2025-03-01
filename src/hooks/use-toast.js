"use client";

import { useState, useCallback } from 'react';

// Simple toast notification system
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, type = 'default', duration = 5000 }) => {
    const id = Date.now().toString();
    
    const newToast = {
      id,
      title,
      description,
      type,
    };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);
  
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  };
};

// Toast component for rendering notifications
export const ToastContainer = () => {
  const { toasts, dismiss } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-right-5 ${
            toast.type === 'error' 
              ? 'bg-destructive text-destructive-foreground' 
              : toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-background border'
          }`}
        >
          {toast.type === 'error' && (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0">
              <path d="M7.5 0.875C3.83375 0.875 0.875 3.83375 0.875 7.5C0.875 11.1663 3.83375 14.125 7.5 14.125C11.1663 14.125 14.125 11.1663 14.125 7.5C14.125 3.83375 11.1663 0.875 7.5 0.875ZM7.5 13.125C4.3845 13.125 1.875 10.6155 1.875 7.5C1.875 4.3845 4.3845 1.875 7.5 1.875C10.6155 1.875 13.125 4.3845 13.125 7.5C13.125 10.6155 10.6155 13.125 7.5 13.125Z" fill="currentColor" />
              <path d="M7.5 6.875C7.845 6.875 8.125 7.155 8.125 7.5V10C8.125 10.345 7.845 10.625 7.5 10.625C7.155 10.625 6.875 10.345 6.875 10V7.5C6.875 7.155 7.155 6.875 7.5 6.875Z" fill="currentColor" />
              <path d="M7.5 5.625C7.845 5.625 8.125 5.345 8.125 5C8.125 4.655 7.845 4.375 7.5 4.375C7.155 4.375 6.875 4.655 6.875 5C6.875 5.345 7.155 5.625 7.5 5.625Z" fill="currentColor" />
            </svg>
          )}
          
          {toast.type === 'success' && (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0">
              <path d="M7.5 0.875C3.83375 0.875 0.875 3.83375 0.875 7.5C0.875 11.1663 3.83375 14.125 7.5 14.125C11.1663 14.125 14.125 11.1663 14.125 7.5C14.125 3.83375 11.1663 0.875 7.5 0.875ZM7.5 13.125C4.3845 13.125 1.875 10.6155 1.875 7.5C1.875 4.3845 4.3845 1.875 7.5 1.875C10.6155 1.875 13.125 4.3845 13.125 7.5C13.125 10.6155 10.6155 13.125 7.5 13.125Z" fill="currentColor" />
              <path d="M10.3638 5.36612C10.6138 5.61612 10.6138 6.01612 10.3638 6.26612L7.11375 9.51612C6.86375 9.76612 6.46375 9.76612 6.21375 9.51612L4.63875 7.94112C4.38875 7.69112 4.38875 7.29112 4.63875 7.04112C4.88875 6.79112 5.28875 6.79112 5.53875 7.04112L6.66375 8.16612L9.46375 5.36612C9.71375 5.11612 10.1138 5.11612 10.3638 5.36612Z" fill="currentColor" />
            </svg>
          )}
          
          <div className="flex-1">
            {toast.title && <div className="font-medium mb-1">{toast.title}</div>}
            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
          </div>
          
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 rounded-md p-1 hover:bg-muted/20"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default useToast; 