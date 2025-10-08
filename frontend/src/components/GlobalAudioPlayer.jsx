import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const GlobalAudioPlayer = () => {
  const {
    isPlaying,
    currentTrack,
    duration,
    currentTime,
    volume,
    pauseTrack,
    resumeTrack,
    stopTrack,
    seekTo,
    changeVolume
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border-t border-indigo-500/30 shadow-lg z-50">
      {/* Compact Player */}
      <div className="relative p-3 bg-gradient-to-br from-slate-900/90 via-indigo-900/90 to-slate-900/90 backdrop-blur-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {/* Audio Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🕌</span>
              {isPlaying && (
                <div className="absolute w-8 h-8 border border-emerald-400 rounded-lg animate-ping opacity-40"></div>
              )}
            </div>
            
            {/* Track Info */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {currentTrack.title || `Surah ${currentTrack.chapterId}`}
              </h3>
              <p className="text-xs text-emerald-300">
                {currentTrack.reciterName || 'Quran Recitation'}
              </p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={stopTrack}
            className="w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            title="Stop"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div 
            className="w-full h-1.5 bg-slate-700 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? pauseTrack : resumeTrack}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          >
            <span>{isPlaying ? '⏸️' : '▶️'}</span>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Volume */}
          <div className="flex items-center space-x-2 bg-slate-800/50 px-2 py-1 rounded-lg">
            <span className="text-xs">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-slate-600 rounded appearance-none cursor-pointer"
            />
            <span className="text-xs text-slate-400 w-6">{Math.round(volume * 100)}%</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default GlobalAudioPlayer;
