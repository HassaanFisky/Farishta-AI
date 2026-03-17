'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function FidelityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface border border-white/8"
      style={{ color: 'var(--gold-primary)' }}
    >
      <Shield className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">Verified Sources</span>
    </motion.div>
  )
}
