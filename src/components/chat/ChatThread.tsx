'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '@/context/ChatContext'
import { UserBubble, AIBubble } from './MessageBubble'

interface ChatThreadProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

export default function ChatThread({ scrollRef }: ChatThreadProps) {
  const { activeSession } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Expose container ref
  useEffect(() => {
    if (scrollRef && containerRef.current) {
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current
    }
  }, [scrollRef])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages.length])

  if (!activeSession) return null

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px', display: 'flex',
        flexDirection: 'column', gap: 14,
      }}
    >
      <AnimatePresence initial={false}>
        {activeSession.messages.map(message => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            {message.role === 'user'
              ? <UserBubble message={message} />
              : <AIBubble message={message} />
            }
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  )
}
