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
        darkSidebar: '#0f172a',
        canvasBg: '#f8fafc',
        accentCoral: {
          light: '#fb7185',
          DEFAULT: '#f43f5e',
          dark: '#e11d48',
        },
        accentPink: '#ec4899',
        accentPurple: '#8b5cf6',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.07)',
        'glow-coral': '0 8px 25px -4px rgba(244, 63, 94, 0.35)',
      }
    },
  },
  plugins: [],
}
