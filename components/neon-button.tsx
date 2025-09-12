"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "cyber" | "glass" | "holographic" | "kawaii"
  size?: "sm" | "md" | "lg"
  glitchEffect?: boolean
}

export function NeonButton({
  children,
  className,
  variant = "cyber",
  size = "md",
  glitchEffect = false,
  ...props
}: NeonButtonProps) {
  const variantClasses = {
    cyber: "cyber-button text-white font-semibold",
    glass: "glass-effect border-2 border-pink-500/30 hover:border-pink-500/60 text-pink-100",
    holographic: "holographic-shimmer text-white font-bold",
    kawaii:
      "bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white kawaii-element",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const effectClasses = glitchEffect ? "glitch-effect" : ""

  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300 transform hover:scale-105",
        "energy-wave sparkle-trail",
        variantClasses[variant],
        sizeClasses[size],
        effectClasses,
        className,
      )}
      data-text={typeof children === "string" ? children : ""}
      {...props}
    >
      {children}
    </Button>
  )
}
