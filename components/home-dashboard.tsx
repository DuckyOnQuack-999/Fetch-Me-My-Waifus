"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleDownloadTab } from "./simple-download-tab"
import { GalleryTab } from "./gallery-tab"
import { SettingsTab } from "./settings-tab"
import { Heart, Download, ImageIcon, Settings, Sparkles, Zap, Activity } from "lucide-react"
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 kawaii-heart animate-pulse-slow" />
          <h1 className="text-4xl font-bold text-gradient">Waifu Fetcher</h1>
          <Sparkles className="w-6 h-6 kawaii-heart" />
        </div>
        <p className="text-muted-foreground neon-text">
          Your kawaii cyber companion for collecting beautiful anime art ✨
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="download" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 cyber-button">
          <TabsTrigger value="download" className="flex items-center gap-2">
            <Download className="w-4 h-4 kawaii-heart" />
            Download
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 kawaii-heart" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4 kawaii-heart" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="animate-fade-in">
          <Card className="material-card kawaii-element">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 kawaii-heart" />
                Download Images
              </CardTitle>
              <CardDescription className="neon-text">
                Fetch beautiful anime images from various APIs with advanced filtering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleDownloadTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="animate-fade-in">
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 kawaii-heart" />
                Image Gallery
              </CardTitle>
              <CardDescription className="neon-text">Browse and manage your downloaded images</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="animate-fade-in">
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 kawaii-heart" />
                Settings & Configuration
              </CardTitle>
              <CardDescription className="neon-text">Customize your waifu downloading experience</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="material-card pulse-node">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold neon-text">{completedDownloads?.length || 0}</p>
              </div>
              <Download className="w-8 h-8 kawaii-heart" />
            </div>
          </CardContent>
        </Card>

        <Card className="material-card pulse-node">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-3xl font-bold neon-text">{favorites?.length || 0}</p>
              </div>
              <Heart className="w-8 h-8 kawaii-heart animate-pulse-slow" />
            </div>
          </CardContent>
        </Card>

        <Card className="material-card pulse-node">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collections</p>
                <p className="text-3xl font-bold neon-text">{storageStats?.counts.collections || 0}</p>
              </div>
              <Sparkles className="w-8 h-8 kawaii-heart" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
