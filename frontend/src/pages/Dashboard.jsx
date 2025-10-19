import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [currentPrayer, setCurrentPrayer] = useState(null)
  const [nextPrayer, setNextPrayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPrayerTimes()
  }, [])

  const fetchPrayerTimes = async () => {
    try {
      const response = await axios.get('/api/prayer/times/Delhi')
      
      if (response.data && response.data.times) {
        setPrayerTimes(response.data.times)
        calculateCurrentPrayer(response.data.times)
      } else {
        // Fallback to mock data
        const mockTimes = { 
          'Fajr': '04:25', 'Dhuhr': '12:10', 'Asr': '15:45', 
          'Maghrib': '18:30', 'Isha': '20:00', 'Sunrise': '06:15' 
        };
        setPrayerTimes(mockTimes);
        calculateCurrentPrayer(mockTimes);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // Fallback to mock data on error
      const mockTimes = { 
        'Fajr': '04:25', 'Dhuhr': '12:10', 'Asr': '15:45', 
        'Maghrib': '18:30', 'Isha': '20:00', 'Sunrise': '06:15' 
      };
      setPrayerTimes(mockTimes);
      calculateCurrentPrayer(mockTimes);
    }
    setLoading(false);
  }

  const calculateCurrentPrayer = (times) => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const prayers = [
      { name: 'Fajr', time: times.Fajr },
      { name: 'Dhuhr', time: times.Dhuhr },
      { name: 'Asr', time: times.Asr },
      { name: 'Maghrib', time: times.Maghrib },
      { name: 'Isha', time: times.Isha }
    ]

    prayers.forEach(prayer => {
      const [hours, minutes] = prayer.time.split(':').map(Number)
      prayer.minutes = hours * 60 + minutes
    })

    prayers.sort((a, b) => a.minutes - b.minutes)

    let current = null
    let next = null

    for (let i = 0; i < prayers.length; i++) {
      if (currentTime < prayers[i].minutes) {
        next = prayers[i]
        current = i > 0 ? prayers[i - 1] : prayers[prayers.length - 1]
        break
      }
    }

    if (!next) {
      current = prayers[prayers.length - 1]
      next = prayers[0]
    }

    setCurrentPrayer(current)
    setNextPrayer(next)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
        <h1 className="text-3xl font-heading font-bold text-gold-400 mb-2">
          Assalamu Alaikum, {user?.username}
        </h1>
        <p className="text-lg text-gray-300 font-medium">
          Welcome to your Islamic Companion
        </p>
        <div className="mt-4 text-gray-400">
          <p>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Prayer */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border-l-4 border-gold-500">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gray-700 border-2 border-gold-500 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-pray text-gold-400 text-2xl"></i>
            </div>
          </div>
          <h3 className="text-xl font-heading font-bold text-gold-400 mb-2">
            {currentPrayer ? `Current: ${currentPrayer.name}` : 'Current Prayer'}
          </h3>
          <p className="text-3xl font-bold text-white">
            {currentPrayer ? currentPrayer.time : '--:--'}
          </p>
        </div>

        {/* Next Prayer */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center">
              <i className="fas fa-clock text-gray-300 text-2xl"></i>
            </div>
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-300 mb-2">
            {nextPrayer ? `Next: ${nextPrayer.name}` : 'Next Prayer'}
          </h3>
          <p className="text-3xl font-bold text-gray-400">
            {nextPrayer ? nextPrayer.time : '--:--'}
          </p>
        </div>
      </div>

      {/* All Prayer Times */}
      {prayerTimes && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-gold-400 mb-6 text-center">
            Today's Prayer Times - Delhi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              <div key={prayer} className="text-center p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-gold-600 transition-colors duration-300">
                <h3 className="font-semibold text-gray-300 mb-2">{prayer}</h3>
                <p className="text-2xl font-bold text-gold-400">{time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/quran" className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700 hover:border-gold-500 hover:bg-gray-750 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 bg-gray-700 border border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-book-open text-gold-400 text-xl"></i>
          </div>
          <h3 className="font-heading font-semibold text-gold-400 mb-2">Read Quran</h3>
          <p className="text-sm text-gray-400">Continue your daily recitation</p>
        </a>

        <a href="/qibla" className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700 hover:border-gold-500 hover:bg-gray-750 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 bg-gray-700 border border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-compass text-gold-400 text-xl"></i>
          </div>
          <h3 className="font-heading font-semibold text-gold-400 mb-2">Find Qibla</h3>
          <p className="text-sm text-gray-400">Get accurate Qibla direction</p>
        </a>

        <a href="/arrangements" className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700 hover:border-gold-500 hover:bg-gray-750 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 bg-gray-700 border border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-moon text-gold-400 text-xl"></i>
          </div>
          <h3 className="font-heading font-semibold text-gold-400 mb-2">Ramadan</h3>
          <p className="text-sm text-gray-400">Community arrangements</p>
        </a>
      </div>
    </div>
  )
}

export default Dashboard;
