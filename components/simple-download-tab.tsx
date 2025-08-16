"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Download, Settings, ImageIcon, Tag, Shuffle, Heart, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"

export function SimpleDownloadTab() {
  const { startDownload, startBatchDownload, isDownloading, totalProgress } = useDownload()
  const { settings } = useSettings()

  const [downloadConfig, setDownloadConfig] = useState({
    source: "waifu.im",
    category: "waifu",
    count: 5,
    tags: "",
    nsfw: false,
    minWidth: 800,
    minHeight: 600,
    orientation: "any",
  })

  const [isConfiguring, setIsConfiguring] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const apiSources = [
    { value: "waifu.im", label: "Waifu.im", description: "High quality anime images" },
    { value: "waifu.pics", label: "Waifu.pics", description: "SFW and NSFW anime images" },
    { value: "nekos.best", label: "Nekos.best", description: "Neko and anime images" },
    { value: "wallhaven", label: "Wallhaven", description: "Anime wallpapers" },
  ]

  const categories = {
    "waifu.im": ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun"],
    "waifu.pics": ["waifu", "neko", "shinobu", "megumin", "bully"],
    "nekos.best": ["neko", "kitsune", "husbando", "waifu"],
    wallhaven: ["anime", "manga", "general"],
  }

  const handleQuickDownload = async () => {
    try {
      const urls = Array.from(
        { length: downloadConfig.count },
        (_, i) => `https://api.${downloadConfig.source}/random?category=${downloadConfig.category}&${i}`,
      )

      await startBatchDownload(urls, {
        source: downloadConfig.source,
        category: downloadConfig.category,
        tags: downloadConfig.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })

      toast.success(`Started downloading ${downloadConfig.count} images from ${downloadConfig.source}`)
    } catch (error) {
      toast.error("Failed to start download")
    }
  }

  const handlePreviewImages = async () => {
    // Simulate fetching preview images
    const mockPreviews = Array.from(
      { length: Math.min(downloadConfig.count, 6) },
      (_, i) => `/placeholder.svg?height=200&width=150&text=Preview+${i + 1}`,
    )
    setPreviewImages(mockPreviews)
    toast.success("Generated image previews")
  }

  return (
    <div className="space-y-6">
      {/* Quick Download Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Download
            </CardTitle>
            <CardDescription>Download anime images instantly with smart defaults</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">API Source</Label>
                <Select
                  value={downloadConfig.source}
                  onValueChange={(value) => setDownloadConfig((prev) => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        <div>
                          <div className="font-medium">{source.label}</div>
                          <div className="text-xs text-muted-foreground">{source.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={downloadConfig.category}
                  onValueChange={(value) => setDownloadConfig((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories[downloadConfig.source as keyof typeof categories] || []).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Image Count</Label>
                <Select
                  value={downloadConfig.count.toString()}
                  onValueChange={(value) => setDownloadConfig((prev) => ({ ...prev, count: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 image</SelectItem>
                    <SelectItem value="5">5 images</SelectItem>
                    <SelectItem value="10">10 images</SelectItem>
                    <SelectItem value="20">20 images</SelectItem>
                    <SelectItem value="50">50 images</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  placeholder="cute, kawaii, school"
                  value={downloadConfig.tags}
                  onChange={(e) => setDownloadConfig((prev) => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="nsfw"
                    checked={downloadConfig.nsfw}
                    onCheckedChange={(checked) => setDownloadConfig((prev) => ({ ...prev, nsfw: checked }))}
                  />
                  <Label htmlFor="nsfw">Include NSFW</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfiguring(!isConfiguring)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {isConfiguring ? "Hide" : "Show"} Advanced
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviewImages}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ImageIcon className="w-4 h-4" />
                  Preview
                </Button>
                <Button onClick={handleQuickDownload} disabled={isDownloading} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {isDownloading ? "Downloading..." : "Start Download"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced Configuration */}
      {isConfiguring && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>Fine-tune your download preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Image Quality</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minWidth">Min Width</Label>
                      <Input
                        id="minWidth"
                        type="number"
                        value={downloadConfig.minWidth}
                        onChange={(e) =>
                          setDownloadConfig((prev) => ({
                            ...prev,
                            minWidth: Number.parseInt(e.target.value) || 800,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minHeight">Min Height</Label>
                      <Input
                        id="minHeight"
                        type="number"
                        value={downloadConfig.minHeight}
                        onChange={(e) =>
                          setDownloadConfig((prev) => ({
                            ...prev,
                            minHeight: Number.parseInt(e.target.value) || 600,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select
                      value={downloadConfig.orientation}
                      onValueChange={(value) => setDownloadConfig((prev) => ({ ...prev, orientation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Download Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-start downloads</Label>
                        <div className="text-sm text-muted-foreground">
                          Start downloads immediately when added to queue
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Skip duplicates</Label>
                        <div className="text-sm text-muted-foreground">Avoid downloading duplicate images</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-favorite high rated</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically favorite images with high ratings
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Preview Images
              </CardTitle>
              <CardDescription>Preview of images that will be downloaded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg border">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">{previewImages.length} images ready for download</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Shuffle className="w-4 h-4 mr-1" />
                    Shuffle
                  </Button>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Download Progress */}
      {isDownloading && totalProgress && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-500 animate-pulse" />
                Download in Progress
              </CardTitle>
              <CardDescription>
                {totalProgress.downloaded} of {totalProgress.total} images completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={totalProgress.total > 0 ? (totalProgress.downloaded / totalProgress.total) * 100 : 0}
                  className="h-3"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Speed</div>
                    <div className="font-medium">{((totalProgress.speed || 0) / 1024 / 1024).toFixed(1)} MB/s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ETA</div>
                    <div className="font-medium">
                      {Math.floor((totalProgress.eta || 0) / 60)}m {Math.floor((totalProgress.eta || 0) % 60)}s
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current</div>
                    <div className="font-medium truncate">{totalProgress.currentFile || "Processing..."}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Errors</div>
                    <div className="font-medium text-red-500">{totalProgress.errors?.length || 0}</div>
                  </div>
                </div>
                {totalProgress.errors && totalProgress.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600">Recent Errors:</h4>
                    <div className="space-y-1">
                      {totalProgress.errors.slice(0, 3).map((error, index) => (
                        <p key={index} className="text-xs text-red-600 bg-red-50 dark:bg-red-950/50 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Popular download presets and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                onClick={() => {
                  setDownloadConfig({
                    source: "waifu.im",
                    category: "waifu",
                    count: 10,
                    tags: "cute, kawaii",
                    nsfw: false,
                    minWidth: 1920,
                    minHeight: 1080,
                    orientation: "landscape",
                  })
                  handleQuickDownload()
                }}
              >
                <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-500" />
                </div>
                <div className="text-center">
                  <div className="font-medium">Cute Waifus</div>
                  <div className="text-xs text-muted-foreground">10 HD cute anime girls</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                onClick={() => {
                  setDownloadConfig({
                    source: "wallhaven",
                    category: "anime",
                    count: 20,
                    tags: "wallpaper, landscape",
                    nsfw: false,
                    minWidth: 2560,
                    minHeight: 1440,
                    orientation: "landscape",
                  })
                  handleQuickDownload()
                }}
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-center">
                  <div className="font-medium">Wallpapers</div>
                  <div className="text-xs text-muted-foreground">20 4K anime wallpapers</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                onClick={() => {
                  setDownloadConfig({
                    source: "nekos.best",
                    category: "neko",
                    count: 15,
                    tags: "neko, cat ears",
                    nsfw: false,
                    minWidth: 800,
                    minHeight: 600,
                    orientation: "any",
                  })
                  handleQuickDownload()
                }}
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Tag className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-center">
                  <div className="font-medium">Neko Girls</div>
                  <div className="text-xs text-muted-foreground">15 cat ear anime girls</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                onClick={() => {
                  setDownloadConfig({
                    source: "waifu.pics",
                    category: "waifu",
                    count: 5,
                    tags: "random",
                    nsfw: false,
                    minWidth: 600,
                    minHeight: 600,
                    orientation: "any",
                  })
                  handleQuickDownload()
                }}
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Shuffle className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-center">
                  <div className="font-medium">Random Mix</div>
                  <div className="text-xs text-muted-foreground">5 random anime images</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
