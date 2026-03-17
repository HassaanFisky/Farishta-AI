'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import NameAnalysisCard from '@/components/ui/NameAnalysisCard'

interface NameAnalysisResult {
  arabicRoot: string
  quranicVerse: {
    arabic: string
    translation: string
    reference: string
  }
  historicalFigure: {
    name: string
    era: string
    description: string
  }
  nameWisdom: string
  prophetAtAge: {
    age: number
    event: string
  }
  confidence: 'High' | 'Medium' | 'Low'
}

interface IKnowYouOverlayProps {
  open: boolean
  onClose: () => void
}

export default function IKnowYouOverlay({ open, onClose }: IKnowYouOverlayProps) {
  const { logoSrc } = useTheme()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NameAnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleReveal = useCallback(async () => {
    if (!name.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/name-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), age: 0 }),
      })
      const data: NameAnalysisResult & { error?: string } = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      setError('Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [name, loading])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'var(--bg-chat)',
            zIndex: 15,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            padding: '24px 20px',
            overflowY: 'auto',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 14,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--txt-tertiary)', lineHeight: 1,
            }}
          >×</button>

          {/* Center content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', maxWidth: 400 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Image src={logoSrc} alt="Farishta AI" width={54} height={54} style={{ objectFit: 'contain' }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--gold)', margin: 0 }}
            >
              This Is You
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 12, color: 'var(--txt-tertiary)', textAlign: 'center', margin: 0 }}
            >
              Enter your name. Receive what it carries.
            </motion.p>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}
            >
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReveal()}
                style={{
                  width: '100%', maxWidth: 300,
                  padding: '9px 14px', borderRadius: 10,
                  border: '1px solid var(--border-md)',
                  background: 'var(--bg-input)',
                  color: 'var(--txt-primary)', fontSize: 15,
                  fontFamily: 'var(--font-cormorant)',
                  textAlign: 'center', outline: 'none',
                }}
              />

              <button
                onClick={handleReveal}
                disabled={!name.trim() || loading}
                style={{
                  padding: '8px 24px', borderRadius: 99,
                  border: '1px solid var(--border-md)',
                  background: 'var(--gold-faint)',
                  color: 'var(--txt-gold)', fontSize: 13,
                  fontFamily: 'var(--font-dm-sans)',
                  cursor: name.trim() && !loading ? 'pointer' : 'not-allowed',
                  opacity: name.trim() && !loading ? 1 : 0.4,
                }}
              >
                {loading ? (
                  <span className="shimmer">Revealing…</span>
                ) : 'Reveal ✦'}
              </button>

              {error && (
                <p style={{ fontSize: 11, color: '#c47060', textAlign: 'center' }}>{error}</p>
              )}
            </motion.div>

            {/* Result */}
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', marginTop: 16 }}
              >
                <NameAnalysisCard result={result} name={name} />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
