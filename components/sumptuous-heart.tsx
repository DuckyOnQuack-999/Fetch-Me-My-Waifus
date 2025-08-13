"use client"

import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

export function SumptuousHeart({ className, size = "md", animated = true }: SumptuousHeartProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full drop-shadow-lg", animated && "animate-pulse")}
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#dc2626" />
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
          filter="url(#glow)"
          className={cn("transition-all duration-300", animated && "animate-[float_3s_ease-in-out_infinite]")}
        />
      </svg>

      {animated && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 blur-xl animate-pulse" />
      )}
    </div>
  )
}
