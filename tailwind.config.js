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
        'apex-obsidian': '#0b0f19',
        'apex-card': {
          DEFAULT: '#111827',
          light: '#1e293b',
          dark: '#0e1320',
          hover: '#1a2234',
        },
        'apex-border': {
          DEFAULT: '#1f293d',
          light: '#334155',
          subtle: '#162032',
        },
        'apex-emerald': {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#34d399',
          glow: 'rgba(16, 185, 129, 0.2)',
        },
        'apex-amber': {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          light: '#fbbf24',
          glow: 'rgba(245, 158, 11, 0.2)',
        },
        'apex-navy': {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#60a5fa',
          glow: 'rgba(59, 130, 246, 0.2)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'bloomberg-glow-emerald': '0 0 15px rgba(16, 185, 129, 0.35)',
        'bloomberg-glow-amber': '0 0 15px rgba(245, 158, 11, 0.35)',
        'bloomberg-glow-navy': '0 0 15px rgba(59, 130, 246, 0.35)',
      },
    },
  },
  plugins: [],
};
