import React from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiDownload, FiMap } from 'react-icons/fi'

const ReasoningPanel = ({ steps, currentPlan, onSave }) => {
  const getStepIcon = (step, index) => {
    if (steps.length > index) return <FiCheck className="text-green-400" />
    return <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
  }

  return (
    <div className="space-y-4">
      {steps.length === 0 && !currentPlan && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-gray-400 text-sm">AI agents are ready to plan your trip</p>
          <p className="text-gray-500 text-xs mt-2">Start a conversation above</p>
        </div>
      )}

      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 p-3 glass rounded-xl"
        >
          <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            {getStepIcon(step, index)}
          </div>
          <div>
            <p className="text-sm font-medium">{step}</p>
            {step.includes("Agent") && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">Processing...</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl border border-primary-500/30 mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <FiMap className="text-primary-400" />
            <h4 className="font-semibold">Trip Summary</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Destination:</span>
              <span>{currentPlan.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span>{currentPlan.days} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Budget:</span>
              <span>₹{currentPlan.budget?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Cost:</span>
              <span className="text-primary-400">₹{currentPlan.costBreakdown?.total?.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={onSave}
            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center gap-2 text-sm"
          >
            <FiDownload /> Save This Trip
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default ReasoningPanel