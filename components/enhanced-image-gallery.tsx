"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Download, Eye, Share2, MoreHorizontal, Calendar, ImageIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SumptuousHeart } from "@/components/sumptuous-heart"
import { cn, formatBytes, formatTimeAgo } from "@/lib/utils"
import type { WaifuImage, ViewMode } from "@/types/waifu"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedImageGalleryProps {
  images: WaifuImage[]
  viewMode?: ViewMode
  selectedImages?: string[]
  onImageClick?: (image: WaifuImage) => void
  onImageSelect?: (imageId: string) => void
  onToggleFavorite?: (imageId: string) => void
  onDownloadImage?: (image: WaifuImage) => void
  onShareImage?: (image: WaifuImage) => void
  onDeleteImage?: (imageId: string) => void
  isFavorite?: (imageId: string) => boolean
  isSelectable?: boolean
  showMetadata?: boolean
  className?: string
}

export function EnhancedImageGallery({
  images,
  viewMode = "grid",
  selectedImages = [],
  onImageClick,
  onImageSelect,
  onToggleFavorite,
  onDownloadImage,
  onShareImage,
  onDeleteImage,
  isFavorite = () => false,
  isSelectable = false,
  showMetadata = true,
  className,
}: EnhancedImageGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId))
  }, [])

  const handleImageError = useCallback((imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId))
  }, [])

  const handleImageClick = useCallback(
    (image: WaifuImage, event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (isSelectable && event.ctrlKey) {
        onImageSelect?.(image.id)
      } else {
        onImageClick?.(image)
      }
    },
    [isSelectable, onImageClick, onImageSelect],
  )

  const gridClasses = useMemo(() => {
    switch (viewMode) {
      case "masonry":
        return "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
      case "list":
        return "space-y-4"
      default:
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    }
  }, [viewMode])

  const renderGridImage = (image: WaifuImage, index: number) => (
    <motion.div
      key={image.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={cn("group relative cursor-pointer", viewMode === "masonry" && "break-inside-avoid mb-4")}
      onClick={(e) => handleImageClick(image, e)}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20",
          selectedImages.includes(image.id) && "ring-2 ring-primary ring-offset-2",
        )}
      >
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            {/* Image */}
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.title || "Gallery image"}
              className={cn(
                "w-full h-full object-cover transition-all duration-300",
                "group-hover:scale-105",
                !loadedImages.has(image.id) && "bg-muted animate-pulse",
                failedImages.has(image.id) && "bg-muted",
              )}
              loading="lazy"
              onLoad={() => handleImageLoad(image.id)}
              onError={() => handleImageError(image.id)}
            />

            {/* Loading overlay */}
            {!loadedImages.has(image.id) && !failedImages.has(image.id) && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            {/* Error overlay */}
            {failedImages.has(image.id) && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Failed to load</p>
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top controls */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isSelectable && (
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onCheckedChange={() => onImageSelect?.(image.id)}
                  className="bg-white/90 border-white/90"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <div className="flex gap-1 ml-auto">
                {isFavorite(image.id) && <SumptuousHeart size="sm" filled color="red" />}
                {image.is_nsfw && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    NSFW
                  </Badge>
                )}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite?.(image.id)
                    }}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite(image.id) && "fill-red-500 text-red-500")} />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onImageClick?.(image)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownloadImage?.(image)
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onShareImage?.(image)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownloadImage?.(image)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDeleteImage?.(image.id)} className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {showMetadata && (
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm truncate">{image.title || `Image ${image.id.slice(-6)}`}</h4>
                <Badge variant="outline" className="text-xs">
                  {image.source}
                </Badge>
              </div>

              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
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

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatTimeAgo(image.created_at)}
                </div>
                {image.width && image.height && (
                  <span>
                    {image.width}×{image.height}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderListImage = (image: WaifuImage, index: number) => (
    <motion.div
      key={image.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="group cursor-pointer"
      onClick={(e) => handleImageClick(image, e)}
    >
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          selectedImages.includes(image.id) && "ring-2 ring-primary ring-offset-2",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {isSelectable && (
              <Checkbox
                checked={selectedImages.includes(image.id)}
                onCheckedChange={() => onImageSelect?.(image.id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img
                src={image.thumbnail_url || image.url}
                alt={image.title || "Gallery image"}
                className="w-full h-full object-cover"
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageError(image.id)}
              />
              {failedImages.has(image.id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium truncate">{image.title || `Image ${image.id.slice(-6)}`}</h4>
                <div className="flex items-center gap-2">
                  {isFavorite(image.id) && <SumptuousHeart size="sm" filled color="red" />}
                  <Badge variant="outline" className="text-xs">
                    {image.source}
                  </Badge>
                </div>
              </div>

              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {image.tags.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{image.tags.length - 5}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(image.created_at)}
                  </div>
                  {image.width && image.height && (
                    <span>
                      {image.width}×{image.height}
                    </span>
                  )}
                  {image.file_size && <span>{formatBytes(image.file_size)}</span>}
                </div>
                {image.metadata?.quality && (
                  <Badge variant="outline" className="text-xs">
                    {image.metadata.quality}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite?.(image.id)
                }}
              >
                <Heart className={cn("h-4 w-4", isFavorite(image.id) && "fill-red-500 text-red-500")} />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onImageClick?.(image)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownloadImage?.(image)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onShareImage?.(image)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadImage?.(image)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDeleteImage?.(image.id)} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No images found</h3>
        <p className="text-muted-foreground">Your gallery is empty. Start downloading some images to see them here.</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="popLayout">
        <div className={gridClasses}>
          {images.map((image, index) =>
            viewMode === "list" ? renderListImage(image, index) : renderGridImage(image, index),
          )}
        </div>
      </AnimatePresence>
    </div>
  )
}
