"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { Heart, Download, Search, Filter, Grid, List, SortAsc, SortDesc, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface GalleryTabProps {
  images?: any[]
  showFavoritesOnly?: boolean
  onImageSelect?: (image: any) => void
  onImageDownload?: (image: any) => void
}

export function GalleryTab({
  images: propImages,
  showFavoritesOnly = false,
  onImageSelect,
  onImageDownload,
}: GalleryTabProps) {
  const { images: storageImages, favorites, isFavorite, toggleFavorite, removeImage } = useStorage()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Use prop images or storage images, with safe fallback and ensure all images have IDs
  const allImages = useMemo(() => {
    const rawImages = propImages || storageImages || []
    return rawImages.map((image, index) => ({
      ...image,
      id: image.id || `image-${index}-${Date.now()}`, // Ensure every image has an ID
      filename: image.filename || `image-${index + 1}`,
      createdAt: image.createdAt || new Date().toISOString(),
      tags: Array.isArray(image.tags) ? image.tags : [],
      source: image.source || "unknown",
    }))
  }, [propImages, storageImages])

  // Filter images based on showFavoritesOnly
  const baseImages = useMemo(() => {
    if (showFavoritesOnly) {
      return allImages.filter((image) => {
        // Safe check for image ID before calling isFavorite
        return image.id && isFavorite(image.id)
      })
    }
    return allImages
  }, [allImages, showFavoritesOnly, favorites, isFavorite])

  // Apply search and sort filters
  const filteredImages = useMemo(() => {
    let filtered = [...baseImages]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (image) =>
          image.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          image.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.filename?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "newest":
          comparison = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          break
        case "oldest":
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          break
        case "size":
          comparison = (b.fileSize || 0) - (a.fileSize || 0)
          break
        case "resolution":
          comparison = (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0)
          break
        case "source":
          comparison = (a.source || "").localeCompare(b.source || "")
          break
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "")
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [baseImages, searchTerm, sortBy, sortOrder])

  const handleImageClick = (image: any) => {
    if (onImageSelect && image) {
      onImageSelect(image)
    }
  }

  const handleDownload = (image: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onImageDownload && image) {
      onImageDownload(image)
    }
    toast.success(`Downloading ${image.filename || "image"}...`)
  }

  const handleFavoriteToggle = (image: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!image?.id) {
      toast.error("Cannot favorite image: Invalid image ID")
      return
    }

    const wasAlreadyFavorite = isFavorite(image.id)
    toggleFavorite(image.id)
    toast.success(wasAlreadyFavorite ? "Removed from favorites" : "Added to favorites")
  }

  const handleDelete = (image: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!image?.id) {
      toast.error("Cannot delete image: Invalid image ID")
      return
    }

    removeImage(image.id)
    toast.success("Image removed from gallery")
  }

  const handleBulkAction = (action: string) => {
    if (selectedImages.length === 0) {
      toast.error("No images selected")
      return
    }

    const validImageIds = selectedImages.filter((id) => id && id.trim() !== "")
    if (validImageIds.length === 0) {
      toast.error("No valid images selected")
      return
    }

    switch (action) {
      case "favorite":
        validImageIds.forEach((id) => {
          if (!isFavorite(id)) toggleFavorite(id)
        })
        toast.success(`Added ${validImageIds.length} images to favorites`)
        break
      case "unfavorite":
        validImageIds.forEach((id) => {
          if (isFavorite(id)) toggleFavorite(id)
        })
        toast.success(`Removed ${validImageIds.length} images from favorites`)
        break
      case "download":
        validImageIds.forEach((id) => {
          const image = allImages.find((img) => img.id === id)
          if (image && onImageDownload) onImageDownload(image)
        })
        toast.success(`Downloading ${validImageIds.length} images...`)
        break
      case "delete":
        validImageIds.forEach((id) => removeImage(id))
        toast.success(`Deleted ${validImageIds.length} images`)
        break
    }
    setSelectedImages([])
  }

  const toggleImageSelection = (imageId: string) => {
    if (!imageId) return

    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const selectAllImages = () => {
    const validImageIds = filteredImages.map((img) => img.id).filter((id) => id && id.trim() !== "")

    if (selectedImages.length === validImageIds.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(validImageIds)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatResolution = (width: number, height: number) => {
    if (!width || !height) return "Unknown"
    return `${width} × ${height}`
  }

  // Safe check for favorites
  const isImageFavorite = (imageId: string | undefined) => {
    if (!imageId) return false
    try {
      return isFavorite(imageId)
    } catch (error) {
      console.warn("Error checking favorite status:", error)
      return false
    }
  }

  if (!allImages || allImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-6xl mb-4 opacity-50">🖼️</div>
        <h3 className="text-lg font-semibold mb-2">No Images Found</h3>
        <p className="text-muted-foreground">
          {showFavoritesOnly
            ? "You haven't favorited any images yet."
            : "Start by downloading some images to see them here."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by tags, source, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
              <SelectItem value="resolution">Resolution</SelectItem>
              <SelectItem value="source">Source</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedImages.length} selected</span>
          <div className="flex gap-1 ml-auto">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("favorite")}>
              <Heart className="w-3 h-3 mr-1" />
              Favorite
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("download")}>
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedImages([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Showing {filteredImages.length} of {allImages.length} images
          </span>
          {showFavoritesOnly && <Badge variant="secondary">Favorites Only</Badge>}
        </div>

        <Button variant="outline" size="sm" onClick={selectAllImages}>
          {selectedImages.length === filteredImages.length ? "Deselect All" : "Select All"}
        </Button>
      </div>

      {/* Image Grid/List */}
      {viewMode === "grid" ? (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${settings?.gridColumns || 4}, minmax(0, 1fr))`,
          }}
        >
          {filteredImages.map((image) => {
            const imageId = image.id || `fallback-${Math.random()}`
            const isSelected = selectedImages.includes(imageId)
            const isFav = isImageFavorite(imageId)

            return (
              <Card
                key={imageId}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleImageClick(image)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={image.preview || image.url || `/placeholder.svg?height=200&width=300`}
                      alt={image.filename || "Image"}
                      className="w-full h-48 object-cover rounded-t-lg"
                      loading="lazy"
                    />

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8"
                          onClick={(e) => handleFavoriteToggle(image, e)}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8"
                          onClick={(e) => handleDownload(image, e)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="w-8 h-8"
                          onClick={(e) => handleDelete(image, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="absolute bottom-2 left-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleImageSelection(imageId)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Info */}
                  {settings?.showImageDetails && (
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium truncate">{image.filename}</span>
                        <Badge variant="outline" className="text-xs">
                          {image.source}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatResolution(image.width, image.height)}</span>
                        <span>{formatFileSize(image.fileSize)}</span>
                      </div>

                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{image.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((image) => {
            const imageId = image.id || `fallback-${Math.random()}`
            const isSelected = selectedImages.includes(imageId)
            const isFav = isImageFavorite(imageId)

            return (
              <Card
                key={imageId}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleImageClick(image)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleImageSelection(imageId)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4"
                    />

                    <img
                      src={image.preview || image.url || `/placeholder.svg?height=60&width=80`}
                      alt={image.filename || "Image"}
                      className="w-16 h-12 object-cover rounded"
                      loading="lazy"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{image.filename}</span>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            {image.source}
                          </Badge>
                          {image.category && (
                            <Badge variant="secondary" className="text-xs">
                              {image.category}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatResolution(image.width, image.height)}</span>
                        <span>{formatFileSize(image.fileSize)}</span>
                        <span>{new Date(image.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>

                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.slice(0, 5).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{image.tags.length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8"
                        onClick={(e) => handleFavoriteToggle(image, e)}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={(e) => handleDownload(image, e)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={(e) => handleDelete(image, e)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredImages.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="text-4xl mb-2 opacity-50">🔍</div>
          <h3 className="text-lg font-semibold mb-1">No Results Found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  )
}
