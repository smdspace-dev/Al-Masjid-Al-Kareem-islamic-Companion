import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState('Checking...')

  const { login } = useAuth()
  
  // Check if backend server is running
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setServerStatus(`Connected: ${data.status}`);
        } else {
          setServerStatus(`Server error: ${response.status}`);
        }
      } catch (error) {
        console.error('Server check error:', error);
        setServerStatus('Cannot connect to server');
      }
    };
    
    checkServerStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', formData.username);
      
      // Try normal login first
      const result = await login(formData.username, formData.password);
      
      if (!result || !result.success) {
        if (serverStatus.includes('Cannot connect') && 
            formData.username === 'admin' && 
            formData.password === 'admin123') {
          // Provide mock login if backend is unreachable
          console.log('Using mock login for admin user');
          localStorage.setItem('auth_token', 'mock_token_for_admin');
          window.location.reload();
          return;
        }
        setError(result?.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // If server is down but credentials are default admin, use mock login
      if (serverStatus.includes('Cannot connect') && 
          formData.username === 'admin' && 
          formData.password === 'admin123') {
        console.log('Server down, using mock login');
        localStorage.setItem('auth_token', 'mock_token_for_admin');
        window.location.reload();
        return;
      }
      
      setError('Connection error. Please check if the server is running.');
    }

    setLoading(false);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-800 border-2 border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <i className="fas fa-mosque text-gold-400 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-heading font-bold text-gold-400 mb-2">
            Al-Masjid Al-Kareem
          </h1>
          <p className="text-gray-400">Classical Islamic Companion</p>
          <div className={`mt-2 text-xs ${serverStatus.includes('Connected') ? 'text-green-400' : 'text-red-400'}`}>
            Server Status: {serverStatus}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-heading font-semibold text-gold-400 text-center mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-gray-900 border border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-600 hover:bg-gold-500 text-gray-900 rounded-md py-3 text-lg font-semibold transition-colors duration-300 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing In...
                </span>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 mb-4">
              For arrangement of dawat, arrangements for Ramazan, contact admin to make an arranger account: 
              <br/><span className="text-gold-400">ahilxdesigns@gmail.com</span>
            </p>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                localStorage.setItem('auth_token', 'guest_user_token');
                window.location.reload();
              }}
              className="w-full bg-gray-700 hover:bg-gray-650 text-gold-400 border border-gray-600 rounded-md py-3 text-lg font-semibold transition-colors duration-300"
            >
              <i className="fas fa-user mr-2"></i>
              Continue as Application User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
