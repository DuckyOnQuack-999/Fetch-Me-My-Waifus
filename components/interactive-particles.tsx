"use client"

import { useEffect, useRef, useState } from "react"

interface MouseParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

export function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<MouseParticle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const [isActive, setIsActive] = useState(false)

  const colors = ["#ff0066", "#ff3399", "#ff66cc", "#ff99dd"]

  const createMouseParticle = (x: number, y: number): MouseParticle => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 0,
      maxLife: 60,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  }

  const drawMouseParticle = (ctx: CanvasRenderingContext2D, particle: MouseParticle) => {
    const alpha = 1 - particle.life / particle.maxLife
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = particle.color
    ctx.shadowColor = particle.color
    ctx.shadowBlur = 15

    // Draw heart shape
    const x = particle.x
    const y = particle.y
    const size = particle.size

    ctx.beginPath()
    ctx.moveTo(x, y + size / 4)
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size)
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
    ctx.fill()

    ctx.restore()
  }

  const updateMouseParticle = (particle: MouseParticle): boolean => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vx *= 0.98
    particle.vy *= 0.98
    particle.life++

    return particle.life < particle.maxLife
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw mouse particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      const alive = updateMouseParticle(particle)
      if (alive) {
        drawMouseParticle(ctx, particle)
      }
      return alive
    })

    animationRef.current = requestAnimationFrame(animate)
  }

  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }

    if (isActive && Math.random() < 0.3) {
      particlesRef.current.push(createMouseParticle(e.clientX, e.clientY))
    }
  }

  const handleMouseEnter = () => setIsActive(true)
  const handleMouseLeave = () => setIsActive(false)

  const handleClick = (e: MouseEvent) => {
    // Create burst of particles on click
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push(createMouseParticle(e.clientX, e.clientY))
    }
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
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("click", handleClick)

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("click", handleClick)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ mixBlendMode: "screen" }} />
  )
}
