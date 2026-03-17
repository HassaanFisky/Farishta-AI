'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'

const SUGGESTIONS: { text: string; mode: string }[] = [
  { text: 'What is Salah?',    mode: 'education' },
  { text: 'Prove God exists',  mode: 'defense' },
  { text: 'Is riba haram?',    mode: 'ethics' },
  { text: 'Analyze my name ✦', mode: 'education' },
]

interface EmptyStateProps {
  onSuggest: (text: string) => void
}

export default function EmptyState({ onSuggest }: EmptyStateProps) {
  const { logoSrc } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 2,
      }}
    >
      {/* Watermark */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <Image
          src={logoSrc}
          alt="Farishta AI"
          width={220}
          height={220}
          style={{ objectFit: 'contain', opacity: 'var(--wm-opacity)' as unknown as number }}
        />
      </div>

      {/* Center content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.65, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Image src={logoSrc} alt="Farishta AI" width={70} height={70} style={{ objectFit: 'contain' }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 21, fontWeight: 300,
            color: 'var(--txt-gold)', margin: 0,
          }}
        >
          Farishta AI
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic', fontSize: 12,
            color: 'var(--txt-tertiary)', margin: 0,
          }}
        >
          Truth. One step at a time.
        </motion.p>

        {/* Suggestion pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: 8,
            marginTop: 20, pointerEvents: 'all',
          }}
        >
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => onSuggest(s.text)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '5px 13px', borderRadius: 99,
                border: '1px solid var(--border)',
                background: 'var(--gold-faint)',
                color: 'var(--txt-secondary)', fontSize: 11,
                fontFamily: 'var(--font-dm-sans)',
                cursor: 'pointer',
              }}
            >
              {s.text}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
