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
        finora: {
          primary: 'rgb(var(--finora-primary) / <alpha-value>)',
          primaryDark: 'rgb(var(--finora-primary-dark) / <alpha-value>)',
          primaryLight: 'rgb(var(--finora-primary-light) / <alpha-value>)',
          darkBlue: 'rgb(var(--finora-dark-blue) / <alpha-value>)',
          darkBlueHover: 'rgb(var(--finora-dark-blue-hover) / <alpha-value>)',
          lightBlue: 'rgb(var(--finora-light-blue) / <alpha-value>)',
          green: 'rgb(var(--finora-green) / <alpha-value>)',
          greenLight: 'rgb(var(--finora-green-light) / <alpha-value>)',
          red: 'rgb(var(--finora-red) / <alpha-value>)',
          redLight: 'rgb(var(--finora-red-light) / <alpha-value>)',
          orange: 'rgb(var(--finora-orange) / <alpha-value>)',
          orangeLight: 'rgb(var(--finora-orange-light) / <alpha-value>)',
          purple: 'rgb(var(--finora-purple) / <alpha-value>)',
          purpleLight: 'rgb(var(--finora-purple-light) / <alpha-value>)',
          bg: 'rgb(var(--finora-bg) / <alpha-value>)',
          bgSecondary: 'rgb(var(--finora-bg-secondary) / <alpha-value>)',
          bgTeritary: 'rgb(var(--finora-bg-tertiary) / <alpha-value>)',
          textPrimary: 'rgb(var(--finora-text-primary) / <alpha-value>)',
          textSecondary: 'rgb(var(--finora-text-secondary) / <alpha-value>)',
          textMuted: 'rgb(var(--finora-text-muted) / <alpha-value>)',
          border: 'rgb(var(--finora-border) / <alpha-value>)',
          borderStrong: 'rgb(var(--finora-border-strong) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': 'var(--finora-shadow-soft)',
        'soft-lg': 'var(--finora-shadow-soft-lg)',
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      }
    },
  },
  plugins: [],
}
