'use client'

import { useSidebar } from '@/context/SidebarContext'
import { useChat } from '@/context/ChatContext'

interface ChatHeaderProps {
  onTitleClick?: () => void
}

export default function ChatHeader({ onTitleClick }: ChatHeaderProps) {
  const { toggle } = useSidebar()
  const { activeSession } = useChat()

  return (
    <div style={{
      height: 44,
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 10px', gap: 8,
      flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      {/* Sidebar toggle */}
      <button
        onClick={toggle}
        title="Toggle sidebar"
        style={{
          width: 28, height: 28, borderRadius: 7,
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--txt-secondary)',
          cursor: 'pointer', fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        ☰
      </button>

      {/* Title button */}
      <button
        onClick={onTitleClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 8px', borderRadius: 8,
        }}
      >
        <span style={{
          fontSize: 13, color: 'var(--txt-primary)',
          fontFamily: 'var(--font-dm-sans)', fontWeight: 400,
          maxWidth: 200, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {activeSession?.title ?? 'Farishta AI'}
        </span>
        <span style={{ color: 'var(--txt-tertiary)', fontSize: 9 }}>▾</span>
      </button>
    </div>
  )
}
