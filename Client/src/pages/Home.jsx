import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiArrowRight, FiZap, FiGlobe, FiMap, FiTrendingUp, FiShield, FiUsers, FiAward } from 'react-icons/fi'
import AnimatedGlobe from '../components/common/AnimatedGlobe'

const Home = () => {
  const { user } = useAuth()

  const features = [
    { icon: FiZap, title: 'AI-Powered Planning', description: 'Advanced AI understands your preferences and creates personalized itineraries' },
    { icon: FiGlobe, title: 'Global Destinations', description: 'Access travel knowledge for destinations worldwide' },
    { icon: FiMap, title: 'Smart Budgeting', description: 'Real-time budget optimization and cost breakdown' },
    { icon: FiTrendingUp, title: 'Price Prediction', description: 'AI predicts best times to book and travel' },
    { icon: FiShield, title: 'Safety First', description: 'Real-time safety alerts and emergency contacts' },
    { icon: FiUsers, title: 'Group Planning', description: 'Plan trips for families, couples, or solo travelers' },
  ]

  const steps = [
    { number: '01', title: 'Describe Your Dream Trip', description: 'Tell our AI your destination, budget, duration, and preferences' },
    { number: '02', title: 'AI Analysis', description: 'Our multi-agent system analyzes requirements and searches best options' },
    { number: '03', title: 'Get Your Plan', description: 'Receive a complete itinerary with hotels, activities, and cost breakdown' },
    { number: '04', title: 'Customize & Save', description: 'Modify your plan and save it to your dashboard for easy access' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-aurora opacity-30"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
              >
                <FiAward className="text-primary-400" />
                <span className="text-sm text-primary-400">Microsoft AI Hackathon 2026</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl lg:text-7xl font-bold mb-6"
              >
                Your AI-Powered
                <span className="gradient-text block">Travel Companion</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-8"
              >
                Plan your perfect trip with our advanced AI agents. Get personalized itineraries, smart budgeting, and real-time recommendations.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <Link
                  to={user ? '/dashboard/planner' : '/register'}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  Start Planning
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 glass glass-hover rounded-xl font-semibold">
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <AnimatedGlobe />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features for</h2>
            <h2 className="text-4xl font-bold gradient-text">Smart Travelers</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How Our AI Agent Works</h2>
            <p className="text-gray-300 text-lg">Powered by 6 specialized AI agents working together</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-bold gradient-text mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-primary-400">
                    <FiArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of smart travelers using TravelMind AI</p>
            <Link
              to={user ? '/dashboard/planner' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
            >
              Get Started Now
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home