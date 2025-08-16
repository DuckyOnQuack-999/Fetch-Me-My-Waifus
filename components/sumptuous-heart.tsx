"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface SumptuousHeartProps {
  size?: number
  className?: string
  color?: string
  animated?: boolean
}

export function SumptuousHeart({
  size = 24,
  className = "",
  color = "text-pink-500",
  animated = true,
}: SumptuousHeartProps) {
  const heartVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.3,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0.5, 0],
      scale: [1, 1.5, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  if (!animated) {
    return <Heart className={`${color} ${className}`} size={size} fill="currentColor" />
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-pink-500/20 blur-md"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Main heart */}
      <motion.div
        variants={heartVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="relative z-10"
      >
        <Heart
          className={color}
          size={size}
          fill="currentColor"
          style={{
            filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.3))",
          }}
        />
      </motion.div>
    </div>
  )
}
