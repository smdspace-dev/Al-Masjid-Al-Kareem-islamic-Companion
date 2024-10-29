/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Islamic Dark Color Palette
        gold: {
          100: '#FFF8E1',
          200: '#FFECB3',
          300: '#FFE082',
          400: '#FFD54F',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FF8F00',
          800: '#FF6F00',
          900: '#E65100'
        },
        burgundy: {
          100: '#F5E6E8',
          200: '#E8BFBF',
          300: '#DB9999',
          400: '#CE7373',
          500: '#A0506D',
          600: '#800020',
          700: '#660019',
          800: '#4D0013',
          900: '#33000C'
        },
        royal: {
          100: '#E6F0FF',
          200: '#B3D1FF',
          300: '#80B3FF',
          400: '#4D94FF',
          500: '#1e3a8a',
          600: '#1a3474',
          700: '#152b61',
          800: '#10224e',
          900: '#0a1a3a'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0d14'
        },
        emerald: {
          100: '#ECFDF5',
          200: '#D1FAE5',
          300: '#A7F3D0',
          400: '#6EE7B7',
          500: '#34D399',
          600: '#10B981',
          700: '#059669',
          800: '#047857',
          900: '#065F46'
        }
      },
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
        'heading': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
        'sans': ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'islamic-pattern': "url('/patterns/islamic-geometric.svg')",
        'ornate-border': "url('/patterns/ornate-border.svg')",
        'golden-texture': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'burgundy-texture': 'linear-gradient(135deg, #800020 0%, #A0506D 100%)',
        'royal-texture': 'linear-gradient(135deg, #1e3a8a 0%, #1a3474 100%)'
      },
      boxShadow: {
        'ornate': '0 8px 32px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'royal': '0 8px 32px rgba(30, 58, 138, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'burgundy': '0 8px 32px rgba(128, 0, 32, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
