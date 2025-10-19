/* eslint-disable */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored token on component mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      
      // Special handling for mock token (when backend is down)
      if (storedToken === 'mock_token_for_admin') {
        console.log('Using mock admin user');
        setUser({
          id: 1,
          username: 'ahilxdesigns@gmail.com',
          email: 'ahilxdesigns@gmail.com',
          role: 'admin',
          is_active: true
        });
        setLoading(false);
      } else {
        // Check if the token is valid with the backend
        validateToken(storedToken);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (storedToken) => {
    try {
      // Try to fetch user info with the token
      console.log('Validating token...');
      
      // First check if the API is accessible at all
      try {
        const healthCheck = await fetch('/api/health');
        console.log('API health check:', await healthCheck.text());
      } catch (e) {
        console.error('API health check failed:', e);
      }
      
      // Check if it's a guest user token
      if (storedToken === 'guest_user_token') {
        console.log('Using guest user access');
        setUser({
          id: 0,
          username: 'guest',
          email: 'guest@muslim-app.com',
          role: 'guest',
          is_active: true
        });
        return;
      }
      
      const response = await api.get('/auth/me');
      console.log('Token validation successful:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Token validation failed:', error);
      console.log('Error details:', error.response ? error.response.data : 'No response data');
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log('Attempting login with username:', username);
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      if (response.data && response.data.access_token) {
        const { access_token, user: userData } = response.data;
        setToken(access_token);
        setUser(userData);
        localStorage.setItem('auth_token', access_token);
        return { success: true, user: userData };
      } else {
        console.error('Login response missing token or user data');
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Special handling for offline mode with admin credentials
      if (!window.navigator.onLine || error.message.includes('Network Error')) {
        if (username === 'ahilxdesigns@gmail.com' && password === 'Qareeb@2025') {
          const mockToken = 'mock_token_for_admin';
          const mockUser = {
            id: 1,
            username: 'ahilxdesigns@gmail.com',
            email: 'ahilxdesigns@gmail.com',
            role: 'admin',
            is_active: true
          };
          
          setToken(mockToken);
          setUser(mockUser);
          localStorage.setItem('auth_token', mockToken);
          
          return { 
            success: true, 
            user: mockUser,
            offline: true
          };
        }
      }
      
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please check your credentials or try again later.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  // Function to check if the current user has admin role
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.username === 'ahilxdesigns@gmail.com');
  };

  // Enable guest admin access for testing
  const enableAdminAccess = () => {
    const adminUser = {
      id: 1,
      username: 'ahilxdesigns@gmail.com',
      email: 'ahilxdesigns@gmail.com',
      role: 'admin',
      is_active: true
    };
    setUser(adminUser);
    setToken('admin_access_token');
    localStorage.setItem('auth_token', 'admin_access_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      token, 
      login, 
      logout, 
      updateUser,
      isAdmin,
      enableAdminAccess,
      isAuthenticated: !!user || !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};
