/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070a12',
          900: '#0b0f1a',
          850: '#0e1320',
          800: '#121829',
          750: '#161d33',
          700: '#1b243d',
          600: '#243056',
          500: '#33426b',
          400: '#4a5a87',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(34,211,238,0.18), 0 0 24px -6px rgba(34,211,238,0.45)',
        'glow-danger': '0 0 0 1px rgba(239,68,68,0.20), 0 0 24px -6px rgba(239,68,68,0.50)',
        'glow-success': '0 0 0 1px rgba(34,197,94,0.20), 0 0 24px -6px rgba(34,197,94,0.45)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
      },
      animation: {
        scanline: 'scanline 1.8s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-out both',
        blink: 'blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
