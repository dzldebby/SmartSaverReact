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

    // Simulate AI response (this would be replaced with an actual API call)
    setTimeout(() => {
      generateBotResponse(userMessage.content);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    // This is a mock implementation
    // In a real app, this would call an API like GPT or a custom backend
    
    const lowercasedInput = userInput.toLowerCase();
    let response = '';
    
    if (lowercasedInput.includes('mortgage') || lowercasedInput.includes('home loan')) {
      response = "Mortgage rates are typically lower than other loan types because they're secured by your home. Currently, rates range from 6.4% to 7.0% for a 30-year fixed rate mortgage. The exact rate you'll get depends on your credit score, down payment, and debt-to-income ratio.";
      toast({
        title: "Mortgage Information",
        description: "I've provided current mortgage rate information.",
        type: "success",
      });
    } else if (lowercasedInput.includes('credit score') || lowercasedInput.includes('fico')) {
      response = "Your credit score significantly impacts the interest rates you receive. Generally, scores above 740 get the best rates. For each 20-point drop below 740, you might see rates increase by 0.2-0.4%. To improve your score, pay bills on time, keep credit card balances low, and avoid applying for new credit before taking out a major loan.";
      toast({
        title: "Credit Score Information",
        description: "I've provided information about credit scores and interest rates.",
        type: "success",
      });
    } else if (lowercasedInput.includes('refinance') || lowercasedInput.includes('refinancing')) {
      response = "Refinancing can make sense if you can lower your rate by at least 0.5-1% or shorten your loan term. Consider the closing costs (typically 2-5% of the loan amount) and how long you plan to stay in your home. If you'll save more in interest than you'll pay in closing costs during the time you own the home, refinancing is usually worthwhile.";
      toast({
        title: "Refinancing Information",
        description: "I've provided information about when refinancing makes sense.",
        type: "success",
      });
    } else if (lowercasedInput.includes('savings') || lowercasedInput.includes('high yield')) {
      response = "Online banks generally offer higher interest rates on savings accounts than traditional banks. Currently, the best high-yield savings accounts offer around 0.7-1.5% APY, compared to the national average of about 0.01%. Look for accounts with no monthly fees and check if they're FDIC insured.";
      toast({
        title: "Savings Account Information",
        description: "I've provided information about high-yield savings accounts.",
        type: "success",
      });
    } else if (lowercasedInput.includes('compare') || lowercasedInput.includes('difference')) {
      response = "When comparing loan offers, don't just look at the interest rate. Consider the APR, which includes fees. Also compare the total cost over the life of the loan, including closing costs. Sometimes a slightly higher rate with lower fees can be better if you don't plan to keep the loan for its full term.";
      toast({
        title: "Loan Comparison Tips",
        description: "I've provided tips for comparing loan offers.",
        type: "success",
      });
    } else if (lowercasedInput.includes('apr') || lowercasedInput.includes('apy')) {
      response = "APR (Annual Percentage Rate) includes both the interest rate and fees, giving you the true cost of borrowing. APY (Annual Percentage Yield) shows the total return on savings accounts, including compound interest. When borrowing, look for a lower APR; when saving, look for a higher APY.";
      toast({
        title: "APR vs APY",
        description: "I've explained the difference between APR and APY.",
        type: "success",
      });
    } else if (lowercasedInput.includes('hello') || lowercasedInput.includes('hi') || lowercasedInput.includes('hey')) {
      response = "Hello! I'm here to help with any questions about banking, interest rates, loans, or financial planning. What would you like to know?";
    } else {
      response = "I'd be happy to help with your finance and banking questions. You can ask me about different loan types, how interest rates work, tips for improving your credit score, or strategies for comparing financial products between different banks.";
    }
    
    const botMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
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