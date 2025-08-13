"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export function SumptuousHeart() {
  return (
    <div className="relative">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main heart with glow effect */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Glow layers */}
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-pink-500 to-red-500 opacity-30 rounded-full scale-150" />
        <div className="absolute inset-0 blur-lg bg-gradient-to-r from-pink-400 to-red-400 opacity-50 rounded-full scale-125" />
        <div className="absolute inset-0 blur-md bg-gradient-to-r from-pink-300 to-red-300 opacity-70 rounded-full scale-110" />

        {/* Heart icon */}
        <Heart
          className="relative w-8 h-8 fill-current text-transparent bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text"
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))",
          }}
        />

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 border-2 border-pink-400 rounded-full"
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  )
}
