'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'
import { useChat } from '@/context/ChatContext'
import { useSidebar } from '@/context/SidebarContext'
import type { ChatSession } from '@/types/chat'

interface IKnowYouTriggerProps {
  onClick: () => void
}

function IKnowYouTrigger({ onClick }: IKnowYouTriggerProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'var(--gold-faint)',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span style={{ color: 'var(--gold)', fontSize: 14 }}>✦</span>
      <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: 13, color: 'var(--txt-gold)' }}>
        I Know You
      </span>
    </button>
  )
}

function groupSessions(sessions: ChatSession[]) {
  const now = new Date()
  const today: ChatSession[] = []
  const yesterday: ChatSession[] = []
  const earlier: ChatSession[] = []

  sessions.forEach(s => {
    const diff = (now.getTime() - new Date(s.updatedAt).getTime()) / 86400000
    if (diff < 1) today.push(s)
    else if (diff < 2) yesterday.push(s)
    else earlier.push(s)
  })
  return { today, yesterday, earlier }
}

interface SidebarProps {
  onIKnowYou?: () => void
  onProfileClick?: () => void
}

export default function Sidebar({ onIKnowYou, onProfileClick }: SidebarProps) {
  const { logoSrc } = useTheme()
  const { sessions, activeSessionId, createSession, setActiveSession } = useChat()
  const { isOpen, close } = useSidebar()
  const [search, setSearch] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  )
  const grouped = groupSessions(filtered)

  const sidebarContent = (
    <div style={{
      width: 240,
      height: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top: Logo + Brand */}
      <div style={{
        padding: '14px 14px 10px',
        borderBottom: '1px solid var(--divider)',
        display: 'flex', alignItems: 'center', gap: 9,
        flexShrink: 0,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--gold-faint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Image src={logoSrc} alt="Farishta AI" width={28} height={28} style={{ objectFit: 'contain' }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 15, fontWeight: 400,
          color: 'var(--txt-gold)',
          letterSpacing: '0.02em',
        }}>
          Farishta AI
        </span>
        {isMobile && (
          <button
            onClick={close}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--txt-tertiary)', fontSize: 18, lineHeight: 1,
            }}
          >×</button>
        )}
      </div>

      {/* Search + New Chat */}
      <div style={{ padding: '10px 10px 6px', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '6px 10px',
            borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg-input)',
            color: 'var(--txt-primary)', fontSize: 11,
            fontFamily: 'var(--font-dm-sans)',
            outline: 'none', marginBottom: 8,
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={() => createSession('education')}
          style={{
            width: '100%', padding: '7px 12px',
            borderRadius: 99, border: '1px solid var(--border-md)',
            background: 'var(--gold-faint)',
            color: 'var(--txt-gold)', fontSize: 11,
            fontFamily: 'var(--font-dm-sans)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          New Chat
        </button>
      </div>

      {/* Session list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 6px' }}>
        {(['Today', 'Yesterday', 'Earlier'] as const).map(label => {
          const items =
            label === 'Today' ? grouped.today
            : label === 'Yesterday' ? grouped.yesterday
            : grouped.earlier
          if (!items.length) return null
          return (
            <div key={label} style={{ marginBottom: 8 }}>
              <p style={{
                fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--txt-tertiary)',
                padding: '8px 8px 4px',
                fontFamily: 'var(--font-dm-sans)',
                margin: 0,
              }}>
                {label}
              </p>
              {items.map((session, i) => (
                <motion.button
                  key={session.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.22 }}
                  onClick={() => setActiveSession(session.id)}
                  style={{
                    width: '100%', padding: '7px 10px',
                    borderRadius: 8, border: 'none',
                    background: activeSessionId === session.id ? 'var(--bg-surface)' : 'transparent',
                    color: 'var(--txt-primary)', fontSize: 12,
                    fontFamily: 'var(--font-dm-sans)',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 7,
                    overflow: 'hidden',
                  }}
                >
                  <span style={{
                    width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
                    background: activeSessionId === session.id ? 'var(--gold)' : 'var(--txt-tertiary)',
                  }} />
                  <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', flex: 1,
                    color: activeSessionId === session.id ? 'var(--txt-primary)' : 'var(--txt-secondary)',
                    fontSize: 12,
                  }}>
                    {session.title}
                  </span>
                </motion.button>
              ))}
            </div>
          )
        })}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--divider)', margin: '8px 0' }} />

        {/* I Know You */}
        <div style={{ padding: '0 4px 4px' }}>
          <IKnowYouTrigger onClick={() => onIKnowYou?.()} />
        </div>
      </div>

      {/* Bottom: Profile */}
      <div style={{
        padding: '8px 10px',
        borderTop: '1px solid var(--divider)',
        flexShrink: 0,
      }}>
        <button
          onClick={onProfileClick}
          style={{
            width: '100%', padding: '8px 10px',
            borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            display: 'flex', alignItems: 'center', gap: 9,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--gold-faint)',
            border: '1px solid var(--border-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 12, color: 'var(--txt-gold)' }}>U</span>
          </div>
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <p style={{ fontSize: 11, color: 'var(--txt-primary)', margin: 0, fontWeight: 500, fontFamily: 'var(--font-dm-sans)' }}>
              You
            </p>
            <p style={{ fontSize: 10, color: 'var(--txt-tertiary)', margin: 0, fontFamily: 'var(--font-dm-sans)' }}>
              Free plan
            </p>
          </div>
          <span style={{ color: 'var(--txt-tertiary)', fontSize: 10 }}>›</span>
        </button>
      </div>
    </div>
  )

  // Mobile: overlay drawer
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              style={{
                position: 'fixed', inset: 0, zIndex: 40,
                background: 'rgba(0,0,0,0.5)',
              }}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 41 }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop: collapse animation
  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden', flexShrink: 0, height: '100vh' }}
    >
      {sidebarContent}
    </motion.div>
  )
}
