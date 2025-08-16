"use client"

import { useState, useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedStatsProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedStats({ value, duration = 2000, className = "" }: AnimatedStatsProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(easeOutQuart * value)

      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  )
}

interface CounterProps {
  from: number
  to: number
  duration?: number
}

export function Counter({ from, to, duration = 1 }: CounterProps) {
  const spring = useSpring(from, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    spring.set(to)
  }, [spring, to])

  return <motion.span>{display}</motion.span>
}

interface AnimatedNumberProps {
  value: number
  format?: (value: number) => string
  className?: string
}

export function AnimatedNumber({ value, format = (n) => n.toString(), className }: AnimatedNumberProps) {
  const spring = useSpring(0, { duration: 1500 })
  const display = useTransform(spring, (current) => format(Math.round(current)))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {display}
    </motion.span>
  )
}
