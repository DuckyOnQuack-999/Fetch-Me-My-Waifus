"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  ImageIcon,
  Heart,
  Settings,
  Activity,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Code,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { DownloadTab } from "@/components/download-tab"
import { GalleryTab } from "@/components/gallery-tab"
import { AnimatedStats } from "@/components/animated-stats"

export function HomeDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalDownloads: 1247,
    favoriteImages: 89,
    collectionsCount: 12,
    storageUsed: 2.4,
    analysisScore: 94,
    securityScore: 98,
  })

  const quickActions = [
    {
      title: "Quick Download",
      description: "Download images instantly",
      icon: Download,
      action: () => setActiveTab("simple"),
      color: "bg-blue-500",
    },
    {
      title: "Browse Gallery",
      description: "View your collection",
      icon: ImageIcon,
      action: () => setActiveTab("gallery"),
      color: "bg-purple-500",
    },
    {
      title: "DuckyCoder Analysis",
      description: "Analyze your code",
      icon: Code,
      action: () => window.open("/duckycoder", "_blank"),
      color: "bg-green-500",
    },
    {
      title: "Settings",
      description: "Configure preferences",
      icon: Settings,
      action: () => window.open("/settings", "_blank"),
      color: "bg-orange-500",
    },
  ]

  const recentActivity = [
    { action: "Downloaded 15 images", time: "2 minutes ago", type: "download" },
    { action: "Added to favorites", time: "5 minutes ago", type: "favorite" },
    { action: "Created new collection", time: "1 hour ago", type: "collection" },
    { action: "Security scan completed", time: "2 hours ago", type: "security" },
    { action: "Performance analysis", time: "3 hours ago", type: "analysis" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "download":
        return <Download className="w-4 h-4 text-blue-500" />
      case "favorite":
        return <Heart className="w-4 h-4 text-red-500" />
      case "collection":
        return <ImageIcon className="w-4 h-4 text-purple-500" />
      case "security":
        return <Shield className="w-4 h-4 text-green-500" />
      case "analysis":
        return <Activity className="w-4 h-4 text-orange-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Waifu Downloader
          </h1>
          <p className="text-muted-foreground mt-2">Enhanced with DuckyCoder v7 AI-powered analysis and optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100">
            <Sparkles className="w-3 h-3 mr-1" />
            DuckyCoder v7 Active
          </Badge>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="simple">Quick Download</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Downloads</p>
                      <AnimatedStats value={stats.totalDownloads} className="text-3xl font-bold text-blue-700" />
                    </div>
                    <Download className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-blue-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% from last month
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Favorites</p>
                      <AnimatedStats value={stats.favoriteImages} className="text-3xl font-bold text-purple-700" />
                    </div>
                    <Heart className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-purple-600">
                      <Users className="w-4 h-4 mr-1" />
                      Curated collection
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Collections</p>
                      <AnimatedStats value={stats.collectionsCount} className="text-3xl font-bold text-green-700" />
                    </div>
                    <ImageIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-green-600">
                      <Activity className="w-4 h-4 mr-1" />
                      Organized library
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Storage Used</p>
                      <div className="text-3xl font-bold text-orange-700">{stats.storageUsed}GB</div>
                    </div>
                    <Activity className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="mt-4">
                    <Progress value={24} className="h-2" />
                    <div className="text-xs text-orange-600 mt-1">24% of 10GB limit</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">Analysis Score</p>
                      <AnimatedStats
                        value={stats.analysisScore}
                        suffix="%"
                        className="text-3xl font-bold text-indigo-700"
                      />
                    </div>
                    <Code className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-indigo-600">
                      <Zap className="w-4 h-4 mr-1" />
                      DuckyCoder v7 powered
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Security Score</p>
                      <AnimatedStats
                        value={stats.securityScore}
                        suffix="%"
                        className="text-3xl font-bold text-red-700"
                      />
                    </div>
                    <Shield className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-red-600">
                      <Shield className="w-4 h-4 mr-1" />
                      Quantum-resistant
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all bg-transparent"
                          onClick={action.action}
                        >
                          <div className={`p-3 rounded-full ${action.color} text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm">{action.title}</div>
                            <div className="text-xs text-muted-foreground">{action.description}</div>
                          </div>
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="simple">
          <SimpleDownloadTab />
        </TabsContent>

        <TabsContent value="advanced">
          <DownloadTab />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
