"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ImageIcon, Settings } from "lucide-react"
import { DirectoryBrowser } from "./directory-browser"

export function DownloadTab() {
  const [selectedApi, setSelectedApi] = useState("waifu.pics")
  const [category, setCategory] = useState("waifu")
  const [type, setType] = useState("sfw")
  const [count, setCount] = useState("1")
  const [downloadPath, setDownloadPath] = useState("/Downloads/Waifus")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <Download className="h-5 w-5" />
            Download Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-select">API Source</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waifu">Waifu</SelectItem>
                  <SelectItem value="neko">Neko</SelectItem>
                  <SelectItem value="shinobu">Shinobu</SelectItem>
                  <SelectItem value="megumin">Megumin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-select">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sfw">SFW</SelectItem>
                  <SelectItem value="nsfw">NSFW</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count-input">Count</Label>
              <Input
                id="count-input"
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Number of images"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {selectedApi}
            </Badge>
            <Badge variant="outline">{category}</Badge>
            <Badge variant={type === "sfw" ? "default" : "destructive"}>{type.toUpperCase()}</Badge>
            <Badge variant="secondary">{count} images</Badge>
          </div>
        </CardContent>
      </Card>

      <DirectoryBrowser onDirectorySelect={setDownloadPath} selectedDirectory={downloadPath} />

      <Card className="material-card">
        <CardContent className="pt-6">
          <Button onClick={handleDownload} disabled={isDownloading} className="w-full glow" size="lg">
            {isDownloading ? (
              <>
                <Settings className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
