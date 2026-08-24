import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiHome } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 animate-aurora opacity-20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl hover:shadow-lg transition-all"
        >
          <FiHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound