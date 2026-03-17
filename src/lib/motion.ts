// Framer Motion variants and configs for Digital Sukoon

export const breath = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 18,
  mass: 0.9,
}

export const breathEase = [0.22, 1.0, 0.36, 1.0] as const
export const sukoonEase = [0.2, 0.9, 0.28, 1.0] as const

export const variants = {
  answerContainer: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        duration: 0.42,
        ease: breathEase,
      },
    },
  },
  answerItem: {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        ease: breathEase,
      },
    },
  },
  logoBloom: {
    hidden: { opacity: 0, scale: 0.86 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: sukoonEase,
      },
    },
  },
  haloExpand: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0, 0.35, 0.35],
      scale: [0.8, 1.2, 1.0],
      transition: {
        duration: 1.2,
        times: [0, 0.17, 1],
        ease: sukoonEase,
      },
    },
  },
}

export const tactilePress = {
  scale: 0.985,
  transition: { duration: 0.044 },
}

export const tactileRelease = {
  scale: 1,
  transition: { duration: 0.16, ease: [0.34, 1.56, 0.64, 1] },
}
