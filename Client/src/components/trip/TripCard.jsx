import React from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiUsers, FiDollarSign, FiMapPin, FiTrash2, FiEye } from 'react-icons/fi'

const TripCard = ({ trip, index, compact, onDelete, onClick, viewMode = 'grid' }) => {
  const cardContent = (
    <div className={`${viewMode === 'grid' ? 'p-5' : 'p-4'} space-y-3`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{trip.destination}</h3>
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <FiMapPin size={12} />
            {trip.source} → {trip.destination}
          </p>
        </div>
        {!compact && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
              className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiEye />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(trip._id)
              }}
              className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1 text-gray-400">
          <FiCalendar size={14} />
          <span>{trip.days || trip.itinerary?.length} days</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <FiUsers size={14} />
          <span>{trip.travelers || 1} travelers</span>
        </div>
        <div className="flex items-center gap-1 text-primary-400">
          <FiDollarSign size={14} />
          <span>₹{(trip.budget || trip.totalCost?.total || 0).toLocaleString()}</span>
        </div>
      </div>
      
      {compact && trip.itinerary && (
        <div className="text-xs text-gray-400">
          {trip.itinerary.length} activities planned
        </div>
      )}
      
      {!compact && trip.recommendations && trip.recommendations[0] && (
        <div className="text-xs text-gray-400 border-t border-white/10 pt-2 mt-2">
          💡 {trip.recommendations[0].substring(0, 60)}...
        </div>
      )}
    </div>
  )

  if (compact) {
    return <div className="glass rounded-xl overflow-hidden">{cardContent}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
        viewMode === 'list' ? 'flex items-center justify-between' : ''
      }`}
      onClick={onClick}
    >
      {cardContent}
    </motion.div>
  )
}

export default TripCard