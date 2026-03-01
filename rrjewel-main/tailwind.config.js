/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium Luxury Dark Backgrounds
        'luxury-dark': '#0A0E27',        // Deep Navy-Black
        'luxury-secondary': '#111B3D',   // Rich Deep Blue
        'luxury-tertiary': '#0F1428',    // Midnight Blue
        
        // Jewel Tone Accents (Eye-catching Premium)
        'emerald-luxury': '#0F7938',     // Deep Emerald
        'sapphire-luxury': '#0F3A7D',    // Rich Sapphire
        'ruby-luxury': '#8B1538',        // Deep Ruby Red
        'amethyst-luxury': '#3D1552',    // Royal Amethyst
        
        // Premium Gold & Platinum
        'gold-primary': '#FFD700',       // Brilliant Gold
        'gold-soft': '#F5D547',          // Warm Gold
        'gold-highlight': '#FFED4E',     // Bright Gold Highlight
        'platinum': '#E8E8E8',           // Platinum White
        'rose-gold': '#B76E79',          // Rose Gold Accent
        
        // Premium Text Colors
        'text-primary': '#FFFFFF',       // Pure White on dark
        'text-muted': '#C0C0C0',         // Silver-Muted
        'text-accent': '#FFD700',        // Gold Text
        
        // Glass & Overlay
        'glass-light': 'rgba(255, 255, 255, 0.05)',
        'glass-dark': 'rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        'serif': ['Georgia', 'Garamond', 'serif'],
        'sans': ['Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 30px rgba(255, 215, 0, 0.4)',
        'glow-lg': '0 0 60px rgba(255, 215, 0, 0.3)',
        'glow-ruby': '0 0 40px rgba(139, 21, 56, 0.3)',
        'glow-emerald': '0 0 40px rgba(15, 121, 56, 0.3)',
        'glow-sapphire': '0 0 40px rgba(15, 58, 125, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 215, 0, 0.15)',
        'premium': '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.2)',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(255, 215, 0, 0.8)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%': { backgroundPosition: '-200% center' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};