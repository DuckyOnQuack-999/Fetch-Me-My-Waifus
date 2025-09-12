"use client"
import { ParticleSystem } from "./particle-system"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden">
      {/* Matrix rain effect */}
      <div className="matrix-rain" />

      {/* Floating hearts */}
      <div className="floating-hearts" />

      {/* Circuit pattern */}
      <div className="circuit-pattern" />

      {/* Cyber grid */}
      <div className="cyber-grid" />

      {/* Particle system */}
      <ParticleSystem particleCount={30} />

      {/* Additional animated layers */}
      <div className="absolute inset-0 quantum-particles" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl animate-pulse-slow"
        style={{ animationDelay: "-1s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-pink-500/10 blur-2xl animate-bounce-slow"
        style={{ animationDelay: "-2s" }}
      />
    </div>
  )
}
