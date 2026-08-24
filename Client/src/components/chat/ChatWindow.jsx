import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 chat-scroll"
      style={{ 
        maxHeight: '100%',
        scrollBehavior: 'smooth'
      }}
    >
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl md:text-7xl mb-4"
          >
            ✈️
          </motion.div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 gradient-text">
            Start Your Journey
          </h3>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Tell me about your dream trip! Any destination, any budget, anywhere in the world.
          </p>
          <div className="mt-6 glass rounded-xl p-3 text-left max-w-md">
            <p className="text-xs text-gray-400 mb-2">📝 Example:</p>
            <code className="text-xs md:text-sm text-primary-400 break-words">
              "I want a 5 day Goa trip from Varanasi under ₹25,000 for 2 travelers"
            </code>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}
      </AnimatePresence>
      
      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="glass rounded-2xl p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
              <span className="text-xs md:text-sm text-gray-400 ml-2">AI is planning...</span>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;