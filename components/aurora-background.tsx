"use client"

export function AuroraBackground() {
  return (
    <>
      {/* Aurora layers - reduced opacity */}
      <div className="aurora-bg opacity-30" />

      {/* Circuit pattern overlay - reduced opacity */}
      <div className="circuit-pattern opacity-20" />

      {/* Floating orbs - reduced size and opacity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-64 h-64 rounded-full opacity-5 animate-pulse-slow"
          style={{
            background: "radial-gradient(circle, #ff0066 0%, transparent 70%)",
            top: "10%",
            left: "20%",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-8 animate-pulse-slow"
          style={{
            background: "radial-gradient(circle, #ff3399 0%, transparent 70%)",
            top: "60%",
            right: "15%",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-56 h-56 rounded-full opacity-4 animate-pulse-slow"
          style={{
            background: "radial-gradient(circle, #ff66cc 0%, transparent 70%)",
            bottom: "20%",
            left: "30%",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Energy streams - reduced opacity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-1 h-full opacity-10 energy-wave"
          style={{
            background: "linear-gradient(to bottom, transparent, #ff0066, transparent)",
            left: "25%",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute w-1 h-full opacity-8 energy-wave"
          style={{
            background: "linear-gradient(to bottom, transparent, #ff3399, transparent)",
            right: "35%",
            animationDelay: "3s",
          }}
        />
      </div>
    </>
  )
}
