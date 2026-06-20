/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#07111F',
          dark: '#020617',
          light: '#0c1a30',
          card: 'rgba(7, 17, 31, 0.65)'
        },
        glow: {
          cyan: '#00E5FF',
          purple: '#7C3AED',
          pink: '#FF4D8D',
          emerald: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
