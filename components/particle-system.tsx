"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
  type: "heart" | "star" | "sparkle" | "bubble"
}

interface ParticleSystemProps {
  particleCount?: number
  className?: string
}

export function ParticleSystem({ particleCount = 50, className = "" }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  const colors = ["#ff0066", "#ff3399", "#ff66cc", "#ff99dd", "#ffccee"]
  const particleTypes: Particle["type"][] = ["heart", "star", "sparkle", "bubble"]

  const createParticle = (): Particle => {
    const canvas = canvasRef.current
    if (!canvas) return {} as Particle

    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: Math.random() * 300 + 200,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
    }
  }

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.globalAlpha = particle.opacity * (1 - particle.life / particle.maxLife)
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
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size)
        ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
        ctx.fill()
        break

      case "star":
        // Draw star shape
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
          const outerRadius = size
          const innerRadius = size * 0.4

          if (i === 0) {
            ctx.moveTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius)
          } else {
            ctx.lineTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius)
          }

          const innerAngle = angle + Math.PI / 5
          ctx.lineTo(x + Math.cos(innerAngle) * innerRadius, y + Math.sin(innerAngle) * innerRadius)
        }
        ctx.closePath()
        ctx.fill()
        break

      case "sparkle":
        // Draw sparkle (cross shape)
        ctx.beginPath()
        ctx.moveTo(x - size, y)
        ctx.lineTo(x + size, y)
        ctx.moveTo(x, y - size)
        ctx.lineTo(x, y + size)
        ctx.lineWidth = 2
        ctx.strokeStyle = particle.color
        ctx.stroke()
        break

      case "bubble":
        // Draw bubble (circle with gradient)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        break
    }

    ctx.restore()
  }

  const updateParticle = (particle: Particle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.life++

    // Add some floating motion
    particle.vx += (Math.random() - 0.5) * 0.1
    particle.vy += (Math.random() - 0.5) * 0.1

    // Fade out as life progresses
    particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)

    return particle.life < particle.maxLife && particle.y > -50
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      const alive = updateParticle(particle)
      if (alive) {
        drawParticle(ctx, particle)
      }
      return alive
    })

    // Add new particles
    while (particlesRef.current.length < particleCount) {
      particlesRef.current.push(createParticle())
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  const handleResize = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    handleResize()
    window.addEventListener("resize", handleResize)

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, createParticle)

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  )
}
