"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Matrix Rain Effect */}
      <div className="matrix-rain" />

      {/* Circuit Pattern */}
      <div className="circuit-pattern absolute inset-0" />

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div
              className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-30"
              style={{
                boxShadow: "0 0 10px currentColor",
              }}
            />
          </div>
        ))}
      </div>

      {/* Pulsing Orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse-slow"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(i) * 40}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div
              className="w-32 h-32 rounded-full opacity-10"
              style={{
                background: `radial-gradient(circle, var(--neon-primary) 0%, transparent 70%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Scan Lines */}
      <div className="scan-lines absolute inset-0" />

      {/* Energy Waves */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px opacity-20"
            style={{
              top: `${20 + i * 20}%`,
              background: `linear-gradient(90deg, transparent, var(--neon-primary), transparent)`,
              animation: `slideRight ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${0.8 + Math.random() * 1}rem`,
            }}
          >
            ♡
          </div>
        ))}
      </div>

      {/* Holographic Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 105, 180, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 105, 180, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "gridPulse 8s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        @keyframes gridPulse {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  )
}
