"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  type: "heart" | "star" | "sparkle" | "dot"
  opacity: number
}

interface ParticleSystemProps {
  className?: string
  particleCount?: number
  interactive?: boolean
}

export function ParticleSystem({ className = "", particleCount = 50, interactive = true }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })

  const colors = [
    "#ff0066", // neon-primary
    "#ff3399", // neon-secondary
    "#ff66cc", // neon-accent
    "#ff1a8c", // variant 1
    "#ff4db3", // variant 2
  ]

  const createParticle = useCallback(
    (x?: number, y?: number): Particle => {
      const canvas = canvasRef.current
      if (!canvas) return {} as Particle

      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        life: 0,
        maxLife: 120 + Math.random() * 60,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: ["heart", "star", "sparkle", "dot"][Math.floor(Math.random() * 4)] as Particle["type"],
        opacity: 1,
      }
    },
    [colors],
  )

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color
    ctx.shadowColor = particle.color
    ctx.shadowBlur = 10

    const x = particle.x
    const y = particle.y
    const size = particle.size

    switch (particle.type) {
      case "heart":
        // Draw heart shape
        ctx.beginPath()
        ctx.moveTo(x, y + size / 4)
        ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y + size / 4)
        ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 1.5)
        ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 4)
        ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y + size / 4)
        ctx.fill()
        break

      case "star":
        // Draw star shape
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = ((i * 144 - 90) * Math.PI) / 180
          const x1 = x + Math.cos(angle) * size
          const y1 = y + Math.sin(angle) * size
          if (i === 0) ctx.moveTo(x1, y1)
          else ctx.lineTo(x1, y1)

          const innerAngle = (((i + 0.5) * 144 - 90) * Math.PI) / 180
          const x2 = x + Math.cos(innerAngle) * (size / 2)
          const y2 = y + Math.sin(innerAngle) * (size / 2)
          ctx.lineTo(x2, y2)
        }
        ctx.closePath()
        ctx.fill()
        break

      case "sparkle":
        // Draw sparkle (diamond)
        ctx.beginPath()
        ctx.moveTo(x, y - size)
        ctx.lineTo(x + size / 2, y)
        ctx.lineTo(x, y + size)
        ctx.lineTo(x - size / 2, y)
        ctx.closePath()
        ctx.fill()
        break

      default:
        // Draw dot
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        break
    }

    ctx.restore()
  }, [])

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const particles = particlesRef.current

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]

      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // Add some drift
      particle.vx += (Math.random() - 0.5) * 0.1
      particle.vy += 0.05 // gravity

      // Update opacity based on life
      particle.opacity = 1 - particle.life / particle.maxLife

      // Remove dead particles
      if (particle.life >= particle.maxLife || particle.y > canvas.height + 50) {
        particles.splice(i, 1)
      }
    }

    // Add new particles
    while (particles.length < particleCount) {
      particles.push(createParticle())
    }

    // Add mouse interaction particles
    if (interactive && mouseRef.current.isMoving) {
      for (let i = 0; i < 3; i++) {
        particles.push(
          createParticle(
            mouseRef.current.x + (Math.random() - 0.5) * 50,
            mouseRef.current.y + (Math.random() - 0.5) * 50,
          ),
        )
      }
    }
  }, [createParticle, particleCount, interactive])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    updateParticles()

    particlesRef.current.forEach((particle) => {
      drawParticle(ctx, particle)
    })

    animationRef.current = requestAnimationFrame(render)
  }, [updateParticles, drawParticle])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
    mouseRef.current.isMoving = true

    // Reset moving flag after a delay
    setTimeout(() => {
      mouseRef.current.isMoving = false
    }, 100)
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Create burst effect
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2
        const speed = Math.random() * 5 + 2
        const particle = createParticle(x, y)
        particle.vx = Math.cos(angle) * speed
        particle.vy = Math.sin(angle) * speed
        particle.maxLife = 60
        particlesRef.current.push(particle)
      }
    },
    [createParticle],
  )

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initial setup
    resizeCanvas()

    // Initialize particles
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle())
    }

    // Event listeners
    window.addEventListener("resize", resizeCanvas)
    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("click", handleClick)
    }

    // Start animation
    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("click", handleClick)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [resizeCanvas, createParticle, particleCount, interactive, handleMouseMove, handleClick, render])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-${interactive ? "auto" : "none"} z-0 ${className}`}
      style={{ mixBlendMode: "normal", opacity: 0.7 }}
    />
  )
}
