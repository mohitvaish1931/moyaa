/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Rakhi Collection Theme
        'luxury-dark': '#F7EFE6',        // Updated to off-white so most sections are white
        'luxury-secondary': '#F7EFE6',
        'luxury-tertiary': '#F7EFE6',
        'bg-primary': '#F7EFE6',         // Beige/Off-white Background
        
        // Brand Accents
        'primary-red': '#846A4A',        // Changed red to dark brown to override old red text
        'gold-primary': '#BA9444',       // Less yellow, more metallic gold
        'accent-gold': '#BA9444',        
        'emerald-luxury': '#0E2822',
        
        // Text Colors
        'text-primary': '#846A4A',       // Main Heading/Text Color
        'text-secondary': '#684F38',     // Secondary Brown
        'text-muted': '#846A4A',
        'text-accent': '#D4AF37',        
        'platinum': '#F7EFE6',           
        
        // Glass & Overlay
        'glass-light': 'rgba(247, 239, 230, 0.8)',
        'glass-dark': 'rgba(14, 40, 34, 0.8)',
      },

      fontFamily: {
        'serif': ['"Playfair Display"', 'serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(212, 175, 55, 0.35)',
        'glow-lg': '0 0 60px rgba(212, 175, 55, 0.25)',
        'inner-glow': 'inset 0 0 20px rgba(212, 175, 55, 0.2)',
        'premium': '0 20px 50px rgba(14, 40, 34, 0.1), 0 0 40px rgba(212, 175, 55, 0.15)',
      },

      backdropFilter: {
        'glass': 'backdrop-filter blur(20px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'scroll': 'scroll 100s linear infinite',
        'scroll-slow': 'scroll 180s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(212, 175, 55, 0.8)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%': { backgroundPosition: '-200% center' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};