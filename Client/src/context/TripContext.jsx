import React, { createContext, useState, useContext } from 'react'
import { tripService } from '../services/tripService'
import toast from 'react-hot-toast'

const TripContext = createContext()

export const useTrips = () => {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrips must be used within TripProvider')
  }
  return context
}

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const response = await tripService.getAllTrips()
      if (response.success) {
        setTrips(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error)
      toast.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const fetchTripById = async (id) => {
    setLoading(true)
    try {
      const response = await tripService.getTripById(id)
      if (response.success) {
        setCurrentTrip(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Failed to fetch trip:', error)
      toast.error('Failed to load trip details')
      return null
    } finally {
      setLoading(false)
    }
  }

  const saveTrip = async (tripData) => {
    try {
      const response = await tripService.saveTrip(tripData)
      if (response.success) {
        toast.success('Trip saved successfully!')
        await fetchTrips()
        return response.data
      }
    } catch (error) {
      console.error('Failed to save trip:', error)
      toast.error('Failed to save trip')
      return null
    }
  }

  const deleteTrip = async (id) => {
    try {
      const response = await tripService.deleteTrip(id)
      if (response.success) {
        toast.success('Trip deleted successfully')
        await fetchTrips()
        if (currentTrip?._id === id) {
          setCurrentTrip(null)
        }
        return true
      }
    } catch (error) {
      console.error('Failed to delete trip:', error)
      toast.error('Failed to delete trip')
      return false
    }
  }

  const downloadPDF = async (id) => {
    try {
      const blob = await tripService.downloadPDF(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trip_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Failed to download PDF:', error)
      toast.error('Failed to download PDF')
    }
  }

  const value = {
    trips,
    currentTrip,
    loading,
    fetchTrips,
    fetchTripById,
    saveTrip,
    deleteTrip,
    downloadPDF,
  }

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  )
}