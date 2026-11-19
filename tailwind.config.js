/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finora: {
          primary: '#2563EB',
          primaryDark: '#1d4ed8',
          primaryLight: '#3b82f6',
          darkBlue: '#142C53',
          darkBlueHover: '#0f2242',
          lightBlue: '#EFF6FF',
          green: '#16A34A',
          greenLight: '#DCFCE7',
          red: '#DC2626',
          redLight: '#FEE2E2',
          orange: '#F59E0B',
          orangeLight: '#FEF3C7',
          purple: '#9333EA',
          purpleLight: '#F3E8FF',
          bg: '#F5F7FC',
          textPrimary: '#172554',
          textSecondary: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 44, 83, 0.06), 0 2px 6px -1px rgba(20, 44, 83, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(20, 44, 83, 0.08), 0 4px 10px -2px rgba(20, 44, 83, 0.05)',
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
      }
    },
  },
  plugins: [],
}
