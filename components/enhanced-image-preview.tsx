"use client"

import { useState, useEffect, useRef } from "react"
import { X, Download, Heart, Share2, RotateCw, ZoomIn, ZoomOut, Info, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageMetadata {
  url: string
  filename?: string
  size?: string
  dimensions?: string
  format?: string
  source?: string
  tags?: string[]
  artist?: string
  uploadDate?: string
}

interface EnhancedImagePreviewProps {
  image: ImageMetadata
  isOpen: boolean
  onClose: () => void
  onDownload?: (url: string, filename?: string) => void
  onFavorite?: (image: ImageMetadata) => void
  isFavorited?: boolean
}

export function EnhancedImagePreview({
  image,
  isOpen,
  onClose,
  onDownload,
  onFavorite,
  isFavorited = false,
}: EnhancedImagePreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showMetadata, setShowMetadata] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
      setIsLoading(true)
      setImageError(false)
    }
  }, [isOpen, image.url])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setImageError(true)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.1))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload(image.url, image.filename)
      toast.success("Download started")
    }
  }

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(image)
      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites")
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.filename || "Waifu Image",
          url: image.url,
        })
      } else {
        await navigator.clipboard.writeText(image.url)
        toast.success("Image URL copied to clipboard")
      }
    } catch (error) {
      toast.error("Failed to share image")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return "Unknown"
    const size = Number.parseInt(bytes)
    if (isNaN(size)) return bytes

    const units = ["B", "KB", "MB", "GB"]
    let unitIndex = 0
    let fileSize = size

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024
      unitIndex++
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold truncate">{image.filename || "Image Preview"}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowMetadata(!showMetadata)}>
                  <Info className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant={isFavorited ? "default" : "outline"} size="sm" onClick={handleFavorite}>
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center bg-black/5 overflow-auto">
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                {imageError ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <div className="text-center">
                      <X className="w-12 h-12 mx-auto mb-2" />
                      <p>Failed to load image</p>
                    </div>
                  </div>
                ) : (
                  <img
                    ref={imageRef}
                    src={image.url || "/placeholder.svg"}
                    alt={image.filename || "Preview"}
                    className="max-w-none transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      maxHeight: showMetadata ? "60vh" : "80vh",
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>

            {/* Metadata Sidebar */}
            {showMetadata && (
              <div className="w-80 border-l bg-background overflow-auto">
                <Card className="h-full rounded-none border-0">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Image Details</h3>
                      <div className="space-y-2 text-sm">
                        {image.filename && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Filename:</span>
                            <span className="font-mono text-xs truncate ml-2" title={image.filename}>
                              {image.filename}
                            </span>
                          </div>
                        )}
                        {image.dimensions && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dimensions:</span>
                            <span>{image.dimensions}</span>
                          </div>
                        )}
                        {image.size && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{formatFileSize(image.size)}</span>
                          </div>
                        )}
                        {image.format && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Format:</span>
                            <span className="uppercase">{image.format}</span>
                          </div>
                        )}
                        {image.source && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Source:</span>
                            <span>{image.source}</span>
                          </div>
                        )}
                        {image.artist && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Artist:</span>
                            <span>{image.artist}</span>
                          </div>
                        )}
                        {image.uploadDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Upload Date:</span>
                            <span>{new Date(image.uploadDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {image.tags && image.tags.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-1">
                            {image.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs cursor-pointer"
                                onClick={() => copyToClipboard(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Actions</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start bg-transparent"
                          onClick={() => copyToClipboard(image.url)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start bg-transparent"
                          onClick={() => window.open(image.url, "_blank")}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Zoom: {Math.round(zoom * 100)}% | Rotation: {rotation}°
              </div>
              <div className="flex items-center gap-4">
                <span>Use mouse wheel to zoom</span>
                <span>•</span>
                <span>Click and drag to pan</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
