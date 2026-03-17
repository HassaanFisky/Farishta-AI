'use client'

import { motion } from 'framer-motion'

interface QuranicVerse {
  arabic: string
  translation: string
  reference: string
}

interface HistoricalFigure {
  name: string
  era: string
  description: string
}

interface ProphetAtAge {
  age: number
  event: string
}

interface NameAnalysisResult {
  arabicRoot: string
  quranicVerse: QuranicVerse
  historicalFigure: HistoricalFigure
  nameWisdom: string
  prophetAtAge: ProphetAtAge
  confidence: 'High' | 'Medium' | 'Low'
}

interface NameAnalysisCardProps {
  result: NameAnalysisResult
  name: string
}

const Section = ({ title, children, index }: { title: string; children: React.ReactNode; index: number }) => (
  <motion.div
    custom={index}
    variants={{
      hidden: { opacity: 0, y: 12 },
      visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }),
    }}
    initial="hidden"
    animate="visible"
    style={{
      borderRadius: 12,
      border: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      padding: '14px 16px',
    }}
  >
    <p style={{
      fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'var(--txt-gold)', marginBottom: 8, fontFamily: 'var(--font-dm-sans)',
    }}>
      {title}
    </p>
    {children}
  </motion.div>
)

export default function NameAnalysisCard({ result, name }: NameAnalysisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: 8 }}>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.5rem', fontWeight: 300,
          color: 'var(--gold)', margin: 0,
        }}>
          {name}
        </h2>
      </div>

      {/* 1 — Arabic Root */}
      <Section title="Arabic Root" index={0}>
        <p style={{ fontSize: 13, color: 'var(--txt-primary)', margin: 0, lineHeight: 1.6 }}>
          {result.arabicRoot}
        </p>
      </Section>

      {/* 2 — Quranic Connection */}
      <Section title="Quranic Connection" index={1}>
        <p className="arabic-text" style={{ fontSize: '1.2rem', color: 'var(--gold)', marginBottom: 8 }}>
          {result.quranicVerse.arabic}
        </p>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--txt-secondary)', marginBottom: 6 }}>
          {result.quranicVerse.translation}
        </p>
        <span style={{ fontSize: 10, color: 'var(--txt-gold)', opacity: 0.7 }}>
          {result.quranicVerse.reference}
        </span>
      </Section>

      {/* 3 — Historical Figure */}
      <Section title="A Soul Who Carried This Name" index={2}>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt-primary)', marginBottom: 4 }}>
          {result.historicalFigure.name}
          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--txt-tertiary)', marginLeft: 6 }}>
            · {result.historicalFigure.era}
          </span>
        </p>
        <p style={{ fontSize: 12, color: 'var(--txt-secondary)', lineHeight: 1.7, margin: 0 }}>
          {result.historicalFigure.description}
        </p>
      </Section>

      {/* 4 — Name's Wisdom */}
      <Section title="What This Name Calls You Toward" index={3}>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic', fontSize: '1rem',
          color: 'var(--txt-primary)', lineHeight: 1.8, margin: 0,
          borderLeft: '2px solid var(--border-strong)',
          paddingLeft: 12,
        }}>
          {result.nameWisdom}
        </p>
      </Section>

      {/* 5 — Prophet at Your Age */}
      <Section title={`The Prophet ﷺ at Age ${result.prophetAtAge.age}`} index={4}>
        <div style={{
          borderRadius: 8,
          background: '#162E1F',
          borderLeft: '3px solid var(--gold)',
          padding: '10px 14px',
        }}>
          <p style={{ fontSize: 12, color: 'var(--txt-secondary)', lineHeight: 1.7, margin: 0 }}>
            {result.prophetAtAge.event}
          </p>
        </div>
      </Section>

      {/* Footer */}
      <p style={{
        textAlign: 'center', fontSize: 10,
        color: 'var(--txt-tertiary)', fontFamily: 'var(--font-cormorant)',
        fontStyle: 'italic', marginTop: 4,
      }}>
        Alhamdulillah · Confidence: {result.confidence}
      </p>
    </motion.div>
  )
}
