"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Download,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ImageIcon,
  Zap,
  Heart,
  Star,
  Shuffle,
} from "lucide-react"
import { useDownload } from "@/context/downloadContext"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export function SimpleDownloadTab() {
  const { downloads = [], isDownloading, downloadProgress, addDownload, removeDownload } = useDownload()
  const [url, setUrl] = useState("")
  const [selectedApi, setSelectedApi] = useState("waifu.pics")
  const [category, setCategory] = useState("waifu")
  const [count, setCount] = useState(5)
  const [includeNsfw, setIncludeNsfw] = useState(false)
  const [autoDownload, setAutoDownload] = useState(true)

  const apiOptions = [
    { value: "waifu.pics", label: "Waifu.pics", description: "SFW & NSFW anime images" },
    { value: "waifu.im", label: "Waifu.im", description: "High-quality waifu images" },
    { value: "nekos.best", label: "Nekos.best", description: "Neko & anime characters" },
    { value: "wallhaven", label: "Wallhaven", description: "Anime wallpapers" },
  ]

  const categories = {
    "waifu.pics": [
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
    ],
    "waifu.im": ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform"],
    "nekos.best": ["neko", "kitsune", "husbando", "waifu"],
    wallhaven: ["anime", "manga", "general", "people"],
  }

  const quickPresets = [
    {
      name: "Cute Waifus",
      api: "waifu.pics",
      category: "waifu",
      count: 10,
      description: "Adorable anime girls",
      icon: Heart,
      color: "bg-pink-500",
    },
    {
      name: "Neko Girls",
      api: "nekos.best",
      category: "neko",
      count: 8,
      description: "Cat-eared cuties",
      icon: Star,
      color: "bg-purple-500",
    },
    {
      name: "HD Wallpapers",
      api: "wallhaven",
      category: "anime",
      count: 15,
      description: "High-res backgrounds",
      icon: ImageIcon,
      color: "bg-blue-500",
    },
    {
      name: "Random Mix",
      api: "waifu.im",
      category: "waifu",
      count: 12,
      description: "Surprise selection",
      icon: Shuffle,
      color: "bg-green-500",
    },
  ]

  const handleDownload = async () => {
    if (!url.trim() && !selectedApi) return

    try {
      if (url.trim()) {
        await addDownload({
          url: url.trim(),
          api: "custom",
          category: "custom",
          filename: `custom-${Date.now()}.jpg`,
        })
        setUrl("")
        toast.success("Custom URL added to download queue")
      } else {
        // Generate multiple downloads for API
        for (let i = 0; i < count; i++) {
          await addDownload({
            url: `https://api.${selectedApi}/${category}`,
            api: selectedApi,
            category,
            filename: `${selectedApi}-${category}-${Date.now()}-${i}.jpg`,
          })
        }
        toast.success(`Added ${count} images from ${selectedApi} to download queue`)
      }
    } catch (error) {
      toast.error("Failed to add download")
      console.error("Download failed:", error)
    }
  }

  const handlePresetDownload = async (preset: (typeof quickPresets)[0]) => {
    try {
      for (let i = 0; i < preset.count; i++) {
        await addDownload({
          url: `https://api.${preset.api}/${preset.category}`,
          api: preset.api,
          category: preset.category,
          filename: `${preset.api}-${preset.category}-${Date.now()}-${i}.jpg`,
        })
      }
      toast.success(`Started downloading ${preset.count} ${preset.name.toLowerCase()}`)
    } catch (error) {
      toast.error("Failed to start preset download")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "downloading":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <ImageIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Completed
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "downloading":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            Downloading
          </Badge>
        )
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Download */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Quick Download
            </CardTitle>
            <CardDescription>Download images from various waifu APIs with advanced options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Selection */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="api-select">API Source</Label>
                <Select value={selectedApi} onValueChange={setSelectedApi}>
                  <SelectTrigger id="api-select">
                    <SelectValue placeholder="Select API" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiOptions.map((api) => (
                      <SelectItem key={api.value} value={api.value}>
                        <div>
                          <div className="font-medium">{api.label}</div>
                          <div className="text-xs text-muted-foreground">{api.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories[selectedApi as keyof typeof categories] || []).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count-select">Count</Label>
                <Select value={count.toString()} onValueChange={(value) => setCount(Number(value))}>
                  <SelectTrigger id="count-select">
                    <SelectValue placeholder="Count" />
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
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch id="nsfw" checked={includeNsfw} onCheckedChange={setIncludeNsfw} />
                <Label htmlFor="nsfw">Include NSFW</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto" checked={autoDownload} onCheckedChange={setAutoDownload} />
                <Label htmlFor="auto">Auto-start downloads</Label>
              </div>
            </div>

            {/* Download Actions */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleDownload()}
                  className="flex-1"
                />
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading || (!url.trim() && !selectedApi)}
                  className="gap-2 min-w-[120px]"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>

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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Presets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Presets
            </CardTitle>
            <CardDescription>Popular download configurations for instant use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickPresets.map((preset, index) => (
                <motion.div
                  key={preset.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3 bg-transparent hover:bg-muted/50 transition-all duration-200 w-full"
                    onClick={() => handlePresetDownload(preset)}
                    disabled={isDownloading}
                  >
                    <div className={`p-3 rounded-lg ${preset.color} text-white shadow-lg`}>
                      <preset.icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">{preset.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {preset.count} images • {preset.api}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download Queue */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Download Queue
              </div>
              <Badge variant="outline" className="gap-1">
                <ImageIcon className="h-3 w-3" />
                {downloads?.length || 0} items
              </Badge>
            </CardTitle>
            <CardDescription>Manage your download queue and monitor progress</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!downloads || downloads.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-muted-foreground"
                >
                  <Download className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No downloads yet</h3>
                  <p className="text-sm">Start downloading some waifus to see them here!</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {downloads.map((download, index) => (
                    <motion.div
                      key={download.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">{getStatusIcon(download.status)}</div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-medium truncate">{download.filename}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {download.api}
                          </Badge>
                          <span>•</span>
                          <span>{download.category}</span>
                          {download.size && (
                            <>
                              <span>•</span>
                              <span>{download.size}</span>
                            </>
                          )}
                        </div>

                        {download.status === "downloading" && download.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{download.progress}%</span>
                            </div>
                            <Progress value={download.progress} className="h-1" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(download.status)}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDownload(download.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
