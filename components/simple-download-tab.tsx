"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Play, Square, Settings, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import type { ImageCategory, DownloadItem } from "@/types/waifu"

export function SimpleDownloadTab() {
  const { addToQueue, downloads, isDownloading, downloadProgress } = useDownload()
  const { settings } = useSettings()

  const [category, setCategory] = useState<ImageCategory>("waifu")
  const [count, setCount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const categories: { value: ImageCategory; label: string; description: string }[] = [
    { value: "waifu", label: "Waifu", description: "Anime girl characters" },
    { value: "neko", label: "Neko", description: "Cat-girl characters" },
    { value: "shinobu", label: "Shinobu", description: "Shinobu Kocho themed" },
    { value: "megumin", label: "Megumin", description: "Megumin themed" },
    { value: "bully", label: "Bully", description: "Teasing characters" },
    { value: "cuddle", label: "Cuddle", description: "Cuddling scenes" },
    { value: "cry", label: "Cry", description: "Emotional scenes" },
    { value: "hug", label: "Hug", description: "Hugging scenes" },
    { value: "awoo", label: "Awoo", description: "Wolf-girl characters" },
    { value: "kiss", label: "Kiss", description: "Romantic scenes" },
    { value: "lick", label: "Lick", description: "Playful scenes" },
    { value: "pat", label: "Pat", description: "Head patting" },
    { value: "smug", label: "Smug", description: "Smug expressions" },
    { value: "bonk", label: "Bonk", description: "Bonking scenes" },
    { value: "yeet", label: "Yeet", description: "Throwing scenes" },
    { value: "blush", label: "Blush", description: "Blushing characters" },
    { value: "smile", label: "Smile", description: "Happy expressions" },
    { value: "wave", label: "Wave", description: "Waving gestures" },
    { value: "highfive", label: "High Five", description: "High five gestures" },
    { value: "handhold", label: "Hand Hold", description: "Hand holding" },
    { value: "nom", label: "Nom", description: "Eating scenes" },
    { value: "bite", label: "Bite", description: "Biting scenes" },
    { value: "glomp", label: "Glomp", description: "Tackle hugs" },
    { value: "slap", label: "Slap", description: "Slapping scenes" },
    { value: "kill", label: "Kill", description: "Action scenes" },
    { value: "kick", label: "Kick", description: "Kicking scenes" },
    { value: "happy", label: "Happy", description: "Joyful expressions" },
    { value: "wink", label: "Wink", description: "Winking gestures" },
    { value: "poke", label: "Poke", description: "Poking gestures" },
    { value: "dance", label: "Dance", description: "Dancing scenes" },
  ]

  const handleStartDownload = async () => {
    if (isLoading || count <= 0) return

    setIsLoading(true)
    toast.success(`Starting download of ${count} ${category} images`)

    try {
      for (let i = 0; i < count; i++) {
        const downloadItem: DownloadItem = {
          id: `download_${Date.now()}_${i}`,
          url: `https://api.waifu.pics/sfw/${category}`,
          filename: `${category}_${Date.now()}_${i}.jpg`,
          status: "pending",
          progress: 0,
          category: category,
          tags: [category],
          addedAt: new Date(),
          timestamp: new Date(),
          source: settings?.apiSource || "waifu.pics",
        }
        addToQueue(downloadItem)

        // Small delay between additions
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      toast.success(`Added ${count} images to download queue!`)
    } catch (error) {
      toast.error("Failed to add images to queue")
      console.error("Download error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const activeDownloads = downloads.filter((d) => d.status === "downloading").length
  const completedDownloads = downloads.filter((d) => d.status === "completed").length
  const failedDownloads = downloads.filter((d) => d.status === "failed").length

  return (
    <div className="space-y-6">
      {/* Main Download Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Quick Download
            </CardTitle>
            <CardDescription>Download anime images from multiple sources with customizable options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ImageCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-xs text-muted-foreground">{cat.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Count Input */}
              <div className="space-y-2">
                <Label htmlFor="count">Number of Images</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, Number.parseInt(e.target.value) || 1)))}
                  placeholder="Enter number of images"
                />
              </div>
            </div>

            {/* Download Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleStartDownload}
                disabled={isLoading || isDownloading}
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding to Queue...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download {count} {category} images
                  </>
                )}
              </Button>

              <Button variant="outline" size="lg">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Progress */}
            {isDownloading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Download Progress</span>
                  <span>{downloadProgress}%</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Download Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{activeDownloads}</p>
                <p className="text-xs text-muted-foreground">Active Downloads</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <Download className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{completedDownloads}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{failedDownloads}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                <Square className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{downloads.length}</p>
                <p className="text-xs text-muted-foreground">Total Queue</p>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <Play className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Downloads */}
      {downloads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Downloads</CardTitle>
              <CardDescription>Latest items in your download queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {downloads.slice(0, 5).map((download, index) => (
                  <motion.div
                    key={download.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">{download.filename}</p>
                        <p className="text-xs text-muted-foreground">{download.category}</p>
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
                        className="text-xs"
                      >
                        {download.status}
                      </Badge>
                      {download.status === "downloading" && (
                        <div className="w-12">
                          <Progress value={download.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
