"use client"

import { motion } from "framer-motion"
import { Heart, Download, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface WaifuDownloaderLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  animated?: boolean
  cyber?: boolean
}

export function WaifuDownloaderLogo({
  className,
  size = "md",
  animated = true,
  cyber = true,
}: WaifuDownloaderLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const LogoComponent = animated ? motion.div : "div"

  const logoVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        rotate: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
  }

  const heartVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    hover: {
      scale: 1.3,
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
      y: -3,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 0.8, 1],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0.7, 1],
      transition: {
        delay: 0.7,
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 3,
        ease: "easeInOut",
      },
    },
  }

  const glowVariants = {
    animate: {
      boxShadow: ["0 0 20px var(--neon-primary)", "0 0 40px var(--neon-secondary)", "0 0 20px var(--neon-primary)"],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <LogoComponent
      className={cn(
        "relative flex items-center justify-center rounded-lg text-white shadow-lg cursor-pointer",
        cyber ? "holographic" : "bg-gradient-to-br from-pink-400 to-red-500",
        sizeClasses[size],
        className,
      )}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      {/* Cyber Background Effect */}
      {cyber && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          variants={animated ? glowVariants : undefined}
          animate={animated ? "animate" : undefined}
          style={{
            background: "linear-gradient(135deg, var(--neon-primary), var(--neon-secondary))",
            filter: "blur(1px)",
          }}
        />
      )}

      {/* Main Background */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg",
          cyber
            ? "bg-gradient-to-br from-[var(--neon-primary)] via-[var(--neon-secondary)] to-[var(--neon-accent)]"
            : "bg-gradient-to-br from-pink-400 via-red-400 to-pink-500",
        )}
        style={{
          boxShadow: cyber ? "0 0 30px var(--neon-glow)" : "0 4px 20px rgba(255, 105, 180, 0.4)",
        }}
      />

      {/* Inner Circle */}
      <motion.div
        className="absolute inset-1 rounded-lg bg-background/90 backdrop-blur-sm border border-white/20"
        style={{
          background: cyber
            ? "radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3))"
            : "radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
        }}
      />

      {/* Heart Icon */}
      <motion.div
        className="absolute z-10"
        variants={animated ? heartVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <Heart
          className={cn(cyber ? "text-[var(--neon-primary)]" : "text-red-300", "drop-shadow-[0_0_10px_currentColor]")}
          size={Number.parseInt(sizeClasses[size].replace(/[^\d]/g, "")) * 0.3}
          fill="currentColor"
        />
      </motion.div>

      {/* Download Icon */}
      <motion.div
        className="absolute bottom-1 right-1 z-10"
        variants={animated ? downloadVariants : undefined}
        initial={animated ? "initial" : undefined}
        animate={animated ? "animate" : undefined}
        whileHover={animated ? "hover" : undefined}
      >
        <Download
          className={cn(cyber ? "text-[var(--neon-secondary)]" : "text-pink-300", "drop-shadow-[0_0_8px_currentColor]")}
          size={Number.parseInt(sizeClasses[size].replace(/[^\d]/g, "")) * 0.2}
        />
      </motion.div>

      {/* Cyber Enhancement - Zap Icon */}
      {cyber && (
        <motion.div
          className="absolute top-1 left-1 z-10"
          variants={animated ? downloadVariants : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
          whileHover={animated ? "hover" : undefined}
        >
          <Zap
            className="text-[var(--neon-accent)] drop-shadow-[0_0_6px_currentColor]"
            size={Number.parseInt(sizeClasses[size].replace(/[^\d]/g, "")) * 0.15}
            fill="currentColor"
          />
        </motion.div>
      )}

      {/* Sparkle Effects */}
      {animated && (
        <>
          <motion.div
            className="absolute -top-1 -right-1 z-20"
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
          >
            <Sparkles
              className={cn(
                cyber ? "text-[var(--neon-accent)]" : "text-yellow-300",
                "drop-shadow-[0_0_8px_currentColor]",
              )}
              size={Number.parseInt(sizeClasses[size].replace(/[^\d]/g, "")) * 0.15}
            />
          </motion.div>

          <motion.div
            className="absolute -bottom-1 -left-1 z-20"
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
              className={cn(
                cyber ? "text-[var(--neon-primary)]" : "text-purple-300",
                "drop-shadow-[0_0_6px_currentColor]",
              )}
              size={Number.parseInt(sizeClasses[size].replace(/[^\d]/g, "")) * 0.12}
            />
          </motion.div>
        </>
      )}

      {/* Pulse Ring Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 pointer-events-none"
          style={{
            borderColor: cyber ? "var(--neon-primary)" : "#ff69b4",
          }}
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

      {/* Central Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "h-2/3 w-2/3 z-10 relative",
          cyber ? "text-white drop-shadow-[0_0_10px_var(--neon-primary)]" : "text-gray-700",
        )}
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
