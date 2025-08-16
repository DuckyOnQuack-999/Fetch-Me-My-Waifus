"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  size?: number
  className?: string
  animate?: boolean
}

export function SumptuousHeart({ size = 60, className, animate = true }: SumptuousHeartProps) {
  const heartVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
        variants={animate ? glowVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
      />

      {/* Main heart */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        variants={animate ? heartVariants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="heartShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ec4899" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="url(#heartGradient)"
            filter="url(#heartShadow)"
            className="drop-shadow-lg"
          />
        </svg>
      </motion.div>

      {/* Sparkle effects */}
      {animate && (
        <>
          <motion.div
            className="absolute top-1 right-1 w-1 h-1 bg-pink-300 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-300 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-0 w-1 h-1 bg-pink-400 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.5,
            }}
          />
        </>
      )}
    </div>
  )
}
