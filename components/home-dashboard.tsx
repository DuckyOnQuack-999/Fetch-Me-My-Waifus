"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { QuantumPerformanceMonitor } from "@/components/quantum-performance-monitor"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { AnimatedStats } from "@/components/animated-stats"
import { SumptuousHeart } from "@/components/sumptuous-heart"
import { Download, Heart, ImageIcon, Settings, TrendingUp, Zap, Activity, Clock } from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"
import { motion } from "framer-motion"

export function HomeDashboard() {
  const { settings } = useSettings()
  const { images, favorites, collections, downloadHistory } = useStorage()
  const { downloads, isDownloading, totalProgress } = useDownload()
  const [recentImages, setRecentImages] = useState([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Safe access to downloads array
  const safeDownloads = downloads || []
  const activeDownloads = safeDownloads.filter((d) => d.status === "downloading")
  const queueSize = safeDownloads.filter((d) => d.status === "pending").length

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
        const image = images.find((img) => img.image_id?.toString() === id)
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

  const stats = {
    totalDownloads: downloadHistory.length,
    favorites: favorites.length,
    collections: Object.keys(collections).length,
    queueSize: queueSize,
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SumptuousHeart size={60} className="animate-float" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Waifu Downloader</h1>
            <p className="text-muted-foreground">Advanced anime image fetcher with quantum-enhanced performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10">
            v7.0.0 Quantum
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="material-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={stats.totalDownloads} />
            </div>
            <p className="text-xs text-muted-foreground">
              {isDownloading ? `${stats.queueSize} in queue` : "Ready to download"}
            </p>
          </CardContent>
        </Card>

        <Card className="material-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={stats.favorites} />
            </div>
            <p className="text-xs text-muted-foreground">Images you love</p>
          </CardContent>
        </Card>

        <Card className="material-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={stats.collections} />
            </div>
            <p className="text-xs text-muted-foreground">Organized galleries</p>
          </CardContent>
        </Card>

        <Card className="material-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">98%</div>
            <p className="text-xs text-muted-foreground">System health</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Downloads Progress */}
      {isDownloading && totalProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(totalProgress.downloaded / totalProgress.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Speed: {((totalProgress.speed || 0) / 1024 / 1024).toFixed(1)} MB/s</span>
                  <span>
                    ETA: {Math.floor((totalProgress.eta || 0) / 60)}m {Math.floor((totalProgress.eta || 0) % 60)}s
                  </span>
                </div>
                {totalProgress.currentFile && (
                  <p className="text-sm text-muted-foreground truncate">Current: {totalProgress.currentFile}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
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
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
                  onClick={() => (window.location.href = "/?tab=download")}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Start Download</p>
                    <p className="text-xs text-muted-foreground">Download new images</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
                  onClick={() => (window.location.href = "/gallery")}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Browse Gallery</p>
                    <p className="text-xs text-muted-foreground">View collection</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
                  onClick={() => (window.location.href = "/favorites")}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Favorites</p>
                    <p className="text-xs text-muted-foreground">Manage favorites</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
                  onClick={() => (window.location.href = "/settings")}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Settings</p>
                    <p className="text-xs text-muted-foreground">Configure app</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest downloads and favorites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
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

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Tabs defaultValue="download" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              API Status
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Download</CardTitle>
                <CardDescription>Download anime images from multiple sources with advanced filtering</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleDownloadTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
                <CardDescription>
                  Browse and manage your downloaded images with advanced search and filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedImageGallery
                  images={recentImages}
                  onDownload={(image) => console.log("Download:", image)}
                  onFavorite={(image) => console.log("Favorite:", image)}
                  isLoading={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <ApiStatusIndicator />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <QuantumPerformanceMonitor />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
