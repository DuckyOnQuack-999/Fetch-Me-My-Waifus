"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Heart, Share2, Copy, ExternalLink, Calendar, Ruler, FileImage, Tag, Palette } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import type { WaifuImage } from "@/types/waifu"

interface EnhancedImagePreviewProps {
  image: WaifuImage
}

export function EnhancedImagePreview({ image }: EnhancedImagePreviewProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString()
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename || `image-${image.image_id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started")
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.url)
    toast.success("Image URL copied to clipboard")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.filename || "Waifu Image",
          url: image.url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyUrl()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
      {/* Image Display */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <motion.img
                src={image.url || "/placeholder.svg?height=500&width=500"}
                alt={image.filename || "Image"}
                className="w-full h-full object-contain"
                onLoad={() => setIsImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleCopyUrl}>
            <Copy className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
          <Button variant="outline" onClick={() => window.open(image.url, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>
      </div>

      {/* Image Details */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Image Details
            </CardTitle>
            <CardDescription>{image.filename || `Image ${image.image_id}`}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Dimensions</div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  <span className="font-mono">
                    {image.width || "?"} × {image.height || "?"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">File Size</div>
                <div className="font-mono">{formatFileSize(image.file_size)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Format</div>
                <div className="font-mono">{image.extension?.toUpperCase() || "Unknown"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Source</div>
                <Badge variant="outline">{image.source || "Unknown"}</Badge>
              </div>
            </div>

            <Separator />

            {/* Metadata */}
            <div className="space-y-3">
              {image.artist && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Artist</div>
                  <div>{image.artist}</div>
                </div>
              )}

              {image.character && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Character</div>
                  <div>{image.character}</div>
                </div>
              )}

              {image.series && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Series</div>
                  <div>{image.series}</div>
                </div>
              )}

              {image.rating && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <Badge
                    variant={
                      image.rating === "safe"
                        ? "default"
                        : image.rating === "questionable"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {image.rating.toUpperCase()}
                  </Badge>
                </div>
              )}

              {image.dominant_color && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Dominant Color</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: image.dominant_color }} />
                    <span className="font-mono">{image.dominant_color}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(image.created_at)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            {image.tags && image.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-1">
                  {image.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {typeof tag === "string" ? tag : tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            {image.favorites !== undefined && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Favorites</div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{image.favorites}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Tag className="h-4 w-4 mr-2" />
              Add to Collection
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Palette className="h-4 w-4 mr-2" />
              AI Upscale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
