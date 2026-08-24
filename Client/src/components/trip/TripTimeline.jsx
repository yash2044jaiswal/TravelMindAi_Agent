import React from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiCoffee, FiSun, FiMoon, FiInfo } from 'react-icons/fi'

const TripTimeline = ({ itinerary }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-xl font-semibold mb-6">Itinerary Timeline</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-purple-500" />
        
        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">Day {day.day || index + 1}</span>
              </div>
              
              <div className="glass rounded-xl p-4 ml-4">
                <h4 className="text-lg font-semibold mb-2">{day.title}</h4>
                
                {day.activities && day.activities.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-primary-400 mb-2">
                      <FiSun size={14} />
                      <span>Activities</span>
                    </div>
                    <ul className="space-y-1">
                      {day.activities.map((activity, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-primary-400">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {day.accommodation && (
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-primary-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400">Accommodation</p>
                        <p className="text-white">{day.accommodation}</p>
                      </div>
                    </div>
                  )}
                  
                  {day.meals && (
                    <div className="flex items-start gap-2">
                      <FiCoffee className="text-primary-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400">Meals</p>
                        <p className="text-white text-xs">
                          Breakfast: {day.meals.breakfast}<br />
                          Lunch: {day.meals.lunch}<br />
                          Dinner: {day.meals.dinner}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {day.tips && (
                  <div className="mt-3 p-2 bg-primary-500/10 rounded-lg flex items-start gap-2">
                    <FiInfo className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">{day.tips}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default TripTimeline