"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  features: string[]
  status?: "available" | "coming-soon" | "beta"
  onClick?: () => void
  className?: string
  gradient?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  features,
  status = "available",
  onClick,
  className,
  gradient = "from-blue-500/10 to-purple-500/10",
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const statusConfig = {
    available: { label: "Available", variant: "default" as const },
    "coming-soon": { label: "Coming Soon", variant: "secondary" as const },
    beta: { label: "Beta", variant: "outline" as const },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1",
          isHovered && "border-primary/50",
          className,
        )}
        onClick={onClick}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="mt-1">{description}</CardDescription>
              </div>
            </div>
            <Badge variant={statusConfig[status].variant} className="text-xs">
              {statusConfig[status].label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {feature}
              </motion.div>
            ))}
          </div>

          {status === "available" && onClick && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" size="sm" className="w-full mt-4 bg-background/80 backdrop-blur-sm">
                Try Now
              </Button>
            </motion.div>
          )}

          {status === "coming-soon" && (
            <div className="text-xs text-muted-foreground text-center mt-4 p-2 bg-muted/50 rounded">
              This feature is coming soon! Stay tuned for updates.
            </div>
          )}

          {status === "beta" && (
            <div className="text-xs text-muted-foreground text-center mt-4 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
              Beta feature - may have limited functionality
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
