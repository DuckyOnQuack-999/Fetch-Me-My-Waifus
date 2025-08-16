"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Download, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock, ImageIcon } from "lucide-react"
import { useDownload } from "@/context/downloadContext"

export function SimpleDownloadTab() {
  const { downloads, isDownloading, downloadProgress, addDownload, removeDownload } = useDownload()
  const [url, setUrl] = useState("")
  const [selectedApi, setSelectedApi] = useState("waifu.pics")
  const [category, setCategory] = useState("waifu")

  const handleDownload = async () => {
    if (!url.trim()) return

    try {
      await addDownload({
        url: url.trim(),
        api: selectedApi,
        category,
        filename: `waifu-${Date.now()}.jpg`,
      })
      setUrl("")
    } catch (error) {
      console.error("Download failed:", error)
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
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "downloading":
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Quick Download
          </CardTitle>
          <CardDescription>Download images from various waifu APIs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={selectedApi} onValueChange={setSelectedApi}>
              <SelectTrigger>
                <SelectValue placeholder="Select API" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waifu.pics">Waifu.pics</SelectItem>
                <SelectItem value="waifu.im">Waifu.im</SelectItem>
                <SelectItem value="nekos.best">Nekos.best</SelectItem>
                <SelectItem value="wallhaven">Wallhaven</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waifu">Waifu</SelectItem>
                <SelectItem value="neko">Neko</SelectItem>
                <SelectItem value="shinobu">Shinobu</SelectItem>
                <SelectItem value="megumin">Megumin</SelectItem>
                <SelectItem value="bully">Bully</SelectItem>
                <SelectItem value="cuddle">Cuddle</SelectItem>
                <SelectItem value="cry">Cry</SelectItem>
                <SelectItem value="hug">Hug</SelectItem>
                <SelectItem value="awoo">Awoo</SelectItem>
                <SelectItem value="kiss">Kiss</SelectItem>
                <SelectItem value="lick">Lick</SelectItem>
                <SelectItem value="pat">Pat</SelectItem>
                <SelectItem value="smug">Smug</SelectItem>
                <SelectItem value="bonk">Bonk</SelectItem>
                <SelectItem value="yeet">Yeet</SelectItem>
                <SelectItem value="blush">Blush</SelectItem>
                <SelectItem value="smile">Smile</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="highfive">Highfive</SelectItem>
                <SelectItem value="handhold">Handhold</SelectItem>
                <SelectItem value="nom">Nom</SelectItem>
                <SelectItem value="bite">Bite</SelectItem>
                <SelectItem value="glomp">Glomp</SelectItem>
                <SelectItem value="slap">Slap</SelectItem>
                <SelectItem value="kill">Kill</SelectItem>
                <SelectItem value="kick">Kick</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="wink">Wink</SelectItem>
                <SelectItem value="poke">Poke</SelectItem>
                <SelectItem value="dance">Dance</SelectItem>
                <SelectItem value="cringe">Cringe</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleDownload} disabled={isDownloading || !selectedApi} className="gap-2">
              {isDownloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isDownloading ? "Downloading..." : "Download Random"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Or paste image URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleDownload()}
            />
            <Button onClick={handleDownload} disabled={isDownloading || !url.trim()} variant="outline">
              Download URL
            </Button>
          </div>

          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Download Progress</span>
                <span>{downloadProgress}%</span>
              </div>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Download Queue
            </div>
            <Badge variant="outline">{downloads?.length || 0} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!downloads || downloads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-4" />
              <p>No downloads yet</p>
              <p className="text-sm">Start downloading some waifus!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((download) => (
                <div key={download.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  {getStatusIcon(download.status)}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{download.filename}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{download.api}</span>
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
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
