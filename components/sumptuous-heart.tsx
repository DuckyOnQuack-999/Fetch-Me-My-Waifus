import { cn } from "@/lib/utils"

interface SumptuousHeartProps {
  className?: string
  size?: "sm" | "md" | "lg"
  filled?: boolean
  animated?: boolean
  color?: "red" | "pink" | "purple" | "gradient"
}

export function SumptuousHeart({
  className,
  size = "md",
  filled = false,
  animated = false,
  color = "red",
}: SumptuousHeartProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const colorClasses = {
    red: filled ? "text-red-500 fill-red-500" : "text-red-500",
    pink: filled ? "text-pink-500 fill-pink-500" : "text-pink-500",
    purple: filled ? "text-purple-500 fill-purple-500" : "text-purple-500",
    gradient: filled ? "text-pink-500 fill-pink-500" : "text-pink-500",
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "w-full h-full transition-all duration-300",
          colorClasses[color],
          animated && "animate-pulse hover:scale-110",
          "drop-shadow-sm",
        )}
      >
        <defs>
          {color === "gradient" && (
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          )}
        </defs>

        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={color === "gradient" ? "url(#heartGradient)" : undefined}
        />
      </svg>

      {/* Sparkle effect for filled hearts */}
      {filled && animated && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping opacity-75 animation-delay-300" />
        </>
      )}
    </div>
  )
}
