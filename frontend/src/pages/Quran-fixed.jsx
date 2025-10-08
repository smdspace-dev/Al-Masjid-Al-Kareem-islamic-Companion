import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Quran = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPara, setSelectedPara] = useState(1);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahs, setSurahs] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(7);
  const [error, setError] = useState(null);

  const { playTrack, currentTrack, isPlaying, stopTrack } = useAudioPlayer();

  // Fetch reciters on component mount
  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quran/reciters');
        const data = await response.json();
        setReciters(data.reciters || []);
        if (data.reciters && data.reciters.length > 0) {
          setSelectedReciter(data.reciters[0].id);
        }
      } catch (error) {
        console.error('Error fetching reciters:', error);
        // Fallback reciters
        setReciters([
          { id: 7, name: 'Mishari Rashid al-Afasy' },
          { id: 1, name: 'Abdul Basit Abdul Samad' },
          { id: 3, name: 'Abdur-Rahman as-Sudais' },
          { id: 5, name: 'Sa`ud ash-Shuraym' },
          { id: 6, name: 'Ahmed ibn Ali al-Ajamy' }
        ]);
        setSelectedReciter(7);
      }
    };

    fetchReciters();
  }, []);

  // Fetch surahs for selected para
  useEffect(() => {
    const fetchParaSurahs = async () => {
      if (!selectedPara) return;
      
      setLoading(true);
      setError(null);
      setSurahs([]);
      setSelectedSurah(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/quran/para/${selectedPara}/surahs`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setSurahs([]);
        } else {
          setSurahs(data.surahs || []);
          // Auto-select first surah
          if (data.surahs && data.surahs.length > 0) {
            setSelectedSurah(data.surahs[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching para surahs:', error);
        setError('Failed to load surahs for this para');
        // Fallback data for Para 1
        if (selectedPara === 1) {
          const fallbackSurahs = [
            { id: 1, name_simple: 'Al-Fatiha', name_arabic: 'الفاتحة', verses_count: 7 },
            { id: 2, name_simple: 'Al-Baqarah', name_arabic: 'البقرة', verses_count: 286 }
          ];
          setSurahs(fallbackSurahs);
          setSelectedSurah(fallbackSurahs[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParaSurahs();
  }, [selectedPara]);

  // Play surah audio
  const playSurahAudio = async () => {
    if (!selectedSurah) {
      alert('Please select a surah first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/quran/chapter/${selectedSurah.id}/audio?reciter_id=${selectedReciter}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.audio_file && data.audio_file.audio_url) {
        const track = {
          audioUrl: data.audio_file.audio_url,
          chapterId: selectedSurah.id,
          title: `${selectedSurah.name_simple} (${selectedSurah.name_arabic})`,
          reciterName: reciters.find(r => r.id === selectedReciter)?.name || 'Unknown Reciter',
          fallbackUrls: data.audio_file.fallback_urls || []
        };
        
        await playTrack(track);
      } else {
        throw new Error('Audio URL not found in response');
      }
    } catch (error) {
      console.error('Error playing surah audio:', error);
      setError(`Failed to load audio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if current track is playing this surah
  const isCurrentSurahPlaying = currentTrack && currentTrack.chapterId === selectedSurah?.id && isPlaying;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">القرآن الكريم</h1>

        {/* Para Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Para (Juz)</h2>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((para) => (
              <button
                key={para}
                onClick={() => setSelectedPara(para)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedPara === para
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {para}
              </button>
            ))}
          </div>
        </div>

        {/* Reciter Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 2: Select Reciter</h2>
          <select
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white w-full md:w-auto min-w-64"
          >
            {reciters.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-300 text-sm mt-2 underline hover:text-red-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4">Loading surahs for Para {selectedPara}...</p>
          </div>
        )}

        {/* Surah Selection */}
        {!loading && surahs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Step 3: Select Surah from Para {selectedPara}</h2>
            <div className="grid gap-4">
              {surahs.map((surah) => (
                <div
                  key={surah.id}
                  onClick={() => setSelectedSurah(surah)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedSurah?.id === surah.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {surah.name_simple} ({surah.name_arabic})
                      </h3>
                      <p className="text-sm opacity-75">
                        Surah {surah.id} • {surah.verses_count} verses
                      </p>
                    </div>
                    {selectedSurah?.id === surah.id && (
                      <div className="text-blue-300">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Play Button */}
        {selectedSurah && (
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Step 4: Play Recitation</h2>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-400">
                  Ready to Play: {selectedSurah.name_simple} ({selectedSurah.name_arabic})
                </h3>
                <p className="text-gray-400">
                  Reciter: {reciters.find(r => r.id === selectedReciter)?.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {selectedSurah.verses_count} verses
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                {!isCurrentSurahPlaying ? (
                  <button
                    onClick={playSurahAudio}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors text-lg font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        ▶️ Play Recitation
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={stopTrack}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors text-lg font-semibold"
                  >
                    ⏹️ Stop Playing
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Surahs Message */}
        {!loading && surahs.length === 0 && selectedPara && (
          <div className="text-center py-8">
            <p className="text-gray-400">No surahs available for Para {selectedPara}.</p>
            <p className="text-sm text-gray-500 mt-2">
              This may be due to API limitations. Please try another para.
            </p>
          </div>
        )}

        {/* Currently Playing Indicator */}
        {currentTrack && (
          <div className="fixed bottom-32 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-white">{currentTrack.title}</p>
                <p className="text-xs text-gray-400">{currentTrack.reciterName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quran;
