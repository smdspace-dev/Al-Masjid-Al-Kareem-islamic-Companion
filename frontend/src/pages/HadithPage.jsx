import React, { useState, useEffect } from 'react';

const HadithPage = () => {
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
      const response = await fetch('http://127.0.0.1:5000/api/hadith/collections');
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
      console.log('Fetching hadith for collection:', collectionName, 'page:', page);
      
      const response = await fetch(`http://127.0.0.1:5000/api/hadith/collections/${collectionName}/hadith?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        console.log('Hadith response:', data);
        
        setHadithList(data.hadith || []);
        setCurrentPage(page);
        // Calculate total pages based on collection size
        const totalHadith = data.total || 500; // Fallback to 500
        setTotalPages(Math.ceil(totalHadith / 10));
        setSelectedCollection(collectionName);
        setActiveTab('hadith');
      } else {
        console.error('Failed to fetch hadith:', response.status);
      }
    } catch (error) {
      console.error('Error fetching hadith:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomHadith = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/hadith/random');
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
      setActiveTab('search');
      
      // Use search within selected collection or general search
      const url = selectedCollection 
        ? `http://127.0.0.1:5000/api/hadith/collections/${selectedCollection}/hadith?search=${encodeURIComponent(searchQuery)}&limit=20`
        : `http://127.0.0.1:5000/api/hadith/random`; // Fallback to random for demo
        
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.hadith ? [data.hadith] : data.results || []);
      }
    } catch (error) {
      console.error('Error searching hadith:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && selectedCollection) {
      fetchHadithByCollection(selectedCollection, currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && selectedCollection) {
      fetchHadithByCollection(selectedCollection, currentPage - 1);
    }
  };

  const renderHadithCard = (hadith, index) => (
    <div key={hadith.id || index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📚</span>
          </div>
          <div>
            <h3 className="text-emerald-400 font-bold text-lg">{hadith.collection || 'Hadith Collection'}</h3>
            <p className="text-white/60 text-sm">{hadith.book || 'Book'} • Hadith {hadith.hadith_number || index + 1}</p>
          </div>
        </div>
        {hadith.grade && (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">
            {hadith.grade}
          </span>
        )}
      </div>

      {/* Arabic Text */}
      {hadith.arabic && (
        <div className="mb-4 p-4 bg-black/20 rounded-lg border border-emerald-500/20">
          <p className="text-right text-xl leading-relaxed text-white font-arabic">
            {hadith.arabic}
          </p>
        </div>
      )}

      {/* English Translation */}
      <div className="mb-4">
        <p className="text-white/90 leading-relaxed text-base">
          {hadith.english || hadith.text || 'Hadith text not available'}
        </p>
      </div>

      {/* Narrator */}
      {hadith.narrator && (
        <div className="text-sm text-emerald-400 font-medium">
          <span className="opacity-75">Narrated by:</span> {hadith.narrator}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 Hadith Collections</h1>
          <p className="text-white/70 text-lg">Authentic sayings and teachings of Prophet Muhammad (PBUH)</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchHadith()}
              placeholder="Search hadith by keyword..."
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none transition-colors"
            />
            <button
              onClick={searchHadith}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'collections' 
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            📖 Collections
          </button>
          <button
            onClick={() => setActiveTab('random')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'random' 
                ? 'bg-emerald-500 text-white shadow-lg' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            🎲 Random Hadith
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'search' 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🔍 Search Results
            </button>
          )}
          {selectedCollection && (
            <button
              onClick={() => setActiveTab('hadith')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'hadith' 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              📚 {selectedCollection}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {/* Collections Grid */}
          {activeTab === 'collections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, index) => (
                <div
                  key={collection.id || index}
                  onClick={() => fetchHadithByCollection(collection.id)}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl">📖</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-white/60 text-sm">{collection.total_hadith} Hadith</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{collection.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Random Hadith */}
          {activeTab === 'random' && randomHadith && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={fetchRandomHadith}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  🎲 Get New Random Hadith
                </button>
              </div>
              {renderHadithCard(randomHadith, 0)}
            </div>
          )}

          {/* Search Results */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Search Results for "{searchQuery}"</h2>
              {searchResults.length > 0 ? (
                searchResults.map((hadith, index) => renderHadithCard(hadith, index))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-white/60 text-lg">No results found. Try a different search term.</p>
                </div>
              )}
            </div>
          )}

          {/* Hadith List with Pagination */}
          {activeTab === 'hadith' && selectedCollection && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  📚 {collections.find(c => c.id === selectedCollection)?.name || selectedCollection} Collection
                </h2>
                <button
                  onClick={() => setActiveTab('collections')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  ← Back to Collections
                </button>
              </div>

              <div className="space-y-6">
                {hadithList.map((hadith, index) => renderHadithCard(hadith, index))}
              </div>

              {/* Pagination Controls */}
              {hadithList.length > 0 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 border border-white/20"
                  >
                    ← Previous
                  </button>
                  <span className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 border border-white/20"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-emerald-400 text-2xl">📚</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HadithPage;
