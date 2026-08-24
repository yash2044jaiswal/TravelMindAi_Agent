import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiTrash2, FiMapPin, FiCompass, FiTrendingUp } from 'react-icons/fi';

const ChatInput = ({ onSendMessage, loading, onClear }) => {
  const [message, setMessage] = useState('');

  const exampleQueries = [
    { icon: '🏖️', text: 'Plan a 5 day Goa trip from Delhi under ₹25,000 for 2 people' },
    { icon: '⛰️', text: 'I want a 3 day Manali trip from Chandigarh under ₹15,000' },
    { icon: '🌿', text: 'Create a 7 day Kerala trip from Mumbai under ₹50,000 for 2 travelers' },
    { icon: '🏰', text: 'Plan a 4 day Jaipur trip from Ahmedabad under ₹20,000' },
    { icon: '🌊', text: 'Plan a 5 day Bali trip from Mumbai under ₹60,000 for 2 people' },
    { icon: '❄️', text: 'I want a 7 day Switzerland trip from Delhi under ₹1,50,000 for 2 travelers' },
    { icon: '🏔️', text: 'Plan a road trip from Delhi to Leh Ladakh for 10 days' },
    { icon: '🕌', text: 'Create a 5 day Dubai trip from Mumbai under ₹80,000' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-white/10 p-4">
      {/* Example Queries - Only show when no messages */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <FiCompass className="text-primary-400 text-sm" />
          <span className="text-xs text-gray-500">Try these examples:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {exampleQueries.slice(0, 6).map((example, index) => (
            <button
              key={index}
              onClick={() => setMessage(example.text)}
              className="flex-shrink-0 text-xs px-3 py-1.5 glass rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <span className="mr-1">{example.icon}</span>
              {example.text.substring(0, 40)}...
            </button>
          ))}
        </div>
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your dream trip... (Any destination, any budget!)"
            className="w-full pl-9 pr-4 py-3 glass rounded-xl focus:border-primary-500 focus:outline-none text-sm"
            disabled={loading}
          />
        </div>
        
        <button
          type="button"
          onClick={onClear}
          className="px-4 glass rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <FiTrash2 />
        </button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!message.trim() || loading}
          className="px-6 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl disabled:opacity-50 flex items-center gap-2 font-medium"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FiSend /> Send
            </>
          )}
        </motion.button>
      </form>
      
      {/* Info Note */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <FiTrendingUp size={10} />
          AI-powered by Google Gemini • Any destination worldwide • Real-time planning
        </p>
      </div>
    </div>
  );
};

export default ChatInput;