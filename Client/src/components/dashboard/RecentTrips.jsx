import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'

const RecentTrips = ({ trips, loading }) => {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-dark-700 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-dark-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const recentTrips = trips?.slice(0, 3) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Trips</h3>
        <Link to="/dashboard/saved-trips" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
          View All <FiArrowRight size={14} />
        </Link>
      </div>
      
      {recentTrips.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No trips yet</p>
          <Link to="/dashboard/planner" className="text-sm text-primary-400 mt-2 inline-block">
            Plan your first trip →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTrips.map((trip, index) => (
            <Link
              key={trip._id}
              to={`/dashboard/trips/${trip._id}`}
              className="block p-3 glass rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{trip.destination}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <FiMapPin size={12} />
                    {trip.source || 'From'} • {trip.days || trip.itinerary?.length} days
                  </p>
                </div>
                <p className="text-primary-400">₹{(trip.totalCost?.total || trip.budget || 0).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default RecentTrips