"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  className?: string
  size?: number
  filled?: boolean
  animated?: boolean
  onClick?: () => void
}

export function SumptuousHeart({
  className,
  size = 24,
  filled = false,
  animated = true,
  onClick,
}: SumptuousHeartProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isClicked, setIsClicked] = React.useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
    onClick?.()
  }

  const HeartComponent = animated ? motion.div : "div"
  const animationProps = animated
    ? {
        animate: {
          scale: isClicked ? 1.3 : isHovered ? 1.1 : 1,
          rotate: isClicked ? [0, -10, 10, 0] : 0,
        },
        transition: {
          duration: isClicked ? 0.3 : 0.2,
          ease: "easeInOut",
        },
      }
    : {}

  return (
    <HeartComponent
      className={cn("cursor-pointer inline-flex items-center justify-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...animationProps}
    >
      <Heart
        size={size}
        className={cn(
          "transition-colors duration-200",
          filled ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400",
          isHovered && !filled && "text-red-400",
        )}
      />
    </HeartComponent>
  )
}
