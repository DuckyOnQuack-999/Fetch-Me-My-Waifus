"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedStatsProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedStats({ value, duration = 2, className }: AnimatedStatsProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = display.onChange((latest) => {
      setDisplayValue(latest)
    })
    return unsubscribe
  }, [display])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  )
}
