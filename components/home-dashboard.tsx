"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Heart, ImageIcon, Activity, Zap, Clock, HardDrive, Folder } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { useActivity } from "@/context/activityContext"

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
  const { images, favorites, collections, downloadHistory, getStorageStats } = useStorage()
  const { downloads, activeDownloads, completedDownloads, totalProgress } = useDownload()
  const { settings } = useSettings()
  const { activities } = useActivity()
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
      change: `${Object.keys(collections ?? {}).length} collections`,
      icon: ImageIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Favorites",
      value: favorites?.length || 0,
      change: favorites?.length > 0 ? "Saved" : "None yet",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Downloaded",
      value: (completedDownloads?.length || 0) + (downloadHistory?.length || 0),
      change: completedDownloads?.length > 0 ? "This session" : "All time",
      icon: Download,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active",
      value: activeDownloads?.length || 0,
      change: activeDownloads?.length > 0 ? "In progress" : "Idle",
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  // Build activity feed from real sources: context activities + download history
  const recentActivity = useMemo(() => {
    const items: { action: string; item: string; time: string; type: string }[] = []

    // From activity context (WebSocket / local storage)
    for (const a of activities.slice(0, 10)) {
      items.push({
        action: a.action ?? "Activity",
        item: a.target ?? "",
        time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : "",
        type: a.type ?? "activity",
      })
    }

    // From download history when no activities
    if (items.length === 0) {
      for (const h of (downloadHistory ?? []).slice(0, 5)) {
        items.push({
          action: "Downloaded",
          item: h.filename ?? h.url?.split("/").pop() ?? "file",
          time: h.timestamp ? new Date(h.timestamp).toLocaleTimeString() : "",
          type: "download",
        })
      }
    }

    // From current session downloads
    for (const d of completedDownloads.slice(0, 5)) {
      if (!items.find((i) => i.item === d.filename)) {
        items.push({
          action: "Downloaded",
          item: d.filename,
          time: d.endTime ? new Date(d.endTime).toLocaleTimeString() : "Just now",
          type: "download",
        })
      }
    }

    return items.slice(0, 8)
  }, [activities, downloadHistory, completedDownloads])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "download": return <Download className="h-4 w-4 text-green-500" />
      case "favorite": return <Heart className="h-4 w-4 text-red-500" />
      case "collection": return <Folder className="h-4 w-4 text-blue-500" />
      case "settings": return <Zap className="h-4 w-4 text-purple-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
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
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity yet. Start downloading images!</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
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
                      {activity.action}{activity.item ? <span className="text-muted-foreground"> &quot;{activity.item}&quot;</span> : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))
            )}
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
