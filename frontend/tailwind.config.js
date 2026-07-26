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
        brand: {
          dark: '#050B14',      // Deep premium dark background
          card: '#0D1527',      // Slightly lighter card background
          border: '#1E293B',    // Slate border
          yellow: '#FACC15',    // Premium Yellow Accent (yellow-400)
          yellowHover: '#EAB308', // Darker yellow hover (yellow-500)
          muted: '#94A3B8',     // Slate-400 muted text
          text: '#F8FAFC',      // Slate-50 bright text
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 30px rgb(0, 0, 0, 0.4)',
        'premium-glow': '0 0 20px rgba(250, 204, 21, 0.15)',
        'glow-yellow': '0 0 15px rgba(250, 204, 21, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
