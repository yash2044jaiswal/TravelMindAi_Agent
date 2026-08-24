import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiMap, 
  FiBookmark, 
  FiUser, 
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/planner', icon: FiMap, label: 'AI Planner' },
    { path: '/dashboard/saved-trips', icon: FiBookmark, label: 'Saved Trips' },
    { path: '/dashboard/compare', icon: FiBarChart2, label: 'Compare' },
    { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  ];

  const isPlannerPage = location.pathname.includes('/planner');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 glass rounded-lg"
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : (isMobile ? -280 : 0),
          width: isSidebarOpen ? (isMobile ? 280 : 260) : (isMobile ? 0 : 80)
        }}
        className={`fixed left-0 top-0 h-screen bg-dark-800/95 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300 overflow-hidden ${
          isMobile ? 'shadow-2xl' : ''
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/10">
            <div className={`flex items-center gap-2 ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMap className="text-white text-sm" />
              </div>
              {(isSidebarOpen || isMobile) && (
                <div>
                  <h2 className="text-lg font-bold gradient-text">TravelMind AI</h2>
                  <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    } ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}`
                  }
                  title={!isSidebarOpen && !isMobile ? item.label : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(isSidebarOpen || isMobile) && <span className="text-sm">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full ${
                !isSidebarOpen && !isMobile ? 'justify-center' : ''
              }`}
              title={!isSidebarOpen && !isMobile ? 'Logout' : ''}
            >
              <FiLogOut className="w-5 h-5 flex-shrink-0" />
              {(isSidebarOpen || isMobile) && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content - FIXED for chat */}
      <main 
        className={`transition-all duration-300 min-h-screen ${
          isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-[260px]' : 'ml-[80px]')
        }`}
      >
        <div className={`p-4 md:p-6 ${isPlannerPage ? 'h-screen overflow-hidden' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;