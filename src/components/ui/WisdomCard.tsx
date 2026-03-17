'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'

interface WisdomCardProps {
  arabic?: string
  wisdom: string
  reference: string
}

export default function WisdomCard({ arabic, wisdom, reference }: WisdomCardProps) {
  const { logoSrc } = useTheme()
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0e1f17',
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'farishta-wisdom.png'
      a.click()
    } catch (e) {
      console.error('Download failed:', e)
    } finally {
      setDownloading(false)
    }
  }, [downloading])

  const handleCopy = useCallback(() => {
    const text = arabic ? `${arabic}\n\n${wisdom}\n\n— ${reference}` : `${wisdom}\n\n— ${reference}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [arabic, wisdom, reference])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {/* The actual card that gets captured */}
      <div
        ref={cardRef}
        style={{
          background: '#0e1f17',
          border: '1.5px solid rgba(201,168,76,0.35)',
          borderRadius: 14,
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        {/* Logo + brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Image src={logoSrc} alt="Farishta AI" width={40} height={40} style={{ objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 14, color: '#C9A84C', letterSpacing: '0.06em' }}>
            Farishta AI
          </span>
        </div>

        {/* Arabic */}
        {arabic && (
          <p
            className="arabic-text"
            style={{ fontSize: '1.35rem', color: '#C9A84C', lineHeight: 1.9, margin: 0 }}
          >
            {arabic}
          </p>
        )}

        {/* Divider */}
        <div style={{ width: 60, height: 1, background: 'rgba(201,168,76,0.25)' }} />

        {/* Wisdom */}
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          fontSize: '1rem',
          color: '#e8e4dc',
          lineHeight: 1.7,
          margin: 0,
          maxWidth: 320,
        }}>
          {wisdom}
        </p>

        {/* Reference */}
        <span style={{ fontSize: 10, color: '#c4a248', opacity: 0.7, letterSpacing: '0.04em' }}>
          {reference}
        </span>

        {/* Tagline */}
        <span style={{
          fontSize: 9,
          color: '#C9A84C',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.55,
        }}>
          Truth. One step at a time.
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 14px', borderRadius: 8,
            border: '1px solid var(--border-md)',
            background: 'var(--gold-faint)',
            color: 'var(--txt-gold)',
            fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)',
            opacity: downloading ? 0.5 : 1,
          }}
        >
          ↓ {downloading ? 'Saving…' : 'Download'}
        </button>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 14px', borderRadius: 8,
            border: '1px solid var(--border-md)',
            background: 'var(--gold-faint)',
            color: copied ? 'var(--gold)' : 'var(--txt-gold)',
            fontSize: 11, cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          ⧉ {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>
    </motion.div>
  )
}
