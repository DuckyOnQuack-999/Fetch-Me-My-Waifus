"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Heart, ImageIcon, Activity, Zap, Clock, HardDrive, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { SumptuousHeart } from "@/components/sumptuous-heart"
import { cn } from "@/lib/utils"

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
      color: "text-[var(--neon-primary)]",
      bgColor: "bg-[var(--neon-primary)]/10",
      glowColor: "var(--neon-primary)",
    },
    {
      title: "Favorites",
      value: favorites?.length || 0,
      change: "+8%",
      icon: Heart,
      color: "text-[var(--neon-secondary)]",
      bgColor: "bg-[var(--neon-secondary)]/10",
      glowColor: "var(--neon-secondary)",
    },
    {
      title: "Downloads",
      value: completedDownloads?.length || 0,
      change: "+23%",
      icon: Download,
      color: "text-[var(--neon-accent)]",
      bgColor: "bg-[var(--neon-accent)]/10",
      glowColor: "var(--neon-accent)",
    },
    {
      title: "Active",
      value: activeDownloads?.length || 0,
      change: "Live",
      icon: Activity,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      glowColor: "#fb923c",
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
    const iconProps = { className: "h-4 w-4 drop-shadow-[0_0_6px_currentColor]" }
    switch (type) {
      case "download":
        return <Download {...iconProps} className={cn(iconProps.className, "text-[var(--neon-accent)]")} />
      case "favorite":
        return <SumptuousHeart size={16} glowing />
      case "collection":
        return <ImageIcon {...iconProps} className={cn(iconProps.className, "text-[var(--neon-primary)]")} />
      case "settings":
        return <Zap {...iconProps} className={cn(iconProps.className, "text-purple-400")} />
      default:
        return <Activity {...iconProps} className={cn(iconProps.className, "text-gray-400")} />
    }
  }

  const safeProgress = {
    downloaded: totalProgress?.downloaded || 0,
    total: totalProgress?.total || 0,
    speed: totalProgress?.speed || 0,
    currentFile: totalProgress?.currentFile || null,
  }

  const progressPercentage = safeProgress.total > 0 ? (safeProgress.downloaded / safeProgress.total) * 100 : 0

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h2 className="text-3xl font-bold neon-text">
          Welcome to your Dashboard
          <Sparkles className="inline-block ml-2 h-6 w-6 text-[var(--neon-accent)] animate-pulse" />
        </h2>
        <p className="text-muted-foreground text-lg">
          Manage your anime image collection with powerful AI-enhanced tools
        </p>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 10px 30px ${stat.glowColor}40`,
              transition: { type: "spring", stiffness: 400 },
            }}
          >
            <Card className="material-card kawaii-element">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold neon-text">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn("text-xs glass-effect border-0", stat.bgColor, stat.color)}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <motion.div
                    className={cn("p-3 rounded-lg", stat.bgColor, "border border-current/20")}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      boxShadow: `0 0 20px ${stat.glowColor}30`,
                    }}
                  >
                    <stat.icon className={cn("h-6 w-6", stat.color, "drop-shadow-[0_0_8px_currentColor]")} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Progress */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Download className="h-6 w-6 text-[var(--neon-accent)] drop-shadow-[0_0_8px_currentColor]" />
                </motion.div>
                <span className="neon-text">Download Progress</span>
              </CardTitle>
              <CardDescription>Current download status and queue information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeDownloads && activeDownloads.length > 0 ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Overall Progress</span>
                      <span className="neon-text font-bold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={progressPercentage} className="h-3 holographic" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [-100, 300] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        style={{ width: "100px", height: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Downloaded</p>
                      <p className="font-bold text-lg neon-text">
                        {safeProgress.downloaded} / {safeProgress.total}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Speed</p>
                      <p className="font-bold text-lg neon-text">
                        {(safeProgress.speed / 1024 / 1024).toFixed(1)} MB/s
                      </p>
                    </div>
                  </div>

                  {safeProgress.currentFile && (
                    <motion.div
                      className="p-4 rounded-lg glass-effect border border-[var(--neon-primary)]/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">Currently downloading:</p>
                      <p className="font-medium truncate neon-text">{safeProgress.currentFile}</p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Download className="h-16 w-16 text-muted-foreground mx-auto mb-4 drop-shadow-[0_0_10px_currentColor]" />
                  </motion.div>
                  <p className="text-muted-foreground mb-4">No active downloads</p>
                  <Button
                    variant="cyber"
                    onClick={() => (window.location.href = "/?tab=download")}
                    className="kawaii-element"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Start Downloading
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Storage Usage */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <HardDrive className="h-6 w-6 text-[var(--neon-primary)] drop-shadow-[0_0_8px_currentColor]" />
                </motion.div>
                <span className="neon-text">Storage Usage</span>
              </CardTitle>
              <CardDescription>Local storage and cache information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {storageStats && storageStats.usage ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Storage Used</span>
                      <span className="neon-text font-bold">{storageStats.usage.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={storageStats.usage.percentage} className="h-3 holographic" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Used</p>
                      <p className="font-bold text-lg neon-text">
                        {(storageStats.usage.used / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-bold text-lg neon-text">
                        {(storageStats.usage.available / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Images", count: storageStats.counts.images, color: "var(--neon-primary)" },
                      { label: "Favorites", count: storageStats.counts.favorites, color: "var(--neon-secondary)" },
                      { label: "Collections", count: storageStats.counts.collections, color: "var(--neon-accent)" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex justify-between items-center p-2 rounded glass-effect"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <Badge
                          variant="secondary"
                          className="glass-effect border-0"
                          style={{
                            color: item.color,
                            boxShadow: `0 0 10px ${item.color}30`,
                          }}
                        >
                          {item.count}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <HardDrive className="h-16 w-16 text-muted-foreground mx-auto mb-4 drop-shadow-[0_0_10px_currentColor]" />
                  </motion.div>
                  <p className="text-muted-foreground">Loading storage information...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Clock className="h-6 w-6 text-[var(--neon-accent)] drop-shadow-[0_0_8px_currentColor]" />
              </motion.div>
              <span className="neon-text">Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest actions and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 4px 20px var(--neon-primary)20",
                  }}
                  className="flex items-center gap-4 p-4 rounded-lg glass-effect border border-[var(--neon-primary)]/20 hover:border-[var(--neon-primary)]/40 transition-all duration-300 kawaii-element"
                >
                  <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      <span className="neon-text">{activity.action}</span>{" "}
                      <span className="text-muted-foreground">"{activity.item}"</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Zap className="h-6 w-6 text-[var(--neon-accent)] drop-shadow-[0_0_8px_currentColor]" />
              </motion.div>
              <span className="neon-text">Quick Actions</span>
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Download,
                  label: "Download Images",
                  href: "/?tab=download",
                  color: "var(--neon-primary)",
                },
                {
                  icon: ImageIcon,
                  label: "Browse Gallery",
                  href: "/gallery",
                  color: "var(--neon-secondary)",
                },
                {
                  icon: Heart,
                  label: "View Favorites",
                  href: "/favorites",
                  color: "var(--neon-accent)",
                  isHeart: true,
                },
                {
                  icon: Zap,
                  label: "Settings",
                  href: "/settings",
                  color: "#a855f7",
                },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, type: "spring" }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 10px 30px ${action.color}40`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-3 bg-transparent glass-effect border-[var(--neon-primary)]/30 hover:border-[var(--neon-primary)]/60 kawaii-element"
                    onClick={() => (window.location.href = action.href)}
                  >
                    {action.isHeart ? (
                      <SumptuousHeart size={24} glowing />
                    ) : (
                      <action.icon
                        className="h-6 w-6 drop-shadow-[0_0_8px_currentColor]"
                        style={{ color: action.color }}
                      />
                    )}
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
