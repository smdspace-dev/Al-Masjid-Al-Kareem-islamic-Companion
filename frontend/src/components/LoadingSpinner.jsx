import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-3"></div>
        <p className="text-gold-400 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
