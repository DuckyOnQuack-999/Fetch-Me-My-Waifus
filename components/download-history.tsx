"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { History, Search, Download, Trash2, Calendar } from "lucide-react"

interface HistoryItem {
  id: string
  filename: string
  url: string
  downloadDate: Date
  size: number
  status: "completed" | "failed"
  source: string
}

export function DownloadHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [history] = useState<HistoryItem[]>([
    {
      id: "1",
      filename: "waifu_001.jpg",
      url: "https://example.com/image1.jpg",
      downloadDate: new Date("2024-01-15T10:30:00"),
      size: 2048000,
      status: "completed",
      source: "waifu.pics",
    },
    {
      id: "2",
      filename: "neko_002.jpg",
      url: "https://example.com/image2.jpg",
      downloadDate: new Date("2024-01-15T09:15:00"),
      size: 1536000,
      status: "completed",
      source: "nekos.best",
    },
    {
      id: "3",
      filename: "anime_003.jpg",
      url: "https://example.com/image3.jpg",
      downloadDate: new Date("2024-01-14T16:45:00"),
      size: 0,
      status: "failed",
      source: "waifu.im",
    },
  ])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "N/A"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  const filteredHistory = history.filter(
    (item) =>
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient">
          <History className="h-5 w-5" />
          Download History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {filteredHistory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{item.filename}</span>
                    <Badge variant={item.status === "completed" ? "default" : "destructive"}>{item.status}</Badge>
                    <Badge variant="secondary">{item.source}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.downloadDate)}
                  </div>
                  <span>{formatFileSize(item.size)}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No download history found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
