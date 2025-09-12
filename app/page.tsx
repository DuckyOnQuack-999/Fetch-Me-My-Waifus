"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, ImageIcon, Settings, Zap, TrendingUp, Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { HomeDashboard } from "@/components/home-dashboard"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { GalleryTab } from "@/components/gallery-tab"
import { SettingsTab } from "@/components/settings-tab"
import CyberpunkShowcase from "@/components/cyberpunk-showcase"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"

export default function HomePage() {
  const { images, favorites } = useStorage()
  const { downloads, activeDownloads, completedDownloads } = useDownload()
  const [activeTab, setActiveTab] = useState("showcase")

  const stats = [
    {
      title: "Total Images",
      value: images.length,
      icon: ImageIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Favorites",
      value: favorites.length,
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Downloads",
      value: completedDownloads.length,
      icon: Download,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active",
      value: activeDownloads.length,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 scrollbar-cyber">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>

          <div className="space-y-6">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gradient font-mono">
                  NEON ECLIPSE WAIFU DOWNLOADER
                </h1>
                <p className="text-muted-foreground font-mono text-neon">
                  {"> AI-POWERED QUANTUM ANIME IMAGE ACQUISITION SYSTEM"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 text-red-400 border-red-400 font-mono">
                  <Zap className="h-3 w-3" />
                  NEURAL ENHANCED
                </Badge>
                <Badge variant="outline" className="gap-1 text-pink-400 border-pink-400 font-mono">
                  <Terminal className="h-3 w-3" />
                  Y2K FUSION
                </Badge>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <Card key={stat.title} className="material-card">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono text-gradient">{stat.value}</p>
                        <p className="text-xs text-muted-foreground font-mono">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 glass-effect">
                  <TabsTrigger value="showcase" className="gap-2 font-mono">
                    <Zap className="h-4 w-4" />
                    SHOWCASE
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="gap-2 font-mono">
                    <TrendingUp className="h-4 w-4" />
                    DASHBOARD
                  </TabsTrigger>
                  <TabsTrigger value="download" className="gap-2 font-mono">
                    <Download className="h-4 w-4" />
                    DOWNLOAD
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="gap-2 font-mono">
                    <ImageIcon className="h-4 w-4" />
                    GALLERY
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2 font-mono">
                    <Settings className="h-4 w-4" />
                    SETTINGS
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="showcase" className="space-y-6">
                  <CyberpunkShowcase />
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-6">
                  <HomeDashboard />
                </TabsContent>

                <TabsContent value="download" className="space-y-6">
                  <SimpleDownloadTab />
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  <GalleryTab />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <SettingsTab />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
