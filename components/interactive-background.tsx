"use client"

import { useEffect, useRef, useCallback } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  const createNodes = useCallback((count: number) => {
    const nodes: Node[] = []
    for (let i = 0; i < count; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      nodes.push({
        x,
        y,
        vx: 0,
        vy: 0,
        targetX: x,
        targetY: y,
      })
    }
    return nodes
  }, [])

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, nodes: Node[]) => {
    ctx.strokeStyle = "rgba(255, 105, 180, 0.1)"
    ctx.lineWidth = 1

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const opacity = ((150 - distance) / 150) * 0.2
          ctx.strokeStyle = `rgba(255, 105, 180, ${opacity})`
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update nodes
    nodesRef.current.forEach((node) => {
      // Mouse attraction
      const dx = mouseRef.current.x - node.x
      const dy = mouseRef.current.y - node.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 200) {
        const force = ((200 - distance) / 200) * 0.02
        node.vx += dx * force
        node.vy += dy * force
      }

      // Return to original position
      const returnForce = 0.01
      node.vx += (node.targetX - node.x) * returnForce
      node.vy += (node.targetY - node.y) * returnForce

      // Apply velocity with damping
      node.vx *= 0.95
      node.vy *= 0.95
      node.x += node.vx
      node.y += node.vy

      // Draw node
      ctx.fillStyle = "rgba(255, 105, 180, 0.3)"
      ctx.beginPath()
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    drawConnections(ctx, nodesRef.current)
    animationRef.current = requestAnimationFrame(animate)
  }, [drawConnections])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      nodesRef.current = createNodes(30)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createNodes, animate, handleMouseMove])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-5" />
}
