"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  Download,
  Heart,
  Star,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Eye,
  Share2,
  Bookmark,
  Tag,
  ImageIcon,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageData {
  id: string
  url: string
  thumbnail?: string
  title?: string
  tags?: string[]
  source?: string
  width?: number
  height?: number
  fileSize?: number
  uploadDate?: string
  rating?: number
  isFavorite?: boolean
}

interface EnhancedImageGalleryProps {
  images: ImageData[]
  onDownload?: (image: ImageData) => void
  onFavorite?: (image: ImageData) => void
  onShare?: (image: ImageData) => void
  isLoading?: boolean
}

export function EnhancedImageGallery({
  images = [],
  onDownload,
  onFavorite,
  onShare,
  isLoading = false,
}: EnhancedImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"date" | "rating" | "size" | "name">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)
  const [filterSource, setFilterSource] = useState<string>("all")

  // Sample data for demonstration
  const sampleImages: ImageData[] = useMemo(
    () => [
      {
        id: "1",
        url: "/placeholder.svg?height=400&width=300&text=Anime+Girl+1",
        thumbnail: "/placeholder.svg?height=200&width=150&text=Anime+Girl+1",
        title: "Cute Anime Girl",
        tags: ["anime", "cute", "girl", "kawaii"],
        source: "waifu.im",
        width: 1920,
        height: 1080,
        fileSize: 245000,
        uploadDate: "2024-01-15",
        rating: 4.8,
        isFavorite: true,
      },
      {
        id: "2",
        url: "/placeholder.svg?height=400&width=300&text=Anime+Girl+2",
        thumbnail: "/placeholder.svg?height=200&width=150&text=Anime+Girl+2",
        title: "Magical Girl",
        tags: ["anime", "magic", "girl", "fantasy"],
        source: "waifu.pics",
        width: 1600,
        height: 900,
        fileSize: 189000,
        uploadDate: "2024-01-14",
        rating: 4.6,
        isFavorite: false,
      },
      {
        id: "3",
        url: "/placeholder.svg?height=400&width=300&text=Anime+Girl+3",
        thumbnail: "/placeholder.svg?height=200&width=150&text=Anime+Girl+3",
        title: "School Girl",
        tags: ["anime", "school", "uniform", "student"],
        source: "nekos.best",
        width: 1920,
        height: 1080,
        fileSize: 312000,
        uploadDate: "2024-01-13",
        rating: 4.9,
        isFavorite: true,
      },
    ],
    [],
  )

  const displayImages = images.length > 0 ? images : sampleImages

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    displayImages.forEach((image) => {
      image.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [displayImages])

  // Get all unique sources
  const allSources = useMemo(() => {
    const sources = new Set<string>()
    displayImages.forEach((image) => {
      if (image.source) sources.add(image.source)
    })
    return Array.from(sources).sort()
  }, [displayImages])

  // Filter and sort images
  const filteredImages = useMemo(() => {
    const filtered = displayImages.filter((image) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = image.title?.toLowerCase().includes(query)
        const matchesTags = image.tags?.some((tag) => tag.toLowerCase().includes(query))
        if (!matchesTitle && !matchesTags) return false
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasSelectedTags = selectedTags.every((tag) => image.tags?.includes(tag))
        if (!hasSelectedTags) return false
      }

      // Source filter
      if (filterSource !== "all" && image.source !== filterSource) {
        return false
      }

      return true
    })

    // Sort images
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.uploadDate || "").getTime() - new Date(b.uploadDate || "").getTime()
          break
        case "rating":
          comparison = (a.rating || 0) - (b.rating || 0)
          break
        case "size":
          comparison = (a.fileSize || 0) - (b.fileSize || 0)
          break
        case "name":
          comparison = (a.title || "").localeCompare(b.title || "")
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [displayImages, searchQuery, selectedTags, sortBy, sortOrder, filterSource])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search images by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {allSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="flex items-center gap-2"
          >
            {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedTags.length > 0 || searchQuery || filterSource !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
            {filterSource !== "all" && <Badge variant="secondary">Source: {filterSource}</Badge>}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                Tag: {tag}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleTagToggle(tag)} />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedTags([])
                setFilterSource("all")
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredImages.length} of {displayImages.length} images
        </p>
      </div>

      {/* Image Gallery */}
      <AnimatePresence mode="wait">
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={image.thumbnail || image.url}
                      alt={image.title || "Image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    {image.isFavorite && (
                      <div className="absolute top-2 left-2">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate">{image.title || "Untitled"}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{image.source}</span>
                        {image.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            {image.rating}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {image.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {(image.tags?.length || 0) > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(image.tags?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 bg-transparent"
                          onClick={() => onDownload?.(image)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => onFavorite?.(image)}
                        >
                          <Heart className={`w-3 h-3 ${image.isFavorite ? "fill-current text-red-500" : ""}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => onShare?.(image)}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.title || "Image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium truncate">{image.title || "Untitled"}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{image.source}</span>
                              <span>
                                {image.width}x{image.height}
                              </span>
                              <span>{formatFileSize(image.fileSize || 0)}</span>
                              {image.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                                  {image.rating}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {image.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedImage(image)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onDownload?.(image)}>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onFavorite?.(image)}>
                              <Heart className={`w-4 h-4 ${image.isFavorite ? "fill-current text-red-500" : ""}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Detail Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedImage.title || "Image Details"}</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onDownload?.(selectedImage)}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onFavorite?.(selectedImage)}>
                      <Heart className={`w-4 h-4 ${selectedImage.isFavorite ? "fill-current text-red-500" : ""}`} />
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <img
                      src={selectedImage.url || "/placeholder.svg"}
                      alt={selectedImage.title || "Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6 pr-4">
                    <div>
                      <h3 className="font-medium mb-2">Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Source:</span>
                          <span>{selectedImage.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span>
                            {selectedImage.width}x{selectedImage.height}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File Size:</span>
                          <span>{formatFileSize(selectedImage.fileSize || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Upload Date:</span>
                          <span>{selectedImage.uploadDate}</span>
                        </div>
                        {selectedImage.rating && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              {selectedImage.rating}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Actions</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => onDownload?.(selectedImage)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Original
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => onFavorite?.(selectedImage)}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {selectedImage.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => onShare?.(selectedImage)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Image
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Bookmark className="w-4 h-4 mr-2" />
                          Add to Collection
                        </Button>
                      </div>
                    </div>
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
