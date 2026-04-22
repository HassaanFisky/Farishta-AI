import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { ChatProvider } from '@/context/ChatContext'
import { SidebarProvider } from '@/context/SidebarContext'

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Farishta AI — Truth. One step at a time.',
  description: 'An angelic mentor guiding every human toward truth — rooted in Quran, Hadith, and wisdom.',
  icons: { icon: '/assets/logos/farishta-ai-logo.png' },
}

// Inline anti-flash script — runs before any CSS paint
const ANTI_FLASH_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('farishta-theme') || 'main';
    var themes = {
      main:  { '--bg-app':'#0d1110','--bg-sidebar':'#090c0b','--bg-chat':'#0d1110','--bg-surface':'#161c1a','--bg-input':'#131917','--txt-primary':'#f5f5f3','--gold':'#d4af37','--bg-glass':'rgba(13,17,16,0.85)' },
      dark:  { '--bg-app':'#080808','--bg-sidebar':'#050505','--bg-chat':'#080808','--bg-surface':'#111111','--bg-input':'#0c0c0c','--txt-primary':'#ececeb','--gold':'#d4af37','--bg-glass':'rgba(10,10,10,0.9)' },
      light: { '--bg-app':'#fcfcf9','--bg-sidebar':'#f7f7f2','--bg-chat':'#fcfcf9','--bg-surface':'#f0f0e8','--bg-input':'#fdfdfb','--txt-primary':'#1c1c1a','--gold':'#a68b30','--bg-glass':'rgba(252,252,249,0.92)' },
    };
    var vars = themes[t] || themes.main;
    var root = document.documentElement;
    for (var k in vars) root.style.setProperty(k, vars[k]);
    root.style.background = vars['--bg-app'];
    document.body && (document.body.style.background = vars['--bg-app']);
  } catch(e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
      </head>
      <body className={`${cormorant.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <ChatProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
