'use client'

import { motion } from 'framer-motion'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import type { ThemeKey } from '@/types/theme'

const THEME_CYCLE: ThemeKey[] = ['main', 'dark', 'light']

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme)
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
    setTheme(next)
  }

  return (
    <motion.button
      onClick={cycleTheme}
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'var(--bg-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.08, boxShadow: '0 8px 24px var(--accent-glow)' }}
      whileTap={{ scale: 0.985, transition: { duration: 0.044 } }}
      transition={{ duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'backOut' }}
      >
        {theme === 'main' && (
          <Sparkles className="w-5 h-5" style={{ color: 'var(--txt-gold)' }} />
        )}
        {theme === 'dark' && (
          <Moon className="w-5 h-5" style={{ color: 'var(--txt-gold)' }} />
        )}
        {theme === 'light' && (
          <Sun className="w-5 h-5" style={{ color: 'var(--txt-gold)' }} />
        )}
      </motion.div>
    </motion.button>
  )
}
