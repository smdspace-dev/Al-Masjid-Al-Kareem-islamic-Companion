import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AudioPlayerProvider } from './context/AudioPlayerContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import GlobalAudioPlayer from './components/GlobalAudioPlayer'
import Dashboard from './pages/Dashboard'
import PrayerTimes from './pages/PrayerTimes'
import Quran from './pages/Quran'
import Qibla from './pages/Qibla'
import HadithPage from './pages/HadithPage'
import Calendar from './pages/Calendar'
import Guides from './pages/Guides'
import RamadanArrangements from './pages/RamadanArrangements'
import AdminPanel from './pages/ModernAdminPanel'
import Login from './pages/Login'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  return (
    <Router>
      <Routes>
        {/* Main app routes */}
        <Route path="/*" element={
          loading ? (
            <LoadingSpinner />
          ) : !user ? (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
              <Login />
            </div>
          ) : (
            <AudioPlayerProvider>
              <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100">
                <Header />
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 p-4 md:p-6 ml-16 md:ml-64 max-w-full overflow-x-hidden main-content-with-player">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/prayer" element={<PrayerTimes />} />
                      <Route path="/quran" element={<Quran />} />
                      <Route path="/qibla" element={<Qibla />} />
                      <Route path="/hadith" element={<HadithPage />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/guides" element={<Guides />} />
                      <Route path="/arrangements" element={<RamadanArrangements />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      
                      {/* Fallback route for any undefined path */}
                      <Route path="*" element={
                        <div className="text-center py-10">
                          <h2 className="text-3xl font-heading font-bold text-gold-400 mb-4">
                            Page Not Found
                          </h2>
                          <p className="text-xl text-gray-300 mb-8">
                            The page you're looking for doesn't exist.
                          </p>
                          <a href="/" className="bg-gold-600 hover:bg-gold-500 text-gray-900 font-bold py-2 px-4 rounded">
                            Go Home
                          </a>
                        </div>
                      } />
                    </Routes>
                  </main>
                </div>
                <Footer />
                <GlobalAudioPlayer />
              </div>
            </AudioPlayerProvider>
          )
        } />
      </Routes>
    </Router>
  )
}

export default App
