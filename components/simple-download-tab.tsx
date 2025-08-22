"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Loader2, CheckCircle, AlertCircle, ImageIcon } from "lucide-react"
import { getImages, setImages, addToDownloadHistory } from "@/utils/localStorage"
import { toast } from "sonner"
import { useSettings } from "@/hooks/useSettings"
import { useDownload } from "@/hooks/useDownload"
import { useStorage } from "@/hooks/useStorage"
import { fetchImagesFromMultipleSources } from "@/utils/fetchImages"
import { AnimatePresence, motion } from "framer-motion"
import { Pause, Zap } from "lucide-react"
import type { ImageCategory, ApiSource, WaifuImage } from "@/types"

const API_ENDPOINTS = {
  "waifu.im": "https://api.waifu.im/search",
  "waifu.pics": "https://api.waifu.pics/sfw/waifu",
  "nekos.best": "https://nekos.best/api/v2/waifu",
  wallhaven: "https://wallhaven.cc/api/v1/search",
}

const CATEGORIES = {
  "waifu.im": ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun"],
  "waifu.pics": ["waifu", "neko", "shinobu", "megumin", "bully"],
  "nekos.best": ["waifu", "neko", "kitsune", "husbando"],
  wallhaven: ["anime", "general", "people"],
}

export function SimpleDownloadTab() {
  const { settings } = useSettings()
  const { startBatchDownload, downloads, isDownloading, totalProgress } = useDownload()
  const { addImage } = useStorage()

  const [downloadConfig, setDownloadConfig] = useState({
    category: "waifu" as ImageCategory,
    apiSource: "all" as ApiSource,
    count: 10,
    isNsfw: false,
    minWidth: 800,
    minHeight: 600,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState<WaifuImage[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const [selectedApi, setSelectedApi] = useState<string>("waifu.pics")
  const [selectedCategory, setSelectedCategory] = useState<string>("waifu")
  const [customUrl, setCustomUrl] = useState<string>("")
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    status: "idle",
    message: "",
  })

  const categories: ImageCategory[] = [
    "waifu",
    "neko",
    "shinobu",
    "megumin",
    "bully",
    "cuddle",
    "cry",
    "hug",
    "awoo",
    "kiss",
    "lick",
    "pat",
    "smug",
    "bonk",
    "yeet",
    "blush",
    "smile",
    "wave",
    "highfive",
    "handhold",
    "nom",
    "bite",
    "glomp",
    "slap",
    "kill",
    "kick",
    "happy",
    "wink",
    "poke",
    "dance",
    "cringe",
    "maid",
    "uniform",
    "selfies",
    "husbando",
    "kitsune",
  ]

  const apiSources: { value: ApiSource; label: string; description: string }[] = [
    { value: "all", label: "All Sources", description: "Fetch from all available APIs" },
    { value: "waifu.im", label: "Waifu.im", description: "High-quality curated images" },
    { value: "waifu.pics", label: "Waifu.pics", description: "Large collection of anime images" },
    { value: "nekos.best", label: "Nekos.best", description: "Neko-focused image collection" },
    { value: "wallhaven", label: "Wallhaven", description: "High-resolution wallpapers" },
    { value: "femboyfinder", label: "FemboyFinder", description: "Specialized collection" },
  ]

  const updateDownloadState = useCallback((updates: Partial<DownloadState>) => {
    setDownloadState((prev) => ({ ...prev, ...updates }))
  }, [])

  const fetchFromWaifuPics = async (): Promise<any> => {
    const response = await fetch(`https://api.waifu.pics/sfw/${selectedCategory}`)
    if (!response.ok) throw new Error("Failed to fetch from waifu.pics")
    const data = await response.json()
    return {
      url: data.url,
      source: "waifu.pics",
      category: selectedCategory,
      tags: [selectedCategory],
    }
  }

  const fetchFromWaifuIm = async (): Promise<any> => {
    const params = new URLSearchParams({
      included_tags: selectedCategory,
      height: ">=2000",
      is_nsfw: "false",
    })

    const response = await fetch(`https://api.waifu.im/search?${params}`)
    if (!response.ok) throw new Error("Failed to fetch from waifu.im")
    const data = await response.json()

    if (!data.images || data.images.length === 0) {
      throw new Error("No images found")
    }

    const image = data.images[0]
    return {
      url: image.url,
      source: "waifu.im",
      category: selectedCategory,
      tags: image.tags || [selectedCategory],
      width: image.width,
      height: image.height,
    }
  }

  const fetchFromNekosBest = async (): Promise<any> => {
    const response = await fetch(`https://nekos.best/api/v2/${selectedCategory}`)
    if (!response.ok) throw new Error("Failed to fetch from nekos.best")
    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error("No images found")
    }

    const image = data.results[0]
    return {
      url: image.url,
      source: "nekos.best",
      category: selectedCategory,
      tags: [selectedCategory],
      artist: image.artist_name,
      href: image.artist_href,
    }
  }

  const fetchFromWallhaven = async (): Promise<any> => {
    const apiKey = process.env.WALLHAVEN_API_KEY || "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk"
    const params = new URLSearchParams({
      categories: "010", // Anime only
      purity: "100", // SFW only
      sorting: "random",
      apikey: apiKey,
    })

    const response = await fetch(`https://wallhaven.cc/api/v1/search?${params}`)
    if (!response.ok) throw new Error("Failed to fetch from Wallhaven")
    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      throw new Error("No images found")
    }

    const image = data.data[0]
    return {
      url: image.path,
      source: "wallhaven",
      category: "anime",
      tags: image.tags || ["anime"],
      resolution: image.resolution,
      colors: image.colors,
    }
  }

  const fetchFromCustomUrl = async (): Promise<any> => {
    if (!customUrl.trim()) {
      throw new Error("Please enter a valid URL")
    }

    // Basic URL validation
    try {
      new URL(customUrl)
    } catch {
      throw new Error("Invalid URL format")
    }

    return {
      url: customUrl,
      source: "custom",
      category: "custom",
      tags: ["custom"],
    }
  }

  const downloadImage = async () => {
    try {
      updateDownloadState({
        isDownloading: true,
        progress: 0,
        status: "downloading",
        message: "Fetching image...",
      })

      let imageData: any

      // Fetch image data based on selected API
      updateDownloadState({ progress: 25, message: "Connecting to API..." })

      switch (selectedApi) {
        case "waifu.pics":
          imageData = await fetchFromWaifuPics()
          break
        case "waifu.im":
          imageData = await fetchFromWaifuIm()
          break
        case "nekos.best":
          imageData = await fetchFromNekosBest()
          break
        case "wallhaven":
          imageData = await fetchFromWallhaven()
          break
        case "custom":
          imageData = await fetchFromCustomUrl()
          break
        default:
          throw new Error("Invalid API selection")
      }

      updateDownloadState({ progress: 50, message: "Processing image..." })

      // Create image object
      const newImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: imageData.url,
        title: `${imageData.source} - ${imageData.category}`,
        source: imageData.source,
        tags: imageData.tags || [],
        category: imageData.category,
        downloadedAt: new Date().toISOString(),
        width: imageData.width,
        height: imageData.height,
        artist: imageData.artist,
        colors: imageData.colors,
        resolution: imageData.resolution,
      }

      updateDownloadState({ progress: 75, message: "Saving to gallery..." })

      // Add to gallery
      const existingImages = getImages()
      const updatedImages = [newImage, ...existingImages]
      setImages(updatedImages)

      // Add to download history
      addToDownloadHistory({
        id: newImage.id,
        title: newImage.title,
        source: newImage.source,
        url: newImage.url,
        timestamp: newImage.downloadedAt,
      })

      updateDownloadState({
        progress: 100,
        status: "success",
        message: "Image downloaded successfully!",
        downloadedImage: newImage,
      })

      toast.success("Image downloaded successfully!")

      // Reset after 3 seconds
      setTimeout(() => {
        updateDownloadState({
          isDownloading: false,
          progress: 0,
          status: "idle",
          message: "",
          downloadedImage: undefined,
        })
      }, 3000)
    } catch (error) {
      console.error("Download error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to download image"

      updateDownloadState({
        isDownloading: false,
        progress: 0,
        status: "error",
        message: errorMessage,
      })

      toast.error(errorMessage)

      // Reset error after 5 seconds
      setTimeout(() => {
        updateDownloadState({
          status: "idle",
          message: "",
        })
      }, 5000)
    }
  }

  const handleApiChange = (value: string) => {
    setSelectedApi(value)
    // Reset category when API changes
    const categories = CATEGORIES[value as keyof typeof CATEGORIES]
    if (categories && categories.length > 0) {
      setSelectedCategory(categories[0])
    }
  }

  const availableCategories = CATEGORIES[selectedApi as keyof typeof CATEGORIES] || []

  const handlePreview = async () => {
    setIsLoading(true)
    try {
      const images = await fetchImagesFromMultipleSources(
        downloadConfig.category,
        Math.min(downloadConfig.count, 6), // Limit preview to 6 images
        downloadConfig.isNsfw,
        "RANDOM",
        1,
        downloadConfig.minWidth,
        downloadConfig.minHeight,
        settings,
        downloadConfig.apiSource,
      )

      setPreviewImages(images)
      setShowPreview(true)
      toast.success(`Found ${images.length} images for preview`)
    } catch (error) {
      console.error("Preview failed:", error)
      toast.error("Failed to load preview images")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartDownload = async () => {
    setIsLoading(true)
    try {
      const images = await fetchImagesFromMultipleSources(
        downloadConfig.category,
        downloadConfig.count,
        downloadConfig.isNsfw,
        "RANDOM",
        1,
        downloadConfig.minWidth,
        downloadConfig.minHeight,
        settings,
        downloadConfig.apiSource,
      )

      if (images.length === 0) {
        toast.error("No images found with the current settings")
        return
      }

      // Add images to storage
      images.forEach((image) => addImage(image))

      // Start batch download
      const urls = images.map((img) => img.url)
      await startBatchDownload(urls, {
        source: downloadConfig.apiSource,
        category: downloadConfig.category,
        tags: [downloadConfig.category],
      })

      toast.success(`Started downloading ${images.length} images`)
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Failed to start download")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Download Configuration */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download Configuration
          </CardTitle>
          <CardDescription>Configure your image download preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={downloadConfig.category}
                onValueChange={(value: ImageCategory) => setDownloadConfig((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-source">API Source</Label>
              <Select
                value={downloadConfig.apiSource}
                onValueChange={(value: ApiSource) => setDownloadConfig((prev) => ({ ...prev, apiSource: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {apiSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{source.label}</div>
                        <div className="text-xs text-muted-foreground">{source.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Image Count</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={downloadConfig.count}
                onChange={(e) =>
                  setDownloadConfig((prev) => ({ ...prev, count: Number.parseInt(e.target.value) || 1 }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-width">Min Width (px)</Label>
              <Input
                id="min-width"
                type="number"
                min="100"
                max="10000"
                value={downloadConfig.minWidth}
                onChange={(e) =>
                  setDownloadConfig((prev) => ({ ...prev, minWidth: Number.parseInt(e.target.value) || 100 }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-height">Min Height (px)</Label>
              <Input
                id="min-height"
                type="number"
                min="100"
                max="10000"
                value={downloadConfig.minHeight}
                onChange={(e) =>
                  setDownloadConfig((prev) => ({ ...prev, minHeight: Number.parseInt(e.target.value) || 100 }))
                }
              />
            </div>

            {/* Include NSFW Content */}
            <div className="flex items-center space-x-2">
              <input
                id="nsfw"
                type="checkbox"
                checked={downloadConfig.isNsfw}
                onChange={(e) => setDownloadConfig((prev) => ({ ...prev, isNsfw: e.target.checked }))}
                className="h-4 w-4 text-primary rounded border border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              />
              <Label htmlFor="nsfw">Include NSFW Content</Label>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-border my-4" />

          {/* Download Configuration Summary */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {downloadConfig.category}
            </Badge>
            <Badge variant="outline">{downloadConfig.apiSource}</Badge>
            <Badge variant={downloadConfig.isNsfw ? "destructive" : "default"}>
              {downloadConfig.isNsfw ? "NSFW" : "SFW"}
            </Badge>
            <Badge variant="secondary">{downloadConfig.count} images</Badge>
            <Badge variant="outline">
              {downloadConfig.minWidth}×{downloadConfig.minHeight}+
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Download */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Quick Download
          </CardTitle>
          <CardDescription>Download random images from various anime APIs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-select">API Source</Label>
              <Select value={selectedApi} onValueChange={handleApiChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select API" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waifu.pics">Waifu.pics</SelectItem>
                  <SelectItem value="waifu.im">Waifu.im</SelectItem>
                  <SelectItem value="nekos.best">Nekos.best</SelectItem>
                  <SelectItem value="wallhaven">Wallhaven</SelectItem>
                  <SelectItem value="custom">Custom URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedApi !== "custom" ? (
              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="custom-url">Image URL</Label>
                <Input
                  id="custom-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button
            onClick={downloadImage}
            disabled={downloadState.isDownloading || (selectedApi === "custom" && !customUrl.trim())}
            className="w-full"
          >
            {downloadState.isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Random Image
              </>
            )}
          </Button>

          {downloadState.isDownloading && (
            <div className="space-y-2">
              <Progress value={downloadState.progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{downloadState.message}</p>
            </div>
          )}

          {downloadState.status === "success" && downloadState.downloadedImage && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="flex items-center justify-between">
                  <span>{downloadState.message}</span>
                  <Badge variant="secondary" className="ml-2">
                    {downloadState.downloadedImage.source}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {downloadState.status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{downloadState.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handlePreview} disabled={isLoading} variant="outline" className="flex-1 bg-transparent">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Preview Images
            </div>
          )}
        </Button>

        <Button onClick={handleStartDownload} disabled={isLoading || isDownloading} className="flex-1">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Starting...
            </div>
          ) : isDownloading ? (
            <div className="flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Downloading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Start Download
            </div>
          )}
        </Button>
      </div>

      {/* Download Progress */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Zap className="h-5 w-5" />
                  Download Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {totalProgress.downloaded} / {totalProgress.total}
                    </span>
                  </div>
                  <Progress value={(totalProgress.downloaded / totalProgress.total) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Speed:</span>
                    <div className="font-mono">{(totalProgress.speed / 1024 / 1024).toFixed(1)} MB/s</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ETA:</span>
                    <div className="font-mono">
                      {Math.floor(totalProgress.eta / 60)}m {Math.floor(totalProgress.eta % 60)}s
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current:</span>
                    <div className="font-mono truncate">{totalProgress.currentFile || "Processing..."}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Errors:</span>
                    <div className="font-mono text-destructive">{totalProgress.errors?.length || 0}</div>
                  </div>
                </div>

                {totalProgress.errors && totalProgress.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Errors occurred:</span>
                    </div>
                    <div className="max-h-20 overflow-y-auto space-y-1">
                      {totalProgress.errors.map((error, index) => (
                        <div key={index} className="text-xs text-muted-foreground bg-destructive/10 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      <AnimatePresence>
        {showPreview && previewImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Preview Images
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                    Hide Preview
                  </Button>
                </div>
                <CardDescription>Preview of {previewImages.length} images that will be downloaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {previewImages.map((image, index) => (
                    <motion.div
                      key={image.image_id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="aspect-square rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={image.url || "/placeholder.svg?height=150&width=150"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Downloaded Image */}
      {downloadState.downloadedImage && (
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Downloaded Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={downloadState.downloadedImage.url || "/placeholder.svg"}
                alt={downloadState.downloadedImage.title}
                className="w-full sm:w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=128&width=128"
                }}
              />
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">{downloadState.downloadedImage.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{downloadState.downloadedImage.source}</Badge>
                  {downloadState.downloadedImage.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {downloadState.downloadedImage.resolution && (
                  <p className="text-sm text-muted-foreground">
                    Resolution: {downloadState.downloadedImage.resolution}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Downloads Summary */}
      {downloads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Recent Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {downloads.slice(0, 5).map((download) => (
                <div key={download.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        download.status === "completed"
                          ? "bg-green-500"
                          : download.status === "downloading"
                            ? "bg-blue-500"
                            : download.status === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-sm font-medium truncate">{download.filename}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {download.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface DownloadState {
  isDownloading: boolean
  progress: number
  status: "idle" | "downloading" | "success" | "error"
  message: string
  downloadedImage?: any
}
