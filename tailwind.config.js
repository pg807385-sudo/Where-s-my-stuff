/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F7F5EF',
          dark: '#12140F',
        },
        ink: {
          DEFAULT: '#22261F',
          soft: '#4B5245',
          faint: '#8A9080',
        },
        moss: {
          50: '#EEF2EA',
          100: '#DCE6D4',
          200: '#B9CDA9',
          300: '#96B47F',
          400: '#749957',
          500: '#4E6B4E',
          600: '#3F5940',
          700: '#334732',
          800: '#283725',
          900: '#1D2819',
        },
        amber: {
          50: '#FBF3E3',
          100: '#F5E3BC',
          200: '#ECCB84',
          300: '#E3B454',
          400: '#D99A3D',
          500: '#C08328',
          600: '#976420',
        },
        clay: {
          400: '#D2775C',
          500: '#C4552F',
          600: '#A6432A',
        },
        card: {
          dark: '#1B1E16',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        tag: '0 1px 2px rgba(34,38,31,0.06), 0 6px 16px -6px rgba(34,38,31,0.12)',
        tagHover: '0 2px 4px rgba(34,38,31,0.08), 0 14px 28px -10px rgba(34,38,31,0.18)',
        pop: '0 20px 50px -12px rgba(34,38,31,0.35)',
      },
      borderRadius: {
        tag: '18px',
      },
      keyframes: {
        'toast-in': {
          '0%': { transform: 'translateY(12px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.96) translateY(8px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'sheet-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.28s cubic-bezier(0.16,1,0.3,1)',
        'pop-in': 'pop-in 0.22s cubic-bezier(0.16,1,0.3,1)',
        'sheet-in': 'sheet-in 0.3s cubic-bezier(0.16,1,0.3,1)',
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
