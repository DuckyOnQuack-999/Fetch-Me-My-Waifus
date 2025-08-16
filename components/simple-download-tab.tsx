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
import { Download, Play, Pause, Square, Settings, ImageIcon, Zap } from "lucide-react"
import { toast } from "sonner"
import { useSettings } from "@/context/settingsContext"
import { useDownload } from "@/context/downloadContext"

const CATEGORIES = [
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
]

const API_SOURCES = [
  { value: "all", label: "All Sources" },
  { value: "waifu.im", label: "Waifu.im" },
  { value: "waifu.pics", label: "Waifu Pics" },
  { value: "nekos.best", label: "Nekos.best" },
  { value: "wallhaven", label: "Wallhaven" },
]

export function SimpleDownloadTab() {
  const { settings, updateSettings } = useSettings()
  const { downloadQueue, isDownloading, startDownload, pauseDownload, stopDownload } = useDownload()

  const [downloadCount, setDownloadCount] = useState(10)
  const [selectedCategory, setSelectedCategory] = useState("waifu")
  const [selectedSource, setSelectedSource] = useState("all")
  const [enableNsfw, setEnableNsfw] = useState(false)
  const [customTags, setCustomTags] = useState("")
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleQuickDownload = async () => {
    try {
      const downloadOptions = {
        count: downloadCount,
        category: selectedCategory,
        source: selectedSource,
        nsfw: enableNsfw,
        tags: customTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      toast.success(`Starting download of ${downloadCount} ${selectedCategory} images`)

      // Simulate download progress
      setDownloadProgress(0)
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            toast.success("Download completed successfully!")
            return 100
          }
          return prev + Math.random() * 10
        })
      }, 500)

      await startDownload(downloadOptions)
    } catch (error) {
      toast.error("Failed to start download")
      console.error("Download error:", error)
    }
  }

  const handlePauseResume = () => {
    if (isDownloading) {
      pauseDownload()
      toast.info("Download paused")
    } else {
      // Resume logic would go here
      toast.info("Download resumed")
    }
  }

  const handleStop = () => {
    stopDownload()
    setDownloadProgress(0)
    toast.info("Download stopped")
  }

  return (
    <div className="space-y-6">
      {/* Quick Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Download
          </CardTitle>
          <CardDescription>Quickly download anime images with basic settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="download-count">Number of Images</Label>
              <Input
                id="download-count"
                type="number"
                min="1"
                max="100"
                value={downloadCount}
                onChange={(e) => setDownloadCount(Number.parseInt(e.target.value) || 1)}
                className="input-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">API Source</Label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {API_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-tags">Custom Tags (comma-separated)</Label>
              <Input
                id="custom-tags"
                placeholder="e.g., cute, pink hair, school uniform"
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
                className="input-glow"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="nsfw-toggle" checked={enableNsfw} onCheckedChange={setEnableNsfw} />
              <Label htmlFor="nsfw-toggle">Include NSFW content</Label>
              <Badge variant="secondary" className="text-xs">
                18+
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Button onClick={handleQuickDownload} disabled={isDownloading} className="glow-button">
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Downloading..." : "Start Download"}
            </Button>

            {isDownloading && (
              <>
                <Button variant="outline" onClick={handlePauseResume}>
                  {isDownloading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={handleStop}>
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {downloadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Download Progress</span>
                <span>{downloadProgress.toFixed(1)}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Queue */}
      {downloadQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Download Queue
            </CardTitle>
            <CardDescription>{downloadQueue.length} items in queue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {downloadQueue.slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium">{item.filename}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.source}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === "completed"
                          ? "default"
                          : item.status === "downloading"
                            ? "secondary"
                            : item.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                    {item.progress !== undefined && (
                      <div className="w-16">
                        <Progress value={item.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {downloadQueue.length > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  ... and {downloadQueue.length - 5} more items
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Settings
          </CardTitle>
          <CardDescription>Adjust common download settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Concurrent Downloads</Label>
              <Select
                value={settings.concurrentDownloads.toString()}
                onValueChange={(value) => updateSettings({ concurrentDownloads: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Slow)</SelectItem>
                  <SelectItem value="3">3 (Balanced)</SelectItem>
                  <SelectItem value="5">5 (Fast)</SelectItem>
                  <SelectItem value="10">10 (Maximum)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Image Quality</Label>
              <Select
                value={settings.selectedPreset}
                onValueChange={(value) => updateSettings({ selectedPreset: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Fast)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best Quality)</SelectItem>
                  <SelectItem value="ultra">Ultra (4K+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-start Downloads</Label>
              <p className="text-xs text-muted-foreground">Automatically start downloads when added to queue</p>
            </div>
            <Switch
              checked={settings.autoStartDownloads}
              onCheckedChange={(checked) => updateSettings({ autoStartDownloads: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Skip Duplicates</Label>
              <p className="text-xs text-muted-foreground">Avoid downloading duplicate images</p>
            </div>
            <Switch
              checked={settings.skipDuplicates}
              onCheckedChange={(checked) => updateSettings({ skipDuplicates: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
