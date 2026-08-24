import React from 'react'
import { motion } from 'framer-motion'
import { FiActivity, FiCheckCircle, FiLoader } from 'react-icons/fi'

const AgentStatus = ({ isActive, steps }) => {
  const agents = [
    { name: 'Requirement Analyzer', status: 'pending', step: 'Understanding request...' },
    { name: 'Gemini Retriever', status: 'pending', step: 'Searching travel knowledge...' },
    { name: 'Budget Planner', status: 'pending', step: 'Calculating cost matrix...' },
    { name: 'Hotel Selector', status: 'pending', step: 'Finding best stays...' },
    { name: 'Itinerary Planner', status: 'pending', step: 'Creating day-by-day plan...' },
    { name: 'Report Generator', status: 'pending', step: 'Assembling final guide...' },
  ]

  // Update agent status based on steps
  steps.forEach((step, index) => {
    if (step.includes('Agent 1')) agents[0].status = 'complete'
    if (step.includes('Agent 2')) agents[1].status = 'complete'
    if (step.includes('Agent 3')) agents[2].status = 'complete'
    if (step.includes('Agent 4')) agents[3].status = 'complete'
    if (step.includes('Agent 5')) agents[4].status = 'complete'
    if (step.includes('Agent 6')) agents[5].status = 'complete'
  })

  if (steps.length > 0 && steps.length < 6) {
    const currentAgentIndex = Math.floor(steps.length / 1.5)
    if (agents[currentAgentIndex]) agents[currentAgentIndex].status = 'active'
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <FiActivity className="text-primary-400" />
        Multi-Agent System
      </h3>
      
      <div className="space-y-2">
        {agents.map((agent, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2 glass rounded-lg"
          >
            <div className="w-6 h-6">
              {agent.status === 'complete' && <FiCheckCircle className="w-5 h-5 text-green-400" />}
              {agent.status === 'active' && <FiLoader className="w-5 h-5 text-primary-400 animate-spin" />}
              {agent.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-600" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">{agent.name}</p>
              <p className="text-xs text-gray-500">{agent.step}</p>
            </div>
            {agent.status === 'active' && (
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AgentStatus