"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, Pause, X, CheckCircle, AlertCircle } from "lucide-react"

interface QueueItem {
  id: string
  url: string
  filename: string
  status: "pending" | "downloading" | "completed" | "failed" | "paused"
  progress: number
  size?: number
  downloaded?: number
  speed?: number
  eta?: number
}

export function DownloadQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "1",
      url: "https://example.com/image1.jpg",
      filename: "waifu_001.jpg",
      status: "downloading",
      progress: 45,
      size: 2048000,
      downloaded: 921600,
      speed: 1024000,
      eta: 1,
    },
    {
      id: "2",
      url: "https://example.com/image2.jpg",
      filename: "neko_002.jpg",
      status: "pending",
      progress: 0,
    },
    {
      id: "3",
      url: "https://example.com/image3.jpg",
      filename: "anime_003.jpg",
      status: "completed",
      progress: 100,
    },
  ])

  const getStatusIcon = (status: QueueItem["status"]) => {
    switch (status) {
      case "downloading":
        return <Download className="h-4 w-4 animate-pulse text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Download className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: QueueItem["status"]) => {
    const variants = {
      pending: "secondary",
      downloading: "default",
      completed: "default",
      failed: "destructive",
      paused: "secondary",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
  }

  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient">
          <Download className="h-5 w-5" />
          Download Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="font-medium truncate">{item.filename}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {item.status === "downloading" && (
                <div className="space-y-2">
                  <Progress value={item.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.progress}%</span>
                    <div className="flex gap-4">
                      {item.size && item.downloaded && (
                        <span>
                          {formatFileSize(item.downloaded)} / {formatFileSize(item.size)}
                        </span>
                      )}
                      {item.speed && <span>{formatSpeed(item.speed)}</span>}
                      {item.eta && <span>ETA: {item.eta}s</span>}
                    </div>
                  </div>
                </div>
              )}

              {item.status === "completed" && <Progress value={100} className="h-2" />}
            </div>
          ))}

          {queue.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No downloads in queue</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
