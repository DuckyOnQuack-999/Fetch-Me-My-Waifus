import { cn } from "@/lib/utils"

interface WaifuDownloaderLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

export function WaifuDownloaderLogo({ className, size = "md", animated = false }: WaifuDownloaderLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        animated && "animate-pulse",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#logoGradient)"
          opacity="0.1"
          className={animated ? "animate-pulse" : ""}
        />

        {/* Main logo shape - stylized "W" */}
        <path
          d="M20 25 L30 65 L40 35 L50 65 L60 35 L70 65 L80 25"
          stroke="url(#logoGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
          className={animated ? "animate-pulse" : ""}
        />

        {/* Decorative elements */}
        <circle cx="25" cy="20" r="3" fill="url(#logoGradient)" opacity="0.7" />
        <circle cx="75" cy="20" r="3" fill="url(#logoGradient)" opacity="0.7" />
        <circle cx="50" cy="75" r="4" fill="url(#logoGradient)" opacity="0.8" />

        {/* Inner accent */}
        <path
          d="M35 45 L45 55 L55 45"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Animated ring for extra flair */}
      {animated && <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />}
    </div>
  )
}
