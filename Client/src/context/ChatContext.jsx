import React, { createContext, useState, useContext, useRef } from 'react';
import { chatService } from '../services/chatService';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    setLoading(true);
    setReasoningSteps([]);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Add processing indicator
    const processingId = Date.now() + 1;
    const processingMessage = {
      id: processingId,
      type: 'ai',
      isProcessing: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, processingMessage]);

    try {
      const response = await chatService.sendMessage(message);
      
      // Remove processing message
      setMessages(prev => prev.filter(msg => msg.id !== processingId));
      
      if (response.success) {
        const { data } = response;
        
        // Animate reasoning steps if present
        if (data.reasoningSteps && data.reasoningSteps.length > 0) {
          for (const step of data.reasoningSteps) {
            setReasoningSteps(prev => [...prev, step]);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        // Build AI message based on response type
        let aiMessage = {
          id: Date.now(),
          type: 'ai',
          timestamp: new Date(),
        };
        
        if (data.isGreeting) {
          aiMessage.content = data.chatResponse;
          aiMessage.isGreeting = true;
        } 
        else if (data.isTravelRelated === false) {
          aiMessage.content = data.chatResponse;
          aiMessage.isTravelRelated = false;
        }
        else if (data.isTripPlan && data.tripPlan) {
          aiMessage.tripPlan = data.tripPlan;
          aiMessage.content = data.chatResponse || `✨ Your ${data.tripPlan.days}-day trip to ${data.tripPlan.destination} is ready! ✨`;
          
          // Store current plan for reference
          setCurrentPlan(data.tripPlan);
        }
        else if (data.chatResponse) {
          aiMessage.content = data.chatResponse;
        }
        else {
          aiMessage.content = "I'm here to help with your travel plans! Could you please provide more details like destination, duration, and budget?";
        }
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response');
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove processing message
      setMessages(prev => prev.filter(msg => msg.id !== processingId));
      
      // Add error message
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: "I'm having trouble processing your request right now. Please try again with a different query.\n\n**Example:**\n*'Plan a 5-day trip to Goa from Delhi under ₹25,000 for 2 people'*",
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response. Please try again.');
      
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setReasoningSteps([]);
    setCurrentPlan(null);
    toast.success('Chat cleared! Start a new conversation.');
  };

  const value = {
    messages,
    loading,
    reasoningSteps,
    currentPlan,
    sendMessage,
    clearChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};