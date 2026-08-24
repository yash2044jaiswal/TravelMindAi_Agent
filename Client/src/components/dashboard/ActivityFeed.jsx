import React from 'react'
import { motion } from 'framer-motion'
import { FiMap, FiClock } from 'react-icons/fi'

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

/**
 * Renders real recent-trip activity from the user's saved trips.
 * No fabricated activity items - if there's no data yet, an empty state is shown.
 */
const ActivityFeed = ({ trips = [] }) => {
  const activities = (trips || [])
    .slice(0, 4)
    .map(trip => ({
      id: trip._id,
      message: `Trip planned to ${trip.destination}`,
      time: timeAgo(trip.createdAt),
    }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm py-6 text-center">No activity yet. Plan your first trip to see it here.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 glass rounded-xl"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <FiClock size={10} />
                  {activity.time}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ActivityFeed
