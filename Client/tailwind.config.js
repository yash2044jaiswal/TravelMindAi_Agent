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
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cdd9fe',
          300: '#a4befc',
          400: '#759af8',
          500: '#4f73f2',
          600: '#3a52e6',
          700: '#2f3fd2',
          800: '#2a35ab',
          900: '#273287',
        },
        dark: {
          900: '#0a0a0f',
          800: '#111118',
          700: '#1a1a24',
          600: '#22222e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        aurora: {
          '0%': { transform: 'translateX(0%) translateY(0%)' },
          '100%': { transform: 'translateX(-50%) translateY(-50%)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}