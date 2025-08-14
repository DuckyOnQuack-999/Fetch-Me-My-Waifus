"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Loader2 } from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"

interface DownloadItem {
  id: string
  url: string
  filename: string
  status: "pending" | "downloading" | "completed" | "error"
  progress: number
}

export function SimpleDownloadTab() {
  const { settings } = useSettings()
  const [url, setUrl] = useState("")
  const [filename, setFilename] = useState("")
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  // Safely access apiSource with fallback
  const apiSource = settings?.apiSource || "waifu.im"

  const handleDownload = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL")
      return
    }

    const downloadId = Date.now().toString()
    const downloadFilename = filename.trim() || `waifu-${downloadId}.jpg`

    const newDownload: DownloadItem = {
      id: downloadId,
      url: url.trim(),
      filename: downloadFilename,
      status: "pending",
      progress: 0,
    }

    setDownloads((prev) => [newDownload, ...prev])
    setIsDownloading(true)

    try {
      // Update status to downloading
      setDownloads((prev) => prev.map((d) => (d.id === downloadId ? { ...d, status: "downloading" as const } : d)))

      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setDownloads((prev) => prev.map((d) => (d.id === downloadId ? { ...d, progress } : d)))
      }

      // Mark as completed
      setDownloads((prev) =>
        prev.map((d) => (d.id === downloadId ? { ...d, status: "completed" as const, progress: 100 } : d)),
      )

      toast.success(`Downloaded: ${downloadFilename}`)
      setUrl("")
      setFilename("")
    } catch (error) {
      setDownloads((prev) => prev.map((d) => (d.id === downloadId ? { ...d, status: "error" as const } : d)))
      toast.error("Download failed")
    } finally {
      setIsDownloading(false)
    }
  }

  const getStatusColor = (status: DownloadItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "downloading":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-gradient">Simple Download</CardTitle>
          <CardDescription>Download images directly from URLs using {apiSource}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Image URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-glow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename">Filename (optional)</Label>
            <Input
              id="filename"
              placeholder="my-waifu.jpg"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="input-glow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-source">API Source</Label>
            <Select value={apiSource}>
              <SelectTrigger className="input-glow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waifu.im">Waifu.im</SelectItem>
                <SelectItem value="waifu.pics">Waifu Pics</SelectItem>
                <SelectItem value="nekos.best">Nekos.best</SelectItem>
                <SelectItem value="wallhaven">Wallhaven</SelectItem>
                <SelectItem value="femboy-finder">Femboy Finder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleDownload} disabled={isDownloading || !url.trim()} className="w-full glow-button">
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {downloads.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-gradient">Download History</CardTitle>
            <CardDescription>Recent downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {downloads.map((download) => (
                <div
                  key={download.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-primary/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{download.filename}</p>
                    <p className="text-xs text-muted-foreground truncate">{download.url}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className={`${getStatusColor(download.status)} text-white border-0`}>
                      {download.status}
                    </Badge>
                    {download.status === "downloading" && (
                      <span className="text-xs text-muted-foreground">{download.progress}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
