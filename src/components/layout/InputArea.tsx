'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '@/context/ChatContext'

interface InputAreaProps {
  onPlusClick?: () => void
  chatAreaRef?: React.RefObject<HTMLDivElement | null>
}

export default function InputArea({ onPlusClick, chatAreaRef }: InputAreaProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { activeSessionId, createSession, addMessage, updateMessage } = useChat()

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [text])

  const submitMessage = useCallback(async (msg: string) => {
    const trimmed = msg.trim()
    if (!trimmed || loading) return

    const sessionId = activeSessionId ?? createSession('education')
    setText('')

    addMessage(sessionId, { role: 'user', content: trimmed })

    const aiId = addMessage(sessionId, { role: 'assistant', content: '', loading: true })

    setLoading(true)
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      })
      const data = await res.json()
      updateMessage(sessionId, aiId, {
        content: data.answer || 'No response received.',
        mode: data.mode,
        citations: data.citations,
        isWhisperMode: data.isWhisperMode ?? false,
        whisperArabic: data.whisperArabic,
        whisperTranslation: data.whisperTranslation,
        whisperReference: data.whisperReference,
        isFatwaQuery: data.isFatwaQuery ?? false,
        confidence: data.confidence,
        loading: false,
      })
    } catch {
      updateMessage(sessionId, aiId, {
        content: 'An error occurred. Please try again.',
        loading: false,
      })
    } finally {
      setLoading(false)
      if (chatAreaRef?.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
      }
    }
  }, [loading, activeSessionId, createSession, addMessage, updateMessage, chatAreaRef])

  // Listen for suggestion events from EmptyState / page
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      submitMessage(customEvent.detail)
    }
    window.addEventListener('farishta:suggest', handler)
    return () => window.removeEventListener('farishta:suggest', handler)
  }, [submitMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitMessage(text)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-sidebar)',
      borderTop: '1px solid var(--border)',
      padding: '8px 14px 12px',
      flexShrink: 0,
    }}>
      {/* Plus row */}
      <div style={{ marginBottom: 8 }}>
        <button
          onClick={onPlusClick}
          title="New chat with mode"
          style={{
            width: 24, height: 24, borderRadius: '50%',
            border: '1px solid var(--border-md)',
            background: 'var(--gold-faint)',
            color: 'var(--txt-gold)', fontSize: 16, lineHeight: '22px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {/* Input row */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 8,
        background: 'var(--bg-input)',
        border: '1px solid var(--border-md)',
        borderRadius: 14, padding: '8px 10px',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything — Quran, Science, Life..."
          rows={1}
          disabled={loading}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--txt-primary)', fontSize: 13,
            fontFamily: 'var(--font-dm-sans)',
            resize: 'none', lineHeight: 1.5,
            maxHeight: 120, overflowY: 'auto',
          }}
        />
        <motion.button
          onClick={() => submitMessage(text)}
          disabled={!text.trim() || loading}
          whileTap={{ scale: 0.93 }}
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            border: '1px solid var(--border-md)',
            background: text.trim() && !loading ? 'var(--gold-faint)' : 'transparent',
            color: 'var(--txt-gold)', fontSize: 14,
            cursor: text.trim() && !loading ? 'pointer' : 'not-allowed',
            opacity: text.trim() && !loading ? 1 : 0.35,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ↑
        </motion.button>
      </div>
    </div>
  )
}
