"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnhancedCardProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "glass" | "cyber" | "holographic"
  animated?: boolean
  glowOnHover?: boolean
}

export function EnhancedCard({
  children,
  className,
  variant = "default",
  animated = true,
  glowOnHover = true,
}: EnhancedCardProps) {
  const variantClasses = {
    default: "material-card",
    glass: "glass-effect",
    cyber: "cyber-button",
    holographic: "holographic-shimmer",
  }

  const animationClasses = animated ? "sparkle-trail kawaii-element" : ""
  const glowClasses = glowOnHover ? "glow-pulse energy-wave" : ""

  return (
    <Card
      className={cn(
        variantClasses[variant],
        animationClasses,
        glowClasses,
        "transition-all duration-300 transform hover:scale-105",
        className,
      )}
    >
      {children}
    </Card>
  )
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
