"use client"
import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  size?: number
  className?: string
  glowing?: boolean
  animated?: boolean
}

export function SumptuousHeart({ size = 24, className, glowing = false, animated = true }: SumptuousHeartProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "kawaii-heart",
        animated && "animate-pulse-slow",
        glowing && "drop-shadow-[0_0_10px_var(--neon-primary)]",
        className,
      )}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--neon-primary)" />
          <stop offset="50%" stopColor="var(--neon-secondary)" />
          <stop offset="100%" stopColor="var(--neon-accent)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="url(#heartGradient)"
        filter={glowing ? "url(#glow)" : undefined}
      />
    </svg>
  )
}
