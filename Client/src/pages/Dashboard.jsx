import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTrips } from '../context/TripContext'
import { userService } from '../services/userService'
import StatsCard from '../components/dashboard/StatsCard'
import RecentTrips from '../components/dashboard/RecentTrips'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import { 
  FiMap, 
  FiDollarSign, 
  FiMessageCircle, 
  FiTrendingUp,
  FiCalendar,
  FiCompass
} from 'react-icons/fi'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { trips, fetchTrips, loading } = useTrips()
  const [stats, setStats] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    fetchTrips()
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await userService.getDashboardStats()
      if (response.success) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    }
  }

  // Real 6-month trend computed server-side from actual saved trips.
  const chartData = dashboardData?.monthlyTrend || []

  // Simple, honest month-over-month deltas derived from the real trend
  // (no fabricated percentages). Returns null when there isn't enough data yet.
  const monthOverMonthChange = (key) => {
    if (!chartData || chartData.length < 2) return null
    const prev = chartData[chartData.length - 2][key]
    const curr = chartData[chartData.length - 1][key]
    if (!prev) return null
    const pct = Math.round(((curr - prev) / prev) * 100)
    return `${pct >= 0 ? '+' : ''}${pct}%`
  }

  const statsCards = [
    {
      title: 'Total Trips',
      value: dashboardData?.totalTrips || 0,
      icon: FiMap,
      gradient: 'from-blue-500 to-cyan-500',
      change: monthOverMonthChange('trips'),
    },
    {
      title: 'Total Investment',
      value: `₹${(dashboardData?.totalInvestment || 0).toLocaleString()}`,
      icon: FiDollarSign,
      gradient: 'from-green-500 to-emerald-500',
      change: monthOverMonthChange('budget'),
    },
    {
      title: 'Chat Sessions',
      value: dashboardData?.chatCount || 0,
      icon: FiMessageCircle,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Avg. Budget Utilization',
      value: dashboardData?.avgBudgetUtilization ?? '—',
      icon: FiTrendingUp,
      gradient: 'from-orange-500 to-red-500',
      suffix: dashboardData?.avgBudgetUtilization != null ? '%' : '',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back! Here's your travel overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Travel Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f73f2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f73f2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff50" />
                <YAxis stroke="#ffffff50" />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a24',
                    border: '1px solid rgba(79, 115, 242, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="trips" stroke="#4f73f2" fill="url(#colorTrips)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Budget Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff50" />
                <YAxis stroke="#ffffff50" />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a24',
                    border: '1px solid rgba(79, 115, 242, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="budget" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Trips & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTrips trips={dashboardData?.recentTrips || trips} loading={loading} />
        <ActivityFeed trips={dashboardData?.recentTrips || trips} />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 glass rounded-xl hover:bg-white/10 transition-all group">
            <FiCalendar className="w-6 h-6 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm">New Trip</p>
          </button>
          <button className="p-4 glass rounded-xl hover:bg-white/10 transition-all group">
            <FiCompass className="w-6 h-6 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm">Explore</p>
          </button>
          <button className="p-4 glass rounded-xl hover:bg-white/10 transition-all group">
            <FiTrendingUp className="w-6 h-6 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm">Insights</p>
          </button>
          <button className="p-4 glass rounded-xl hover:bg-white/10 transition-all group">
            <FiMessageCircle className="w-6 h-6 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm">AI Chat</p>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard