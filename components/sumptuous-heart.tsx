"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  size?: number
  className?: string
  animated?: boolean
  color?: string
  pulseColor?: string
}

export function SumptuousHeart({
  size = 24,
  className = "",
  animated = true,
  color = "text-pink-500",
  pulseColor = "border-pink-500/30",
}: SumptuousHeartProps) {
  const heartVariants = {
    initial: { scale: 0, rotate: -45 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.7, 0, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(236, 72, 153, 0.3)",
        "0 0 40px rgba(236, 72, 153, 0.6)",
        "0 0 20px rgba(236, 72, 153, 0.3)",
      ],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className={cn("relative flex items-center justify-center cursor-pointer", className)}
      style={{ width: size, height: size }}
      variants={animated ? heartVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
      whileTap={animated ? "tap" : undefined}
    >
      {/* Glow Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={glowVariants}
          animate="animate"
          style={{ width: size, height: size }}
        />
      )}

      {/* Pulse Rings */}
      {animated && (
        <>
          <motion.div
            className={cn("absolute inset-0 rounded-full border-2", pulseColor)}
            style={{ width: size, height: size }}
            variants={pulseVariants}
            animate="animate"
          />
          <motion.div
            className={cn("absolute inset-0 rounded-full border-2", pulseColor)}
            style={{ width: size, height: size }}
            variants={{
              ...pulseVariants,
              animate: {
                ...pulseVariants.animate,
                transition: {
                  ...pulseVariants.animate.transition,
                  delay: 0.5,
                },
              },
            }}
            animate="animate"
          />
        </>
      )}

      {/* Main Heart */}
      <motion.div className="relative z-10">
        <Heart className={cn(color, "drop-shadow-lg")} size={size * 0.6} fill="currentColor" />
      </motion.div>

      {/* Sparkle Particles */}
      {animated && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-400 rounded-full"
              style={{
                top: `${20 + Math.sin((i * Math.PI) / 3) * 15}%`,
                left: `${50 + Math.cos((i * Math.PI) / 3) * 15}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* Floating Hearts */}
      {animated && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`floating-${i}`}
              className="absolute"
              style={{
                top: `${30 + i * 20}%`,
                left: `${70 + i * 10}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                x: [0, 10, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.8,
                ease: "easeInOut",
              }}
            >
              <Heart className="text-pink-300" size={size * 0.2} fill="currentColor" />
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  )
}

export default SumptuousHeart
