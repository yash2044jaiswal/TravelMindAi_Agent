import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('authToken'))

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile()
      if (response.success) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('authToken')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      if (response.success) {
        const { token: authToken, user: userData } = response.data
        localStorage.setItem('authToken', authToken)
        setToken(authToken)
        setUser(userData)
        toast.success('Login successful!')
        return { success: true }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password)
      if (response.success) {
        const { token: authToken, user: userData } = response.data
        localStorage.setItem('authToken', authToken)
        setToken(authToken)
        setUser(userData)
        toast.success('Registration successful!')
        return { success: true }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = async () => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data)
      if (response.success) {
        setUser(response.data)
        toast.success('Profile updated successfully')
        return { success: true }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
      return { success: false }
    }
  }

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}