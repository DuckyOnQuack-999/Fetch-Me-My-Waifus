"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Download, Share, Copy, ExternalLink, Calendar, Tag, FileImage, Palette, Info } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useStorage } from "@/context/storageContext"
import type { WaifuImage } from "@/types/waifu"

interface EnhancedImagePreviewProps {
  image: WaifuImage
}

export function EnhancedImagePreview({ image }: EnhancedImagePreviewProps) {
  const { toggleFavorite } = useStorage()
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = image.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.url)
    toast.success("Image URL copied to clipboard!")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.filename,
          url: image.url,
        })
      } catch (error) {
        handleCopyUrl()
      }
    } else {
      handleCopyUrl()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[80vh] overflow-hidden">
      {/* Image Display */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-square overflow-hidden rounded-lg bg-muted"
        >
          <img
            src={image.url || "/placeholder.svg"}
            alt={image.filename}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => toggleFavorite(image.image_id)}
            variant={image.isFavorite ? "default" : "outline"}
            className="flex-1"
          >
            <Heart className={`h-4 w-4 mr-2 ${image.isFavorite ? "fill-current" : ""}`} />
            {image.isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>

          <Button onClick={handleDownload} disabled={isLoading} variant="outline" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? "Downloading..." : "Download"}
          </Button>

          <Button onClick={handleShare} variant="outline" size="sm">
            <Share className="h-4 w-4" />
          </Button>

          <Button onClick={handleCopyUrl} variant="outline" size="sm">
            <Copy className="h-4 w-4" />
          </Button>

          <Button asChild variant="outline" size="sm">
            <a href={image.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Image Details */}
      <div className="space-y-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Image Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{image.filename}</h3>
              <p className="text-sm text-muted-foreground">{image.description || "No description available"}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Format</span>
                </div>
                <p className="text-muted-foreground">{image.filename.split(".").pop()?.toUpperCase() || "Unknown"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Size</span>
                </div>
                <p className="text-muted-foreground">
                  {image.size ? `${(image.size / 1024 / 1024).toFixed(2)} MB` : "Unknown"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Source</span>
                </div>
                <p className="text-muted-foreground">{image.source || "Unknown"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Added</span>
                </div>
                <p className="text-muted-foreground">{new Date(image.timestamp).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {(image.tags || []).length > 0 ? (
                  image.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
              </div>
            </div>

            {/* Additional Metadata */}
            {image.artist && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Artist</h4>
                  <p className="text-sm text-muted-foreground">{image.artist}</p>
                </div>
              </>
            )}

            {image.character && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Character</h4>
                  <p className="text-sm text-muted-foreground">{image.character}</p>
                </div>
              </>
            )}

            {image.series && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Series</h4>
                  <p className="text-sm text-muted-foreground">{image.series}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
