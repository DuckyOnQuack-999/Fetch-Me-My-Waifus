"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { QuantumPerformanceMonitor } from "@/components/quantum-performance-monitor"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { AnimatedStats } from "@/components/animated-stats"
import { WaifuDownloaderLogo } from "@/components/waifu-downloader-logo"
import { SumptuousHeart } from "@/components/sumptuous-heart"
import { Download, Heart, ImageIcon, Settings, TrendingUp, Zap } from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"

export function HomeDashboard() {
  const { settings } = useSettings()
  const { favorites, collections, downloadHistory } = useStorage()
  const { downloadQueue, isDownloading } = useDownload()
  const [recentImages, setRecentImages] = useState([])

  const stats = {
    totalDownloads: downloadHistory.length,
    favorites: favorites.length,
    collections: Object.keys(collections).length,
    queueSize: downloadQueue.length,
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <WaifuDownloaderLogo />
          <div>
            <h1 className="text-3xl font-bold text-gradient">Waifu Downloader</h1>
            <p className="text-muted-foreground">Advanced anime image fetcher with quantum-enhanced performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SumptuousHeart />
          <Badge variant="outline" className="bg-primary/10">
            v7.0.0 Quantum
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="material-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <AnimatedStats value={stats.totalDownloads} />
            <p className="text-xs text-muted-foreground">
              {isDownloading ? `${stats.queueSize} in queue` : "Ready to download"}
            </p>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <AnimatedStats value={stats.favorites} />
            <p className="text-xs text-muted-foreground">Images you love</p>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <AnimatedStats value={stats.collections} />
            <p className="text-xs text-muted-foreground">Organized galleries</p>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">98%</div>
            <p className="text-xs text-muted-foreground">System health</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
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
                      Concurrent downloads: {settings.concurrentDownloads}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Auto-start: {settings.autoStartDownloads ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Quality Settings</h3>
                    <p className="text-xs text-muted-foreground">
                      Min resolution: {settings.minWidth}x{settings.minHeight}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      NSFW content: {settings.enableNsfw ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <Button className="w-full">Open Advanced Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
