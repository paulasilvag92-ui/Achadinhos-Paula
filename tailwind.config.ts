import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          dark: '#E85D2C',
          light: '#FF8C5A',
        },
        accent: '#FF2D55',
        bg: '#FFF8F5',
        surface: '#FFFFFF',
        'text-main': '#1A1A2E',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-sm': 'bounceSm 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.96)' },
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(255, 107, 53, 0.1)',
        'card-hover': '0 8px 32px rgba(255, 107, 53, 0.2)',
        btn: '0 4px 14px rgba(255, 107, 53, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
