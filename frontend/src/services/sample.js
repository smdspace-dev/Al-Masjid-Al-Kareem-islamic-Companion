import axios from 'axios';

// Create an axios instance with a base URL and default headers
const api = axios.create({
  baseURL: '/api', // This will be proxied to http://127.0.0.1:5000/api by Vite
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
