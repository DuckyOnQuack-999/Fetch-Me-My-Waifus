"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Heart, FolderOpen, Zap } from "lucide-react"

interface StatsProps {
  totalDownloads: number
  favoritesCount: number
  collectionsCount: number
  activeDownloads: number
  downloadQueue: any[]
}

export function OptimizedStats({
  totalDownloads,
  favoritesCount,
  collectionsCount,
  activeDownloads,
  downloadQueue,
}: StatsProps) {
  const stats = useMemo(
    () => [
      {
        title: "Total Downloads",
        value: totalDownloads,
        icon: Download,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        change: "+12%",
      },
      {
        title: "Favorites",
        value: favoritesCount,
        icon: Heart,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        change: "+5%",
      },
      {
        title: "Collections",
        value: collectionsCount,
        icon: FolderOpen,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        change: "+2%",
      },
      {
        title: "Active Downloads",
        value: activeDownloads,
        icon: Zap,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        change: downloadQueue.length > 0 ? "In Progress" : "Idle",
      },
    ],
    [totalDownloads, favoritesCount, collectionsCount, activeDownloads, downloadQueue.length],
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="material-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-green-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
