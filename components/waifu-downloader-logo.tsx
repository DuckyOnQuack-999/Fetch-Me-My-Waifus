"use client"
import { motion } from "framer-motion"
import { Heart, Download, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface WaifuDownloaderLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function WaifuDownloaderLogo({ className, size = "md", animated = true }: WaifuDownloaderLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const LogoComponent = animated ? motion.div : "div"
  const animationProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {}

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
    <LogoComponent
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg",
        sizeClasses[size],
        className,
      )}
      {...animationProps}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      {/* Background Circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-lg"
        style={{ width: sizeClasses[size], height: sizeClasses[size] }}
      />

      {/* Inner Circle */}
      <motion.div
        className="absolute inset-1 rounded-full bg-background/90 backdrop-blur-sm"
        style={{
          width: sizeClasses[size].replace("h-", "").replace("w-", "") - 8,
          height: sizeClasses[size].replace("h-", "").replace("w-", "") - 8,
        }}
      />

      {/* Heart Icon */}
      <motion.div
        className="absolute"
        variants={animated ? heartVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <Heart
          className="text-pink-500"
          size={Number.parseInt(sizeClasses[size].replace("h-", "").replace("w-", "")) * 0.3}
          fill="currentColor"
        />
      </motion.div>

      {/* Download Icon */}
      <motion.div
        className="absolute bottom-1 right-1"
        variants={animated ? downloadVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <Download
          className="text-blue-500"
          size={Number.parseInt(sizeClasses[size].replace("h-", "").replace("w-", "")) * 0.2}
        />
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
            <Sparkles
              className="text-yellow-400"
              size={Number.parseInt(sizeClasses[size].replace("h-", "").replace("w-", "")) * 0.15}
            />
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
            <Sparkles
              className="text-purple-400"
              size={Number.parseInt(sizeClasses[size].replace("h-", "").replace("w-", "")) * 0.12}
            />
          </motion.div>
        </>
      )}

      {/* Pulse Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-pink-500/30"
          style={{ width: sizeClasses[size], height: sizeClasses[size] }}
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

      {/* SVG Logo */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-2/3 w-2/3"
      >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
        <path d="M21 15.5c-1.5 1.5-4 1.5-5.5 0" />
        <path d="M8.5 15.5c-1.5 1.5-4 1.5-5.5 0" />
      </svg>
    </LogoComponent>
  )
}

export default WaifuDownloaderLogo
