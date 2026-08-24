import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTrips } from '../context/TripContext'
import { FiDownload, FiShare2, FiTrash2, FiArrowLeft, FiMapPin, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi'
import BudgetBreakdown from '../components/trip/BudgetBreakdown'
import TripTimeline from '../components/trip/TripTimeline'
import toast from 'react-hot-toast'

const TripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentTrip, fetchTripById, deleteTrip, downloadPDF, loading } = useTrips()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTripById(id)
    }
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const success = await deleteTrip(id)
      if (success) {
        navigate('/dashboard/saved-trips')
      }
    }
  }

  const handleDownload = async () => {
    setSaving(true)
    await downloadPDF(id)
    setSaving(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading || !currentTrip) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/saved-trips')}
            className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {currentTrip.destination} Adventure
            </h1>
            <div className="flex gap-4 mt-2 text-gray-400">
              <span className="flex items-center gap-1">
                <FiMapPin /> {currentTrip.source} → {currentTrip.destination}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar /> {currentTrip.days} Days
              </span>
              <span className="flex items-center gap-1">
                <FiUsers /> {currentTrip.travelers} Travelers
              </span>
              <span className="flex items-center gap-1">
                <FiDollarSign /> ₹{currentTrip.budget?.toLocaleString() || currentTrip.totalCost?.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <FiShare2 /> Share
          </button>
          <button
            onClick={handleDownload}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FiDownload /> {saving ? 'Preparing...' : 'Download PDF'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      {/* Budget Breakdown */}
      {currentTrip.totalCost && <BudgetBreakdown costBreakdown={currentTrip.totalCost} />}

      {/* Itinerary Timeline */}
      {currentTrip.itinerary && <TripTimeline itinerary={currentTrip.itinerary} />}

      {/* Recommendations */}
      {currentTrip.recommendations && currentTrip.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Pro Tips & Recommendations</h3>
          <div className="space-y-3">
            {currentTrip.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-primary-500/10 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Emergency Contacts */}
      {currentTrip.emergencyContacts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-yellow-500/20"
        >
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">Emergency Contacts</h3>
          <p className="text-gray-300">{currentTrip.emergencyContacts}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TripDetails