import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiAward, FiMap, FiClock } from 'react-icons/fi'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await updateProfile({ name: formData.name })
    setLoading(false)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const stats = [
    { label: 'Trips Planned', value: '12', icon: FiMap, color: 'from-blue-500 to-cyan-500' },
    { label: 'Countries Visited', value: '8', icon: FiAward, color: 'from-purple-500 to-pink-500' },
    { label: 'Days Traveled', value: '45', icon: FiClock, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold gradient-text">Profile</h1>
        <p className="text-gray-400 mt-2">Manage your account and travel preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <p className="text-gray-400 mt-1">{user?.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 bg-dark-800 border border-white/10 rounded-lg opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiSave /> {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 glass rounded-lg"
                  >
                    <FiX />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass rounded-2xl p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Travel Preferences</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                <span>Budget Preference</span>
                <span className="text-primary-400">Mixed (Budget & Premium)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                <span>Preferred Season</span>
                <span className="text-primary-400">Winter & Spring</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                <span>Accommodation Type</span>
                <span className="text-primary-400">Hotels & Homestays</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile