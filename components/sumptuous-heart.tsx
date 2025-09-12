"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface SumptuousHeartProps {
  className?: string
  size?: number
  fill?: boolean
}

export function SumptuousHeart({ className, size = 24, fill = false }: SumptuousHeartProps) {
  const heartVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
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

  return (
    <motion.div className={className} variants={heartVariants} initial="initial" animate="animate" whileHover="hover">
      <Heart size={size} fill={fill ? "currentColor" : "none"} className="text-red-300" />
    </motion.div>
  )
}
