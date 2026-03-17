'use client'

import { motion } from 'framer-motion'
import { variants } from '@/lib/motion'

interface WhisperModeProps {
  arabic: string
  translation: string
  reference: string
}

export default function WhisperMode({ arabic, translation, reference }: WhisperModeProps) {
  return (
    <motion.div
      variants={variants.whisper}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="whisper-glow"
      style={{
        width: '100%',
        padding: '32px 24px',
        borderRadius: 16,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      {/* Arabic */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="arabic-text"
        style={{
          fontSize: '2rem',
          color: 'var(--gold)',
          letterSpacing: '0.05em',
          lineHeight: 1.9,
          maxWidth: 520,
        }}
      >
        {arabic}
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          width: 80,
          height: 1,
          background: 'var(--border-md)',
        }}
      />

      {/* Translation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: 'var(--txt-primary)',
          lineHeight: 1.7,
          maxWidth: 480,
        }}
      >
        {translation}
      </motion.p>

      {/* Reference */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        style={{
          fontSize: 11,
          color: 'var(--txt-gold)',
          fontFamily: 'var(--font-dm-sans)',
          letterSpacing: '0.04em',
          opacity: 0.7,
        }}
      >
        — {reference}
      </motion.span>
    </motion.div>
  )
}
