"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedStatsProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

export function AnimatedStats({
  value,
  duration = 2000,
  className = "",
  suffix = "",
  prefix = "",
}: AnimatedStatsProps) {
  const [displayValue, setDisplayValue] = useState(0)

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const display = useTransform(spring, (latest) => Math.round(latest))

  useEffect(() => {
    spring.set(value)

    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest)
    })

    return () => unsubscribe()
  }, [value, spring, display])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  )
}
