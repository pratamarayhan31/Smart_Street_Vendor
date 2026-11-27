/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet Utama: Merah, Putih, Biru Muda
        primary: {
          DEFAULT: '#C62828', // Merah Utama
          hover: '#B71C1C',
          container: '#991B1B', // Merah gelap untuk sidebar / aksen tegas
          light: '#E04444',
        },
        secondary: {
          DEFAULT: '#C62828', // Aksi penekanan
          hover: '#B71C1C',
          container: '#DCEEFF', // Biru Muda untuk container & highlight
        },
        brand: {
          red: '#C62828',
          'red-hover': '#B71C1C',
          'red-secondary': '#E04444',
          white: '#FFFFFF',
          'blue-light': '#DCEEFF',
          'blue-subtle': '#F2F8FF',
          dark: '#263445',
        },
        background: '#F7F9FC', // Background Utama
        surface: {
          DEFAULT: '#FFFFFF', // Putih Dominan
          'container-low': '#F2F8FF', // Biru Sangat Muda
          container: '#DCEEFF', // Biru Muda
          'container-high': '#C8E3FD',
        },
        'text-primary': '#263445', // Teks Utama Abu Gelap
        'text-muted': '#718096', // Teks Sekunder
        'border-subtle': '#E3EAF2', // Border Lembut
        success: {
          DEFAULT: '#16A34A',
          surface: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#D97706',
          surface: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#C62828',
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
      boxShadow: {
        'soft': '0 2px 10px rgba(38, 52, 69, 0.05)',
        'card': '0 4px 16px rgba(38, 52, 69, 0.06)',
      },
    },
  },
  plugins: [],
};
