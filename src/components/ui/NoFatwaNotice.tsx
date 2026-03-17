'use client'

import { motion } from 'framer-motion'

export default function NoFatwaNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        borderRadius: 10,
        border: '1px solid var(--border-md)',
        background: 'var(--gold-faint)',
        padding: '10px 14px',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ color: 'var(--gold)', fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠</span>
      <div>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt-primary)', marginBottom: 3 }}>
          Personal rulings require a qualified scholar
        </p>
        <p style={{ fontSize: 11, color: 'var(--txt-secondary)', lineHeight: 1.6, margin: 0 }}>
          Farishta AI provides educational context only. For fatwa or personal Islamic rulings,
          please consult a certified aalim.
        </p>
      </div>
    </motion.div>
  )
}
