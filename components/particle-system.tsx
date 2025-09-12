"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: "heart" | "star" | "sparkle" | "dot"
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  particleCount?: number
  interactive?: boolean
}

export function ParticleSystem({ particleCount = 50, interactive = true }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  const colors = ["#ff0066", "#ff3399", "#ff66cc", "#ff99dd"]

  const createParticle = useCallback((): Particle => {
    const types: Particle["type"][] = ["heart", "star", "sparkle", "dot"]
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    }
  }, [])

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
        ctx.beginPath()
        ctx.arc(x - size / 4, y - size / 4, size / 4, 0, Math.PI * 2)
        ctx.arc(x + size / 4, y - size / 4, size / 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(x, y + size / 4)
        ctx.lineTo(x - size / 2, y - size / 4)
        ctx.lineTo(x + size / 2, y - size / 4)
        ctx.closePath()
        ctx.fill()
        break
      case "star":
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
          const x1 = x + Math.cos(angle) * size
          const y1 = y + Math.sin(angle) * size
          const x2 = x + (Math.cos(angle + Math.PI / 5) * size) / 2
          const y2 = y + (Math.sin(angle + Math.PI / 5) * size) / 2
          if (i === 0) ctx.moveTo(x1, y1)
          else ctx.lineTo(x1, y1)
          ctx.lineTo(x2, y2)
        }
        ctx.closePath()
        ctx.fill()
        break
      case "sparkle":
        ctx.beginPath()
        ctx.moveTo(x, y - size)
        ctx.lineTo(x + size / 3, y - size / 3)
        ctx.lineTo(x + size, y)
        ctx.lineTo(x + size / 3, y + size / 3)
        ctx.lineTo(x, y + size)
        ctx.lineTo(x - size / 3, y + size / 3)
        ctx.lineTo(x - size, y)
        ctx.lineTo(x - size / 3, y - size / 3)
        ctx.closePath()
        ctx.fill()
        break
      default:
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.restore()
  }, [])

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // Fade out over time
      particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)

      // Interactive mouse attraction
      if (interactive) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = ((100 - distance) / 100) * 0.01
          particle.vx += dx * force
          particle.vy += dy * force
        }
      }

      drawParticle(ctx, particle)

      return particle.y > -50 && particle.life < particle.maxLife && particle.opacity > 0
    })

    // Add new particles
    while (particlesRef.current.length < particleCount) {
      particlesRef.current.push(createParticle())
    }

    animationRef.current = requestAnimationFrame(updateParticles)
  }, [particleCount, interactive, createParticle, drawParticle])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!interactive) return

      // Create burst effect
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const speed = Math.random() * 5 + 2
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: "sparkle",
          life: 0,
          maxLife: 60,
        })
      }
    },
    [interactive],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("click", handleClick)
    }

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, createParticle)

    updateParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("click", handleClick)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, interactive, createParticle, updateParticles, handleMouseMove, handleClick])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ mixBlendMode: "screen" }} />
  )
}
