"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Heart,
  ImageIcon,
  Settings,
  Activity,
  TrendingUp,
  Clock,
  Database,
  Zap,
  Star,
  Folder,
  BarChart3,
} from "lucide-react"
import { useDownload } from "@/context/downloadContext"
import { AnimatedStats } from "@/components/animated-stats"
import { QuantumPerformanceMonitor } from "@/components/quantum-performance-monitor"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SimpleDownloadTab } from "@/components/simple-download-tab"

interface DashboardStats {
  totalDownloads: number
  totalFavorites: number
  totalCollections: number
  storageUsed: number
  apiCalls: number
  successRate: number
}

export function HomeDashboard() {
  const { downloads = [], isDownloading, downloadProgress } = useDownload()
  const [stats, setStats] = useState<DashboardStats>({
    totalDownloads: 0,
    totalFavorites: 0,
    totalCollections: 0,
    storageUsed: 0,
    apiCalls: 0,
    successRate: 0,
  })

  useEffect(() => {
    // Calculate stats from downloads
    const completedDownloads = downloads.filter((d) => d.status === "completed")
    const favorites = downloads.filter((d) => d.isFavorite)

    setStats({
      totalDownloads: completedDownloads.length,
      totalFavorites: favorites.length,
      totalCollections: Math.floor(completedDownloads.length / 10), // Estimate collections
      storageUsed: completedDownloads.length * 2.5, // Estimate MB
      apiCalls: downloads.length * 1.2, // Estimate API calls
      successRate: downloads.length > 0 ? (completedDownloads.length / downloads.length) * 100 : 100,
    })
  }, [downloads])

  const quickStats = [
    {
      title: "Total Downloads",
      value: stats.totalDownloads,
      icon: Download,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      change: "+8%",
    },
    {
      title: "Collections",
      value: stats.totalCollections,
      icon: Folder,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%",
    },
    {
      title: "Storage Used",
      value: `${stats.storageUsed.toFixed(1)} MB`,
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+5%",
    },
  ]

  const recentActivity = [
    { action: "Downloaded", item: "Anime Girl #1234", time: "2 minutes ago", status: "success" },
    { action: "Added to Favorites", item: "Waifu Collection", time: "5 minutes ago", status: "info" },
    { action: "Created Collection", item: "Summer Waifus", time: "10 minutes ago", status: "success" },
    { action: "API Call", item: "Waifu.pics", time: "15 minutes ago", status: "info" },
    { action: "Downloaded", item: "Anime Girl #1235", time: "20 minutes ago", status: "success" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening with your waifu collection today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            System Online
          </Badge>
          {isDownloading && (
            <Badge variant="secondary" className="gap-1">
              <Download className="h-3 w-3 animate-spin" />
              Downloading...
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedStats value={typeof stat.value === "number" ? stat.value : 0} />
                {typeof stat.value === "string" && stat.value.includes("MB") && ` MB`}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Download Progress */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Download Activity
                </CardTitle>
                <CardDescription>Your download progress and statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isDownloading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Download</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={stats.successRate} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{stats.successRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">API Calls</p>
                    <p className="text-2xl font-bold">{stats.apiCalls.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.item}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <SimpleDownloadTab />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <EnhancedImageGallery />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <QuantumPerformanceMonitor />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              New Download
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Folder className="h-4 w-4" />
              Create Collection
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ImageIcon className="h-4 w-4" />
              Browse Gallery
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Star className="h-4 w-4" />
              View Favorites
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
