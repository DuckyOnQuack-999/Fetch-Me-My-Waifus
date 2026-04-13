"use client"

import type React from "react"
import { Text, makeStyles, tokens, shorthands } from "@fluentui/react-components"
import { cn } from "@/lib/utils"

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow8,
    ...shorthands.transition("all", "200ms"),
    "&:hover": {
      boxShadow: tokens.shadow16,
      borderColor: tokens.colorBrandStroke1,
    },
  },
  header: {
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.colorNeutralStroke2,
  },
  content: {
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalXS,
  },
})

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  const styles = useStyles()
  return <div className={cn(styles.card, "fluent-card", className)}>{children}</div>
}

interface CardHeaderComponentProps {
  children: React.ReactNode
  className?: string
}

export function CardHeaderComponent({ children, className }: CardHeaderComponentProps) {
  const styles = useStyles()
  return <div className={cn(styles.header, className)}>{children}</div>
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  const styles = useStyles()
  return <Text className={cn(styles.title, className)}>{children}</Text>
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  const styles = useStyles()
  return <Text className={cn(styles.description, className)}>{children}</Text>
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  const styles = useStyles()
  return <div className={cn(styles.content, className)}>{children}</div>
}

// Re-export for compatibility
export { CardHeaderComponent as CardHeader }
