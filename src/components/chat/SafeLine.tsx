'use client'

import { motion } from 'framer-motion'

export default function SafeLine() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        borderTop: '1px solid var(--divider)',
        padding: '6px 20px',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontStyle: 'italic', fontSize: 10.5,
        color: 'var(--txt-tertiary)', margin: 0, lineHeight: 1.6,
      }}>
        Farishta AI is here to guide, not decide. For personal matters,
        a qualified scholar is always your safest step.
      </p>
    </motion.div>
  )
}
