export type Mode = 'education' | 'defense' | 'ethics'

export interface Citation {
  type?: 'quran' | 'hadith'
  title?: string
  arabic?: string
  translation?: string
  reference?: string
  source?: string
  text?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  loading?: boolean
  mode?: Mode
  citations?: Citation[]
  isFatwaQuery?: boolean
  isWhisperMode?: boolean
  whisperArabic?: string
  whisperTranslation?: string
  whisperReference?: string
  confidence?: 'High' | 'Medium' | 'Low'
}

export interface ChatSession {
  id: string
  title: string
  mode: Mode
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  pinned?: boolean
}
