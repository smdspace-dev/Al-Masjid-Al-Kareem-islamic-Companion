import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-800 sticky top-0 w-full z-50">
      <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600"></div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-mosque text-gray-900 text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-gold-400">
                Al-Masjid Al-Kareem
              </h1>
              <p className="text-xs text-gray-400">Classical Islamic Companion</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <i className="fas fa-clock text-gold-400"></i>
              <span className="text-sm">{currentTime.toLocaleTimeString('en-US')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <i className="fas fa-calendar text-gold-400"></i>
              <span className="text-sm">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-8 bg-gray-800 border border-gold-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gold-400 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gold-400 border border-gray-700 rounded-md transition-colors duration-300 text-sm"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
