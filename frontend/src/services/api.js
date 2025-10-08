import axios from 'axios'

// Set base URL for API calls - Environment aware
const getApiBaseUrl = () => {
  // Check if we have an explicit API URL set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL
  }
  
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Check if we're on Vercel
    if (window.location.hostname.includes('vercel.app')) {
      return `${window.location.origin}/api`
    }
    // Default production URL (Render or other)
    return 'https://your-backend.onrender.com'
  }
  
  // Development environment
  return 'http://localhost:5000'
}

const API_BASE_URL = getApiBaseUrl()

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API error:', error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Response data:', error.response.data)
      console.log('Response status:', error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error setting up request:', error.message)
    }
    return Promise.reject(error)
  }
)

// API service functions
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  }
}

export const prayerService = {
  getPrayerTimes: async (city) => {
    const response = await api.get(`/prayer/times/${city}`)
    return response.data
  },

  getCities: async () => {
    const response = await api.get('/prayer/cities')
    return response.data
  },

  getCurrentPrayer: async (city) => {
    const response = await api.get(`/prayer/current?city=${city}`)
    return response.data
  },

  getQiblaDirection: async (lat, lng) => {
    const response = await api.get(`/prayer/qibla?lat=${lat}&lng=${lng}`)
    return response.data
  }
}

export const quranService = {
  getAllSurahs: async () => {
    const response = await api.get('/quran/surahs')
    return response.data
  },

  getSurah: async (surahNumber) => {
    const response = await api.get(`/quran/surah/${surahNumber}`)
    return response.data
  },

  searchQuran: async (query) => {
    const response = await api.get(`/quran/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  getBookmarks: async () => {
    const response = await api.get('/quran/bookmarks')
    return response.data
  },

  addBookmark: async (surah, ayah, note) => {
    const response = await api.post('/quran/bookmark', { surah, ayah, note })
    return response.data
  }
}

export const hadithService = {
  getCollections: async () => {
    const response = await api.get('/hadith/collections')
    return response.data
  },

  getCollectionHadiths: async (collectionSlug, page = 1) => {
    const response = await api.get(`/hadith/collection/${collectionSlug}?page=${page}`)
    return response.data
  },

  getHadith: async (hadithId) => {
    const response = await api.get(`/hadith/hadith/${hadithId}`)
    return response.data
  },

  searchHadiths: async (query, collection = '') => {
    const response = await api.get(`/hadith/search?q=${encodeURIComponent(query)}&collection=${collection}`)
    return response.data
  },

  getRandomHadith: async () => {
    const response = await api.get('/hadith/random')
    return response.data
  }
}

export const arrangementsService = {
  getAllArrangements: async (type = '', city = '') => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (city) params.append('city', city)

    const response = await api.get(`/arrangements?${params.toString()}`)
    return response.data
  },

  getArrangement: async (id) => {
    const response = await api.get(`/arrangements/${id}`)
    return response.data
  },

  createArrangement: async (arrangementData) => {
    const response = await api.post('/arrangements', arrangementData)
    return response.data
  },

  updateArrangement: async (id, arrangementData) => {
    const response = await api.put(`/arrangements/${id}`, arrangementData)
    return response.data
  },

  deleteArrangement: async (id) => {
    const response = await api.delete(`/arrangements/${id}`)
    return response.data
  },

  getMapData: async () => {
    const response = await api.get('/arrangements/map-data')
    return response.data
  }
}

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  getAllUsers: async (page = 1, role = '') => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    if (role) params.append('role', role)

    const response = await api.get(`/admin/users?${params.toString()}`)
    return response.data
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive })
    return response.data
  },

  getPendingArrangements: async () => {
    const response = await api.get('/admin/arrangements/pending')
    return response.data
  },

  approveArrangement: async (arrangementId, approved) => {
    const response = await api.put(`/admin/arrangements/${arrangementId}/approve`, { approved })
    return response.data
  }
}

export default api
