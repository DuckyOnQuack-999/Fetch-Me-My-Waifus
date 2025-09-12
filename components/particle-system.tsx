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
  type: "heart" | "star" | "sparkle" | "circle"
}

interface ParticleSystemProps {
  particleCount?: number
  className?: string
}

export function ParticleSystem({ particleCount = 50, className = "" }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

  const colors = ["#ff0066", "#ff3399", "#ff66cc", "#ff99e6", "#ffccf2"]
  const particleTypes: Particle["type"][] = ["heart", "star", "sparkle", "circle"]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: Math.random() * 300 + 200,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
    })

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, createParticle)
    }

    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity * (1 - particle.life / particle.maxLife)
      ctx.fillStyle = particle.color
      ctx.shadowColor = particle.color
      ctx.shadowBlur = 10

      ctx.translate(particle.x, particle.y)

      switch (particle.type) {
        case "heart":
          drawHeart(ctx, particle.size)
          break
        case "star":
          drawStar(ctx, particle.size)
          break
        case "sparkle":
          drawSparkle(ctx, particle.size)
          break
        case "circle":
        default:
          ctx.beginPath()
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
          ctx.fill()
          break
      }

      ctx.restore()
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath()
      const x = 0,
        y = 0
      ctx.moveTo(x, y + size / 4)
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
      ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + (size * 3) / 4, x, y + size)
      ctx.bezierCurveTo(x, y + (size * 3) / 4, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
      ctx.fill()
    }

    const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        const x = Math.cos(angle) * size
        const y = Math.sin(angle) * size
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)

        const innerAngle = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2
        const innerX = Math.cos(innerAngle) * (size * 0.5)
        const innerY = Math.sin(innerAngle) * (size * 0.5)
        ctx.lineTo(innerX, innerY)
      }
      ctx.closePath()
      ctx.fill()
    }

    const drawSparkle = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(size * 0.2, -size * 0.2)
      ctx.lineTo(size, 0)
      ctx.lineTo(size * 0.2, size * 0.2)
      ctx.lineTo(0, size)
      ctx.lineTo(-size * 0.2, size * 0.2)
      ctx.lineTo(-size, 0)
      ctx.lineTo(-size * 0.2, -size * 0.2)
      ctx.closePath()
      ctx.fill()
    }

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // Mouse interaction
      const dx = mouseRef.current.x - particle.x
      const dy = mouseRef.current.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.vx += (dx / distance) * force * 0.1
        particle.vy += (dy / distance) * force * 0.1
      }

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      // Reset particle if it's too old
      if (particle.life > particle.maxLife) {
        Object.assign(particle, createParticle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        updateParticle(particle)
        drawParticle(particle)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[-1] ${className}`}
      style={{ mixBlendMode: "screen" }}
    />
  )
}
