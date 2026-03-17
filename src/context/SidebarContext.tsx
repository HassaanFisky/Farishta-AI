'use client'

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
  close: () => void
  open: () => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be inside SidebarProvider')
  return ctx
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('farishta-sidebar')
    if (stored !== null) setIsOpen(stored === 'true')
  }, [])

  const toggle = useCallback(() => setIsOpen(prev => {
    const next = !prev
    localStorage.setItem('farishta-sidebar', String(next))
    return next
  }), [])

  const close = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem('farishta-sidebar', 'false')
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
    localStorage.setItem('farishta-sidebar', 'true')
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </SidebarContext.Provider>
  )
}
