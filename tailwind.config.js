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
        // Brand design tokens (strictly mapped to CSS variables)
        'vayu-bg': 'var(--vayu-bg)',
        'vayu-surface': 'var(--vayu-surface)',
        'vayu-surface-elevated': 'var(--vayu-surface-elevated)',
        'vayu-surface-tint': 'var(--vayu-surface-tint)',
        'vayu-primary': 'var(--vayu-primary)',
        'vayu-primary-hover': 'var(--vayu-primary-hover)',
        'vayu-secondary': 'var(--vayu-secondary)',
        'vayu-secondary-hover': 'var(--vayu-secondary-hover)',
        'vayu-accent': 'var(--vayu-accent)',
        'vayu-accent-hover': 'var(--vayu-accent-hover)',
        'vayu-accent-text': 'var(--vayu-accent-text)',
        'vayu-accent-link': 'var(--vayu-accent-link)',
        'vayu-text': 'var(--vayu-text)',
        'vayu-text-secondary': 'var(--vayu-text-secondary)',
        'vayu-border': 'var(--vayu-border)',
        'vayu-border-subtle': 'var(--vayu-border-subtle)',
        'vayu-focus-ring': 'var(--vayu-focus-ring)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
