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
        darkSidebar: '#080914',
        canvasBg: '#090a16',
        cosmicDark: '#060712',
        cosmicPanel: 'rgba(18, 20, 42, 0.75)',
        cosmicBorder: 'rgba(139, 92, 246, 0.2)',
        accentViolet: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          neon: '#c084fc',
        },
        accentPurple: {
          light: '#c084fc',
          DEFAULT: '#a855f7',
          dark: '#9333ea',
        },
        accentIndigo: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        accentCyan: {
          light: '#67e8f9',
          DEFAULT: '#06b6d4',
          dark: '#0891b2',
        },
        // Backward-compatibility aliases mapped to cosmic electric violet
        accentCoral: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
        accentPink: '#a855f7',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'soft-lg': '0 10px 30px -4px rgba(0, 0, 0, 0.6)',
        'glow-violet': '0 0 25px -2px rgba(139, 92, 246, 0.45)',
        'glow-coral': '0 0 25px -2px rgba(139, 92, 246, 0.45)',
        'glass-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
