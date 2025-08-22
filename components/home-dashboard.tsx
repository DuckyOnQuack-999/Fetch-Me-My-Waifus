"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Heart, ImageIcon, Folder, TrendingUp, Activity, HardDrive, Zap, Star, Clock } from "lucide-react"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { getStorageStats, getImages, getFavorites, getCollections, getDownloadHistory } from "@/utils/localStorage"

interface DashboardStats {
  totalImages: number
  totalFavorites: number
  totalCollections: number
  totalDownloads: number
  storageUsed: number
  storageTotal: number
  storagePercentage: number
}

export function HomeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalImages: 0,
    totalFavorites: 0,
    totalCollections: 0,
    totalDownloads: 0,
    storageUsed: 0,
    storageTotal: 0,
    storagePercentage: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  const loadDashboardData = React.useCallback(async () => {
    try {
      setIsLoading(true)

      // Get storage stats with safe fallbacks
      const storageStats = getStorageStats()
      const images = getImages()
      const favorites = getFavorites()
      const collections = getCollections()
      const downloadHistory = getDownloadHistory()

      // Safely access storage stats
      const storageUsage = storageStats?.usage || { used: 0, available: 0, percentage: 0 }

      setStats({
        totalImages: Array.isArray(images) ? images.length : 0,
        totalFavorites: Array.isArray(favorites) ? favorites.length : 0,
        totalCollections: Array.isArray(collections) ? collections.length : 0,
        totalDownloads: Array.isArray(downloadHistory) ? downloadHistory.length : 0,
        storageUsed: storageUsage.used || 0,
        storageTotal: (storageUsage.used || 0) + (storageUsage.available || 0),
        storagePercentage: storageUsage.percentage || 0,
      })

      // Get recent activity (last 5 downloads)
      const recentDownloads = Array.isArray(downloadHistory)
        ? downloadHistory.slice(0, 5).map((item) => ({
            ...item,
            id: item?.id || `activity_${Date.now()}`,
            type: "download",
            timestamp: item?.timestamp || new Date().toISOString(),
            title: item?.title || "Unknown Image",
          }))
        : []

      setRecentActivity(recentDownloads)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // Set safe fallback values
      setStats({
        totalImages: 0,
        totalFavorites: 0,
        totalCollections: 0,
        totalDownloads: 0,
        storageUsed: 0,
        storageTotal: 0,
        storagePercentage: 0,
      })
      setRecentActivity([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [loadDashboardData])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTimeAgo = (timestamp: string): string => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) return "Just now"
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      return `${Math.floor(diffInSeconds / 86400)}d ago`
    } catch (error) {
      return "Unknown"
    }
  }

  const dashboardCards = useMemo(
    () => [
      {
        title: "Total Images",
        value: stats.totalImages.toLocaleString(),
        description: "Images in your collection",
        icon: ImageIcon,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950",
      },
      {
        title: "Favorites",
        value: stats.totalFavorites.toLocaleString(),
        description: "Favorited images",
        icon: Heart,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950",
      },
      {
        title: "Collections",
        value: stats.totalCollections.toLocaleString(),
        description: "Organized collections",
        icon: Folder,
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950",
      },
      {
        title: "Downloads",
        value: stats.totalDownloads.toLocaleString(),
        description: "Total downloads",
        icon: Download,
        color: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950",
      },
    ],
    [stats],
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="material-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Storage Usage */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>Monitor your local storage usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Used: {formatBytes(stats.storageUsed)}</span>
            <span>Total: {formatBytes(stats.storageTotal)}</span>
          </div>
          <Progress value={stats.storagePercentage} className="h-2" />
          <div className="flex items-center gap-2">
            <Badge variant={stats.storagePercentage > 80 ? "destructive" : "secondary"} className="text-xs">
              {stats.storagePercentage.toFixed(1)}% Used
            </Badge>
            {stats.storagePercentage > 80 && (
              <span className="text-xs text-destructive">Consider cleaning up old data</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="download" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="download" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Quick Download
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="space-y-4">
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Download
              </CardTitle>
              <CardDescription>Download images quickly from supported APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleDownloadTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest downloads and actions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id || index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Download className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title || "Unknown Image"}</p>
                        <p className="text-xs text-muted-foreground">Downloaded {formatTimeAgo(activity.timestamp)}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {activity.source || "Unknown"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start downloading images to see activity here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">waifu.im</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">waifu.pics</span>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">nekos.best</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <span className="text-sm font-medium text-green-600">+12 images</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="text-sm font-medium text-green-600">+48 images</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">All Time</span>
                    <span className="text-sm font-medium">{stats.totalImages} images</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
