/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002548',
          container: '#173B63',
        },
        secondary: {
          DEFAULT: '#0058BE',
          container: '#2170E4',
        },
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          'container-low': '#EFF4FF',
          container: '#E5EEFF',
          'container-high': '#DCE9FF',
        },
        'text-primary': '#0F172A',
        'text-muted': '#64748B',
        'border-subtle': '#E2E8F0',
        success: {
          DEFAULT: '#16A34A',
          surface: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#F59E0B',
          surface: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#DC2626',
          surface: '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
