"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, LinkIcon, CheckCircle, XCircle, Clock, Loader2, ImageIcon, Trash2, RefreshCw } from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { useStorage } from "@/context/storageContext"
import { toast } from "sonner"

interface DownloadItem {
  id: string
  url: string
  filename: string
  status: "pending" | "downloading" | "completed" | "failed"
  progress: number
  error?: string
  timestamp: Date
  source: string
}

export function SimpleDownloadTab() {
  const { settings } = useSettings()
  const { addDownloadRecord } = useStorage()
  const [url, setUrl] = useState("")
  const [selectedSource, setSelectedSource] = useState(settings?.apiSource || "waifu-im")
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (settings?.apiSource) {
      setSelectedSource(settings.apiSource)
    }
  }, [settings])

  const generateFilename = (url: string, source: string) => {
    const timestamp = Date.now()
    const extension = url.split(".").pop()?.split("?")[0] || "jpg"
    return `${source}_${timestamp}.${extension}`
  }

  const simulateDownload = async (item: DownloadItem) => {
    const updateProgress = (progress: number) => {
      setDownloads((prev) => prev.map((d) => (d.id === item.id ? { ...d, progress, status: "downloading" } : d)))
    }

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        updateProgress(i)
      }

      // Mark as completed
      setDownloads((prev) => prev.map((d) => (d.id === item.id ? { ...d, status: "completed", progress: 100 } : d)))

      // Add to download history
      addDownloadRecord({
        url: item.url,
        filename: item.filename,
        source: item.source,
        status: "completed",
        downloadedAt: new Date().toISOString(),
      })

      toast.success(`Downloaded: ${item.filename}`)
    } catch (error) {
      setDownloads((prev) =>
        prev.map((d) =>
          d.id === item.id
            ? {
                ...d,
                status: "failed",
                error: error instanceof Error ? error.message : "Download failed",
              }
            : d,
        ),
      )
      toast.error(`Failed to download: ${item.filename}`)
    }
  }

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL")
      return
    }

    if (!settings) {
      toast.error("Settings not loaded")
      return
    }

    setIsDownloading(true)

    try {
      const downloadItem: DownloadItem = {
        id: Date.now().toString(),
        url: url.trim(),
        filename: generateFilename(url, selectedSource),
        status: "pending",
        progress: 0,
        timestamp: new Date(),
        source: selectedSource,
      }

      setDownloads((prev) => [downloadItem, ...prev])
      setUrl("")

      // Start download simulation
      await simulateDownload(downloadItem)
    } catch (error) {
      toast.error("Failed to start download")
    } finally {
      setIsDownloading(false)
    }
  }

  const removeDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id))
  }

  const clearCompleted = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== "completed"))
    toast.success("Cleared completed downloads")
  }

  const retryDownload = async (id: string) => {
    const item = downloads.find((d) => d.id === id)
    if (item) {
      setDownloads((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "pending", progress: 0, error: undefined } : d)),
      )
      await simulateDownload(item)
    }
  }

  const getStatusIcon = (status: DownloadItem["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "downloading":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: DownloadItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "downloading":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-700 border-red-500/20"
    }
  }

  const activeDownloads = downloads.filter((d) => d.status === "downloading").length
  const completedDownloads = downloads.filter((d) => d.status === "completed").length
  const failedDownloads = downloads.filter((d) => d.status === "failed").length

  return (
    <div className="space-y-6">
      {/* Download Form */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Simple Download
          </CardTitle>
          <CardDescription>Download images directly from URLs using your preferred API source</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">API Source</Label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waifu-im">Waifu.im</SelectItem>
                  <SelectItem value="waifu-pics">Waifu Pics</SelectItem>
                  <SelectItem value="nekos-best">Nekos.best</SelectItem>
                  <SelectItem value="wallhaven">Wallhaven</SelectItem>
                  <SelectItem value="femboy-finder">Femboy Finder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleDownload} disabled={isDownloading || !url.trim()} className="w-full glow-button">
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting Download...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Download Stats */}
      {downloads.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="material-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="material-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="material-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold">{failedDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="material-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{downloads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Download Queue */}
      {downloads.length > 0 && (
        <Card className="material-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Download Queue ({downloads.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Completed
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {downloads.map((download, index) => (
                  <div key={download.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(download.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{download.filename}</p>
                          <p className="text-xs text-muted-foreground truncate">{download.url}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(download.status)}>
                          {download.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {download.status === "failed" && (
                          <Button variant="ghost" size="sm" onClick={() => retryDownload(download.id)}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => removeDownload(download.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {download.status === "downloading" && <Progress value={download.progress} className="h-2" />}

                    {download.error && (
                      <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded">{download.error}</p>
                    )}

                    {index < downloads.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
