/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vayu: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        aqi: {
          good: '#10b981',
          moderate: '#f59e0b',
          unhealthySensitive: '#f97316',
          unhealthy: '#ef4444',
          veryUnhealthy: '#8b5cf6',
          hazardous: '#7f1d1d',
        }
      },
    },
  },
  plugins: [],
};
