import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const Quran = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPara, setSelectedPara] = useState(1);
  const [ayahs, setAyahs] = useState([]);
  const [imams, setImams] = useState([]);
  const [selectedImam, setSelectedImam] = useState('ar.alafasy');
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const audioRef = useRef(null);

  // Create para numbers 1-30
  const paraNumbers = [...Array(30)].map((_, i) => i + 1);

  // Fetch imams on component mount
  useEffect(() => {
    const fetchImams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quran/imams');
        const data = await response.json();
        setImams(data.imams || []);
        if (data.imams && data.imams.length > 0) {
          setSelectedImam(data.imams[0].recitation_id);
        }
      } catch (error) {
        console.error('Error fetching imams:', error);
        // Fallback imams
        setImams([
          { id: 1, name: 'Mishari Rashid al-Afasy', recitation_id: 'ar.alafasy' },
          { id: 2, name: 'Abdul Basit Abdul Samad', recitation_id: 'ar.abdulbasitmurattal' },
          { id: 3, name: 'Ahmed Al Ajmi', recitation_id: 'ar.ahmedajamy' },
        ]);
        setSelectedImam('ar.alafasy');
      }
    };

    fetchImams();
  }, []);

  // Fetch ayahs for selected para
  useEffect(() => {
    const fetchParaAyahs = async () => {
      if (!selectedPara) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/quran/para/${selectedPara}`);
        const data = await response.json();
        setAyahs(data.ayahs || []);
      } catch (error) {
        console.error('Error fetching para ayahs:', error);
        // Fallback data for para 1
        if (selectedPara === 1) {
          setAyahs([
            {
              id: 1,
              surah_id: 1,
              surah_name_arabic: 'الفاتحة',
              surah_name_english: 'Al-Fatiha',
              number_in_surah: 1,
              text_arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              text_translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
              verse_key: '1:1'
            },
            {
              id: 2,
              surah_id: 1,
              surah_name_arabic: 'الفاتحة',
              surah_name_english: 'Al-Fatiha',
              number_in_surah: 2,
              text_arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
              text_translation: 'All praise is due to Allah, Lord of the worlds.',
              verse_key: '1:2'
            }
          ]);
        } else {
          setAyahs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchParaAyahs();
  }, [selectedPara]);

  // Play audio for a surah
  const playAudio = (surahId) => {
    try {
      // Stop current audio if playing
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }

      // Create audio URL
      const audioUrl = `https://server8.mp3quran.net/${selectedImam}/${String(surahId).padStart(3, '0')}.mp3`;
      
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      setCurrentPlaying(surahId);

      audio.play().then(() => {
        console.log('Audio started playing');
      }).catch(error => {
        console.error('Audio play error:', error);
        // Try alternative URL format
        const altUrl = `https://server10.mp3quran.net/ajm/${String(surahId).padStart(3, '0')}.mp3`;
        audio.src = altUrl;
        audio.play().catch(err => {
          console.error('Alternative audio also failed:', err);
          setCurrentPlaying(null);
          setAudioElement(null);
        });
      });

      audio.onended = () => {
        setCurrentPlaying(null);
        setAudioElement(null);
      };

      audio.onerror = () => {
        console.error('Audio loading error');
        setCurrentPlaying(null);
        setAudioElement(null);
      };

    } catch (error) {
      console.error('Play audio error:', error);
      setCurrentPlaying(null);
    }
  };

  // Stop audio
  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(null);
    }
    setCurrentPlaying(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">القرآن الكريم</h1>

        {/* Para Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Para (Juz)</h2>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {paraNumbers.map((para) => (
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

        {/* Imam Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Reciter</h2>
          <select
            value={selectedImam}
            onChange={(e) => setSelectedImam(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white w-full md:w-auto"
          >
            {imams.map((imam) => (
              <option key={imam.id} value={imam.recitation_id}>
                {imam.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ayahs Display */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">
            Para {selectedPara} - Ayahs ({ayahs.length} verses)
          </h2>

          {ayahs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No ayahs available for this para yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                This is a demo version. More para data will be added soon.
              </p>
            </div>
          ) : (
            ayahs.map((ayah) => (
              <div key={ayah.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm text-green-400">
                      {ayah.surah_name_english} ({ayah.surah_name_arabic})
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      Verse {ayah.number_in_surah}
                    </span>
                  </div>
                  <button
                    onClick={() => 
                      currentPlaying === ayah.surah_id 
                        ? stopAudio() 
                        : playAudio(ayah.surah_id)
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPlaying === ayah.surah_id
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {currentPlaying === ayah.surah_id ? '⏹️ Stop' : '▶️ Play Surah'}
                  </button>
                </div>

                <div className="text-right mb-4">
                  <p className="text-2xl leading-relaxed text-yellow-300 font-arabic">
                    {ayah.text_arabic}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-lg text-gray-200 leading-relaxed">
                    {ayah.text_translation}
                  </p>
                </div>

                <div className="text-right mt-2">
                  <span className="text-sm text-gray-400">
                    {ayah.verse_key}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Audio Player Status */}
        {currentPlaying && (
          <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Playing Surah {currentPlaying}</span>
              <button
                onClick={stopAudio}
                className="text-red-400 hover:text-red-300"
              >
                ⏹️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quran;
