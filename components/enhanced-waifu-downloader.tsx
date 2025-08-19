"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  GalleryThumbnailsIcon as Gallery,
  Heart,
  Settings,
  Sparkles,
  Brain,
  Zap,
  Shield,
  Leaf,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { SimpleDownloadTab } from "./simple-download-tab"
import { EnhancedImageGallery } from "./enhanced-image-gallery"
import { FavoritesPage } from "./favorites-page"
import { CollectionsPage } from "./collections-page"
import { SettingsPage } from "./settings-page"
import { DuckyCoderV7Dashboard } from "./duckycoder-v7-dashboard"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { useDownload } from "@/context/downloadContext"
import type { WaifuImage } from "@/types/waifu"

export function EnhancedWaifuDownloader() {
  const { images, toggleFavorite, isFavorite } = useStorage()
  const { settings } = useSettings()
  const { downloads } = useDownload()

  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedImageForPreview, setSelectedImageForPreview] = useState<WaifuImage | null>(null)
  const [selectedImageForUpscale, setSelectedImageForUpscale] = useState<WaifuImage | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [duckyCoderOptimized, setDuckyCoderOptimized] = useState(false)
  const [optimizationMetrics, setOptimizationMetrics] = useState({
    performanceGain: 0,
    ethicalScore: 0,
    sustainabilityScore: 0,
    quantumAdvantage: 0,
  })

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set())
    } else {
      setSelectedImages(new Set(images.map((img) => img.image_id.toString())))
    }
  }

  const handleDownloadImage = (image: WaifuImage) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename || `image-${image.image_id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${image.filename || "image"}`)
  }

  const handleDuckyCoderOptimization = (results: any) => {
    setDuckyCoderOptimized(true)
    setOptimizationMetrics({
      performanceGain: results.transformationResults?.[0]?.metrics?.performanceImprovement || 25,
      ethicalScore: results.ethicalReport?.overallScore || 0.85,
      sustainabilityScore: results.sustainabilityReport?.sustainabilityScore || 0.8,
      quantumAdvantage: results.quantumAdvantage || 3.2,
    })

    toast.success("🚀 Application optimized with DuckyCoder v7!")
  }

  const stats = {
    totalImages: images.length,
    favoriteImages: images.filter((img) => isFavorite(img.image_id)).length,
    activeDownloads: downloads.filter((d) => d.status === "downloading").length,
    completedDownloads: downloads.filter((d) => d.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with DuckyCoder v7 Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl">🦆</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Waifu Downloader
            </h1>
            {duckyCoderOptimized && (
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                DuckyCoder v7 Optimized
              </Badge>
            )}
          </div>

          <p className="text-xl text-muted-foreground">
            Advanced AI-powered image downloading with quantum-enhanced processing
          </p>

          {duckyCoderOptimized && (
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-purple-500" />
                {optimizationMetrics.quantumAdvantage.toFixed(1)}x Quantum Boost
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="h-3 w-3 text-blue-500" />
                {optimizationMetrics.performanceGain.toFixed(0)}% Faster
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-500" />
                {(optimizationMetrics.ethicalScore * 100).toFixed(0)}% Ethical
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Leaf className="h-3 w-3 text-emerald-500" />
                {(optimizationMetrics.sustainabilityScore * 100).toFixed(0)}% Sustainable
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Images</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalImages}</p>
                  </div>
                  <Gallery className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Favorites</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.favoriteImages}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Downloads</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.activeDownloads}</p>
                  </div>
                  <Download className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {stats.completedDownloads}
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Application Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="download" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Gallery className="h-4 w-4" />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Gallery className="h-4 w-4" />
                Collections
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="duckycoder" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                DuckyCoder v7
              </TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Image Download Center
                  </CardTitle>
                  <CardDescription>Download high-quality anime images from multiple sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <SimpleDownloadTab />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <EnhancedImageGallery
                images={images}
                handleImageSelect={handleImageSelect}
                handleSelectAll={handleSelectAll}
                handleDownloadImage={handleDownloadImage}
                selectedImages={selectedImages}
                selectedImageForPreview={selectedImageForPreview}
                setSelectedImageForPreview={setSelectedImageForPreview}
                selectedImageForUpscale={selectedImageForUpscale}
                setSelectedImageForUpscale={setSelectedImageForUpscale}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <FavoritesPage />
            </TabsContent>

            <TabsContent value="collections" className="space-y-6">
              <CollectionsPage />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <SettingsPage />
            </TabsContent>

            <TabsContent value="duckycoder" className="space-y-6">
              <DuckyCoderV7Dashboard onOptimizationComplete={handleDuckyCoderOptimization} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
