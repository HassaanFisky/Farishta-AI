'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@/context/ChatContext'

interface TitleDropdownProps {
  open: boolean
  onClose: () => void
}

export default function TitleDropdown({ open, onClose }: TitleDropdownProps) {
  const { activeSessionId, activeSession, deleteSession, renameSession, createSession, setActiveSession } = useChat()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [open, onClose])

  const handleRename = () => {
    if (!activeSessionId || !activeSession) return
    const title = window.prompt('Rename chat:', activeSession.title)
    if (title && title.trim()) renameSession(activeSessionId, title.trim())
    onClose()
  }

  const handleDelete = () => {
    if (!activeSessionId) return
    deleteSession(activeSessionId)
    const id = createSession('education')
    setActiveSession(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute', top: 48, left: 44,
            width: 180, zIndex: 50,
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-md)',
            borderRadius: 10,
            boxShadow: 'var(--shadow)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleRename}
            style={{ width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}
          >
            <span style={{ fontSize: 12, color: 'var(--txt-tertiary)' }}>✏</span>
            <span style={{ fontSize: 12, color: 'var(--txt-secondary)', fontFamily: 'var(--font-dm-sans)' }}>Rename chat</span>
          </button>
          <button
            onClick={() => onClose()}
            style={{ width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}
          >
            <span style={{ fontSize: 12, color: 'var(--txt-tertiary)' }}>＋</span>
            <span style={{ fontSize: 12, color: 'var(--txt-secondary)', fontFamily: 'var(--font-dm-sans)' }}>Add to project</span>
          </button>
          <div style={{ height: 1, background: 'var(--divider)' }} />
          <button
            onClick={handleDelete}
            style={{ width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}
          >
            <span style={{ fontSize: 12, color: '#c47060' }}>⊗</span>
            <span style={{ fontSize: 12, color: '#c47060', fontFamily: 'var(--font-dm-sans)' }}>Delete chat</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
