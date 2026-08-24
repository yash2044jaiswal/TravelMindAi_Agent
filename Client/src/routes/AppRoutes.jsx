import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Planner from '../pages/Planner'
import TripDetails from '../pages/TripDetailes'
import CompareTrips from '../pages/CompareTrips'
import Profile from '../pages/Profile'
import SavedTrips from '../pages/SavedTrips'
import NotFound from '../pages/NotFound'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="planner" element={<Planner />} />
        <Route path="trips/:id" element={<TripDetails />} />
        <Route path="compare" element={<CompareTrips />} />
        <Route path="profile" element={<Profile />} />
        <Route path="saved-trips" element={<SavedTrips />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes