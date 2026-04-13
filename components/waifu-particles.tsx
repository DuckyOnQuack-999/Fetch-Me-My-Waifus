"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
  type: "circle" | "heart" | "sakura"
  rotation: number
  rotationSpeed: number
}

export default function WaifuParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [isVisible, setIsVisible] = useState(true)

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const colors = [
      "#dc2626", // red-600
      "#ec4899", // pink-500
      "#f43f5e", // rose-500
      "#e11d48", // rose-600
      "#fb7185", // rose-400
      "#f472b6", // pink-400
    ]

    const types: Array<"circle" | "heart" | "sakura"> = ["circle", "heart", "sakura"]
    const type = types[Math.floor(Math.random() * types.length)]

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: type === "heart" ? Math.random() * 8 + 4 : Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: type === "sakura" ? Math.random() * 0.5 + 0.2 : (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }
  }, [])

  const drawHeart = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    const topCurveHeight = size * 0.3
    ctx.moveTo(x, y + topCurveHeight)
    // Left curve
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight)
    ctx.bezierCurveTo(
      x - size / 2,
      y + (size + topCurveHeight) / 2,
      x,
      y + (size + topCurveHeight) / 2 + size * 0.2,
      x,
      y + size,
    )
    // Right curve
    ctx.bezierCurveTo(
      x,
      y + (size + topCurveHeight) / 2 + size * 0.2,
      x + size / 2,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + topCurveHeight,
    )
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight)
    ctx.closePath()
    ctx.fill()
  }, [])

  const drawSakura = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Draw a simple petal shape
      ctx.beginPath()
      ctx.ellipse(0, 0, size * 0.5, size, 0, 0, Math.PI * 2)
      ctx.fill()

      // Add a notch at the top
      ctx.globalCompositeOperation = "destination-out"
      ctx.beginPath()
      ctx.arc(0, -size * 0.8, size * 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = "source-over"

      ctx.restore()
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }, 100)
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particleCount = Math.min(40, Math.floor((window.innerWidth * window.innerHeight) / 40000))
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas))

    const animate = () => {
      if (!ctx || !canvas || !isVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        ctx.globalAlpha = particle.opacity

        if (particle.type === "heart") {
          ctx.fillStyle = particle.color
          drawHeart(ctx, particle.x, particle.y, particle.size)
        } else if (particle.type === "sakura") {
          ctx.fillStyle = particle.color
          drawSakura(ctx, particle.x, particle.y, particle.size, particle.rotation)
          particle.rotation += particle.rotationSpeed
        } else {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        }

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen
        if (particle.x < -10) particle.x = canvas.width + 10
        if (particle.x > canvas.width + 10) particle.x = -10
        if (particle.y < -10) particle.y = canvas.height + 10
        if (particle.y > canvas.height + 10) particle.y = -10
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener("resize", handleResize)

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearTimeout(resizeTimeout)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createParticle, drawHeart, drawSakura, isVisible])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2 }}
      aria-hidden="true"
    />
  )
}
