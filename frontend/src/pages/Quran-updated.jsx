import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Quran = () => {
  const [loading, setLoading] = useState(true);
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [verses, setVerses] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(7); // Default to Mishari al-Afasy
  const [juzs, setJuzs] = useState([]);
  const [error, setError] = useState(null);

  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

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
        setError('Failed to load reciters');
      }
    };

    fetchReciters();
  }, []);

  // Fetch juzs list
  useEffect(() => {
    const fetchJuzs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quran/juzs');
        const data = await response.json();
        setJuzs(data.juzs || []);
      } catch (error) {
        console.error('Error fetching juzs:', error);
        // Create fallback juzs
        const fallbackJuzs = [];
        for (let i = 1; i <= 30; i++) {
          fallbackJuzs.push({ id: i, juz_number: i });
        }
        setJuzs(fallbackJuzs);
      }
    };

    fetchJuzs();
  }, []);

  // Fetch verses for selected juz
  useEffect(() => {
    const fetchJuzVerses = async () => {
      if (!selectedJuz) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/quran/verses/by_juz/${selectedJuz}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setVerses([]);
        } else {
          setVerses(data.verses || []);
        }
      } catch (error) {
        console.error('Error fetching verses:', error);
        setError('Failed to load verses for this juz');
        setVerses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJuzVerses();
  }, [selectedJuz]);

  // Play chapter audio
  const playChapterAudio = async (chapterId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quran/chapters/${chapterId}/audio_files?reciter_id=${selectedReciter}`);
      const data = await response.json();
      
      if (data.audio_file && data.audio_file.audio_url) {
        const track = {
          audioUrl: data.audio_file.audio_url,
          chapterId: chapterId,
          title: `Chapter ${chapterId}`,
          reciterName: reciters.find(r => r.id === selectedReciter)?.name || 'Unknown Reciter'
        };
        
        await playTrack(track);
      } else {
        throw new Error('Audio URL not found');
      }
    } catch (error) {
      console.error('Error playing chapter audio:', error);
      alert('Failed to load audio for this chapter. Please try again.');
    }
  };

  // Play verse audio
  const playVerseAudio = async (verseKey) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quran/verses/${verseKey}/audio?reciter_id=${selectedReciter}`);
      const data = await response.json();
      
      if (data.audio_files && data.audio_files.length > 0) {
        const audioFile = data.audio_files[0];
        const track = {
          audioUrl: audioFile.url,
          verseKey: verseKey,
          title: `Verse ${verseKey}`,
          reciterName: reciters.find(r => r.id === selectedReciter)?.name || 'Unknown Reciter'
        };
        
        await playTrack(track);
      } else {
        throw new Error('Audio URL not found');
      }
    } catch (error) {
      console.error('Error playing verse audio:', error);
      alert('Failed to load audio for this verse. Please try again.');
    }
  };

  // Group verses by chapter
  const groupedVerses = verses.reduce((acc, verse) => {
    const chapterId = verse.chapter_id;
    if (!acc[chapterId]) {
      acc[chapterId] = {
        id: chapterId,
        name_simple: verse.chapter?.name_simple || `Chapter ${chapterId}`,
        name_arabic: verse.chapter?.name_arabic || '',
        verses: []
      };
    }
    acc[chapterId].verses.push(verse);
    return acc;
  }, {});

  if (loading && selectedJuz === 1) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">القرآن الكريم</h1>

        {/* Juz Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Juz (Para)</h2>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <button
                key={juz}
                onClick={() => setSelectedJuz(juz)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedJuz === juz
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {juz}
              </button>
            ))}
          </div>
        </div>

        {/* Reciter Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Reciter</h2>
          <select
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white w-full md:w-auto"
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
            <p className="text-red-300 text-sm mt-2">
              Note: This is using the real Quran.com API. Some endpoints may be rate-limited or temporarily unavailable.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4">Loading Juz {selectedJuz}...</p>
          </div>
        )}

        {/* Verses Display */}
        {!loading && Object.keys(groupedVerses).length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-400">No verses available for Juz {selectedJuz}.</p>
            <p className="text-sm text-gray-500 mt-2">
              This may be due to API limitations or rate limiting.
            </p>
          </div>
        )}

        {/* Grouped by Chapter */}
        {Object.values(groupedVerses).map((chapter) => (
          <div key={chapter.id} className="mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-green-400">
                    {chapter.name_simple} ({chapter.name_arabic})
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {chapter.verses.length} verses in this juz
                  </p>
                </div>
                <button
                  onClick={() => playChapterAudio(chapter.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentTrack?.chapterId === chapter.id && isPlaying
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {currentTrack?.chapterId === chapter.id && isPlaying 
                    ? '⏹️ Playing...' 
                    : '▶️ Play Chapter'
                  }
                </button>
              </div>
            </div>

            {/* Verses */}
            <div className="space-y-4">
              {chapter.verses.map((verse) => (
                <div key={verse.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm text-green-400">
                        Verse {verse.verse_number}
                      </span>
                      <span className="text-sm text-gray-400 ml-2">
                        {verse.verse_key}
                      </span>
                    </div>
                    <button
                      onClick={() => playVerseAudio(verse.verse_key)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        currentTrack?.verseKey === verse.verse_key && isPlaying
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {currentTrack?.verseKey === verse.verse_key && isPlaying 
                        ? '⏹️ Playing' 
                        : '▶️ Play Verse'
                      }
                    </button>
                  </div>

                  <div className="text-right mb-4">
                    <p className="text-2xl leading-relaxed text-yellow-300 font-arabic">
                      {verse.text_uthmani || verse.text_indopak || 'Arabic text not available'}
                    </p>
                  </div>

                  {verse.translations && verse.translations.length > 0 && (
                    <div className="text-left">
                      <p className="text-lg text-gray-200 leading-relaxed">
                        {verse.translations[0].text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quran;
