"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, ImageIcon, Clock, Star, Zap, Activity, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { AnimatedStats } from "./animated-stats"
import { SumptuousHeart } from "./sumptuous-heart"

export function HomeDashboard() {
  const { images, favorites, collections, downloadHistory } = useStorage()
  const { downloads, totalProgress, isDownloading } = useDownload()
  const { settings } = useSettings()
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Generate recent activity from download history and favorites
    const activity = [
      ...downloadHistory.slice(0, 5).map((item) => ({
        type: "download",
        title: `Downloaded ${item.filename}`,
        time: new Date(item.timestamp),
        icon: Download,
        color: "text-green-500",
      })),
      ...favorites.slice(0, 3).map((id) => {
        const image = images.find((img) => img.image_id.toString() === id)
        return {
          type: "favorite",
          title: `Added to favorites`,
          subtitle: image?.tags?.[0] || "Unknown",
          time: new Date(),
          icon: Heart,
          color: "text-pink-500",
        }
      }),
    ]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 8)

    setRecentActivity(activity)
  }, [downloadHistory, favorites, images])

  const stats = [
    {
      title: "Total Images",
      value: images.length,
      icon: ImageIcon,
      color: "text-blue-500",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Favorites",
      value: favorites.length,
      icon: Heart,
      color: "text-pink-500",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Collections",
      value: Object.keys(collections).length,
      icon: Star,
      color: "text-yellow-500",
      change: "+3%",
      changeType: "positive" as const,
    },
    {
      title: "Downloads Today",
      value: downloadHistory.filter((item) => {
        const today = new Date()
        const itemDate = new Date(item.timestamp)
        return itemDate.toDateString() === today.toDateString()
      }).length,
      icon: Download,
      color: "text-green-500",
      change: "+25%",
      changeType: "positive" as const,
    },
  ]

  const quickActions = [
    {
      title: "Start Download",
      description: "Download new images from APIs",
      icon: Download,
      href: "/?tab=download",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    {
      title: "Browse Gallery",
      description: "View your image collection",
      icon: ImageIcon,
      href: "/gallery",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      title: "Manage Favorites",
      description: "View and organize favorites",
      icon: Heart,
      href: "/favorites",
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
    },
    {
      title: "Settings",
      description: "Configure preferences",
      icon: Activity,
      href: "/settings",
      color: "bg-gradient-to-r from-purple-500 to-violet-500",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <SumptuousHeart size={80} className="mx-auto animate-float" />
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Welcome Back!</h1>
          <p className="text-xl text-muted-foreground">Your anime collection is looking amazing ✨</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="material-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">
                      <AnimatedStats value={stat.value} />
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Active Downloads */}
      {isDownloading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary animate-pulse" />
                Active Downloads
              </CardTitle>
              <CardDescription>
                {totalProgress.downloaded} of {totalProgress.total} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={(totalProgress.downloaded / totalProgress.total) * 100} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Speed: {(totalProgress.speed / 1024 / 1024).toFixed(1)} MB/s</span>
                  <span>
                    ETA: {Math.floor(totalProgress.eta / 60)}m {Math.floor(totalProgress.eta % 60)}s
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to your most used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
                    onClick={() => (window.location.href = action.href)}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest downloads and favorites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-muted/50 ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        {activity.subtitle && <p className="text-xs text-muted-foreground">{activity.subtitle}</p>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {activity.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Start downloading to see activity here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Storage Usage */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Storage Overview
            </CardTitle>
            <CardDescription>Your collection statistics and storage usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Images</span>
                  <span className="text-sm text-muted-foreground">{images.length}</span>
                </div>
                <Progress value={(images.length / 1000) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">of 1,000 limit</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Favorites</span>
                  <span className="text-sm text-muted-foreground">{favorites.length}</span>
                </div>
                <Progress value={(favorites.length / 500) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">of 500 limit</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Collections</span>
                  <span className="text-sm text-muted-foreground">{Object.keys(collections).length}</span>
                </div>
                <Progress value={(Object.keys(collections).length / 100) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">of 100 limit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
