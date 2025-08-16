"use client"

import { motion } from "framer-motion"
import { Heart, Download, Sparkles } from "lucide-react"

interface WaifuDownloaderLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export function WaifuDownloaderLogo({ size = 32, className = "", animated = true }: WaifuDownloaderLogoProps) {
  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const heartVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
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
  }

  const downloadVariants = {
    initial: { y: -10, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        delay: 0.7,
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
      },
    },
  }

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      {/* Background Circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg"
        style={{ width: size, height: size }}
      />

      {/* Inner Circle */}
      <motion.div
        className="absolute inset-1 rounded-full bg-background/90 backdrop-blur-sm"
        style={{ width: size - 8, height: size - 8 }}
      />

      {/* Heart Icon */}
      <motion.div
        className="absolute"
        variants={animated ? heartVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <Heart className="text-pink-500" size={size * 0.3} fill="currentColor" />
      </motion.div>

      {/* Download Icon */}
      <motion.div
        className="absolute bottom-1 right-1"
        variants={animated ? downloadVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <Download className="text-blue-500" size={size * 0.2} />
      </motion.div>

      {/* Sparkle Effects */}
      {animated && (
        <>
          <motion.div
            className="absolute -top-1 -right-1"
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
          >
            <Sparkles className="text-yellow-400" size={size * 0.15} />
          </motion.div>

          <motion.div
            className="absolute -bottom-1 -left-1"
            variants={{
              ...sparkleVariants,
              animate: {
                ...sparkleVariants.animate,
                transition: {
                  ...sparkleVariants.animate.transition,
                  delay: 1.2,
                },
              },
            }}
            initial="initial"
            animate="animate"
          >
            <Sparkles className="text-purple-400" size={size * 0.12} />
          </motion.div>
        </>
      )}

      {/* Pulse Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-pink-500/30"
          style={{ width: size, height: size }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  )
}

export default WaifuDownloaderLogo
