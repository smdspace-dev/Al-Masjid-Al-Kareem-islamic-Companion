import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const RamadanArrangements = () => {
  const [arrangements, setArrangements] = useState([])
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'Sehri',
    location: '',
    description: '',
    organizer: '',
    contact: '',
    mapLink: ''
  })
  const { user, isArranger } = useAuth()

  const mockArrangements = [
    {
      id: 1, type: 'Sehri', location: 'Jama Masjid, Delhi',
      description: 'Free traditional Sehri with parathas and lassi, 4:00 AM daily during Ramadan',
      organizer: 'Delhi Muslim Community Center', contact: '+91-11-23456789',
      coordinates: { lat: 28.6507, lng: 77.2334 }, isActive: true, isApproved: true
    },
    {
      id: 2, type: 'Iftari', location: 'Mohammed Ali Road, Mumbai',
      description: 'Grand community Iftari with dates, samosas, and biryani, 6:30 PM daily',
      organizer: 'Mumbai Muslim Welfare Society', contact: '+91-22-23456789',
      coordinates: { lat: 18.9641, lng: 72.8270 }, isActive: true, isApproved: true
    },
    {
      id: 3, type: 'Sehri', location: 'Charminar, Hyderabad',
      description: 'Traditional Hyderabadi Sehri with haleem and naan, 4:15 AM',
      organizer: 'Hyderabad Masjid Committee', contact: '+91-40-23456789',
      coordinates: { lat: 17.3616, lng: 78.4747 }, isActive: true, isApproved: true
    },
    {
      id: 4, type: 'Iftari', location: 'Lucknow Imambara',
      description: 'Lucknowi Iftari with kebabs, biryani, and kulfi, 6:25 PM',
      organizer: 'Lucknow Islamic Center', contact: '+91-522-23456789',
      coordinates: { lat: 26.8467, lng: 80.9462 }, isActive: true, isApproved: true
    }
  ]

  useEffect(() => {
    setArrangements(mockArrangements)
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, this would submit to backend
    console.log('Form submitted:', formData)
    setShowUploadForm(false)
    // Reset form
    setFormData({
      type: 'Sehri', location: '', description: '', organizer: '', contact: '', mapLink: ''
    })
    alert('Arrangement submitted for admin approval!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="ancient-card p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i className="fas fa-moon text-white text-3xl"></i>
        </div>
        <h1 className="text-4xl font-heading font-bold text-royal-800 mb-2">
          Ramadan Arrangements
        </h1>
        <p className="text-xl text-gold-600">
          Community Sehri and Iftari events across India
        </p>
      </div>

      {/* Controls */}
      <div className="ancient-card p-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gold-600 text-white'
                  : 'bg-gold-100 text-royal-800 hover:bg-gold-200'
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-gold-600 text-white'
                  : 'bg-gold-100 text-royal-800 hover:bg-gold-200'
              }`}
            >
              <i className="fas fa-map mr-2"></i>
              Map View
            </button>
          </div>

          {isArranger && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn-ornate"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Arrangement
            </button>
          )}
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {arrangements.map(arrangement => (
            <div key={arrangement.id} className="ancient-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      arrangement.type === 'Sehri'
                        ? 'bg-burgundy-100 text-burgundy-800'
                        : 'bg-gold-100 text-gold-800'
                    }`}>
                      {arrangement.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-royal-800 mb-2">
                    {arrangement.location}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    {arrangement.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-users w-4 mr-2"></i>
                  <span>{arrangement.organizer}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-phone w-4 mr-2"></i>
                  <span>{arrangement.contact}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-map-marker-alt w-4 mr-2"></i>
                  <span>{arrangement.coordinates.lat.toFixed(4)}, {arrangement.coordinates.lng.toFixed(4)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gold-200">
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm">
                  <i className="fas fa-external-link-alt mr-2"></i>
                  View on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="ancient-card p-6">
          <div className="bg-gradient-to-br from-gold-100 to-amber-100 rounded-lg p-12 text-center border-2 border-gold-300">
            <i className="fas fa-map text-6xl text-gold-600 mb-4"></i>
            <h3 className="text-2xl font-heading font-semibold text-royal-800 mb-4">
              Interactive Map
            </h3>
            <p className="text-gray-700 mb-6">
              Google Maps integration showing all Ramadan arrangements across India with interactive pins and detailed information.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {arrangements.map(arr => (
                <div key={arr.id} className="p-3 bg-white rounded-lg border border-gold-300">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    arr.type === 'Sehri' ? 'bg-burgundy-600' : 'bg-gold-600'
                  }`}></div>
                  <p className="font-medium text-royal-800">{arr.location.split(',')[0]}</p>
                  <p className="text-xs text-gray-600">{arr.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="ancient-card p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-royal-800">
                Add New Arrangement
              </h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-ornate"
                  required
                >
                  <option value="Sehri">Sehri</option>
                  <option value="Iftari">Iftari</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Jama Masjid, Delhi"
                  className="input-ornate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the arrangement, timing, and what's provided..."
                  className="input-ornate h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Organization or person name"
                  className="input-ornate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Phone number or email"
                  className="input-ornate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps Link (optional)
                </label>
                <input
                  type="url"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/?q=..."
                  className="input-ornate"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-ornate"
                >
                  <i className="fas fa-check mr-2"></i>
                  Submit for Approval
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-600 mt-4 text-center">
              Your submission will be reviewed by administrators before being published.
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ancient-card p-6 text-center">
          <i className="fas fa-moon text-3xl text-burgundy-600 mb-3"></i>
          <h3 className="text-xl font-bold text-royal-800">
            {arrangements.filter(a => a.type === 'Sehri').length}
          </h3>
          <p className="text-sm text-gray-600">Sehri Events</p>
        </div>
        <div className="ancient-card p-6 text-center">
          <i className="fas fa-utensils text-3xl text-gold-600 mb-3"></i>
          <h3 className="text-xl font-bold text-royal-800">
            {arrangements.filter(a => a.type === 'Iftari').length}
          </h3>
          <p className="text-sm text-gray-600">Iftari Events</p>
        </div>
        <div className="ancient-card p-6 text-center">
          <i className="fas fa-map-marker-alt text-3xl text-emerald-600 mb-3"></i>
          <h3 className="text-xl font-bold text-royal-800">
            {new Set(arrangements.map(a => a.location.split(',')[1]?.trim())).size}
          </h3>
          <p className="text-sm text-gray-600">Cities</p>
        </div>
        <div className="ancient-card p-6 text-center">
          <i className="fas fa-users text-3xl text-royal-600 mb-3"></i>
          <h3 className="text-xl font-bold text-royal-800">
            {arrangements.length}
          </h3>
          <p className="text-sm text-gray-600">Total Events</p>
        </div>
      </div>
    </div>
  )
}

export default RamadanArrangements
