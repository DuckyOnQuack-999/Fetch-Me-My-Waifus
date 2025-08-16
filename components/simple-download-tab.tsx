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
import { Slider } from "@/components/ui/slider"
import { Download, Play, Pause, Square, Settings, ImageIcon, Zap, Filter, Shuffle, Target } from "lucide-react"
import { motion } from "framer-motion"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import type { ImageCategory } from "@/types/waifu"

export function SimpleDownloadTab() {
  const { startDownload, startBatchDownload, isDownloading, totalProgress } = useDownload()
  const { settings, updateSettings } = useSettings()

  const [downloadCount, setDownloadCount] = useState(10)
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>("waifu")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isNsfw, setIsNsfw] = useState(false)
  const [minWidth, setMinWidth] = useState(800)
  const [minHeight, setMinHeight] = useState(600)
  const [selectedSource, setSelectedSource] = useState("waifu.im")
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)

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
  ]

  const popularTags = [
    "anime",
    "manga",
    "cute",
    "kawaii",
    "moe",
    "school",
    "uniform",
    "cat_ears",
    "fox_girl",
    "demon",
    "angel",
    "maid",
    "witch",
    "princess",
    "blue_hair",
    "pink_hair",
    "long_hair",
    "short_hair",
    "twintails",
    "glasses",
    "headphones",
    "sword",
    "magic",
    "fantasy",
    "modern",
  ]

  const sources = [
    { id: "waifu.im", name: "Waifu.im", description: "High quality anime images" },
    { id: "waifu.pics", name: "Waifu.pics", description: "SFW and NSFW anime images" },
    { id: "nekos.best", name: "Nekos.best", description: "Neko and anime images" },
    { id: "wallhaven", name: "Wallhaven", description: "Anime wallpapers" },
  ]

  const handleStartDownload = async () => {
    if (isDownloading) {
      toast.info("Downloads are already in progress")
      return
    }

    try {
      const urls = Array.from(
        { length: downloadCount },
        (_, i) => `https://api.${selectedSource}/v1/random?category=${selectedCategory}&index=${i}`,
      )

      await startBatchDownload(urls, {
        category: selectedCategory,
        tags: selectedTags,
        source: selectedSource,
        metadata: {
          nsfw: isNsfw,
          minWidth,
          minHeight,
          downloadedAt: new Date().toISOString(),
        },
      })

      toast.success(`Started downloading ${downloadCount} ${selectedCategory} images from ${selectedSource}`)
    } catch (error) {
      toast.error("Failed to start download")
      console.error("Download error:", error)
    }
  }

  const handleQuickDownload = async (category: ImageCategory, count: number) => {
    try {
      const urls = Array.from(
        { length: count },
        (_, i) => `https://api.waifu.im/v1/random?category=${category}&index=${i}`,
      )

      await startBatchDownload(urls, {
        category,
        source: "waifu.im",
        tags: [category],
      })

      toast.success(`Quick download started: ${count} ${category} images`)
    } catch (error) {
      toast.error("Quick download failed")
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Download
            </CardTitle>
            <CardDescription>Start downloading immediately with popular categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["waifu", "neko", "shinobu", "megumin"].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
                  onClick={() => handleQuickDownload(category as ImageCategory, 5)}
                  disabled={isDownloading}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm capitalize">{category}</p>
                    <p className="text-xs text-muted-foreground">5 images</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Download Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Tabs defaultValue="simple" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simple Mode</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4">
            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Simple Download
                </CardTitle>
                <CardDescription>Easy-to-use download interface for quick results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value as ImageCategory)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(0, 10).map((category) => (
                            <SelectItem key={category} value={category}>
                              <span className="capitalize">{category}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Images</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[downloadCount]}
                          onValueChange={(value) => setDownloadCount(value[0])}
                          max={100}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <Badge variant="outline" className="min-w-12 text-center">
                          {downloadCount}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Source</Label>
                      <Select value={selectedSource} onValueChange={setSelectedSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              <div>
                                <div className="font-medium">{source.name}</div>
                                <div className="text-xs text-muted-foreground">{source.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Options</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">NSFW Content</Label>
                            <p className="text-xs text-muted-foreground">Include adult content</p>
                          </div>
                          <Switch checked={isNsfw} onCheckedChange={setIsNsfw} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">High Quality Only</Label>
                            <p className="text-xs text-muted-foreground">Minimum 800x600 resolution</p>
                          </div>
                          <Switch
                            checked={minWidth >= 800}
                            onCheckedChange={(checked) => {
                              setMinWidth(checked ? 800 : 400)
                              setMinHeight(checked ? 600 : 300)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Auto-organize</Label>
                            <p className="text-xs text-muted-foreground">Sort by category</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button onClick={handleStartDownload} disabled={isDownloading} className="flex-1" size="lg">
                    {isDownloading ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Download
                      </>
                    )}
                  </Button>

                  <Button variant="outline" size="lg">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Download
                </CardTitle>
                <CardDescription>Fine-tune your download preferences with advanced options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category & Tags</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value as ImageCategory)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              <span className="capitalize">{category}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Popular Tags</Label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                        {popularTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <p className="text-xs text-muted-foreground">Selected: {selectedTags.join(", ")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Download Count</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={downloadCount}
                          onChange={(e) => setDownloadCount(Number.parseInt(e.target.value) || 1)}
                          min={1}
                          max={1000}
                          className="w-24"
                        />
                        <Slider
                          value={[downloadCount]}
                          onValueChange={(value) => setDownloadCount(value[0])}
                          max={200}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Quality Settings</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Min Width</Label>
                          <Input
                            type="number"
                            value={minWidth}
                            onChange={(e) => setMinWidth(Number.parseInt(e.target.value) || 400)}
                            min={100}
                            max={4000}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Min Height</Label>
                          <Input
                            type="number"
                            value={minHeight}
                            onChange={(e) => setMinHeight(Number.parseInt(e.target.value) || 300)}
                            min={100}
                            max={4000}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Content Filters</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">NSFW Content</Label>
                          <Switch checked={isNsfw} onCheckedChange={setIsNsfw} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Animated Images</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Duplicate Detection</Label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Download Behavior</Label>
                      <Select defaultValue="parallel">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parallel">Parallel Downloads</SelectItem>
                          <SelectItem value="sequential">Sequential Downloads</SelectItem>
                          <SelectItem value="batch">Batch Processing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button onClick={handleStartDownload} disabled={isDownloading} className="flex-1" size="lg">
                    {isDownloading ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Start Advanced Download
                      </>
                    )}
                  </Button>

                  <Button variant="outline" size="lg">
                    <Filter className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Download Progress */}
      {isDownloading && totalProgress && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 animate-pulse text-primary" />
                Download Progress
              </CardTitle>
              <CardDescription>
                {totalProgress.downloaded} of {totalProgress.total} images completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round((totalProgress.downloaded / totalProgress.total) * 100)}%</span>
                </div>
                <Progress value={(totalProgress.downloaded / totalProgress.total) * 100} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{totalProgress.downloaded}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{totalProgress.total - totalProgress.downloaded}</div>
                  <div className="text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{((totalProgress.speed || 0) / 1024 / 1024).toFixed(1)} MB/s</div>
                  <div className="text-muted-foreground">Speed</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {Math.floor((totalProgress.eta || 0) / 60)}m {Math.floor((totalProgress.eta || 0) % 60)}s
                  </div>
                  <div className="text-muted-foreground">ETA</div>
                </div>
              </div>

              {totalProgress.currentFile && (
                <div className="text-sm text-muted-foreground truncate">Current: {totalProgress.currentFile}</div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause All
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Square className="h-4 w-4 mr-2" />
                  Cancel All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
