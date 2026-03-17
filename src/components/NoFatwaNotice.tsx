'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function NoFatwaNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border p-4 glass-surface"
      style={{
        borderColor: 'rgba(212,173,93,0.3)',
        background: 'rgba(212,173,93,0.08)',
      }}
    >
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-primary)' }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Unable to Issue Legal Rulings
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-text)' }}>
            I cannot provide fatwas or legal rulings. Here are relevant sources from Quran and Sahih Hadith. 
            Please consult qualified scholars for specific guidance on Islamic jurisprudence.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
