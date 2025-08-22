"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List, Heart, Eye, Tag } from "lucide-react"
import { getImages, getFavorites, toggleFavorite, isFavorite as isImageFavorite } from "@/utils/localStorage"
import { EnhancedImagePreview } from "@/components/enhanced-image-preview"
import { BatchOperationsPanel } from "@/components/batch-operations-panel"

interface GalleryImage {
  id: string
  url: string
  tags: string[]
  source: string
  downloadedAt: string
  title?: string
  width?: number
  height?: number
}

export function GalleryTab() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load images and favorites
  const loadGalleryData = useCallback(async () => {
    try {
      setIsLoading(true)
      const loadedImages = getImages()
      const loadedFavorites = getFavorites()

      // Ensure all images have valid IDs
      const validatedImages = loadedImages.map((image, index) => ({
        ...image,
        id: image.id || `image_${index}_${Date.now()}`,
        url: image.url || "",
        tags: Array.isArray(image.tags) ? image.tags : [],
        source: image.source || "unknown",
        downloadedAt: image.downloadedAt || new Date().toISOString(),
      }))

      setImages(validatedImages)
      setFavorites(Array.isArray(loadedFavorites) ? loadedFavorites : [])
    } catch (error) {
      console.error("Error loading gallery data:", error)
      setImages([])
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGalleryData()
  }, [loadGalleryData])

  // Filter and sort images
  const processedImages = useMemo(() => {
    try {
      let filtered = [...images]

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (image) =>
            image.title?.toLowerCase().includes(query) ||
            image.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
            image.source?.toLowerCase().includes(query),
        )
      }

      // Source filter
      if (selectedSource !== "all") {
        filtered = filtered.filter((image) => image.source === selectedSource)
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
          case "oldest":
            return new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime()
          case "name":
            return (a.title || "").localeCompare(b.title || "")
          case "source":
            return a.source.localeCompare(b.source)
          default:
            return 0
        }
      })

      return filtered
    } catch (error) {
      console.error("Error processing images:", error)
      return []
    }
  }, [images, searchQuery, selectedSource, sortBy])

  useEffect(() => {
    setFilteredImages(processedImages)
  }, [processedImages])

  // Get unique sources
  const availableSources = useMemo(() => {
    try {
      const sources = [...new Set(images.map((img) => img.source).filter(Boolean))]
      return sources.sort()
    } catch (error) {
      console.error("Error getting sources:", error)
      return []
    }
  }, [images])

  // Handle favorite toggle
  const handleToggleFavorite = useCallback(async (imageId: string) => {
    if (!imageId) return

    try {
      const success = toggleFavorite(imageId)
      if (success) {
        setFavorites(getFavorites())
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }, [])

  // Handle image selection
  const handleImageSelect = useCallback((imageId: string) => {
    if (!imageId) return

    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }, [])

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([])
    } else {
      setSelectedImages(filteredImages.map((img) => img.id).filter(Boolean))
    }
  }, [selectedImages.length, filteredImages])

  // Check if image is favorite with error handling
  const isFavorite = useCallback((imageId: string): boolean => {
    if (!imageId) return false

    try {
      return isImageFavorite(imageId)
    } catch (error) {
      console.error("Error checking favorite status:", error)
      return false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gallery</h2>
          <p className="text-muted-foreground">
            {filteredImages.length} of {images.length} images
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          {selectedImages.length > 0 && (
            <BatchOperationsPanel
              selectedImages={selectedImages}
              onClearSelection={() => setSelectedImages([])}
              onRefresh={loadGalleryData}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="material-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images by title, tags, or source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {availableSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedImages.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedImages.length === filteredImages.length ? "Deselect All" : "Select All"}
              </Button>
              <Badge variant="secondary">{selectedImages.length} selected</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {filteredImages.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }
        >
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className={`material-card cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedImages.includes(image.id) ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleImageSelect(image.id)}
            >
              <CardContent className="p-0">
                {viewMode === "grid" ? (
                  <div className="relative aspect-square">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title || "Gallery image"}
                      className="w-full h-full object-cover rounded-t-lg"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 rounded-t-lg" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage(image)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`h-8 w-8 p-0 ${
                          isFavorite(image.id) ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white/90 hover:bg-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(image.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(image.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg">
                      <div className="text-white text-sm font-medium truncate">{image.title || "Untitled"}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {image.source}
                        </Badge>
                        {image.tags && image.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-white/70" />
                            <span className="text-xs text-white/70">{image.tags.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title || "Gallery image"}
                      className="w-16 h-16 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=64&width=64"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{image.title || "Untitled"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {image.source} • {new Date(image.downloadedAt).toLocaleDateString()}
                      </p>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedImage(image)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={isFavorite(image.id) ? "text-red-500" : ""}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(image.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite(image.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="material-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No images found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedSource !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start downloading images to build your gallery"}
                </p>
              </div>
              {(searchQuery || selectedSource !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedSource("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <EnhancedImagePreview
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onToggleFavorite={() => handleToggleFavorite(selectedImage.id)}
          isFavorite={isFavorite(selectedImage.id)}
        />
      )}
    </div>
  )
}
