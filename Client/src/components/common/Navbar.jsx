import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiMap } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/how-it-works', label: 'How It Works' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiMap className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">TravelMind AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!user && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 glass rounded-lg"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            {!user && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="block py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-4 py-2 glass rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar