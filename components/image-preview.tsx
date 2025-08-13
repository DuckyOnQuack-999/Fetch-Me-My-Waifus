"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Download, Share, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ImagePreviewProps {
  images: Array<{
    id: string
    url: string
    title?: string
    tags?: string[]
    isFavorite?: boolean
  }>
}

export function ImagePreview({ images }: ImagePreviewProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  if (images.length === 0) {
    return (
      <Card className="material-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Eye className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No images to preview</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="masonry-grid">
      {images.map((image) => (
        <Card key={image.id} className="material-card mb-4 break-inside-avoid">
          <CardContent className="p-0">
            <div className="relative group">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.title || "Preview"}
                className="w-full h-auto rounded-t-lg object-cover"
                loading="lazy"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="relative">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title || "Full size"}
                        className="w-full h-auto max-h-[80vh] object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="secondary" onClick={() => toggleFavorite(image.id)}>
                  <Heart className={`h-4 w-4 ${favorites.has(image.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="secondary">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image info */}
            <div className="p-4 space-y-2">
              {image.title && <h3 className="font-medium truncate">{image.title}</h3>}

              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {image.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{image.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
