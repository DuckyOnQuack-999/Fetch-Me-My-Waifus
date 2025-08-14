"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface SumptuousHeartProps {
  size?: number
  className?: string
  animated?: boolean
}

export function SumptuousHeart({ size = 64, className = "", animated = true }: SumptuousHeartProps) {
  const heartVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.2,
      rotate: 15,
      transition: { duration: 0.3 },
    },
  }

  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-red-500 blur-xl opacity-30"
        variants={animated ? glowVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        style={{ width: size, height: size }}
      />

      {/* Main heart */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        variants={animated ? heartVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
        style={{ width: size, height: size }}
      >
        <Heart
          className="text-gradient fill-current drop-shadow-lg"
          size={size * 0.6}
          style={{
            filter: "drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))",
          }}
        />
      </motion.div>

      {/* Sparkle effects */}
      {animated && (
        <>
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-3 left-1 w-1.5 h-1.5 bg-pink-300 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.2,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-0 w-1 h-1 bg-purple-400 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1.8,
            }}
          />
        </>
      )}
    </div>
  )
}
