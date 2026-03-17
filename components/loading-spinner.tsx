"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "hearts" | "sparkles"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", variant = "spinner", text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const containerSizes = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  }

  if (variant === "hearts") {
    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: i * 12 - 12 }}
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.15,
              }}
            >
              <Heart className={cn(sizeClasses[size], "text-primary")} fill="currentColor" />
            </motion.div>
          ))}
        </div>
        {text && (
          <motion.p
            className="text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === "sparkles") {
    return (
      <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Sparkles className={cn(sizeClasses[size], "text-primary")} />
        </motion.div>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }

  // Default spinner
  return (
    <div className={cn("flex flex-col items-center justify-center", containerSizes[size], className)}>
      <motion.div
        className={cn("rounded-full border-2 border-primary/30 border-t-primary", sizeClasses[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function FullPageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="relative"
          animate={{
            boxShadow: [
              "0 0 20px rgba(220, 38, 38, 0.3)",
              "0 0 40px rgba(220, 38, 38, 0.5)",
              "0 0 20px rgba(220, 38, 38, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-foreground">{text}</span>
          <motion.div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
