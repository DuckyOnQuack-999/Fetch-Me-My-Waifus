"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import type { DownloadStatus, DownloadProgress, Settings, ResolutionPreset, ImageCategory } from "../types/waifu"
import { formatBytes, formatTime } from "../utils/waifuUtils"
import { Play, Pause, CircleStopIcon as Stop, Folder } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const RESOLUTION_PRESETS: ResolutionPreset[] = [
  { name: "HD (720p)", width: 1280, height: 720 },
  { name: "Full HD (1080p)", width: 1920, height: 1080 },
  { name: "2K", width: 2560, height: 1440 },
  { name: "4K", width: 3840, height: 2160 },
  { name: "Mobile HD", width: 720, height: 1280 },
  { name: "Mobile Full HD", width: 1080, height: 1920 },
]

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

type DownloadSettingsTabProps = {
  onStartDownload: (category: ImageCategory, limit: number, isNsfw: boolean, downloadPath: string) => void
  onPauseDownload: () => void
  onStopDownload: () => void
  downloadStatus: DownloadStatus
  downloadProgress: DownloadProgress
  settings: Settings
  onUpdateSettings: (newSettings: Partial<Settings>) => void
}

export const DownloadSettingsTab: React.FC<DownloadSettingsTabProps> = ({
  onStartDownload,
  onPauseDownload,
  onStopDownload,
  downloadStatus,
  downloadProgress,
  settings,
  onUpdateSettings,
}) => {
  const [downloadDir, setDownloadDir] = useState<string>("/downloads")
  const [category, setCategory] = useState<ImageCategory>("waifu")

  useEffect(() => {
    const availableCategories = API_CATEGORIES[settings.apiSource]
    if (!availableCategories.includes(category)) {
      setCategory(availableCategories[0] as ImageCategory)
      console.warn(
        `Category "${category}" is not supported by the selected API source. Defaulting to "${availableCategories[0]}".`,
      )
    }
  }, [settings.apiSource, category])

  const handleStartDownload = () => {
    onStartDownload(category, settings.concurrentDownloads, settings.allowNsfw, downloadDir)
  }

  const folders = [
    { name: "Downloads", path: "/downloads" },
    { name: "Pictures", path: "/pictures" },
    { name: "Documents", path: "/documents" },
    { name: "Desktop", path: "/desktop" },
  ]

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="download-settings">
          <AccordionTrigger>Download Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="download-dir">Download Folder</Label>
                <div className="flex gap-2">
                  <Input
                    id="download-dir"
                    value={downloadDir}
                    onChange={(e) => setDownloadDir(e.target.value)}
                    placeholder="Select download folder"
                    className="flex-grow"
                    readOnly
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Folder className="w-4 h-4 mr-2" />
                        Browse
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Select Download Folder</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <div className="space-y-2">
                          {folders.map((folder) => (
                            <Button
                              key={folder.path}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                setDownloadDir(folder.path)
                              }}
                            >
                              <Folder className="w-4 h-4 mr-2" />
                              {folder.name}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-source">API Source</Label>
                <Select
                  value={settings.apiSource}
                  onValueChange={(
                    value: "all" | "waifu.im" | "waifu.pics" | "nekos.best" | "wallhaven" | "femboyfinder",
                  ) => onUpdateSettings({ apiSource: value })}
                >
                  <SelectTrigger id="api-source" className="border-primary/20">
                    <SelectValue placeholder="Select API source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="waifu.im">Waifu.im</SelectItem>
                    <SelectItem value="waifu.pics">Waifu Pics</SelectItem>
                    <SelectItem value="nekos.best">Nekos.best</SelectItem>
                    <SelectItem value="wallhaven">Wallhaven</SelectItem>
                    <SelectItem value="femboyfinder">FemboyFinder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Image Category</Label>
                <Select value={category} onValueChange={(value: ImageCategory) => setCategory(value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {API_CATEGORIES[settings.apiSource].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concurrent-downloads">Download Limit / Concurrent Downloads</Label>
                <Input
                  id="concurrent-downloads"
                  type="number"
                  value={settings.concurrentDownloads}
                  onChange={(e) => onUpdateSettings({ concurrentDownloads: Number.parseInt(e.target.value, 10) })}
                  min={1}
                  max={100}
                  className="border-primary/20"
                />
                <p className="text-sm text-muted-foreground">
                  Set the maximum number of images to download and how many to download concurrently.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retry-attempts">Retry Attempts</Label>
                <Input
                  id="retry-attempts"
                  type="number"
                  value={settings.retryAttempts}
                  onChange={(e) => onUpdateSettings({ retryAttempts: Number.parseInt(e.target.value, 10) })}
                  min={0}
                  max={5}
                  className="border-primary/20"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-start"
                  checked={settings.autoStartDownloads}
                  onCheckedChange={(checked) => onUpdateSettings({ autoStartDownloads: checked })}
                />
                <Label htmlFor="auto-start">Auto-start Downloads</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-nsfw"
                  checked={settings.allowNsfw}
                  onCheckedChange={(checked) => onUpdateSettings({ allowNsfw: checked })}
                />
                <Label htmlFor="allow-nsfw">Allow NSFW Content</Label>
              </div>

              {/* Resolution settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom-resolution"
                    checked={settings.useCustomResolution}
                    onCheckedChange={(checked) =>
                      onUpdateSettings({
                        useCustomResolution: checked,
                        selectedPreset: null,
                      })
                    }
                  />
                  <Label htmlFor="custom-resolution">Use Custom Resolution</Label>
                </div>

                {settings.useCustomResolution ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-width">Minimum Width</Label>
                      <Input
                        id="min-width"
                        type="number"
                        value={settings.minWidth}
                        onChange={(e) => onUpdateSettings({ minWidth: Number.parseInt(e.target.value, 10) })}
                        min={0}
                        step={1}
                        className="border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-height">Minimum Height</Label>
                      <Input
                        id="min-height"
                        type="number"
                        value={settings.minHeight}
                        onChange={(e) => onUpdateSettings({ minHeight: Number.parseInt(e.target.value, 10) })}
                        min={0}
                        step={1}
                        className="border-primary/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="resolution-preset">Resolution Preset</Label>
                    <Select
                      value={settings.selectedPreset || ""}
                      onValueChange={(value) => {
                        const preset = RESOLUTION_PRESETS.find((p) => p.name === value)
                        if (preset) {
                          onUpdateSettings({
                            selectedPreset: value,
                            minWidth: preset.width,
                            minHeight: preset.height,
                          })
                        }
                      }}
                    >
                      <SelectTrigger id="resolution-preset" className="border-primary/20">
                        <SelectValue placeholder="Select a resolution preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOLUTION_PRESETS.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name} ({preset.width}x{preset.height})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Current minimum resolution: {settings.minWidth}x{settings.minHeight}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={handleStartDownload}
                  disabled={downloadStatus === "downloading"}
                  className="flex-1"
                  data-download-start
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
                <Button onClick={onPauseDownload} disabled={downloadStatus !== "downloading"} className="flex-1">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={onStopDownload}
                  disabled={downloadStatus === "idle" || downloadStatus === "completed"}
                  className="flex-1"
                >
                  <Stop className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>

              {downloadStatus !== "idle" && (
                <div className="space-y-2">
                  <Progress
                    value={(downloadProgress.downloaded / downloadProgress.total) * 100}
                    className="bg-primary/20"
                  />
                  <div className="text-sm text-muted-foreground">
                    {formatBytes(downloadProgress.downloaded)} / {formatBytes(downloadProgress.total)} | Speed:{" "}
                    {formatBytes(downloadProgress.speed)}/s | ETA: {formatTime(downloadProgress.eta)}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
