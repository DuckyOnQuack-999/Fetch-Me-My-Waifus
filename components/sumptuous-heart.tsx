"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  className?: string
  size?: number
  fill?: boolean
  animated?: boolean
  glowing?: boolean
}

export function SumptuousHeart({
  className,
  size = 24,
  fill = false,
  animated = true,
  glowing = true,
}: SumptuousHeartProps) {
  const heartVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        rotate: {
          duration: 0.5,
          ease: "easeInOut",
        },
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const HeartComponent = animated ? motion.div : "div"

  return (
    <HeartComponent
      className={cn("inline-flex items-center justify-center cursor-pointer", glowing && "kawaii-heart", className)}
      variants={animated ? heartVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? ["animate", "pulse"] : undefined}
      whileHover={animated ? "hover" : undefined}
    >
      <Heart
        size={size}
        fill={fill ? "currentColor" : "none"}
        className={cn(
          "transition-all duration-300",
          glowing && "drop-shadow-[0_0_8px_var(--neon-primary)]",
          fill && "text-[var(--neon-primary)]",
        )}
      />
    </HeartComponent>
  )
}
