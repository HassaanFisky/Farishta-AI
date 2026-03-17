'use client'

import { useState, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useChat } from '@/context/ChatContext'
import Sidebar from '@/components/layout/Sidebar'
import ChatHeader from '@/components/layout/ChatHeader'
import InputArea from '@/components/layout/InputArea'
import ChatThread from '@/components/chat/ChatThread'
import EmptyState from '@/components/chat/EmptyState'
import SafeLine from '@/components/chat/SafeLine'
import ProfilePanel from '@/components/panels/ProfilePanel'
import ModePopup from '@/components/panels/ModePopup'
import TitleDropdown from '@/components/panels/TitleDropdown'
import IKnowYouOverlay from '@/components/panels/IKnowYouOverlay'

export default function FarishtaPage() {
  const { activeSession, addMessage, activeSessionId, createSession } = useChat()
  const hasMessages = (activeSession?.messages?.length ?? 0) > 0

  const [profileOpen, setProfileOpen] = useState(false)
  const [modePopupOpen, setModePopupOpen] = useState(false)
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false)
  const [iKnowYouOpen, setIKnowYouOpen] = useState(false)

  const chatScrollRef = useRef<HTMLDivElement>(null)

  const handleSuggest = useCallback((text: string) => {
    const sessionId = activeSessionId ?? createSession('education')
    addMessage(sessionId, { role: 'user', content: text })
    const event = new CustomEvent('farishta:suggest', { detail: text })
    window.dispatchEvent(event)
  }, [activeSessionId, createSession, addMessage])

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-app)',
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <Sidebar
        onIKnowYou={() => setIKnowYouOpen(true)}
        onProfileClick={() => setProfileOpen(v => !v)}
      />

      {/* Profile Panel — positioned relative to sidebar bottom */}
      <div style={{ position: 'relative' }}>
        <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
      </div>

      {/* Main area */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-chat)',
      }}>
        {/* Header */}
        <ChatHeader onTitleClick={() => setTitleDropdownOpen(v => !v)} />

        {/* Title dropdown */}
        <TitleDropdown open={titleDropdownOpen} onClose={() => setTitleDropdownOpen(false)} />

        {/* Chat area */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <AnimatePresence mode="wait">
            {hasMessages
              ? <ChatThread key="thread" scrollRef={chatScrollRef} />
              : <EmptyState key="empty" onSuggest={handleSuggest} />
            }
          </AnimatePresence>

          {/* I Know You overlay */}
          <IKnowYouOverlay open={iKnowYouOpen} onClose={() => setIKnowYouOpen(false)} />
        </div>

        {/* Safe line */}
        <AnimatePresence>
          {hasMessages && <SafeLine key="safeline" />}
        </AnimatePresence>

        {/* Input */}
        <InputArea
          onPlusClick={() => setModePopupOpen(v => !v)}
          chatAreaRef={chatScrollRef}
        />

        {/* Mode popup */}
        <ModePopup
          open={modePopupOpen}
          onClose={() => setModePopupOpen(false)}
        />
      </main>
    </div>
  )
}
