"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface AnimatedStatsProps {
  icon: LucideIcon
  label: string
  value: number
  delay?: number
}

export const AnimatedStats: React.FC<AnimatedStatsProps> = ({ icon: Icon, label, value, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6 text-center">
          <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-3xl font-bold mb-1"
          >
            {value}
          </motion.div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
