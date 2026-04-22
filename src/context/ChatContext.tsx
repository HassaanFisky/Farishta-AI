'use client'

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'
import type { ChatSession, Message, Mode } from '@/types/chat'

interface ChatContextValue {
  sessions: ChatSession[]
  activeSessionId: string | null
  activeSession: ChatSession | null
  createSession: (mode?: Mode) => string
  deleteSession: (id: string) => void
  renameSession: (id: string, title: string) => void
  addMessage: (sessionId: string, msg: Omit<Message, 'id' | 'timestamp'>) => string
  updateMessage: (sessionId: string, msgId: string, patch: Partial<Message>) => void
  setActiveSession: (id: string | null) => void
  language: string
  setLanguage: (lang: string) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be inside ChatProvider')
  return ctx
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function hydrateSessions(raw: unknown): ChatSession[] {
  if (!Array.isArray(raw)) return []
  return raw.map((s: any) => ({
    ...s,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt),
    messages: Array.isArray(s.messages)
      ? s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      : [],
  }))
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [language, setLanguage] = useState<string>('Auto')

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('farishta-sessions') || '[]')
      const hydrated = hydrateSessions(raw)
      setSessions(hydrated)
      if (hydrated.length > 0) setActiveSessionId(hydrated[0].id)
      
      const savedLang = localStorage.getItem('farishta-language')
      if (savedLang) setLanguage(savedLang)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('farishta-sessions', JSON.stringify(sessions))
    } catch {}
  }, [sessions])

  useEffect(() => {
    try {
      localStorage.setItem('farishta-language', language)
    } catch {}
  }, [language])

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null

  const createSession = useCallback((mode: Mode = 'education'): string => {
    const id = genId()
    const now = new Date()
    const session: ChatSession = {
      id, title: 'New Chat', mode,
      messages: [], createdAt: now, updatedAt: now,
    }
    setSessions(prev => [session, ...prev])
    setActiveSessionId(id)
    return id
  }, [])

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id)
      return next
    })
    setActiveSessionId(prev => {
      if (prev !== id) return prev
      return null
    })
  }, [])

  const renameSession = useCallback((id: string, title: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title, updatedAt: new Date() } : s))
  }, [])

  const addMessage = useCallback((sessionId: string, msg: Omit<Message, 'id' | 'timestamp'>): string => {
    const id = genId()
    const message: Message = { ...msg, id, timestamp: new Date() }
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s
      const isFirstUserMsg = s.messages.length === 0 && msg.role === 'user'
      const title = isFirstUserMsg
        ? msg.content.slice(0, 40) + (msg.content.length > 40 ? '…' : '')
        : s.title
      return { ...s, title, messages: [...s.messages, message], updatedAt: new Date() }
    }))
    return id
  }, [])

  const updateMessage = useCallback((sessionId: string, msgId: string, patch: Partial<Message>) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s
      return {
        ...s,
        messages: s.messages.map(m => m.id === msgId ? { ...m, ...patch } : m),
        updatedAt: new Date(),
      }
    }))
  }, [])

  const setActiveSession = useCallback((id: string | null) => {
    setActiveSessionId(id)
  }, [])

  return (
    <ChatContext.Provider value={{
      sessions, activeSessionId, activeSession,
      createSession, deleteSession, renameSession,
      addMessage, updateMessage,
      setActiveSession,
      language, setLanguage,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
