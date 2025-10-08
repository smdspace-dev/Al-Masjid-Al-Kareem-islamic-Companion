import React, { useState, useEffect } from 'react';

const ModernHadith = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [hadithList, setHadithList] = useState([]);
  const [randomHadith, setRandomHadith] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('collections');

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
    fetchRandomHadith();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hadith/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHadithByCollection = async (collectionName, page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hadith/collections/${collectionName}/hadith?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setHadithList(data.hadith || []);
        setCurrentPage(page);
        setTotalPages(data.pagination?.total_pages || 1);
        setSelectedCollection(collectionName);
        setActiveTab('hadith');
      }
    } catch (error) {
      console.error('Error fetching hadith:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomHadith = async () => {
    try {
      const response = await fetch('/api/hadith/random');
      if (response.ok) {
        const data = await response.json();
        setRandomHadith(data.hadith);
      }
    } catch (error) {
      console.error('Error fetching random hadith:', error);
    }
  };

  const searchHadith = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/hadith/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setActiveTab('search');
      }
    } catch (error) {
      console.error('Error searching hadith:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHadithCard = (hadith, index) => (
    <div key={hadith.id || index} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">📖</span>
          </div>
          <div>
            <h3 className="text-emerald-400 font-semibold">{hadith.collection}</h3>
            <p className="text-slate-400 text-sm">{hadith.book || 'Book'} • Hadith {hadith.hadith_number}</p>
          </div>
        </div>
        {hadith.grades && hadith.grades.length > 0 && (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full">
            {hadith.grades[0].grade}
          </span>
        )}
      </div>

      {/* Arabic Text */}
      {hadith.arabic && (
        <div className="mb-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/20">
          <p className="text-right text-xl leading-loose text-emerald-100 font-arabic">
            {hadith.arabic}
          </p>
        </div>
      )}

      {/* English Translation */}
      {hadith.english && (
        <div className="mb-4">
          <p className="text-slate-300 leading-relaxed text-lg">
            {hadith.english}
          </p>
        </div>
      )}

      {/* Narrator */}
      {hadith.narrator && (
        <div className="mb-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">Narrator:</span> {hadith.narrator}
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
        {hadith.chapter && (
          <span className="bg-slate-600/30 px-2 py-1 rounded-full">
            Chapter: {hadith.chapter}
          </span>
        )}
        {hadith.topics && hadith.topics.length > 0 && (
          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
            Topics: {hadith.topics.slice(0, 2).join(', ')}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-indigo-800/50 backdrop-blur-xl border-b border-indigo-500/30">
        <div className="px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Hadith Collection
            </h1>
            <p className="text-indigo-300 text-lg">
              Authentic Prophetic Traditions • صحيح الأحاديث النبوية
            </p>
            <div className="flex items-center justify-center mt-4 text-slate-400">
              <span className="text-emerald-400">📚</span>
              <span className="mx-2">Powered by Sunnah.com API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 py-6">
        <div className="flex flex-wrap gap-2 bg-slate-800/50 rounded-2xl p-2 backdrop-blur-xl">
          {[
            { id: 'collections', name: 'Collections', icon: '📚' },
            { id: 'random', name: 'Daily Hadith', icon: '🎲' },
            { id: 'search', name: 'Search', icon: '🔍' },
            { id: 'favorites', name: 'Favorites', icon: '❤️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Hadith Collections</h2>
              <p className="text-slate-400">Choose from authentic hadith collections</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection, index) => (
                  <button
                    key={collection.id || index}
                    onClick={() => fetchHadithByCollection(collection.id || collection.name?.toLowerCase())}
                    className="group bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 text-left"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white text-2xl">📖</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-slate-400 text-sm">{collection.arabic_name}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{collection.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Total Hadith: {collection.total_hadith || 'N/A'}</span>
                      <span className="text-emerald-400">→</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Random Hadith Tab */}
        {activeTab === 'random' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Daily Hadith</h2>
              <p className="text-slate-400">A blessed hadith for spiritual reflection</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {randomHadith ? (
                <div className="bg-gradient-to-br from-emerald-900/30 to-blue-900/30 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/30">
                  {/* Arabic */}
                  <div className="text-center mb-6 p-6 bg-slate-800/30 rounded-2xl">
                    <p className="text-2xl leading-loose text-emerald-100 font-arabic">
                      {randomHadith.arabic}
                    </p>
                  </div>

                  {/* English */}
                  <div className="text-center mb-6">
                    <p className="text-xl text-slate-200 leading-relaxed italic">
                      "{randomHadith.english}"
                    </p>
                  </div>

                  {/* Attribution */}
                  <div className="text-center">
                    <p className="text-emerald-400 font-semibold">
                      — {randomHadith.narrator}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      {randomHadith.reference}
                    </p>
                  </div>

                  {/* Refresh Button */}
                  <div className="text-center mt-6">
                    <button
                      onClick={fetchRandomHadith}
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      🔄 New Hadith
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <button
                    onClick={fetchRandomHadith}
                    className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🎲 Get Daily Hadith
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Search Hadith</h2>
              <p className="text-slate-400">Find specific hadith by keywords</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchHadith()}
                    placeholder="Search hadith by keyword..."
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-slate-400">🔍</span>
                  </div>
                </div>
                <button
                  onClick={searchHadith}
                  disabled={!searchQuery.trim() || loading}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-6">
                  {searchResults.map((hadith, index) => renderHadithCard(hadith, index))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hadith List */}
        {activeTab === 'hadith' && hadithList.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {selectedCollection} Collection
              </h2>
              <button
                onClick={() => setActiveTab('collections')}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                ← Back to Collections
              </button>
            </div>

            <div className="space-y-6">
              {hadithList.map((hadith, index) => renderHadithCard(hadith, index))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => fetchHadithByCollection(selectedCollection, currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchHadithByCollection(selectedCollection, currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernHadith;
