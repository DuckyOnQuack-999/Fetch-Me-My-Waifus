"use client"

import { useState } from "react"
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
  animated = false,
  onClick,
}: SumptuousHeartProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    if (onClick) {
      setIsClicked(true)
      onClick()
      setTimeout(() => setIsClicked(false), 300)
    }
  }

  return (
    <Heart
      size={size}
      className={cn(
        "transition-all duration-300 cursor-pointer",
        filled ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500",
        animated && "animate-pulse",
        isClicked && "scale-125",
        onClick && "hover:scale-110",
        className,
      )}
      onClick={handleClick}
    />
  )
}
