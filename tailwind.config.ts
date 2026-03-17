
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="divine-dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Farishta brand palette ──────────────────────────────────────────
        farishta: {
          green: '#1B4332',
          'green-dark': '#0F2419',
          'green-deeper': '#162E1F',
          gold: '#C9A84C',
          'gold-muted': 'rgba(201,168,76,0.4)',
          'gold-border': 'rgba(201,168,76,0.2)',
        },
        // ── Legacy palette (kept for backwards compat) ──────────────────────
        'divine-dark': {
          background: '#0A141A',
          accent: '#D4AF37',
          text: '#E5E5E5',
        },
        'ethereal-light': {
          background: '#FFFFFF',
          text: '#1C1C1C',
          accent: '#D4AF37',
        },
      },
      backgroundImage: {
        'islamic-pattern': "url('/path-to-islamic-geometric-pattern.svg')",
        'stardust-dark': 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
        'stardust-light': 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
      },
      backgroundOpacity: {
        '15': '0.15',
      },
      backdropBlur: {
        'glass': '10px',
      },
      backdropSaturate: {
        'glass': '180%',
      },
      backdropBrightness: {
        'glass': '120%',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "whisper-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(201,168,76,0.05), 0 0 60px rgba(201,168,76,0.03)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(201,168,76,0.12), 0 0 80px rgba(201,168,76,0.06)",
          },
        },
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "gold-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "whisper-glow": "whisper-glow 4s ease-in-out infinite",
        "gold-shimmer": "gold-shimmer 2s linear infinite",
        "gold-pulse": "gold-pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.glassmorphism': {
          'backdrop-filter': 'blur(10px) saturate(180%) brightness(120%)',
          '-webkit-backdrop-filter': 'blur(10px) saturate(180%) brightness(120%)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
        '.dark .glassmorphism': {
          'background-color': 'rgba(10, 20, 26, 0.1)',
        },
        // ── Farishta utilities ──────────────────────────────────────────────
        '.arabic-text': {
          'font-family': 'Amiri, "Noto Naskh Arabic", Georgia, serif',
          'direction': 'rtl',
          'unicode-bidi': 'bidi-override',
        },
        '.gold-shimmer-bg': {
          'background': 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
          'background-size': '200% auto',
          'animation': 'gold-shimmer 2s linear infinite',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

export default config;
