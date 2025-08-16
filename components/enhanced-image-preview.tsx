"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Download, Share2, Info, Tag, Calendar, FileImage, Palette, Wand2 } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { AIUpscaler } from "./ai-upscaler"
import { toast } from "sonner"

interface EnhancedImagePreviewProps {
  image: any
}

export function EnhancedImagePreview({ image }: EnhancedImagePreviewProps) {
  const { toggleFavorite, isFavorite } = useStorage()
  const [showUpscaler, setShowUpscaler] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename || `image-${image.image_id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${image.filename}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.filename || "Shared Image",
          text: `Check out this image: ${image.filename}`,
          url: image.url,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(image.url)
        toast.success("Image URL copied to clipboard")
      }
    } else {
      navigator.clipboard.writeText(image.url)
      toast.success("Image URL copied to clipboard")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Image Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-video rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={image.url || "/placeholder.svg?height=600&width=800"}
                    alt={image.filename || "Image"}
                    className="w-full h-full object-contain"
                    onLoad={() => setImageLoaded(true)}
                  />
                </motion.div>

                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Action Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleFavorite(image.image_id.toString())}>
                    <Heart
                      className={`h-4 w-4 ${isFavorite(image.image_id.toString()) ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowUpscaler(true)}>
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Image Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Filename</div>
                  <div className="font-mono text-sm break-all">{image.filename || `image-${image.image_id}`}</div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Dimensions</div>
                    <div className="font-mono text-sm">
                      {image.width || "Unknown"} × {image.height || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">File Size</div>
                    <div className="font-mono text-sm">{formatFileSize(image.file_size || 0)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Format</div>
                    <div className="font-mono text-sm">{image.file_format || image.extension || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Source</div>
                    <Badge variant="outline">{image.source || "Unknown"}</Badge>
                  </div>
                </div>

                {image.timestamp && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Added
                      </div>
                      <div className="text-sm">{formatDate(image.timestamp)}</div>
                    </div>
                  </>
                )}

                {image.dominant_color && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Palette className="h-3 w-3" />
                        Dominant Color
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: image.dominant_color }} />
                        <span className="font-mono text-sm">{image.dominant_color}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {(image.artist || image.character || image.series) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {image.artist && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Artist</div>
                    <div className="text-sm">{image.artist}</div>
                  </div>
                )}
                {image.character && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Character</div>
                    <div className="text-sm">{image.character}</div>
                  </div>
                )}
                {image.series && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Series</div>
                    <div className="text-sm">{image.series}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => toggleFavorite(image.image_id.toString())}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isFavorite(image.image_id.toString()) ? "fill-red-500 text-red-500" : ""}`}
                />
                {isFavorite(image.image_id.toString()) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => setShowUpscaler(true)}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Upscale
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Image
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Upscaler Dialog */}
      <Dialog open={showUpscaler} onOpenChange={setShowUpscaler}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>AI Image Upscaler</DialogTitle>
          </DialogHeader>
          <AIUpscaler image={image} onClose={() => setShowUpscaler(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
