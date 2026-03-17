'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import type { ThemeKey } from '@/types/theme'

interface ProfilePanelProps {
  open: boolean
  onClose: () => void
}

const THEMES: { key: ThemeKey; label: string; icon: string }[] = [
  { key: 'main',  label: 'Main',  icon: '✦' },
  { key: 'dark',  label: 'Dark',  icon: '◉' },
  { key: 'light', label: 'Light', icon: '◎' },
]

export default function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { theme, setTheme } = useTheme()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'absolute', bottom: 52, left: 8,
            width: 224, zIndex: 50,
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-md)',
            borderRadius: 14,
            boxShadow: 'var(--shadow)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--divider)' }}>
            <p style={{ fontSize: 12, color: 'var(--txt-primary)', margin: 0, fontWeight: 500 }}>You</p>
            <p style={{ fontSize: 10, color: 'var(--txt-tertiary)', margin: '2px 0 0' }}>Free plan</p>
          </div>

          <div style={{ padding: '8px 0' }}>
            {/* Appearance */}
            <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt-tertiary)', padding: '4px 14px 6px', fontFamily: 'var(--font-dm-sans)' }}>
              Appearance
            </p>
            <div style={{ display: 'flex', gap: 4, padding: '0 10px 10px' }}>
              {THEMES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  style={{
                    flex: 1, padding: '5px 4px', borderRadius: 8,
                    border: `1px solid ${theme === t.key ? 'var(--border-strong)' : 'var(--border)'}`,
                    background: theme === t.key ? 'var(--gold-faint)' : 'transparent',
                    color: theme === t.key ? 'var(--txt-gold)' : 'var(--txt-tertiary)',
                    fontSize: 10, cursor: 'pointer', fontFamily: 'var(--font-dm-sans)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div style={{ height: 1, background: 'var(--divider)', margin: '4px 0' }} />

            {/* Account */}
            <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt-tertiary)', padding: '8px 14px 4px', fontFamily: 'var(--font-dm-sans)' }}>Account</p>
            {(['Settings', 'Language'] as const).map(label => (
              <button key={label} style={{ width: '100%', padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--txt-secondary)', fontFamily: 'var(--font-dm-sans)' }}>{label}</span>
                <span style={{ fontSize: 11, color: 'var(--txt-tertiary)' }}>→</span>
              </button>
            ))}

            <div style={{ height: 1, background: 'var(--divider)', margin: '4px 0' }} />

            {/* Learn */}
            <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt-tertiary)', padding: '8px 14px 4px', fontFamily: 'var(--font-dm-sans)' }}>Learn</p>
            {(['About Farishta AI', 'Tutorials', 'Quranic Courses'] as const).map(label => (
              <button key={label} style={{ width: '100%', padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--txt-secondary)', fontFamily: 'var(--font-dm-sans)' }}>{label}</span>
                <span style={{ fontSize: 11, color: 'var(--txt-tertiary)' }}>↗</span>
              </button>
            ))}

            <div style={{ height: 1, background: 'var(--divider)', margin: '4px 0' }} />

            {/* Legal */}
            {(['Usage Policy', 'Privacy Policy'] as const).map(label => (
              <button key={label} style={{ width: '100%', padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--txt-secondary)', fontFamily: 'var(--font-dm-sans)' }}>{label}</span>
                <span style={{ fontSize: 11, color: 'var(--txt-tertiary)' }}>↗</span>
              </button>
            ))}

            <div style={{ height: 1, background: 'var(--divider)', margin: '4px 0' }} />

            <button style={{ width: '100%', padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--txt-secondary)', fontFamily: 'var(--font-dm-sans)' }}>Help & Support</span>
              <span style={{ fontSize: 11, color: 'var(--txt-tertiary)' }}>→</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
