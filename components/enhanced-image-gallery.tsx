"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Download, Heart, Share, Eye, Grid3X3, List, ImageIcon, Star, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { WaifuImage } from "@/types/waifu"

interface EnhancedImageGalleryProps {
  images: WaifuImage[]
  onDownload: (image: WaifuImage) => void
  onFavorite: (image: WaifuImage) => void
  isLoading?: boolean
}

type ViewMode = "grid" | "list"
type SortBy = "date" | "name" | "size" | "rating"
type SortOrder = "asc" | "desc"

export function EnhancedImageGallery({
  images = [],
  onDownload,
  onFavorite,
  isLoading = false,
}: EnhancedImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortBy>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [selectedImage, setSelectedImage] = useState<WaifuImage | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Extract unique tags from all images
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    images.forEach((image) => {
      image.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [images])

  // Filter and sort images
  const filteredImages = useMemo(() => {
    const filtered = images.filter((image) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        image.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        image.image_id?.toString().includes(searchQuery)

      // Tag filter
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => image.tags?.includes(tag))

      // Category filter
      const matchesCategory = filterCategory === "all" || image.category === filterCategory

      return matchesSearch && matchesTags && matchesCategory
    })

    // Sort images
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          break
        case "name":
          comparison = (a.tags?.[0] || "").localeCompare(b.tags?.[0] || "")
          break
        case "size":
          comparison = (a.width || 0) * (a.height || 0) - (b.width || 0) * (b.height || 0)
          break
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [images, searchQuery, selectedTags, filterCategory, sortBy, sortOrder])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setFilterCategory("all")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card className="material-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tags or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="waifu">Waifu</SelectItem>
                <SelectItem value="neko">Neko</SelectItem>
                <SelectItem value="shinobu">Shinobu</SelectItem>
                <SelectItem value="megumin">Megumin</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split("-") as [SortBy, SortOrder]
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="size-desc">Largest First</SelectItem>
                <SelectItem value="size-asc">Smallest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Filter by tags:</p>
                {(selectedTags.length > 0 || searchQuery || filterCategory !== "all") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {allTags.slice(0, 20).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allTags.length > 20 && (
                  <Badge variant="outline" className="opacity-50">
                    +{allTags.length - 20} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredImages.length} of {images.length} images
        </p>
        <div className="flex items-center gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <button onClick={() => toggleTag(tag)} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Image Grid/List */}
      <AnimatePresence mode="wait">
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or clear the filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <Card className="material-card hover-lift overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={image.url || `/placeholder.svg?height=300&width=300`}
                      alt={image.tags?.[0] || "Anime image"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedImage(image)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={() => onFavorite(image)}>
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {image.rating && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {image.rating}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {image.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(image.tags?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs opacity-50">
                            +{(image.tags?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {image.width}×{image.height}
                        </span>
                        <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => onDownload(image)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Card className="material-card hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={image.url || `/placeholder.svg?height=64&width=64`}
                          alt={image.tags?.[0] || "Anime image"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{image.tags?.[0] || `Image ${image.image_id}`}</span>
                          {image.rating && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {image.rating}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {image.tags?.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {image.width}×{image.height} • {image.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedImage(image)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onFavorite(image)}>
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="default" onClick={() => onDownload(image)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Details
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={selectedImage.url || `/placeholder.svg?height=400&width=400`}
                      alt={selectedImage.tags?.[0] || "Anime image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onDownload(selectedImage)} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => onFavorite(selectedImage)}>
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ID:</span>
                          <span>{selectedImage.image_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span>
                            {selectedImage.width}×{selectedImage.height}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="capitalize">{selectedImage.category}</span>
                        </div>
                        {selectedImage.rating && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rating:</span>
                            <span>{selectedImage.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedImage.tags && selectedImage.tags.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
