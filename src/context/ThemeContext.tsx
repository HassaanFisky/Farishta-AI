'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import type { ThemeKey } from '@/types/theme'
import { THEMES, LOGO_SRCS, getThemeCSSVars } from '@/lib/themes'

interface ThemeContextValue {
  theme: ThemeKey
  setTheme: (t: ThemeKey) => void
  logoSrc: string
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}

function applyTheme(key: ThemeKey) {
  const vars = getThemeCSSVars(THEMES[key])
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>('main')

  useEffect(() => {
    const stored = localStorage.getItem('farishta-theme') as ThemeKey | null
    const initial: ThemeKey = stored && ['main','dark','light'].includes(stored) ? stored : 'main'
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  const setTheme = useCallback((t: ThemeKey) => {
    setThemeState(t)
    applyTheme(t)
    localStorage.setItem('farishta-theme', t)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, logoSrc: LOGO_SRCS[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}
