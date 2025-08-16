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
  Folder,
  BarChart3,
  Globe,
} from "lucide-react"
import { useDownload } from "@/context/downloadContext"
import { AnimatedStats } from "@/components/animated-stats"
import { QuantumPerformanceMonitor } from "@/components/quantum-performance-monitor"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { WaifuDownloaderLogo } from "@/components/waifu-downloader-logo"
import { SumptuousHeart } from "@/components/sumptuous-heart"
import { motion } from "framer-motion"

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
    totalDownloads: 1247,
    totalFavorites: 89,
    totalCollections: 12,
    storageUsed: 2.4,
    apiCalls: 1580,
    successRate: 98.5,
  })

  useEffect(() => {
    // Calculate stats from downloads
    const completedDownloads = downloads.filter((d) => d.status === "completed")
    const favorites = downloads.filter((d) => d.isFavorite)

    setStats((prev) => ({
      ...prev,
      totalDownloads: Math.max(prev.totalDownloads, completedDownloads.length),
      totalFavorites: Math.max(prev.totalFavorites, favorites.length),
      totalCollections: Math.max(prev.totalCollections, Math.floor(completedDownloads.length / 10)),
      storageUsed: Math.max(prev.storageUsed, (completedDownloads.length * 2.5) / 1000),
      apiCalls: Math.max(prev.apiCalls, downloads.length * 1.2),
      successRate: downloads.length > 0 ? (completedDownloads.length / downloads.length) * 100 : prev.successRate,
    }))
  }, [downloads])

  const quickStats = [
    {
      title: "Total Downloads",
      value: stats.totalDownloads,
      icon: Download,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      change: "+8%",
      changeColor: "text-green-600",
    },
    {
      title: "Collections",
      value: stats.totalCollections,
      icon: Folder,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      change: "+15%",
      changeColor: "text-green-600",
    },
    {
      title: "Storage Used",
      value: `${stats.storageUsed.toFixed(1)} GB`,
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      change: "+5%",
      changeColor: "text-green-600",
    },
  ]

  const recentActivity = [
    {
      action: "Downloaded",
      item: "Anime Girl Collection #1234",
      time: "2 minutes ago",
      status: "success",
      icon: Download,
      color: "text-green-600",
    },
    {
      action: "Added to Favorites",
      item: "Kawaii Waifu Bundle",
      time: "5 minutes ago",
      status: "info",
      icon: Heart,
      color: "text-pink-600",
    },
    {
      action: "Created Collection",
      item: "Summer Waifus 2024",
      time: "10 minutes ago",
      status: "success",
      icon: Folder,
      color: "text-purple-600",
    },
    {
      action: "API Call Success",
      item: "Waifu.pics endpoint",
      time: "15 minutes ago",
      status: "info",
      icon: Globe,
      color: "text-blue-600",
    },
    {
      action: "Batch Download",
      item: "50 images completed",
      time: "20 minutes ago",
      status: "success",
      icon: Download,
      color: "text-green-600",
    },
  ]

  const quickActions = [
    {
      title: "Start Download",
      description: "Download new images",
      icon: Download,
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      action: () => console.log("Start download"),
    },
    {
      title: "Browse Gallery",
      description: "View collection",
      icon: ImageIcon,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      action: () => console.log("Browse gallery"),
    },
    {
      title: "Manage Favorites",
      description: "Organize favorites",
      icon: Heart,
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      action: () => console.log("Manage favorites"),
    },
    {
      title: "Settings",
      description: "Configure app",
      icon: Settings,
      color: "bg-gradient-to-r from-purple-500 to-violet-500",
      action: () => console.log("Open settings"),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <WaifuDownloaderLogo />
            <SumptuousHeart size={40} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your waifu collection today.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <Activity className="h-3 w-3" />
            System Online
          </Badge>
          {isDownloading && (
            <Badge
              variant="secondary"
              className="gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            >
              <Download className="h-3 w-3 animate-spin" />
              Downloading...
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 ${stat.borderColor} border-l-4`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedStats value={typeof stat.value === "number" ? stat.value : 0} />
                  {typeof stat.value === "string" && stat.value.includes("GB") && ` GB`}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className={`h-3 w-3 ${stat.changeColor}`} />
                  <span className={stat.changeColor}>{stat.change}</span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Downloads</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
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

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{stats.totalDownloads}</div>
                      <div className="text-xs text-muted-foreground">Total Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {downloads.filter((d) => d.status === "downloading").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        {downloads.filter((d) => d.status === "failed").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Failed</div>
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
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={`p-2 rounded-full bg-muted/50 ${activity.color}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.item}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-3 bg-transparent hover:bg-muted/50 transition-all duration-200"
                        onClick={action.action}
                      >
                        <div className={`p-3 rounded-lg ${action.color} text-white shadow-lg`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
      </motion.div>
    </div>
  )
}
