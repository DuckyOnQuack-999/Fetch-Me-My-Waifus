"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { QuantumPerformanceMonitor } from "@/components/quantum-performance-monitor"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { AnimatedStats } from "@/components/animated-stats"
import { WaifuDownloaderLogo } from "@/components/waifu-downloader-logo"
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

  // Safely access downloads array with fallback
  const safeDownloads = downloads || []
  const activeDownloads = safeDownloads.filter((d) => d.status === "downloading")
  const completedDownloads = safeDownloads.filter((d) => d.status === "completed")

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
    queueSize: safeDownloads.length,
  }

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
      icon: Settings,
      href: "/settings",
      color: "bg-gradient-to-r from-purple-500 to-violet-500",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <WaifuDownloaderLogo />
          <SumptuousHeart size={60} className="animate-pulse" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-xl text-muted-foreground">Your anime collection is looking amazing ✨</p>
        </div>
        <Badge variant="outline" className="bg-primary/10">
          v7.0.0 Quantum Enhanced
        </Badge>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={images.length} />
            </div>
            <p className="text-xs text-muted-foreground">+{completedDownloads.length} this session</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={stats.favorites} />
            </div>
            <p className="text-xs text-muted-foreground">Images you love</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <ImageIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={stats.collections} />
            </div>
            <p className="text-xs text-muted-foreground">Organized galleries</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
            <Download className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedStats value={stats.queueSize} />
            </div>
            <p className="text-xs text-muted-foreground">
              {isDownloading ? `${activeDownloads.length} active` : "Ready to download"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Downloads */}
      {isDownloading && totalProgress && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500 animate-pulse" />
                Active Downloads
              </CardTitle>
              <CardDescription>
                {totalProgress.downloaded} of {totalProgress.total} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={totalProgress.total > 0 ? (totalProgress.downloaded / totalProgress.total) * 100 : 0}
                  className="h-3"
                />
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
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
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
          <Card>
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

      {/* Main Content Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Tabs defaultValue="download" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
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

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure your download preferences and API settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Download Settings</h3>
                      <p className="text-xs text-muted-foreground">
                        Concurrent downloads: {settings?.maxConcurrentDownloads || 3}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Auto-start: {settings?.autoStartDownloads ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Quality Settings</h3>
                      <p className="text-xs text-muted-foreground">
                        Min resolution: {settings?.minWidth || 800}x{settings?.minHeight || 600}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        NSFW content: {settings?.enableNsfw ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => (window.location.href = "/settings")}>
                    Open Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Storage Usage */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
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
