import React, { useState, useEffect } from 'react';

const Qibla = () => {
  const [qiblaData, setQiblaData] = useState({ bearing: 270, distance: 6200 });
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [isLocating, setIsLocating] = useState(false);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [compassSupported, setCompassSupported] = useState(false);

  // Check if device orientation is supported
  useEffect(() => {
    if (window.DeviceOrientationEvent) {
      setCompassSupported(true);
      const handleOrientation = (event) => {
        if (event.alpha !== null) {
          setDeviceHeading(event.alpha);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const calculateQiblaDirection = (lat, lng) => {
    // Kaaba coordinates
    const kaaba_lat = 21.4225;
    const kaaba_lng = 39.8262;

    // Convert to radians
    const lat1 = lat * (Math.PI / 180);
    const lat2 = kaaba_lat * (Math.PI / 180);
    const deltaLng = (kaaba_lng - lng) * (Math.PI / 180);

    // Calculate bearing
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360; // Normalize to 0-360

    // Calculate distance
    const R = 6371; // Earth's radius in km
    const dLat = lat2 - lat1;
    const dLng = deltaLng;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return { bearing: Math.round(bearing), distance: Math.round(distance) };
  };

  const getLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          
          const qibla = calculateQiblaDirection(newLocation.lat, newLocation.lng);
          setQiblaData(qibla);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          alert("Could not get your location. Using default location (Delhi).");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  // Calculate the compass direction accounting for device orientation
  const qiblaDirection = compassSupported ? qiblaData.bearing - deviceHeading : qiblaData.bearing;

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center border border-gray-700">
        <div className="w-16 h-16 bg-gray-700 border-2 border-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <i className="fas fa-compass text-gold-400 text-2xl"></i>
        </div>
        <h1 className="text-3xl font-heading font-bold text-gold-400 mb-2">
          Qibla Compass
        </h1>
        <p className="text-lg text-gray-300">
          Find the direction to the Sacred Kaaba
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-bold text-gold-400 mb-2">
            Live Qibla Direction
          </h2>
          <p className="text-gray-300">Face this direction for prayer</p>
          
          <button 
            onClick={getLocation}
            disabled={isLocating}
            className="mt-4 bg-gold-600 hover:bg-gold-500 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors duration-300 disabled:opacity-50"
          >
            {isLocating ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                Locating...
              </span>
            ) : (
              <span className="flex items-center">
                <i className="fas fa-location-arrow mr-2"></i>
                Use My Location
              </span>
            )}
          </button>
        </div>

        {/* Live Compass */}
        <div className="flex justify-center mb-8">
          <div className="relative w-80 h-80 bg-gray-900 rounded-full border-4 border-gold-500 shadow-lg flex items-center justify-center">
            
            {/* Compass Background */}
            <div className="absolute inset-2 border-2 border-gray-700 rounded-full"></div>
            
            {/* Cardinal Directions - Fixed Correct Positioning */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 font-bold text-gold-400 text-lg">N</div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 font-bold text-gold-400 text-lg">S</div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-gold-400 text-lg">W</div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 font-bold text-gold-400 text-lg">E</div>
            
            {/* Qibla Direction Arrow */}
            <div 
              className="absolute w-1 bg-gold-500 origin-bottom transition-transform duration-300"
              style={{
                height: '140px',
                transform: `rotate(${qiblaDirection}deg)`,
                transformOrigin: 'bottom center',
                top: '20px'
              }}
            >
              <div className="w-6 h-6 bg-gold-500 rounded-full -mt-3 -ml-2.5 border-2 border-gray-900 flex items-center justify-center">
                <span className="text-gray-900 text-xs font-bold">🕋</span>
              </div>
            </div>

            {/* Center Point */}
            <div className="w-4 h-4 bg-gold-500 rounded-full border-2 border-gray-900"></div>

            {/* Mecca Direction Indicator (West-Southwest for most Indian locations) */}
            <div 
              className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-gold-400 flex items-center justify-center shadow-lg"
              style={{
                left: '30px',
                top: '60%',
                transform: 'translateY(-50%)'
              }}
            >
              <span className="text-white text-sm">🕋</span>
            </div>
            <div className="absolute left-6 top-2/3 text-green-400 text-xs font-semibold">
              Mecca
            </div>

            {/* Compass markings */}
            {[...Array(36)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute bg-gray-600 ${i % 9 === 0 ? 'w-0.5 h-4' : 'w-0.5 h-2'}`}
                style={{
                  transform: `rotate(${i * 10}deg) translateY(-${i % 9 === 0 ? '150px' : '145px'})`,
                  transformOrigin: 'bottom center',
                  top: '50%',
                  left: 'calc(50% - 1px)'
                }}
              />
            ))}

            {/* Device Heading Indicator (if supported) */}
            {compassSupported && (
              <div 
                className="absolute w-0.5 h-16 bg-blue-400 origin-bottom"
                style={{
                  transform: `rotate(${-deviceHeading}deg)`,
                  transformOrigin: 'bottom center',
                  top: '60px'
                }}
              >
                <div className="w-3 h-3 bg-blue-400 rounded-full -mt-1.5 -ml-1 border border-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-700">
            <i className="fas fa-compass text-3xl text-gold-400 mb-2"></i>
            <h3 className="text-lg font-heading font-semibold text-gray-300 mb-1">Qibla Bearing</h3>
            <p className="text-2xl font-bold text-gold-400">{qiblaData.bearing}°</p>
            {compassSupported && (
              <p className="text-xs text-blue-400 mt-1">Live: {Math.round(qiblaDirection)}°</p>
            )}
          </div>

          <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-700">
            <i className="fas fa-route text-3xl text-gold-400 mb-2"></i>
            <h3 className="text-lg font-heading font-semibold text-gray-300 mb-1">Distance</h3>
            <p className="text-2xl font-bold text-gold-400">{qiblaData.distance.toLocaleString()} km</p>
          </div>

          <div className="text-center p-4 bg-gray-750 rounded-lg border border-gray-700">
            <i className="fas fa-mobile-alt text-3xl text-gold-400 mb-2"></i>
            <h3 className="text-lg font-heading font-semibold text-gray-300 mb-1">Compass</h3>
            <p className="text-sm font-bold text-gold-400">
              {compassSupported ? 'Live Enabled' : 'Manual Only'}
            </p>
            {compassSupported && (
              <p className="text-xs text-blue-400">Heading: {Math.round(deviceHeading)}°</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-750 rounded-lg border border-gray-700">
          <h3 className="text-xl font-heading font-semibold text-gold-400 mb-2">Your Location</h3>
          <p className="text-gray-300">
            <span className="text-gray-400">Latitude:</span> {userLocation.lat.toFixed(4)}°
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400">Longitude:</span> {userLocation.lng.toFixed(4)}°
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {compassSupported ? 
              "📱 Live compass enabled. Turn your device to see real-time Qibla direction." :
              "📍 For more accurate results, please use your device's location services."
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Qibla;
