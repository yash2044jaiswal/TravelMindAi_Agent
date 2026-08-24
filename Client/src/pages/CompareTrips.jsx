import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTrips } from '../context/TripContext'
import { FiCheck, FiX, FiTrendingUp, FiSun, FiCloud, FiMap } from 'react-icons/fi'

const CompareTrips = () => {
  const { trips, fetchTrips } = useTrips()
  const [selectedTrips, setSelectedTrips] = useState([])

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleSelectTrip = (trip) => {
    if (selectedTrips.find(t => t._id === trip._id)) {
      setSelectedTrips(selectedTrips.filter(t => t._id !== trip._id))
    } else if (selectedTrips.length < 3) {
      setSelectedTrips([...selectedTrips, trip])
    }
  }

  const comparisonFeatures = [
    { key: 'destination', label: 'Destination', icon: FiMap },
    { key: 'days', label: 'Duration', icon: FiSun },
    { key: 'budget', label: 'Budget', icon: FiTrendingUp },
    { key: 'travelers', label: 'Travelers', icon: FiCloud },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold gradient-text">Compare Trips</h1>
        <p className="text-gray-400 mt-2">Select up to 3 trips to compare side by side</p>
      </div>

      {/* Trip Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trips.slice(0, 6).map((trip) => (
          <motion.div
            key={trip._id}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSelectTrip(trip)}
            className={`glass rounded-xl p-4 cursor-pointer transition-all ${
              selectedTrips.find(t => t._id === trip._id)
                ? 'border-2 border-primary-500 bg-primary-500/10'
                : 'border border-white/10 hover:border-primary-500/50'
            }`}
          >
            <h3 className="font-semibold">{trip.destination}</h3>
            <p className="text-sm text-gray-400">{trip.days} days • {trip.travelers} travelers</p>
            <p className="text-primary-400 mt-2">₹{trip.budget?.toLocaleString() || trip.totalCost?.total?.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      {selectedTrips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="p-4 text-left">Features</th>
                  {selectedTrips.map((trip) => (
                    <th key={trip._id} className="p-4 text-left">
                      {trip.destination}
                      <button
                        onClick={() => setSelectedTrips(selectedTrips.filter(t => t._id !== trip._id))}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.key} className="border-b border-white/5">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <feature.icon className="text-primary-400" />
                        {feature.label}
                      </div>
                    </td>
                    {selectedTrips.map((trip) => (
                      <td key={trip._id} className="p-4">
                        {feature.key === 'budget' 
                          ? `₹${(trip[feature.key] || trip.totalCost?.total)?.toLocaleString()}`
                          : trip[feature.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4 font-medium">Best For</td>
                  {selectedTrips.map((trip) => (
                    <td key={trip._id} className="p-4">
                      {trip.days <= 3 ? 'Short Getaway' : trip.days <= 5 ? 'Weekend Trip' : 'Extended Vacation'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium">Recommendation</td>
                  {selectedTrips.map((trip) => (
                    <td key={trip._id} className="p-4">
                      <div className="flex items-center gap-2">
                        {trip.budget <= 20000 ? (
                          <FiCheck className="text-green-400" />
                        ) : (
                          <FiX className="text-red-400" />
                        )}
                        <span className={trip.budget <= 20000 ? 'text-green-400' : 'text-red-400'}>
                          {trip.budget <= 20000 ? 'Budget Friendly' : 'Premium Choice'}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CompareTrips