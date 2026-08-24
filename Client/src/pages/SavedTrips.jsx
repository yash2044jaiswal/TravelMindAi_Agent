import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import TripCard from '../components/trip/TripCard'
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi'

const SavedTrips = () => {
  const { trips, fetchTrips, loading, deleteTrip } = useTrips()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [filteredTrips, setFilteredTrips] = useState([])

  useEffect(() => {
    fetchTrips()
  }, [])

  useEffect(() => {
    if (trips) {
      setFilteredTrips(
        trips.filter(trip =>
          trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.source?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, trips])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await deleteTrip(id)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Saved Trips</h1>
          <p className="text-gray-400 mt-2">Your personalized travel plans</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'glass text-primary-400' : 'text-gray-400 hover:text-white'}`}
          >
            <FiGrid />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'glass text-primary-400' : 'text-gray-400 hover:text-white'}`}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass rounded-xl focus:border-primary-500 focus:outline-none"
          />
        </div>
        <button className="px-4 py-3 glass rounded-xl flex items-center gap-2">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Trips Grid/List */}
      {filteredTrips.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold mb-2">No trips saved yet</h3>
          <p className="text-gray-400 mb-4">Start planning your first adventure with our AI assistant</p>
          <button
            onClick={() => navigate('/dashboard/planner')}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg"
          >
            Plan Your First Trip
          </button>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          <AnimatePresence>
            {filteredTrips.map((trip, index) => (
              <TripCard
                key={trip._id}
                trip={trip}
                index={index}
                viewMode={viewMode}
                onDelete={handleDelete}
                onClick={() => navigate(`/dashboard/trips/${trip._id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

export default SavedTrips