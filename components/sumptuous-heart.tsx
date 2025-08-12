"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface SumptuousHeartProps {
  size?: number
  className?: string
}

export function SumptuousHeart({ size = 40, className }: SumptuousHeartProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-red-500 opacity-20 blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <Heart size={size} className="relative z-10 text-primary fill-current drop-shadow-lg" />
    </motion.div>
  )
}
