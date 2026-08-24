import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { useTrips } from '../context/TripContext';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import ReasoningPanel from '../components/chat/ReasoningPanel';
import AgentStatus from '../components/chat/AgentStatus';
import { FiCpu, FiMessageSquare, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const Planner = () => {
  const { messages, loading, reasoningSteps, currentPlan, sendMessage, clearChat } = useChat();
  const { saveTrip } = useTrips();
  const [showReasoning, setShowReasoning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setShowReasoning(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSaveTrip = async () => {
    if (currentPlan) {
      const tripData = {
        source: currentPlan.source,
        destination: currentPlan.destination,
        budget: currentPlan.budget,
        days: currentPlan.days,
        travelers: currentPlan.travelers,
        totalCost: currentPlan.costBreakdown,
        itinerary: currentPlan.itinerary?.map(day => ({
          day: day.day,
          title: day.title,
          activities: day.activities,
          accommodation: day.accommodation,
          meals: day.meals,
          travelDetails: day.travelDetails,
          tips: day.tips,
        })),
        recommendations: currentPlan.recommendations,
      };
      await saveTrip(tripData);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">AI Travel Planner</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Powered by Google Gemini AI</p>
        </div>
        {!isMobile && (
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            {showReasoning ? <FiChevronRight /> : <FiChevronLeft />}
            {showReasoning ? 'Hide' : 'Show'} Reasoning
          </button>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat Section */}
        <div className={`flex-1 flex flex-col glass rounded-2xl overflow-hidden transition-all duration-300 ${
          showReasoning && !isMobile ? 'mr-0' : ''
        }`}>
          <div className="p-3 md:p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiMessageSquare className="text-primary-400 text-sm md:text-base" />
              <h2 className="font-semibold text-sm md:text-base">Travel Assistant</h2>
              {loading && (
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse delay-150" />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse delay-300" />
                </div>
              )}
            </div>
            {isMobile && (
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="text-xs px-2 py-1 glass rounded-lg"
              >
                {showReasoning ? 'Hide AI' : 'Show AI'}
              </button>
            )}
          </div>
          
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput onSendMessage={sendMessage} loading={loading} onClear={clearChat} />
        </div>

        {/* Reasoning Panel - Slide in for mobile */}
        <AnimatePresence>
          {(showReasoning && !isMobile) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="glass rounded-2xl overflow-hidden flex-shrink-0 hidden lg:block"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FiCpu className="text-purple-400" />
                  <h2 className="font-semibold">AI Agent Reasoning</h2>
                </div>
              </div>
              
              <div className="p-4 space-y-6 h-[calc(100%-60px)] overflow-y-auto">
                <AgentStatus isActive={loading} steps={reasoningSteps} />
                <ReasoningPanel steps={reasoningSteps} currentPlan={currentPlan} onSave={handleSaveTrip} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Modal for Reasoning */}
      <AnimatePresence>
        {isMobile && showReasoning && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
          >
            <div className="glass rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <FiCpu className="text-purple-400" />
                  <h2 className="font-semibold">AI Agent Reasoning</h2>
                </div>
                <button
                  onClick={() => setShowReasoning(false)}
                  className="p-1 glass rounded-lg"
                >
                  ✕
                </button>
              </div>
              <AgentStatus isActive={loading} steps={reasoningSteps} />
              <ReasoningPanel steps={reasoningSteps} currentPlan={currentPlan} onSave={handleSaveTrip} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Planner;