'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-6 py-3 font-medium text-sm transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] ${className}`}
      style={
        isPrimary
          ? {
              background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-rich))',
              color: 'var(--bg)',
              boxShadow: '0 4px 16px rgba(246,217,114,0.24)',
            }
          : {
              background: 'var(--glass)',
              border: '1px solid var(--gold-primary)',
              color: 'var(--gold-primary)',
            }
      }
      whileHover={
        !disabled
          ? {
              y: -2,
              boxShadow: isPrimary
                ? '0 8px 24px rgba(246,217,114,0.32)'
                : '0 6px 20px var(--accent-glow)',
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.985, transition: { duration: 0.044 } } : {}}
      transition={{ duration: 0.16, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.button>
  )
}
