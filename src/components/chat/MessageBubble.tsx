'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'
import type { Message } from '@/types/chat'
import ModeIndicator from '@/components/ui/ModeIndicator'
import WhisperMode from '@/components/ui/WhisperMode'
import NoFatwaNotice from '@/components/ui/NoFatwaNotice'
import WisdomCard from '@/components/ui/WisdomCard'
import ReactMarkdown from 'react-markdown'

// ─── User bubble ───────────────────────────────────────────────────
export function UserBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 4px' }}
    >
      <div style={{
        maxWidth: '65%', minWidth: 0,
        background: 'var(--bg-msg-user)',
        border: '1px solid var(--border)',
        borderRadius: '14px 14px 4px 14px',
        padding: '9px 14px',
        fontSize: 13, color: 'var(--txt-primary)',
        fontFamily: 'var(--font-dm-sans)',
        lineHeight: 1.6, wordBreak: 'break-word',
      }}>
        {message.content}
      </div>
    </motion.div>
  )
}

// ─── Loading dots ──────────────────────────────────────────────────
function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '4px 2px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'var(--gold)', display: 'inline-block',
          }}
        />
      ))}
    </div>
  )
}

// ─── Step label ────────────────────────────────────────────────────
function StepLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: 9, letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: 'var(--gold-soft)', margin: '0 0 5px',
      fontFamily: 'var(--font-dm-sans)',
    }}>
      {text}
    </p>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--divider)', margin: '10px 0' }} />
}

// ─── AI bubble ────────────────────────────────────────────────────
export function AIBubble({ message }: { message: Message }) {
  const { logoSrc } = useTheme()
  const [wisdomExpanded, setWisdomExpanded] = useState(false)

  // Whisper mode — full override
  if (message.isWhisperMode && message.whisperArabic) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ padding: '0 4px' }}
      >
        <WhisperMode
          arabic={message.whisperArabic}
          translation={message.whisperTranslation ?? ''}
          reference={message.whisperReference ?? ''}
        />
      </motion.div>
    )
  }

  // Find first citation with arabic for WisdomCard
  const wisdomCitation = message.citations?.find(c => c.arabic && c.translation)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', gap: 9, padding: '0 4px', alignItems: 'flex-start' }}
    >
      {/* Avatar */}
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: 'var(--gold-faint)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginTop: 2,
      }}>
        <Image src={logoSrc} alt="Farishta AI" width={20} height={20} style={{ objectFit: 'contain' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          position: 'relative',
          background: 'var(--bg-msg-ai)',
          border: '1px solid var(--border)',
          borderRadius: '4px 14px 14px 14px',
          padding: '11px 14px',
        }}>
          {/* Mode badge */}
          {message.mode && !message.loading && (
            <div style={{ position: 'absolute', top: -11, right: 10 }}>
              <ModeIndicator mode={message.mode} />
            </div>
          )}

          {/* Loading */}
          {message.loading ? (
            <LoadingDots />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Main content */}
              <div className="prose-farishta" style={{ color: 'var(--txt-secondary)', fontSize: 13, lineHeight: 1.7 }}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <>
                  <Divider />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {message.citations.map((c, i) => (
                      <div key={i} style={{
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-surface)',
                        padding: '8px 10px',
                      }}>
                        {c.arabic && (
                          <p className="arabic-text" style={{ fontSize: '1.1rem', color: 'var(--gold)', marginBottom: 5 }}>
                            {c.arabic}
                          </p>
                        )}
                        {(c.translation || c.text) && (
                          <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--txt-secondary)', marginBottom: 4 }}>
                            {c.translation || c.text}
                          </p>
                        )}
                        <span style={{ fontSize: 9, color: 'var(--txt-gold)', opacity: 0.7, letterSpacing: '0.03em' }}>
                          {c.reference || c.source || (c.type === 'quran' ? 'Quran' : 'Hadith')}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Confidence */}
              {message.confidence && (
                <>
                  <Divider />
                  <span style={{ fontSize: 9, color: 'var(--txt-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                    Confidence: {message.confidence}
                  </span>
                </>
              )}

              {/* Fatwa notice */}
              {message.isFatwaQuery && (
                <div style={{ marginTop: 10 }}>
                  <NoFatwaNotice />
                </div>
              )}

              {/* WisdomCard inline */}
              {wisdomCitation && (
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => setWisdomExpanded(v => !v)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 9, color: 'var(--txt-gold)',
                      letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                      padding: '4px 0', fontFamily: 'var(--font-dm-sans)',
                    }}
                  >
                    ✦ {wisdomExpanded ? 'Hide' : 'Show'} Wisdom Card
                  </button>
                  {wisdomExpanded && (
                    <div style={{ marginTop: 8 }}>
                      <WisdomCard
                        arabic={wisdomCitation.arabic}
                        wisdom={wisdomCitation.translation || wisdomCitation.text || ''}
                        reference={wisdomCitation.reference || ''}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Keep StepLabel exported to prevent unused-variable TS error if used externally
export { StepLabel }
