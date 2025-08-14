"use client"

import { useEffect, useState } from "react"

export function SumptuousHeart() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate floating particles around the heart
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100, // Random position around center
      y: Math.random() * 200 - 100,
      delay: Math.random() * 2, // Random animation delay
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-pink-400/60 rounded-full animate-float-particle"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Main Heart with Glow Effect */}
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 animate-pulse">
          <svg viewBox="0 0 24 24" className="w-20 h-20 text-pink-400/40 filter blur-sm" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Middle Glow */}
        <div className="absolute inset-0 animate-pulse" style={{ animationDelay: "0.5s" }}>
          <svg viewBox="0 0 24 24" className="w-18 h-18 text-rose-400/60 filter blur-xs" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Main Heart */}
        <svg viewBox="0 0 24 24" className="w-16 h-16 text-red-500 animate-heartbeat relative z-10" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

        {/* Inner Sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-sparkle opacity-80"></div>
        </div>
      </div>

      {/* Orbiting Hearts */}
      <div className="absolute inset-0 animate-spin-slow">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-pink-400" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-rose-400" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-red-400" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-red-300" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
