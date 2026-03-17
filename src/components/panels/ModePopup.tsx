'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@/context/ChatContext'
import type { Mode } from '@/types/chat'

const MODES: { mode: Mode; icon: string; label: string; desc: string }[] = [
  { mode: 'education', icon: '✦', label: 'Education', desc: 'Neutral Islamic knowledge' },
  { mode: 'defense',   icon: '⚔', label: 'Defense',   desc: 'Logic, doubts, interfaith' },
  { mode: 'ethics',    icon: '⚖', label: 'Ethics',    desc: 'Real-life moral guidance' },
]

interface ModePopupProps {
  open: boolean
  onClose: () => void
  anchorBottom?: number
  anchorLeft?: number
}

export default function ModePopup({ open, onClose, anchorBottom = 72, anchorLeft = 14 }: ModePopupProps) {
  const { createSession, setActiveSession } = useChat()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
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
          ref={ref}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            bottom: anchorBottom, left: anchorLeft,
            width: 210, zIndex: 50,
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-md)',
            borderRadius: 12,
            boxShadow: 'var(--shadow)',
            overflow: 'hidden',
          }}
        >
          <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt-tertiary)', padding: '10px 14px 6px', fontFamily: 'var(--font-dm-sans)' }}>
            Open as New Chat
          </p>
          {MODES.map(m => (
            <button
              key={m.mode}
              onClick={() => {
                const id = createSession(m.mode)
                setActiveSession(id)
                onClose()
              }}
              style={{
                width: '100%', padding: '9px 14px',
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex',
                alignItems: 'flex-start', gap: 10,
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--txt-gold)', marginTop: 1, flexShrink: 0 }}>{m.icon}</span>
              <div>
                <p style={{ fontSize: 12, color: 'var(--txt-primary)', margin: '0 0 2px', fontFamily: 'var(--font-dm-sans)', fontWeight: 500 }}>{m.label}</p>
                <p style={{ fontSize: 10, color: 'var(--txt-tertiary)', margin: 0, fontFamily: 'var(--font-dm-sans)' }}>{m.desc}</p>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
