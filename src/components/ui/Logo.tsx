'use client'

import Image from 'next/image'
import { useTheme } from '@/context/ThemeContext'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  opacity?: number
}

export default function Logo({ width = 28, height = 28, className, style, opacity }: LogoProps) {
  const { logoSrc } = useTheme()
  return (
    <Image
      src={logoSrc}
      alt="Farishta AI"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain', opacity, ...style }}
      priority
    />
  )
}
