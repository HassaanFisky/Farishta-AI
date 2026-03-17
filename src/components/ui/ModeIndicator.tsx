'use client'

import { motion } from 'framer-motion'
import type { Mode } from '@/types/chat'

interface ModeIndicatorProps {
  mode: Mode
}

const MODE_CONFIG: Record<Mode, { label: string; icon: string; borderColor: string; color: string }> = {
  education: { label: 'Education', icon: '✦', borderColor: 'var(--border-md)', color: 'var(--txt-gold)' },
  defense:   { label: 'Defense',   icon: '⚔', borderColor: 'rgba(180,80,60,0.35)', color: '#c47060' },
  ethics:    { label: 'Ethics',    icon: '⚖', borderColor: 'var(--border-md)', color: 'var(--txt-gold)' },
}

export default function ModeIndicator({ mode }: ModeIndicatorProps) {
  const cfg = MODE_CONFIG[mode]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 99,
        border: `1px solid ${cfg.borderColor}`,
        background: 'var(--gold-faint)',
        fontSize: 9,
        fontFamily: 'var(--font-dm-sans)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        color: cfg.color,
        whiteSpace: 'nowrap' as const,
      }}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </motion.div>
  )
}
