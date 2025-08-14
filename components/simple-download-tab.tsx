"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DownloadStatus, DownloadProgress, ImageCategory } from "../types/waifu"
import { formatBytes, formatTime } from "../utils/waifuUtils"
import { Play, Pause, CircleStopIcon as Stop, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/context/settingsContext"

const API_CATEGORIES = {
  "waifu.im": ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform"],
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
  "nekos.best": ["husbando", "kitsune", "waifu"],
  wallhaven: ["anime", "general", "people"],
  femboyfinder: ["astolfo", "felix", "hideri", "saika", "venti"],
  all: [
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
    "marin-kitagawa",
    "mori-calliope",
    "raiden-shogun",
    "oppai",
    "selfies",
    "uniform",
    "husbando",
    "kitsune",
    "anime",
    "general",
    "people",
    "astolfo",
    "felix",
    "hideri",
    "saika",
    "venti",
  ],
}

type SimpleDownloadTabProps = {
  onStartDownload: (category: ImageCategory, limit: number, isNsfw: boolean, downloadPath: string) => void
  onPauseDownload: () => void
  onStopDownload: () => void
  downloadStatus: DownloadStatus
  downloadProgress: DownloadProgress
}

export const SimpleDownloadTab: React.FC<SimpleDownloadTabProps> = ({
  onStartDownload,
  onPauseDownload,
  onStopDownload,
  downloadStatus,
  downloadProgress,
}) => {
  const { settings } = useSettings()
  const [category, setCategory] = useState<ImageCategory>("waifu")
  const [downloadLimit, setDownloadLimit] = useState(10)
  const [apiSource, setApiSource] = useState("all")
  const [categories, setCategories] = useState<string[]>(API_CATEGORIES.all)

  // Set default categories based on settings.apiSource or fallback to "all"
  useEffect(() => {
    if (settings && settings.apiSource) {
      setApiSource(settings.apiSource)
      setCategories(API_CATEGORIES[settings.apiSource] || API_CATEGORIES.all)
    } else {
      setApiSource("all")
      setCategories(API_CATEGORIES.all)
    }
  }, [settings])

  const handleStartDownload = () => {
    onStartDownload(
      category as ImageCategory,
      downloadLimit,
      settings?.enableNsfw || false,
      settings?.downloadLocation || "/downloads",
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Download Images</h1>
          <p className="text-muted-foreground">Download waifu images from various sources</p>
        </div>
        <Link href="/settings">
          <Button variant="outline">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Download</CardTitle>
            <CardDescription>Start downloading with basic settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Image Category</Label>
              <Select value={category} onValueChange={(value: ImageCategory) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="download-limit">Number of Images</Label>
              <Input
                id="download-limit"
                type="number"
                value={downloadLimit}
                onChange={(e) => setDownloadLimit(Number.parseInt(e.target.value, 10))}
                min={1}
                max={100}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleStartDownload}
                disabled={downloadStatus === "downloading"}
                className="w-full"
                data-download-start
              >
                <Play className="w-4 h-4 mr-2" />
                Start Download
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={onPauseDownload}
                  disabled={downloadStatus !== "downloading"}
                  className="flex-1 bg-transparent"
                  variant="outline"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={onStopDownload}
                  disabled={downloadStatus === "idle" || downloadStatus === "completed"}
                  className="flex-1 bg-transparent"
                  variant="outline"
                >
                  <Stop className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Progress</CardTitle>
            <CardDescription>Current download status and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status: {downloadStatus}</span>
                <span>
                  {downloadProgress.downloaded} / {downloadProgress.total}
                </span>
              </div>
              <Progress value={(downloadProgress.downloaded / downloadProgress.total) * 100} className="h-2" />
            </div>

            {downloadStatus !== "idle" && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Downloaded:</span>
                  <span>{formatBytes(downloadProgress.downloaded)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{formatBytes(downloadProgress.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span>{formatBytes(downloadProgress.speed)}/s</span>
                </div>
                <div className="flex justify-between">
                  <span>ETA:</span>
                  <span>{formatTime(downloadProgress.eta)}</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Current API Source: <span className="font-medium">{apiSource}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                NSFW Content: <span className="font-medium">{settings?.enableNsfw ? "Allowed" : "Blocked"}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
