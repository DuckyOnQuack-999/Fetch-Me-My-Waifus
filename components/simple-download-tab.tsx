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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Settings, Zap, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import type { ImageCategory, DownloadItem } from "@/types/waifu"

export function SimpleDownloadTab() {
  const { addToQueue, downloads } = useDownload()
  const { settings } = useSettings()

  const [downloadConfig, setDownloadConfig] = useState({
    category: "waifu" as ImageCategory,
    count: 10,
    isNsfw: false,
    tags: "",
    source: "waifu.im",
  })

  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const categories: { value: ImageCategory; label: string; icon: string }[] = [
    { value: "waifu", label: "Waifu", icon: "👧" },
    { value: "neko", label: "Neko", icon: "🐱" },
    { value: "shinobu", label: "Shinobu", icon: "🦋" },
    { value: "megumin", label: "Megumin", icon: "💥" },
    { value: "bully", label: "Bully", icon: "😤" },
    { value: "cuddle", label: "Cuddle", icon: "🤗" },
    { value: "cry", label: "Cry", icon: "😢" },
    { value: "hug", label: "Hug", icon: "🫂" },
    { value: "awoo", label: "Awoo", icon: "🐺" },
    { value: "kiss", label: "Kiss", icon: "💋" },
    { value: "lick", label: "Lick", icon: "👅" },
    { value: "pat", label: "Pat", icon: "✋" },
    { value: "smug", label: "Smug", icon: "😏" },
    { value: "bonk", label: "Bonk", icon: "🔨" },
    { value: "yeet", label: "Yeet", icon: "🚀" },
    { value: "blush", label: "Blush", icon: "😊" },
    { value: "smile", label: "Smile", icon: "😄" },
    { value: "wave", label: "Wave", icon: "👋" },
    { value: "highfive", label: "High Five", icon: "🙏" },
    { value: "handhold", label: "Handhold", icon: "🤝" },
    { value: "nom", label: "Nom", icon: "😋" },
    { value: "bite", label: "Bite", icon: "🦷" },
    { value: "glomp", label: "Glomp", icon: "🤸" },
    { value: "slap", label: "Slap", icon: "👋" },
    { value: "kill", label: "Kill", icon: "⚔️" },
    { value: "kick", label: "Kick", icon: "🦵" },
    { value: "happy", label: "Happy", icon: "😊" },
    { value: "wink", label: "Wink", icon: "😉" },
    { value: "poke", label: "Poke", icon: "👉" },
    { value: "dance", label: "Dance", icon: "💃" },
  ]

  const sources = [
    { value: "waifu.im", label: "Waifu.im", description: "High quality anime images" },
    { value: "waifu.pics", label: "Waifu.pics", description: "SFW and NSFW anime images" },
    { value: "nekos.best", label: "Nekos.best", description: "Neko-focused API" },
    { value: "wallhaven", label: "Wallhaven", description: "Wallpapers and backgrounds" },
  ]

  const handleDownload = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    setDownloadProgress(0)

    toast.success(`Starting download of ${downloadConfig.count} ${downloadConfig.category} images`)

    try {
      for (let i = 0; i < downloadConfig.count; i++) {
        const downloadItem: DownloadItem = {
          id: `download_${Date.now()}_${i}`,
          url: `https://example.com/${downloadConfig.category}_${i}.jpg`,
          filename: `${downloadConfig.category}_${Date.now()}_${i}.jpg`,
          status: "pending",
          progress: 0,
          category: downloadConfig.category,
          tags: downloadConfig.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          addedAt: new Date(),
          timestamp: new Date(),
          source: downloadConfig.source as any,
        }

        addToQueue(downloadItem)
        setDownloadProgress(((i + 1) / downloadConfig.count) * 100)

        // Simulate download delay
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      toast.success("All images added to download queue!")
    } catch (error) {
      toast.error("Failed to start download")
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Download
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Quick Download
              </CardTitle>
              <CardDescription>Download images quickly with basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={downloadConfig.category}
                    onValueChange={(value: ImageCategory) =>
                      setDownloadConfig((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="count">Number of Images</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={downloadConfig.count}
                    onChange={(e) =>
                      setDownloadConfig((prev) => ({
                        ...prev,
                        count: Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">API Source</Label>
                <Select
                  value={downloadConfig.source}
                  onValueChange={(value) => setDownloadConfig((prev) => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select API source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
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

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="nsfw">NSFW Content</Label>
                  <p className="text-xs text-muted-foreground">Include not-safe-for-work content</p>
                </div>
                <Switch
                  id="nsfw"
                  checked={downloadConfig.isNsfw}
                  onCheckedChange={(checked) => setDownloadConfig((prev) => ({ ...prev, isNsfw: checked }))}
                />
              </div>

              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Adding to queue...</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}

              <Button onClick={handleDownload} disabled={isDownloading} className="w-full" size="lg">
                {isDownloading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding to Queue...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download {downloadConfig.count} Images
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Advanced Download
              </CardTitle>
              <CardDescription>Fine-tune your download with advanced options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category-advanced">Category</Label>
                  <Select
                    value={downloadConfig.category}
                    onValueChange={(value: ImageCategory) =>
                      setDownloadConfig((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="count-advanced">Number of Images</Label>
                  <Input
                    id="count-advanced"
                    type="number"
                    min="1"
                    max="100"
                    value={downloadConfig.count}
                    onChange={(e) =>
                      setDownloadConfig((prev) => ({
                        ...prev,
                        count: Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., cute, anime, girl"
                  value={downloadConfig.tags}
                  onChange={(e) => setDownloadConfig((prev) => ({ ...prev, tags: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Add specific tags to filter your downloads</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source-advanced">API Source</Label>
                <Select
                  value={downloadConfig.source}
                  onValueChange={(value) => setDownloadConfig((prev) => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select API source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
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

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="nsfw-advanced">NSFW Content</Label>
                  <p className="text-xs text-muted-foreground">Include not-safe-for-work content</p>
                </div>
                <Switch
                  id="nsfw-advanced"
                  checked={downloadConfig.isNsfw}
                  onCheckedChange={(checked) => setDownloadConfig((prev) => ({ ...prev, isNsfw: checked }))}
                />
              </div>

              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Adding to queue...</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}

              <Button onClick={handleDownload} disabled={isDownloading} className="w-full" size="lg">
                {isDownloading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding to Queue...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download {downloadConfig.count} Images
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Queue Status */}
      {downloads && downloads.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Download Queue
                <Badge variant="secondary">{downloads.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {downloads.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm truncate">{item.filename}</span>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
                {downloads.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">And {downloads.length - 3} more items...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
