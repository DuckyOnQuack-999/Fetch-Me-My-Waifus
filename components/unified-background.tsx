"use client"

import { ParticleSystem } from "./particle-system"
import { AuroraBackground } from "./aurora-background"
import { InteractiveBackground } from "./interactive-background"

interface UnifiedBackgroundProps {
  enableParticles?: boolean
  enableAurora?: boolean
  enableInteractive?: boolean
  intensity?: "low" | "medium" | "high"
}

export function UnifiedBackground({
  enableParticles = true,
  enableAurora = true,
  enableInteractive = false, // Disabled by default to reduce fog
  intensity = "medium",
}: UnifiedBackgroundProps) {
  const getParticleCount = () => {
    switch (intensity) {
      case "low":
        return 20
      case "medium":
        return 35
      case "high":
        return 50
      default:
        return 35
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Aurora background - always at the back */}
      {enableAurora && (
        <div className="absolute inset-0 z-0">
          <AuroraBackground />
        </div>
      )}

      {/* Interactive background - middle layer */}
      {enableInteractive && (
        <div className="absolute inset-0 z-1">
          <InteractiveBackground />
        </div>
      )}

      {/* Particle system - front layer */}
      {enableParticles && (
        <div className="absolute inset-0 z-2">
          <ParticleSystem particleCount={getParticleCount()} interactive={true} />
        </div>
      )}
    </div>
  )
}
