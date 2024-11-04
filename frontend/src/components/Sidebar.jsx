import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/prayer', icon: 'fas fa-clock', label: 'Prayer Times' },
    { path: '/quran', icon: 'fas fa-book-open', label: 'Quran' },
    { path: '/qibla', icon: 'fas fa-compass', label: 'Qibla' },
    { path: '/hadith', icon: 'fas fa-quote-right', label: 'Hadith' },
    { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
    { path: '/guides', icon: 'fas fa-book', label: 'Guides' },
    { path: '/arrangements', icon: 'fas fa-moon', label: 'Ramadan' }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${collapsed ? 'w-16' : 'w-64'} bg-gray-800 border-r border-gray-700 shadow-xl z-30 transition-all duration-300 overflow-y-auto`}>
      <button 
        onClick={toggleSidebar} 
        className="absolute -right-3 top-5 bg-gray-800 rounded-full p-1 border border-gray-700 text-gold-400 hover:text-gold-300"
        aria-label="Toggle sidebar"
      >
        <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'} text-xs`}></i>
      </button>
      
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-colors duration-200 
                ${isActive 
                  ? 'bg-gray-700 text-gold-400' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-gold-300'}`
              }
            >
              <i className={`${item.icon} ${collapsed ? 'text-lg' : 'w-5'} text-center`}></i>
              {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="border-t border-gray-700 my-3"></div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200 
                  ${isActive 
                    ? 'bg-gray-700 text-gold-400' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-gold-300'}`
                }
              >
                <i className={`fas fa-crown ${collapsed ? 'text-lg' : 'w-5'} text-center`}></i>
                {!collapsed && <span className="ml-3 font-medium">Admin Panel</span>}
              </NavLink>
            </>
          )}
        </nav>

        {!collapsed && (
          <div className="mt-8 p-4 rounded-lg bg-gray-750 border border-gray-700">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 border-2 border-gold-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <i className="fas fa-moon text-gold-400 text-lg"></i>
              </div>
              <h3 className="font-heading font-semibold text-gold-400 mb-1">
                Ramadan 1446
              </h3>
              <p className="text-xs text-gray-400">
                Feb 28 - Mar 30, 2025
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
