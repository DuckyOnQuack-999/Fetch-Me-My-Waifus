"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SumptuousHeart } from "@/components/sumptuous-heart"
import { AnimatedStats } from "@/components/animated-stats"
import { Download, Heart, ImageIcon, Settings, Sparkles, Zap, Globe, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { useDownload } from "@/context/downloadContext"
import { toast } from "sonner"
import type { ImageCategory, DownloadItem } from "@/types/waifu"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function HomeContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const { images } = useStorage()
  const { settings } = useSettings()
  const { addToQueue } = useDownload()

  const [downloadCategory, setDownloadCategory] = useState<ImageCategory>("waifu")
  const [downloadCount, setDownloadCount] = useState(10)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleStartDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    toast.success(`Starting download of ${downloadCount} ${downloadCategory} images`)

    try {
      // Simulate adding items to download queue
      for (let i = 0; i < downloadCount; i++) {
        const downloadItem: DownloadItem = {
          id: `download_${Date.now()}_${i}`,
          url: `https://example.com/${downloadCategory}_${i}.jpg`,
          filename: `${downloadCategory}_${Date.now()}_${i}.jpg`,
          status: "pending",
          progress: 0,
          category: downloadCategory,
          tags: [downloadCategory],
          addedAt: new Date(),
          timestamp: new Date(),
          source: settings?.apiSource || "waifu.im",
        }
        addToQueue(downloadItem)

        // Small delay to simulate real downloading
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      toast.success("Images added to download queue!")
    } catch (error) {
      toast.error("Failed to start download")
    } finally {
      setIsDownloading(false)
    }
  }

  if (tab === "download") {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <SumptuousHeart size={80} className="mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gradient">Download Center</h1>
            <p className="text-xl text-muted-foreground">Download your favorite anime images from multiple sources</p>
          </motion.div>
        </div>

        <ApiStatusIndicator />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SimpleDownloadTab />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* API Status Bar */}
      <ApiStatusIndicator />

      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SumptuousHeart size={120} className="mx-auto mb-6 animate-float" />
          <h1 className="text-5xl font-bold text-gradient mb-4">Waifu Downloader</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate tool for downloading and managing your favorite anime images from multiple sources
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" onClick={() => (window.location.href = "/?tab=download")}>
            <Download className="mr-2 h-5 w-5" />
            Start Downloading
          </Button>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = "/gallery")}>
            <ImageIcon className="mr-2 h-5 w-5" />
            View Gallery
          </Button>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">
              <AnimatedStats value={images.length} />
            </div>
            <p className="text-muted-foreground">Images Downloaded</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">
              <AnimatedStats value={images.filter((img) => img.isFavorite).length} />
            </div>
            <p className="text-muted-foreground">Favorites</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">
              <AnimatedStats value={5} />
            </div>
            <p className="text-muted-foreground">API Sources</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Multiple Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Download from Waifu.im, Waifu.pics, Nekos.best, Wallhaven, and more</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Fast Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Concurrent downloads with retry logic and progress tracking</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Smart Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Automatic categorization, favorites, and custom collections</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Customizable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Extensive settings for quality, naming, and organization preferences
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Safe & Secure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Content filtering, NSFW controls, and secure API key management</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Modern UI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Beautiful, responsive interface with dark mode and animations</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="download" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="download">Download</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="download" className="space-y-4">
                <p className="text-muted-foreground">Start downloading images from your favorite sources</p>
                <Button onClick={() => (window.location.href = "/?tab=download")}>
                  <Download className="mr-2 h-4 w-4" />
                  Go to Download Center
                </Button>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                <p className="text-muted-foreground">Browse and manage your downloaded images</p>
                <Button onClick={() => (window.location.href = "/gallery")}>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Open Gallery
                </Button>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <p className="text-muted-foreground">Configure API keys, download preferences, and more</p>
                <Button onClick={() => (window.location.href = "/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Open Settings
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function HomePage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Waifu Downloader</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <ApiStatusIndicator />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <HomeContent />
      </div>
    </SidebarInset>
  )
}
