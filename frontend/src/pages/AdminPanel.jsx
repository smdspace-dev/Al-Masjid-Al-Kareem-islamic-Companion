import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [arrangements, setArrangements] = useState([]);
  const [pendingArrangements, setPendingArrangements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({});

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'normal',
    is_active: true
  });
  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-red-300">Admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch data functions
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingArrangements = async () => {
    try {
      const response = await fetch('/api/arrangements/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingArrangements(data.arrangements || []);
      }
    } catch (error) {
      console.error('Error fetching pending arrangements:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPendingArrangements();
  }, []);
  
  useEffect(() => {
    if (user && !isAdmin()) {
      navigate('/dashboard')
      return
    }
    
    setUsers(mockUsers)
    setPendingArrangements(mockPendingArrangements)
    setStatistics({
      totalUsers: 5,
      activeUsers: 4,
      arrangers: 2,
      totalArrangements: 6,
      pendingApproval: 2,
      activeArrangements: 4
    })
    
    // Fetch Quran data
    fetchSurahs()
  }, [user, navigate, isAdmin])

  // Fetch surahs
  const fetchSurahs = async () => {
    try {
      const response = await axios.get('/api/quran/surahs')
      if (response.data && response.data.surahs) {
        setSurahs(response.data.surahs)
      } else {
        // Use mock data if API returns invalid format
        setSurahs([
          { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', numberOfAyahs: 7, revelationType: 'Meccan' },
          { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', numberOfAyahs: 286, revelationType: 'Medinan' }
        ])
      }
    } catch (error) {
      console.error('Error fetching surahs:', error)
      // Use mock data if API fails
      setSurahs([
        { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', numberOfAyahs: 7, revelationType: 'Meccan' },
        { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', numberOfAyahs: 286, revelationType: 'Medinan' }
      ])
    }
  }

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
    alert(`User role updated to ${newRole}`)
  }

  const handleUserStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ))
  }

  const handleApproveArrangement = (arrangementId, approved) => {
    setPendingArrangements(pendingArrangements.filter(arr => arr.id !== arrangementId))
    alert(`Arrangement ${approved ? 'approved' : 'rejected'}`)
  }

  if (!isAdmin()) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-lock text-6xl text-red-400 mb-4"></i>
        <h2 className="text-2xl font-heading font-bold text-royal-800 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600">
          This page is only accessible to administrators.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="ancient-card p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-royal-500 to-royal-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <i className="fas fa-crown text-white text-3xl"></i>
        </div>
        <h1 className="text-4xl font-heading font-bold text-royal-800 mb-2">
          Admin Panel
        </h1>
        <p className="text-xl text-gold-600">
          System management and user administration
        </p>
      </div>

      {/* Tabs */}
      <div className="ancient-card p-6">
              <div className="flex bg-white rounded-t-lg shadow overflow-x-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'dashboard' ? 'text-royal-600 border-b-2 border-royal-600' : 'text-gray-600 hover:text-royal-500'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'users' ? 'text-royal-600 border-b-2 border-royal-600' : 'text-gray-600 hover:text-royal-500'}`}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'pending' ? 'text-royal-600 border-b-2 border-royal-600' : 'text-gray-600 hover:text-royal-500'}`}
        >
          Pending Approval
        </button>
        <button 
          onClick={() => setActiveTab('quran')}
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'quran' ? 'text-royal-600 border-b-2 border-royal-600' : 'text-gray-600 hover:text-royal-500'}`}
        >
          Add Quran Content
        </button>
        <button 
          onClick={() => setActiveTab('add-arrangement')}
          className={`px-6 py-3 text-sm font-medium ${activeTab === 'add-arrangement' ? 'text-royal-600 border-b-2 border-royal-600' : 'text-gray-600 hover:text-royal-500'}`}
        >
          Add Arrangement
        </button>
      </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg border-2 border-emerald-400 text-center">
                <i className="fas fa-users text-4xl text-emerald-600 mb-3"></i>
                <h3 className="text-2xl font-bold text-emerald-800">{statistics.totalUsers}</h3>
                <p className="text-emerald-700">Total Users</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-gold-100 to-amber-100 rounded-lg border-2 border-gold-400 text-center">
                <i className="fas fa-user-check text-4xl text-gold-600 mb-3"></i>
                <h3 className="text-2xl font-bold text-royal-800">{statistics.activeUsers}</h3>
                <p className="text-gold-700">Active Users</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-royal-100 to-royal-200 rounded-lg border-2 border-royal-400 text-center">
                <i className="fas fa-user-cog text-4xl text-royal-600 mb-3"></i>
                <h3 className="text-2xl font-bold text-royal-800">{statistics.arrangers}</h3>
                <p className="text-royal-700">Arrangers</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-lg border-2 border-burgundy-400 text-center">
                <i className="fas fa-calendar text-4xl text-burgundy-600 mb-3"></i>
                <h3 className="text-2xl font-bold text-burgundy-800">{statistics.totalArrangements}</h3>
                <p className="text-burgundy-700">Total Arrangements</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg border-2 border-yellow-400 text-center">
                <i className="fas fa-clock text-4xl text-yellow-600 mb-3"></i>
                <h3 className="text-2xl font-bold text-yellow-800">{statistics.pendingApproval}</h3>
                <p className="text-yellow-700">Pending Approval</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-400 text-center">
                <i className="fas fa-check-circle text-4xl text-green-600 mb-3"></i>
                <h3 className="text-2xl font-bold text-green-800">{statistics.activeArrangements}</h3>
                <p className="text-green-700">Active Arrangements</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
          {activeTab === 'quran' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-heading font-bold text-royal-800 mb-6">Quran Management</h2>
              
              {/* Surah Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                
                // Validate form
                const errors = {};
                if (!surahForm.number) errors.number = "Surah number is required";
                if (!surahForm.name) errors.name = "Arabic name is required";
                if (!surahForm.englishName) errors.englishName = "English name is required";
                if (!surahForm.numberOfAyahs) errors.numberOfAyahs = "Number of ayahs is required";
                if (!surahForm.revelationType) errors.revelationType = "Revelation type is required";
                
                if (Object.keys(errors).length > 0) {
                  setFormErrors(errors);
                  return;
                }
                
                // Submit form
                try {
                  // In a real app, you would call API here
                  console.log("Submitting surah:", surahForm);
                  if (selectedSurah) {
                    // Update existing surah in the list
                    setSurahs(
                      surahs.map(s => s.number === selectedSurah.number ? {
                        ...s,
                        name: surahForm.name,
                        englishName: surahForm.englishName,
                        numberOfAyahs: parseInt(surahForm.numberOfAyahs),
                        revelationType: surahForm.revelationType
                      } : s)
                    );
                    alert("Surah updated successfully!");
                  } else {
                    // Add new surah to the list
                    setSurahs([
                      ...surahs,
                      {
                        number: parseInt(surahForm.number),
                        name: surahForm.name,
                        englishName: surahForm.englishName,
                        numberOfAyahs: parseInt(surahForm.numberOfAyahs),
                        revelationType: surahForm.revelationType
                      }
                    ]);
                    alert("Surah added successfully!");
                  }
                  
                  // Reset form
                  setSurahForm({
                    number: '',
                    name: '',
                    englishName: '',
                    numberOfAyahs: '',
                    revelationType: ''
                  });
                  setSelectedSurah(null);
                  setFormErrors({});
                } catch (error) {
                  console.error("Error adding surah:", error);
                  alert("Failed to add surah. Please try again.");
                }
              }} className="space-y-4 mb-8">
                <h3 className="text-xl font-heading font-bold text-royal-800 mb-4">
                  {selectedSurah ? 'Edit Surah' : 'Add New Surah'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surah Number</label>
                    <input 
                      type="number" 
                      className={`w-full p-2 border ${formErrors.number ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={surahForm.number}
                      onChange={(e) => setSurahForm({...surahForm, number: e.target.value})}
                      placeholder="e.g. 1"
                      disabled={selectedSurah}
                    />
                    {formErrors.number && <p className="text-red-500 text-xs mt-1">{formErrors.number}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arabic Name</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md arabic-text`}
                      value={surahForm.name}
                      onChange={(e) => setSurahForm({...surahForm, name: e.target.value})}
                      placeholder="e.g. الفاتحة"
                      dir="rtl"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border ${formErrors.englishName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={surahForm.englishName}
                      onChange={(e) => setSurahForm({...surahForm, englishName: e.target.value})}
                      placeholder="e.g. Al-Fatiha"
                    />
                    {formErrors.englishName && <p className="text-red-500 text-xs mt-1">{formErrors.englishName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Ayahs</label>
                    <input 
                      type="number" 
                      className={`w-full p-2 border ${formErrors.numberOfAyahs ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={surahForm.numberOfAyahs}
                      onChange={(e) => setSurahForm({...surahForm, numberOfAyahs: e.target.value})}
                      placeholder="e.g. 7"
                    />
                    {formErrors.numberOfAyahs && <p className="text-red-500 text-xs mt-1">{formErrors.numberOfAyahs}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revelation Type</label>
                    <select 
                      className={`w-full p-2 border ${formErrors.revelationType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={surahForm.revelationType}
                      onChange={(e) => setSurahForm({...surahForm, revelationType: e.target.value})}
                    >
                      <option value="">Select Revelation Type</option>
                      <option value="Meccan">Meccan</option>
                      <option value="Medinan">Medinan</option>
                    </select>
                    {formErrors.revelationType && <p className="text-red-500 text-xs mt-1">{formErrors.revelationType}</p>}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-royal-600 text-white rounded-md hover:bg-royal-700 transition"
                  >
                    {selectedSurah ? 'Update Surah' : 'Add Surah'}
                  </button>
                  
                  {selectedSurah && (
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedSurah(null);
                        setSurahForm({
                          number: '',
                          name: '',
                          englishName: '',
                          numberOfAyahs: '',
                          revelationType: ''
                        });
                        setFormErrors({});
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              
              {/* Surahs Table */}
              <div>
                <h3 className="text-xl font-heading font-bold text-royal-800 mb-4">Surahs List</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gold-200 to-amber-200">
                        <th className="border border-gold-400 p-3 text-left text-royal-800">Number</th>
                        <th className="border border-gold-400 p-3 text-left text-royal-800">Arabic Name</th>
                        <th className="border border-gold-400 p-3 text-left text-royal-800">English Name</th>
                        <th className="border border-gold-400 p-3 text-left text-royal-800">Ayahs</th>
                        <th className="border border-gold-400 p-3 text-left text-royal-800">Type</th>
                        <th className="border border-gold-400 p-3 text-left text-royal-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {surahs.length > 0 ? (
                        surahs.map((surah) => (
                          <tr key={surah.number} className="hover:bg-gold-50">
                            <td className="border border-gold-300 p-3">{surah.number}</td>
                            <td className="border border-gold-300 p-3 arabic-text" dir="rtl">{surah.name}</td>
                            <td className="border border-gold-300 p-3">{surah.englishName}</td>
                            <td className="border border-gold-300 p-3">{surah.numberOfAyahs}</td>
                            <td className="border border-gold-300 p-3">{surah.revelationType}</td>
                            <td className="border border-gold-300 p-3">
                              <button
                                onClick={() => {
                                  setSelectedSurah(surah);
                                  setSurahForm({
                                    number: surah.number.toString(),
                                    name: surah.name,
                                    englishName: surah.englishName,
                                    numberOfAyahs: surah.numberOfAyahs.toString(),
                                    revelationType: surah.revelationType
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this surah?')) {
                                    setSurahs(surahs.filter(s => s.number !== surah.number));
                                  }
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="border border-gold-300 p-4 text-center text-gray-500">
                            No surahs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <hr className="my-8 border-gold-300" />
              
              {/* Original Quran Content Form */}
              <h3 className="text-xl font-heading font-bold text-royal-800 mb-4">Add Ayah Content</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                // Validate form
                const errors = {};
                if (!quranContent.surah) errors.surah = "Surah number is required";
                if (!quranContent.name) errors.name = "Surah name is required";
                if (!quranContent.arabic) errors.arabic = "Arabic text is required";
                if (!quranContent.translation) errors.translation = "Translation is required";
                
                if (Object.keys(errors).length > 0) {
                  setFormErrors(errors);
                  return;
                }
                
                // Submit form
                try {
                  // In a real app, you would call API here
                  console.log("Submitting Quran content:", quranContent);
                  alert("Quran content added successfully!");
                  setQuranContent({ surah: '', name: '', arabic: '', translation: '' });
                  setFormErrors({});
                } catch (error) {
                  console.error("Error adding Quran content:", error);
                  alert("Failed to add Quran content. Please try again.");
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surah Number</label>
                    <input 
                      type="number" 
                      className={`w-full p-2 border ${formErrors.surah ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={quranContent.surah}
                      onChange={(e) => setQuranContent({...quranContent, surah: e.target.value})}
                      placeholder="e.g. 1"
                    />
                    {formErrors.surah && <p className="text-red-500 text-xs mt-1">{formErrors.surah}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surah Name</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={quranContent.name}
                      onChange={(e) => setQuranContent({...quranContent, name: e.target.value})}
                      placeholder="e.g. Al-Fatiha"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arabic Text</label>
                  <textarea 
                    className={`w-full p-2 border ${formErrors.arabic ? 'border-red-500' : 'border-gray-300'} rounded-md arabic-text`}
                    value={quranContent.arabic}
                    onChange={(e) => setQuranContent({...quranContent, arabic: e.target.value})}
                    rows={4}
                    dir="rtl"
                    placeholder="Enter Arabic text here..."
                  />
                  {formErrors.arabic && <p className="text-red-500 text-xs mt-1">{formErrors.arabic}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">English Translation</label>
                  <textarea 
                    className={`w-full p-2 border ${formErrors.translation ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={quranContent.translation}
                    onChange={(e) => setQuranContent({...quranContent, translation: e.target.value})}
                    rows={4}
                    placeholder="Enter English translation here..."
                  />
                  {formErrors.translation && <p className="text-red-500 text-xs mt-1">{formErrors.translation}</p>}
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-royal-600 text-white rounded-md hover:bg-royal-700 transition"
                  >
                    Add Quran Content
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Add Ramadan Arrangement Tab */}
          {activeTab === 'add-arrangement' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-heading font-bold text-royal-800 mb-6">Add Ramadan Arrangement</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                // Validate form
                const errors = {};
                if (!arrangementData.location) errors.location = "Location is required";
                if (!arrangementData.description) errors.description = "Description is required";
                if (!arrangementData.organizer) errors.organizer = "Organizer is required";
                if (!arrangementData.contact) errors.contact = "Contact information is required";
                
                if (Object.keys(errors).length > 0) {
                  setFormErrors(errors);
                  return;
                }
                
                // Submit form
                try {
                  // In a real app, you would call API here
                  console.log("Submitting arrangement:", arrangementData);
                  alert("Arrangement added successfully!");
                  setArrangementData({
                    type: 'Sehri',
                    location: '',
                    description: '',
                    organizer: '',
                    contact: ''
                  });
                  setFormErrors({});
                } catch (error) {
                  console.error("Error adding arrangement:", error);
                  alert("Failed to add arrangement. Please try again.");
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={arrangementData.type}
                    onChange={(e) => setArrangementData({...arrangementData, type: e.target.value})}
                  >
                    <option value="Sehri">Sehri</option>
                    <option value="Iftari">Iftari</option>
                    <option value="Taraweeh">Taraweeh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className={`w-full p-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={arrangementData.location}
                    onChange={(e) => setArrangementData({...arrangementData, location: e.target.value})}
                    placeholder="e.g. Jama Masjid, Delhi"
                  />
                  {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className={`w-full p-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    value={arrangementData.description}
                    onChange={(e) => setArrangementData({...arrangementData, description: e.target.value})}
                    rows={3}
                    placeholder="Describe the arrangement details..."
                  />
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border ${formErrors.organizer ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={arrangementData.organizer}
                      onChange={(e) => setArrangementData({...arrangementData, organizer: e.target.value})}
                      placeholder="e.g. Delhi Muslim Community Center"
                    />
                    {formErrors.organizer && <p className="text-red-500 text-xs mt-1">{formErrors.organizer}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border ${formErrors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      value={arrangementData.contact}
                      onChange={(e) => setArrangementData({...arrangementData, contact: e.target.value})}
                      placeholder="e.g. +91-11-23456789"
                    />
                    {formErrors.contact && <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-royal-600 text-white rounded-md hover:bg-royal-700 transition"
                  >
                    Submit Arrangement
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-heading font-semibold text-royal-800 mb-6">
              User Management
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gold-200 to-amber-200">
                    <th className="border border-gold-400 p-3 text-left text-royal-800">Username</th>
                    <th className="border border-gold-400 p-3 text-left text-royal-800">Email</th>
                    <th className="border border-gold-400 p-3 text-left text-royal-800">Role</th>
                    <th className="border border-gold-400 p-3 text-left text-royal-800">Status</th>
                    <th className="border border-gold-400 p-3 text-left text-royal-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gold-50">
                      <td className="border border-gold-300 p-3">{user.username}</td>
                      <td className="border border-gold-300 p-3">{user.email}</td>
                      <td className="border border-gold-300 p-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-2 py-1 rounded border border-gold-300"
                        >
                          <option value="normal">Normal</option>
                          <option value="arranger">Arranger</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="border border-gold-300 p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="border border-gold-300 p-3">
                        <button
                          onClick={() => handleUserStatusToggle(user.id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            user.isActive
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Arrangements Tab */}
        {activeTab === 'arrangements' && (
          <div>
            <h2 className="text-2xl font-heading font-semibold text-royal-800 mb-6">
              Pending Arrangements ({pendingArrangements.length})
            </h2>
            <div className="space-y-4">
              {pendingArrangements.map(arrangement => (
                <div key={arrangement.id} className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
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
                      <p className="text-gray-700 mb-2">
                        {arrangement.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Organizer:</strong> {arrangement.organizer}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Submitted by:</strong> {arrangement.createdBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApproveArrangement(arrangement.id, true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <i className="fas fa-check mr-2"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveArrangement(arrangement.id, false)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {pendingArrangements.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-check-circle text-6xl text-green-400 mb-4"></i>
                  <h3 className="text-xl font-heading font-semibold text-royal-800 mb-2">
                    No Pending Arrangements
                  </h3>
                  <p className="text-gray-600">
                    All arrangements have been reviewed.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
