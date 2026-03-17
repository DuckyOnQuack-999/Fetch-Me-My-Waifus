"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Heart, ImageIcon, Activity, Zap, Clock, HardDrive } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"

interface StorageStats {
  usage: {
    used: number
    available: number
    percentage: number
  }
  counts: {
    images: number
    favorites: number
    collections: number
    downloadHistory: number
  }
  lastUpdated: string
}

export function HomeDashboard() {
  const { images, favorites, getStorageStats } = useStorage()
  const { downloads, activeDownloads, completedDownloads, totalProgress } = useDownload()
  const { settings } = useSettings()
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null)

  useEffect(() => {
    try {
      const stats = getStorageStats()
      setStorageStats(stats)
    } catch (error) {
      console.error("Failed to get storage stats:", error)
      // Set fallback stats
      setStorageStats({
        usage: { used: 0, available: 100 * 1024 * 1024, percentage: 0 },
        counts: {
          images: images?.length || 0,
          favorites: favorites?.length || 0,
          collections: 0,
          downloadHistory: 0,
        },
        lastUpdated: new Date().toISOString(),
      })
    }
  }, [images, favorites, getStorageStats])

  const quickStats = [
    {
      title: "Total Images",
      value: images?.length || 0,
      change: "+12%",
      icon: ImageIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Favorites",
      value: favorites?.length || 0,
      change: "+8%",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Downloads",
      value: completedDownloads?.length || 0,
      change: "+23%",
      icon: Download,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active",
      value: activeDownloads?.length || 0,
      change: "Live",
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const recentActivity = [
    { action: "Downloaded", item: "anime_girl_001.jpg", time: "2 minutes ago", type: "download" },
    { action: "Added to favorites", item: "waifu_collection_42.png", time: "5 minutes ago", type: "favorite" },
    { action: "Created collection", item: "Summer Waifus", time: "10 minutes ago", type: "collection" },
    { action: "Downloaded", item: "neko_art_15.jpg", time: "15 minutes ago", type: "download" },
    { action: "Updated settings", item: "API Configuration", time: "1 hour ago", type: "settings" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "download":
        return <Download className="h-4 w-4 text-green-500" />
      case "favorite":
        return <Heart className="h-4 w-4 text-red-500" />
      case "collection":
        return <ImageIcon className="h-4 w-4 text-blue-500" />
      case "settings":
        return <Zap className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  // Safe access to totalProgress with fallbacks
  const safeProgress = {
    downloaded: totalProgress?.downloaded || 0,
    total: totalProgress?.total || 0,
    speed: totalProgress?.speed || 0,
    currentFile: totalProgress?.currentFile || null,
  }

  const progressPercentage = safeProgress.total > 0 ? (safeProgress.downloaded / safeProgress.total) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gradient">Welcome to your Dashboard</h2>
        <p className="text-muted-foreground">Manage your anime image collection with powerful AI-enhanced tools</p>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="material-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Progress */}
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Progress
            </CardTitle>
            <CardDescription>Current download status and queue information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDownloads && activeDownloads.length > 0 ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Downloaded</p>
                    <p className="font-medium">
                      {safeProgress.downloaded} / {safeProgress.total}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Speed</p>
                    <p className="font-medium">{(safeProgress.speed / 1024 / 1024).toFixed(1)} MB/s</p>
                  </div>
                </div>

                {safeProgress.currentFile && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Currently downloading:</p>
                    <p className="font-medium truncate">{safeProgress.currentFile}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active downloads</p>
                <Button className="mt-2" onClick={() => (window.location.href = "/?tab=download")}>
                  Start Downloading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Usage
            </CardTitle>
            <CardDescription>Local storage and cache information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {storageStats && storageStats.usage ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span>{storageStats.usage.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={storageStats.usage.percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Used</p>
                    <p className="font-medium">{(storageStats.usage.used / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-medium">{(storageStats.usage.available / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Images</span>
                    <Badge variant="secondary">{storageStats.counts.images}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Favorites</span>
                    <Badge variant="secondary">{storageStats.counts.favorites}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Collections</span>
                    <Badge variant="secondary">{storageStats.counts.collections}</Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading storage information...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest actions and downloads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {activity.action} <span className="text-muted-foreground">"{activity.item}"</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/?tab=download")}
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Download Images</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/gallery")}
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs">Browse Gallery</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/favorites")}
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs">View Favorites</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/settings")}
            >
              <Zap className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
