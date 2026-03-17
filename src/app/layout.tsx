import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { ChatProvider } from '@/context/ChatContext'
import { SidebarProvider } from '@/context/SidebarContext'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Farishta AI — Truth. One step at a time.',
  description: 'An angelic mentor guiding every human toward truth — rooted in Quran, Hadith, and wisdom.',
  icons: { icon: '/assets/logos/Farista-AI-LOGO-main.png' },
}

// Inline anti-flash script — runs before any CSS paint
const ANTI_FLASH_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('farishta-theme') || 'main';
    var themes = {
      main:  { '--bg-app':'#0e1f17','--bg-sidebar':'#0a1912','--bg-chat':'#0b1c14','--bg-surface':'#132a1c','--bg-input':'#112318','--txt-primary':'#e8e4dc','--gold':'#C9A84C','--bg-glass':'rgba(10,25,18,0.92)' },
      dark:  { '--bg-app':'#1a1c1e','--bg-sidebar':'#141618','--bg-chat':'#161819','--bg-surface':'#1e2124','--bg-input':'#1c1f22','--txt-primary':'#d4d0c8','--gold':'#C9A84C','--bg-glass':'rgba(20,22,24,0.94)' },
      light: { '--bg-app':'#f5f1e9','--bg-sidebar':'#ede9e0','--bg-chat':'#f0ece3','--bg-surface':'#e8e4db','--bg-input':'#f8f4ec','--txt-primary':'#2c2820','--gold':'#9a7828','--bg-glass':'rgba(240,236,227,0.94)' },
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
      <body className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
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
