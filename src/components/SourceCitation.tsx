'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, Copy, BookOpen, Check } from 'lucide-react'

interface Citation {
  type: 'quran' | 'hadith'
  title: string
  reference: string
  text: string
  arabic?: string
}

interface SourceCitationProps {
  citations: Citation[]
}

export default function SourceCitation({ citations }: SourceCitationProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-text)' }}>
        <BookOpen className="w-3.5 h-3.5" />
        <span>Sources verified from Quran & Sahih Hadith</span>
      </div>

      <div className="space-y-2">
        {citations.map((citation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-surface rounded-lg border border-white/6 overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    background: citation.type === 'quran' ? 'var(--accent-emerald)' : 'rgba(212,173,93,0.2)',
                    color: citation.type === 'quran' ? 'var(--text-primary)' : 'var(--gold-rich)',
                  }}
                >
                  {citation.type === 'quran' ? 'Quran' : 'Hadith'}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {citation.title}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-text)' }}>
                    {citation.reference}
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.24 }}
              >
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--gold-primary)' }} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1.0, 0.36, 1.0] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 border-t border-white/6 space-y-3">
                    {citation.arabic && (
                      <p
                        className="text-lg leading-relaxed text-right"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Amiri, serif' }}
                        lang="ar"
                      >
                        {citation.arabic}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {citation.text}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(citation.text, index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all glass-surface border border-white/6 hover:border-white/12"
                        style={{ color: 'var(--gold-primary)' }}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
