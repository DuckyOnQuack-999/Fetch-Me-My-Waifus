"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, Pause, Zap, ImageIcon, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings } from "@/context/settingsContext"
import { useDownload } from "@/context/downloadContext"
import { useStorage } from "@/context/storageContext"
import { fetchImagesFromMultipleSources } from "@/services/waifuApi"
import { toast } from "sonner"
import type { ImageCategory, ApiSource, WaifuImage } from "@/types/waifu"

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download Configuration
          </CardTitle>
          <CardDescription>Configure your image download preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

            <div className="flex items-center space-x-2">
              <Switch
                id="nsfw"
                checked={downloadConfig.isNsfw}
                onCheckedChange={(checked) => setDownloadConfig((prev) => ({ ...prev, isNsfw: checked }))}
              />
              <Label htmlFor="nsfw">Include NSFW Content</Label>
            </div>
          </div>

          <Separator />

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
