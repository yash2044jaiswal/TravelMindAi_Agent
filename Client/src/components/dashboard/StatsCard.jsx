import React from 'react'
import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon, gradient, change, suffix, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-6 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold">
          {value}
          {suffix && <span className="text-sm text-gray-400 ml-1">{suffix}</span>}
        </p>
      </div>
    </motion.div>
  )
}

export default StatsCard