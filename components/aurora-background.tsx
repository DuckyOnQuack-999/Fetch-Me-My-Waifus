"use client"

import { useEffect, useRef } from "react"

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawAurora = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2 + Math.sin(time * 0.01) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.008) * 50,
        0,
        canvas.width * 0.2,
        canvas.height * 0.3,
        canvas.width * 0.6,
      )
      gradient1.addColorStop(0, "rgba(255, 0, 102, 0.1)")
      gradient1.addColorStop(1, "transparent")

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8 + Math.cos(time * 0.012) * 80,
        canvas.height * 0.7 + Math.sin(time * 0.01) * 60,
        0,
        canvas.width * 0.8,
        canvas.height * 0.7,
        canvas.width * 0.5,
      )
      gradient2.addColorStop(0, "rgba(255, 105, 180, 0.08)")
      gradient2.addColorStop(1, "transparent")

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time++
      animationId = requestAnimationFrame(drawAurora)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    drawAurora()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
}
