"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Grid3X3, List, Heart, Calendar, ImageIcon, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { EnhancedImagePreview } from "@/components/enhanced-image-preview"
import type { WaifuImage } from "@/types/waifu"

interface GalleryFilters {
  search: string
  category: string
  tags: string[]
  dateRange: string
  sortBy: string
  sortOrder: "asc" | "desc"
  viewMode: "grid" | "list"
}

export function GalleryTab() {
  const { images, favorites, isFavorite, toggleFavorite } = useStorage()
  const [filters, setFilters] = useState<GalleryFilters>({
    search: "",
    category: "all",
    tags: [],
    dateRange: "all",
    sortBy: "date",
    sortOrder: "desc",
    viewMode: "grid",
  })
  const [selectedImage, setSelectedImage] = useState<WaifuImage | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Ensure all images have valid IDs
  const safeImages = useMemo(() => {
    return (images || []).map((image, index) => ({
      ...image,
      id: image.id || image.image_id || `image-${Date.now()}-${index}`,
      image_id: image.image_id || image.id || `image-${Date.now()}-${index}`,
      tags: Array.isArray(image.tags) ? image.tags : [],
      created_at: image.created_at || new Date().toISOString(),
    }))
  }, [images])

  // Safe favorite checking function
  const isImageFavorite = (image: WaifuImage): boolean => {
    if (!image) return false

    try {
      const imageId = image.id || image.image_id
      if (!imageId) return false

      return isFavorite(imageId)
    } catch (error) {
      console.error("Error checking favorite status:", error)
      return false
    }
  }

  // Safe favorite toggle function
  const handleToggleFavorite = (image: WaifuImage) => {
    if (!image) return

    try {
      const imageId = image.id || image.image_id
      if (!imageId) {
        console.warn("Cannot toggle favorite: image has no valid ID")
        return
      }

      toggleFavorite(imageId)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let filtered = [...safeImages]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (image) =>
          (image.tags && image.tags.some((tag) => tag.toLowerCase().includes(searchLower))) ||
          (image.source && image.source.toLowerCase().includes(searchLower)) ||
          (image.url && image.url.toLowerCase().includes(searchLower)),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      if (filters.category === "favorites") {
        filtered = filtered.filter((image) => isImageFavorite(image))
      } else if (filters.category === "recent") {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter((image) => image.created_at && new Date(image.created_at) > oneWeekAgo)
      }
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date()
      let cutoffDate: Date

      switch (filters.dateRange) {
        case "today":
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          cutoffDate = new Date(0)
      }

      filtered = filtered.filter((image) => image.created_at && new Date(image.created_at) >= cutoffDate)
    }

    // Sort images
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "date":
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          break
        case "name":
          comparison = (a.url || "").localeCompare(b.url || "")
          break
        case "size":
          comparison = a.width * a.height - b.width * b.height
          break
        case "favorite":
          comparison =
            (favorites.includes(b.id || b.image_id || "") ? 1 : 0) -
            (favorites.includes(a.id || a.image_id || "") ? 1 : 0)
          break
        default:
          comparison = 0
      }

      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    return filtered
  }, [safeImages, filters, favorites])

  // Get unique tags from all images
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    safeImages.forEach((image) => {
      if (image.tags) {
        image.tags.forEach((tag) => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [safeImages])

  const handleImageClick = (image: WaifuImage) => {
    setSelectedImage(image)
    setIsPreviewOpen(true)
  }

  const handleFilterChange = (key: keyof GalleryFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      tags: [],
      dateRange: "all",
      sortBy: "date",
      sortOrder: "desc",
      viewMode: "grid",
    })
  }

  const stats = {
    total: safeImages.length,
    filtered: filteredImages.length,
    favorites: safeImages.filter((image) => isImageFavorite(image)).length,
    recent: safeImages.filter((image) => {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return image.created_at && new Date(image.created_at) > oneWeekAgo
    }).length,
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Image Gallery</h2>
          <p className="text-muted-foreground">
            Showing {filteredImages.length} of {safeImages.length} images
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {stats.total} Total
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {stats.favorites} Favorites
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {stats.recent} Recent
          </Badge>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search and View Mode */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tags, source, or URL..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filters.viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={filters.viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Image Size</SelectItem>
                  <SelectItem value="favorite">Favorites First</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={filters.sortOrder === "desc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("sortOrder", filters.sortOrder === "desc" ? "asc" : "desc")}
                  className="flex-1"
                >
                  {filters.sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Content */}
      <AnimatePresence mode="wait">
        {filteredImages.length > 0 ? (
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EnhancedImageGallery
              images={filteredImages}
              viewMode={filters.viewMode}
              onImageClick={handleImageClick}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isImageFavorite}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.category !== "all" || filters.dateRange !== "all"
                ? "Try adjusting your filters or search terms"
                : "Start by downloading some images to build your collection"}
            </p>
            {(filters.search || filters.category !== "all" || filters.dateRange !== "all") && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <EnhancedImagePreview
              image={selectedImage}
              onClose={() => setIsPreviewOpen(false)}
              onToggleFavorite={() => handleToggleFavorite(selectedImage)}
              isFavorite={isImageFavorite(selectedImage)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
