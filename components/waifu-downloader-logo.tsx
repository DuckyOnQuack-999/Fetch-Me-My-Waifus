"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"

interface WaifuDownloaderLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export function WaifuDownloaderLogo({ size = 40, className = "", animated = true }: WaifuDownloaderLogoProps) {
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  }

  const heartVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.3,
        ease: "backOut",
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const sparkleVariants = {
    initial: { opacity: 0, rotate: 0 },
    animate: {
      opacity: [0, 1, 0],
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  if (!animated) {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div
          className="rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
          style={{ width: size, height: size }}
        >
          <Heart className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} fill="currentColor" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`relative flex items-center justify-center cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      variants={logoVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className="rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden"
        style={{ width: size, height: size }}
      >
        <motion.div variants={heartVariants} initial="initial" animate={["animate", "pulse"]}>
          <Heart className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} fill="currentColor" />
        </motion.div>

        {/* Sparkle effects */}
        <motion.div className="absolute top-1 right-1" variants={sparkleVariants} initial="initial" animate="animate">
          <Sparkles className="text-yellow-300" style={{ width: size * 0.2, height: size * 0.2 }} />
        </motion.div>

        <motion.div
          className="absolute bottom-1 left-1"
          variants={sparkleVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: "1s" }}
        >
          <Sparkles className="text-pink-200" style={{ width: size * 0.15, height: size * 0.15 }} />
        </motion.div>

        {/* Gradient overlay for extra shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full" />
      </motion.div>
    </motion.div>
  )
}
