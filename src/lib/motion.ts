// Framer Motion variants and easing for Farishta AI

export const breath = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 18,
  mass: 0.9,
}

export const breathEase = [0.22, 1.0, 0.36, 1.0] as const
export const sukoonEase = [0.2, 0.9, 0.28, 1.0] as const
export const quickEase  = [0.4, 0, 0.2, 1] as const

export const tactilePress = {
  scale: 0.985,
  transition: { duration: 0.044 },
}

export const tactileRelease = {
  scale: 1,
  transition: { duration: 0.16, ease: [0.34, 1.56, 0.64, 1] },
}

export const variants = {
  // Legacy — kept for existing components
  answerContainer: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.08, duration: 0.42, ease: breathEase },
    },
  },
  answerItem: {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: breathEase } },
  },
  logoBloom: {
    hidden: { opacity: 0, scale: 0.86 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: sukoonEase } },
  },
  haloExpand: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0, 0.35, 0.35],
      scale: [0.8, 1.2, 1.0],
      transition: { duration: 1.2, times: [0, 0.17, 1], ease: sukoonEase },
    },
  },

  // New panel variants
  panel: {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: quickEase } },
    exit:   { opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.16, ease: quickEase } },
  },
  panelUp: {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: quickEase } },
    exit:   { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.16, ease: quickEase } },
  },
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35, ease: quickEase } },
    exit:   { opacity: 0, transition: { duration: 0.25, ease: quickEase } },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: breathEase } },
    exit:   { opacity: 0, y: -6, transition: { duration: 0.25, ease: quickEase } },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.06 } },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: breathEase } },
  },
  whisper: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.6, ease: sukoonEase },
    },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3 } },
  },
  sidebar: {
    open:   { width: 240, opacity: 1, transition: { duration: 0.32, ease: quickEase } },
    closed: { width: 0,   opacity: 0, transition: { duration: 0.28, ease: quickEase } },
  },
  messageBubble: {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: breathEase } },
  },
  nameCard: {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: breathEase },
    }),
  },
}
