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
        farishta: {
          green:        '#1B4332',
          'green-dark': '#0F2419',
          'green-deep': '#0e1f17',
          'green-deeper':'#162E1F',
          gold:         '#C9A84C',
          'gold-muted': 'rgba(201,168,76,0.4)',
          'gold-border':'rgba(201,168,76,0.2)',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)',   'DM Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        goldShimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        whisperGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.15)' },
          '50%':      { boxShadow: '0 0 40px rgba(201,168,76,0.32)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%':           { opacity: '1',   transform: 'scale(1)' },
        },
      },
      animation: {
        goldShimmer: 'goldShimmer 1.5s linear infinite',
        whisperGlow: 'whisperGlow 3s ease-in-out infinite',
        fadeInUp:    'fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        dotPulse:    'dotPulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
