"use client"

import type React from "react"
import { Badge as FluentBadge, makeStyles, tokens, shorthands } from "@fluentui/react-components"
import { cn } from "@/lib/utils"

const useStyles = makeStyles({
  default: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  secondary: {
    backgroundColor: tokens.colorNeutralBackground4,
    color: tokens.colorNeutralForeground2,
  },
  destructive: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  outline: {
    backgroundColor: "transparent",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    color: tokens.colorNeutralForeground2,
  },
})

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const styles = useStyles()

  const getVariantStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondary
      case "destructive":
        return styles.destructive
      case "outline":
        return styles.outline
      default:
        return styles.default
    }
  }

  return (
    <FluentBadge className={cn(getVariantStyle(), className)} appearance="filled">
      {children}
    </FluentBadge>
  )
}
