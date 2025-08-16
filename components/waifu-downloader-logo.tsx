"use client"
import { cn } from "@/lib/utils"

interface WaifuDownloaderLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function WaifuDownloaderLogo({ className, size = "md", animated = false }: WaifuDownloaderLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold",
        sizeClasses[size],
        animated && "animate-pulse",
        className,
      )}
    >
      <span
        className={cn(
          "font-extrabold",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-lg",
        )}
      >
        WD
      </span>
    </div>
  )
}
