"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Download,
  Heart,
  Share2,
  ZoomIn,
  RotateCw,
  Copy,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface WaifuImage {
  id: string
  url: string
  preview_url?: string
  tags: string[]
  source: string
  width: number
  height: number
  file_size?: number
  created_at?: string
  is_nsfw?: boolean
  artist?: string
  character?: string
}

interface EnhancedImageGalleryProps {
  images: WaifuImage[]
  onDownload?: (image: WaifuImage) => void
  onFavorite?: (image: WaifuImage) => void
  isLoading?: boolean
}

export function EnhancedImageGallery({ images, onDownload, onFavorite, isLoading = false }: EnhancedImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"date" | "size" | "dimensions">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImage, setSelectedImage] = useState<WaifuImage | null>(null)
  const [imageRotation, setImageRotation] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique tags from images
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    images.forEach((image) => {
      image.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [images])

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    const filtered = images.filter((image) => {
      const matchesSearch =
        searchTerm === "" ||
        image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (image.artist && image.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (image.character && image.character.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => image.tags.includes(tag))

      return matchesSearch && matchesTags
    })

    // Sort images
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime()
          break
        case "size":
          comparison = (a.file_size || 0) - (b.file_size || 0)
          break
        case "dimensions":
          comparison = a.width * a.height - b.width * b.height
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [images, searchTerm, selectedTags, sortBy, sortOrder])

  const handleDownload = useCallback(
    async (image: WaifuImage) => {
      try {
        onDownload?.(image)
        toast.success(`Downloading ${image.id}`)
      } catch (error) {
        toast.error("Failed to download image")
      }
    },
    [onDownload],
  )

  const handleFavorite = useCallback(
    (image: WaifuImage) => {
      onFavorite?.(image)
      toast.success("Added to favorites")
    },
    [onFavorite],
  )

  const handleShare = useCallback(async (image: WaifuImage) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Waifu Image - ${image.id}`,
          url: image.url,
        })
      } else {
        await navigator.clipboard.writeText(image.url)
        toast.success("Image URL copied to clipboard")
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(image.url)
        toast.success("Image URL copied to clipboard")
      } catch (clipboardError) {
        toast.error("Failed to share image")
      }
    }
  }, [])

  const handleCopyUrl = useCallback(async (image: WaifuImage) => {
    try {
      await navigator.clipboard.writeText(image.url)
      toast.success("Image URL copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy URL")
    }
  }, [])

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No images found</h3>
            <p className="text-muted-foreground">Try downloading some images first or adjust your search filters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by tags, artist, or character..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                  <SelectItem value="dimensions">Dimensions</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          {showFilters && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Filter by tags:</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.slice(0, 50).map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => {
                      setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setSelectedTags([])}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedImages.length} of {images.length} images
        </p>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"
        }
      >
        {filteredAndSortedImages.map((image) => (
          <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={image.preview_url || image.url || "/placeholder.svg?height=400&width=400"}
                alt={`Waifu image ${image.id}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=400&width=400&text=Image+Not+Found"
                }}
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="secondary" onClick={() => setSelectedImage(image)}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Details</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="secondary" onClick={() => handleDownload(image)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="secondary" onClick={() => handleFavorite(image)}>
                        <Heart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to Favorites</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="secondary" onClick={() => handleShare(image)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* NSFW Badge */}
              {image.is_nsfw && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  NSFW
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium truncate">{image.id}</p>
                  <Badge variant="outline" className="text-xs">
                    {image.source}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  {image.width} × {image.height} • {formatFileSize(image.file_size)}
                </div>

                {image.artist && <p className="text-xs text-muted-foreground">Artist: {image.artist}</p>}

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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Detail Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>Image Details - {selectedImage.id}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={selectedImage.url || "/placeholder.svg?height=600&width=600"}
                      alt={`Waifu image ${selectedImage.id}`}
                      fill
                      className="object-contain"
                      style={{ transform: `rotate(${imageRotation}deg)` }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=600&width=600&text=Image+Not+Found"
                      }}
                    />
                  </div>

                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setImageRotation((prev) => prev - 90)}>
                      <RotateCw className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setImageRotation((prev) => prev + 90)}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleCopyUrl(selectedImage)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Dimensions</p>
                      <p className="text-muted-foreground">
                        {selectedImage.width} × {selectedImage.height}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">File Size</p>
                      <p className="text-muted-foreground">{formatFileSize(selectedImage.file_size)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Source</p>
                      <p className="text-muted-foreground">{selectedImage.source}</p>
                    </div>
                    {selectedImage.artist && (
                      <div>
                        <p className="font-medium">Artist</p>
                        <p className="text-muted-foreground">{selectedImage.artist}</p>
                      </div>
                    )}
                    {selectedImage.character && (
                      <div>
                        <p className="font-medium">Character</p>
                        <p className="text-muted-foreground">{selectedImage.character}</p>
                      </div>
                    )}
                    {selectedImage.created_at && (
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedImage.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleDownload(selectedImage)} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => handleFavorite(selectedImage)}>
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => handleShare(selectedImage)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
