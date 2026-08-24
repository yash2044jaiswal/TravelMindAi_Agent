import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { FiTrendingUp, FiDollarSign } from 'react-icons/fi'

const BudgetBreakdown = ({ costBreakdown }) => {
  const data = [
    { name: 'Transport', value: costBreakdown.transport, color: '#4f73f2' },
    { name: 'Hotel', value: costBreakdown.hotel, color: '#a855f7' },
    { name: 'Food', value: costBreakdown.food, color: '#06b6d4' },
    { name: 'Activities', value: costBreakdown.activities, color: '#f59e0b' },
  ]

  const total = costBreakdown.total || Object.values(costBreakdown).reduce((a, b) => a + b, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-primary-400" />
        Budget Breakdown
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1a1a24',
                  border: '1px solid rgba(79, 115, 242, 0.3)',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-primary-400">₹{item.value.toLocaleString()}</span>
                <span className="text-sm text-gray-400">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-lg mt-4">
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-primary-400" />
              <span className="font-semibold">Total Budget</span>
            </div>
            <span className="text-xl font-bold gradient-text">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BudgetBreakdown