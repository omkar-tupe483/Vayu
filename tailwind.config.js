/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vayu: {
          bg: 'var(--vayu-bg)',
          surface: 'var(--vayu-surface)',
          'surface-tint': 'var(--vayu-surface-tint)',
          'surface-elevated': 'var(--vayu-surface-elevated)',
          primary: 'var(--vayu-primary)',
          secondary: 'var(--vayu-secondary)',
          accent: 'var(--vayu-accent)',
          'accent-link': 'var(--vayu-accent-link)',
          text: 'var(--vayu-text)',
          'text-secondary': 'var(--vayu-text-secondary)',
          border: 'var(--vayu-border)',
          'border-subtle': 'var(--vayu-border-subtle)',
          'focus-ring': 'var(--vayu-focus-ring)',
          'btn-text': 'var(--vayu-btn-text)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

