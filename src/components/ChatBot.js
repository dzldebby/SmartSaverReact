"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button, Textarea, Avatar } from '../components/ui';
import { useToast } from '../components/ToastProvider';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your financial assistant. How can I help you with your banking and interest rate questions today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try different API endpoints to see which one works
      const baseUrl = window.location.origin; // Gets the base URL (e.g., http://localhost:3002)
      
      // Try these endpoints in order - prioritize the ones that use OpenAI
      const possibleEndpoints = [
        'http://localhost:3001/api/chat', // Direct to server - uses OpenAI
        'http://localhost:3001/chat',     // Direct to server alternative - now uses OpenAI
        '/api/chat',                      // Standard API endpoint
        '/chat'                           // Direct endpoint
      ];
      
      let apiUrl = possibleEndpoints[0];
      let response = null;
      let error = null;
      
      // Try each endpoint until one works
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          response = await fetch(endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: messages.concat(userMessage).map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              calculationResults: [], // Add calculation results if available
              context: {} // Add context if available
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
      
      // Add bot response
    const botMessage = {
      id: Date.now().toString(),
      role: 'assistant',
        content: data.message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Show error message as bot response
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again later.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from the assistant.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full transition-all duration-300">
      <Card className="flex flex-col h-full shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Financial Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'bg-primary' : 'bg-secondary'}`}>
                  <div className="text-xs">
                    {message.role === 'assistant' ? 'AI' : 'You'}
                  </div>
                </Avatar>
                
                <div
                  className={`py-2 px-3 rounded-lg ${
                    message.role === 'assistant'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg py-2 px-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardFooter className="pt-0">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Textarea
              placeholder="Ask a question about banking or interest rates..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSendMessage(e);
                  }
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatBot; 