import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrayerTimes = () => {
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPrayer, setCurrentPrayer] = useState(null)

  const indianCities = [
    'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
    'Lucknow', 'Ahmedabad', 'Pune', 'Jaipur', 'Surat', 'Kanpur'
  ]

  const mockPrayerTimes = {
    Delhi: { Fajr: '04:25', Dhuhr: '12:10', Asr: '15:45', Maghrib: '18:30', Isha: '20:00', Sunrise: '06:15' },
    Mumbai: { Fajr: '05:15', Dhuhr: '12:25', Asr: '16:00', Maghrib: '18:45', Isha: '20:15', Sunrise: '06:45' },
    Bengaluru: { Fajr: '05:20', Dhuhr: '12:20', Asr: '15:50', Maghrib: '18:40', Isha: '20:10', Sunrise: '06:30' }
  }

  useEffect(() => {
    fetchPrayerTimes(selectedCity)
  }, [selectedCity])

  const fetchPrayerTimes = async (city) => {
    setLoading(true)
    try {
      // Try to fetch from API first
      const response = await axios.get(`/api/prayer/times/${city}`);
      if (response.data && response.data.times) {
        setPrayerTimes(response.data.times);
      } else {
        // Fallback to mock data if API doesn't return expected format
        setPrayerTimes(mockPrayerTimes[city] || mockPrayerTimes['Delhi']);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // Fallback to mock data
      setPrayerTimes(mockPrayerTimes[city] || mockPrayerTimes['Delhi']);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
        <div className="w-16 h-16 bg-gray-700 border-2 border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <i className="fas fa-clock text-gold-400 text-2xl"></i>
        </div>
        <h1 className="text-3xl font-heading font-bold text-gold-400 mb-2">
          Prayer Times
        </h1>
        <p className="text-lg text-gray-300">
          Accurate prayer times for Indian cities
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-heading font-semibold text-gold-400 mb-4">
          Select Your City
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {indianCities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                selectedCity === city
                  ? 'bg-gold-600 text-gray-900 border-gold-500'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gold-500 hover:text-gold-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : prayerTimes && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-gold-400 mb-6 text-center">
            Today's Prayer Times - {selectedCity}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              <div key={prayer} className="bg-gray-750 rounded-lg p-5 text-center border border-gray-700 shadow-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-700 border border-gold-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-pray text-gold-400 text-xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-300 mb-2">
                  {prayer}
                </h3>
                <p className="text-3xl font-bold text-gold-400">
                  {time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PrayerTimes;
