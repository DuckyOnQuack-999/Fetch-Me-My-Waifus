"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Download,
  Pause,
  Square,
  Settings,
  ImageIcon,
  Heart,
  Star,
  Zap,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import type { ImageCategory, DownloadItem } from "@/types/waifu"

interface DownloadStats {
  total: number
  completed: number
  failed: number
  inProgress: number
}

export function SimpleDownloadTab() {
  const { downloads, addToQueue, isDownloading, downloadProgress, startDownload, pauseDownload, stopDownload } =
    useDownload()
  const { settings } = useSettings()

  const [category, setCategory] = useState<ImageCategory>("waifu")
  const [count, setCount] = useState(10)
  const [quality, setQuality] = useState("high")
  const [includeNsfw, setIncludeNsfw] = useState(false)
  const [tags, setTags] = useState("")
  const [orientation, setOrientation] = useState("any")
  const [minWidth, setMinWidth] = useState([1920])
  const [minHeight, setMinHeight] = useState([1080])

  const [stats, setStats] = useState<DownloadStats>({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: 0,
  })

  useEffect(() => {
    const newStats = {
      total: downloads.length,
      completed: downloads.filter((d) => d.status === "completed").length,
      failed: downloads.filter((d) => d.status === "failed").length,
      inProgress: downloads.filter((d) => d.status === "downloading").length,
    }
    setStats(newStats)
  }, [downloads])

  const handleStartDownload = async () => {
    if (count < 1 || count > 100) {
      toast.error("Please enter a valid count between 1 and 100")
      return
    }

    toast.success(`Starting download of ${count} ${category} images`)

    try {
      for (let i = 0; i < count; i++) {
        const downloadItem: DownloadItem = {
          id: `download_${Date.now()}_${i}`,
          url: `https://api.waifu.im/search?included_tags=${category}&width=${minWidth[0]}&height=${minHeight[0]}`,
          filename: `${category}_${Date.now()}_${i}.jpg`,
          status: "pending",
          progress: 0,
          category,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          addedAt: new Date(),
          timestamp: new Date(),
          source: settings?.apiSource || "waifu.im",
          quality,
          nsfw: includeNsfw,
          orientation: orientation as any,
          width: minWidth[0],
          height: minHeight[0],
        }
        addToQueue(downloadItem)
      }

      startDownload()
      toast.success("Download started successfully!")
    } catch (error) {
      toast.error("Failed to start download")
      console.error("Download error:", error)
    }
  }

  const categories: { value: ImageCategory; label: string; icon: any }[] = [
    { value: "waifu", label: "Waifu", icon: Heart },
    { value: "neko", label: "Neko", icon: Star },
    { value: "shinobu", label: "Shinobu", icon: Zap },
    { value: "megumin", label: "Megumin", icon: Star },
    { value: "bully", label: "Bully", icon: Heart },
    { value: "cuddle", label: "Cuddle", icon: Heart },
    { value: "cry", label: "Cry", icon: Heart },
    { value: "hug", label: "Hug", icon: Heart },
    { value: "awoo", label: "Awoo", icon: Star },
    { value: "kiss", label: "Kiss", icon: Heart },
    { value: "lick", label: "Lick", icon: Heart },
    { value: "pat", label: "Pat", icon: Heart },
    { value: "smug", label: "Smug", icon: Star },
    { value: "bonk", label: "Bonk", icon: Zap },
    { value: "yeet", label: "Yeet", icon: Zap },
    { value: "blush", label: "Blush", icon: Heart },
    { value: "smile", label: "Smile", icon: Heart },
    { value: "wave", label: "Wave", icon: Heart },
    { value: "highfive", label: "High Five", icon: Star },
    { value: "handhold", label: "Handhold", icon: Heart },
    { value: "nom", label: "Nom", icon: Star },
    { value: "bite", label: "Bite", icon: Star },
    { value: "glomp", label: "Glomp", icon: Heart },
    { value: "slap", label: "Slap", icon: Zap },
    { value: "kill", label: "Kill", icon: Zap },
    { value: "kick", label: "Kick", icon: Zap },
    { value: "happy", label: "Happy", icon: Heart },
    { value: "wink", label: "Wink", icon: Star },
    { value: "poke", label: "Poke", icon: Star },
    { value: "dance", label: "Dance", icon: Star },
    { value: "cringe", label: "Cringe", icon: Star },
  ]

  const qualityOptions = [
    { value: "low", label: "Low (Fast)" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High (Best)" },
  ]

  const orientationOptions = [
    { value: "any", label: "Any" },
    { value: "landscape", label: "Landscape" },
    { value: "portrait", label: "Portrait" },
    { value: "square", label: "Square" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Download Center</h2>
          <p className="text-muted-foreground">Configure and start your image downloads</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isDownloading ? "default" : "secondary"} className="gap-1">
            {isDownloading ? (
              <>
                <Download className="h-3 w-3 animate-spin" />
                Downloading
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                Ready
              </>
            )}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download Progress */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 animate-spin" />
                  Download in Progress
                </CardTitle>
                <CardDescription>Current download progress and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button onClick={pauseDownload} variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button onClick={stopDownload} variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Download Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Basic Download Settings
                </CardTitle>
                <CardDescription>Configure your basic download preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(value) => setCategory(value as ImageCategory)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="h-4 w-4" />
                              {cat.label}
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
                      value={count}
                      onChange={(e) => setCount(Number.parseInt(e.target.value) || 1)}
                      placeholder="Enter count"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select value={orientation} onValueChange={setOrientation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        {orientationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="nsfw">Include NSFW Content</Label>
                      <p className="text-sm text-muted-foreground">Allow adult content in downloads</p>
                    </div>
                    <Switch id="nsfw" checked={includeNsfw} onCheckedChange={setIncludeNsfw} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., cute, anime, girl"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleStartDownload} disabled={isDownloading} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Start Download"}
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Preview feature coming soon!")}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>Fine-tune your download parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Width: {minWidth[0]}px</Label>
                    <Slider
                      value={minWidth}
                      onValueChange={setMinWidth}
                      max={4000}
                      min={800}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Height: {minHeight[0]}px</Label>
                    <Slider
                      value={minHeight}
                      onValueChange={setMinHeight}
                      max={4000}
                      min={600}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Concurrent Downloads</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 (Slow)</SelectItem>
                        <SelectItem value="3">3 (Recommended)</SelectItem>
                        <SelectItem value="5">5 (Fast)</SelectItem>
                        <SelectItem value="10">10 (Very Fast)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="3">3 (Recommended)</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-organize by Category</Label>
                      <p className="text-sm text-muted-foreground">Create folders based on image categories</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Skip Duplicates</Label>
                      <p className="text-sm text-muted-foreground">Avoid downloading duplicate images</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Generate Thumbnails</Label>
                      <p className="text-sm text-muted-foreground">Create thumbnail previews for faster browsing</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Content Filters
                </CardTitle>
                <CardDescription>Apply filters to customize your downloads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>File Format</Label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Format</SelectItem>
                        <SelectItem value="jpg">JPEG only</SelectItem>
                        <SelectItem value="png">PNG only</SelectItem>
                        <SelectItem value="webp">WebP only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Ratio</SelectItem>
                        <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                        <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                        <SelectItem value="9:16">9:16 (Mobile)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Exclude Tags (comma-separated)</Label>
                    <Input placeholder="e.g., violence, gore, sad" />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Tags (comma-separated)</Label>
                    <Input placeholder="e.g., smile, happy, colorful" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Quality Only</Label>
                      <p className="text-sm text-muted-foreground">Only download high-resolution images</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animated Content</Label>
                      <p className="text-sm text-muted-foreground">Include GIFs and animated images</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Verified Sources Only</Label>
                      <p className="text-sm text-muted-foreground">Only use trusted and verified image sources</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Recent Downloads */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Downloads
            </CardTitle>
            <CardDescription>Your latest download activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {downloads.slice(0, 5).map((download, index) => (
                <motion.div
                  key={download.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{download.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {download.category} • {download.addedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        download.status === "completed"
                          ? "default"
                          : download.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {download.status}
                    </Badge>
                    {download.status === "downloading" && (
                      <div className="w-16">
                        <Progress value={download.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {downloads.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No downloads yet</p>
                  <p className="text-sm">Start your first download to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
