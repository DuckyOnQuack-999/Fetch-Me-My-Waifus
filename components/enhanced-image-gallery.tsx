"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Search,
  Grid3X3,
  List,
  Heart,
  Download,
  Share,
  Eye,
  ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { WaifuImage } from "@/types/waifu"

interface EnhancedImageGalleryProps {
  images: WaifuImage[]
  onDownload?: (image: WaifuImage) => void
  onFavorite?: (image: WaifuImage) => void
  isLoading?: boolean
}

export function EnhancedImageGallery({ images, onDownload, onFavorite, isLoading }: EnhancedImageGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showNsfw, setShowNsfw] = useState(false)
  const [selectedImage, setSelectedImage] = useState<WaifuImage | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filter and sort images
  const filteredImages = useMemo(() => {
    const filtered = images.filter((image) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          image.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          image.character?.toLowerCase().includes(query) ||
          image.series?.toLowerCase().includes(query) ||
          image.artist?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasSelectedTags = selectedTags.some((tag) => image.tags?.includes(tag))
        if (!hasSelectedTags) return false
      }

      // NSFW filter
      if (!showNsfw && image.rating === "explicit") {
        return false
      }

      return true
    })

    // Sort images
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
        break
      case "favorites":
        filtered.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0))
        break
      case "size":
        filtered.sort((a, b) => b.width * b.height - a.width * a.height)
        break
      default:
        break
    }

    return filtered
  }, [images, searchQuery, selectedTags, sortBy, showNsfw])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    images.forEach((image) => {
      image.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [images])

  const handleImageClick = (image: WaifuImage, index: number) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1
      setCurrentImageIndex(newIndex)
      setSelectedImage(filteredImages[newIndex])
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < filteredImages.length - 1) {
      const newIndex = currentImageIndex + 1
      setCurrentImageIndex(newIndex)
      setSelectedImage(filteredImages[newIndex])
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Gallery
          </CardTitle>
          <CardDescription>Browse and manage your anime image collection</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="view">View</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by tags, character, series, or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="favorites">Favorites First</SelectItem>
                    <SelectItem value="size">Largest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="nsfw" checked={showNsfw} onCheckedChange={setShowNsfw} />
                  <Label htmlFor="nsfw">Show NSFW Content</Label>
                </div>

                <div className="space-y-2">
                  <Label>Filter by Tags</Label>
                  <ScrollArea className="h-32 w-full border rounded-md p-4">
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 50).map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                  {selectedTags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Selected:</span>
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTag(tag)}>
                          {tag} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="view" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>View Mode:</Label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredImages.length} of {images.length} images
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Grid/List */}
      <AnimatePresence mode="wait">
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden" onClick={() => handleImageClick(image, index)}>
                    <img
                      src={image.preview_url || image.url || "/placeholder.svg?height=400&width=300"}
                      alt={`Image ${image.image_id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            onFavorite?.(image)
                          }}
                        >
                          <Heart className={`w-4 h-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDownload?.(image)
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {image.rating === "explicit" && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">NSFW</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {image.character || image.series || `Image ${image.image_id}`}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {image.width}×{image.height}
                        </div>
                      </div>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
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
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={image.preview_url || image.url || "/placeholder.svg?height=128&width=128"}
                        alt={`Image ${image.image_id}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleImageClick(image, index)}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-medium">
                            {image.character || image.series || `Image ${image.image_id}`}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {image.width}×{image.height}
                            </span>
                            {image.file_size && <span>{(image.file_size / 1024 / 1024).toFixed(1)} MB</span>}
                            {image.artist && <span>by {image.artist}</span>}
                          </div>
                          {image.tags && image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {image.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
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
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onFavorite?.(image)}
                            className="bg-transparent"
                          >
                            <Heart className={`w-4 h-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDownload?.(image)}
                            className="bg-transparent"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedImage && (
            <div className="relative">
              <div className="relative">
                <img
                  src={selectedImage.url || "/placeholder.svg?height=600&width=800"}
                  alt={`Image ${selectedImage.image_id}`}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onFavorite?.(selectedImage)}
                    className="bg-black/50 hover:bg-black/70"
                  >
                    <Heart
                      className={`w-4 h-4 ${selectedImage.isFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDownload?.(selectedImage)}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                {currentImageIndex > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
                {currentImageIndex < filteredImages.length - 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedImage.character || selectedImage.series || `Image ${selectedImage.image_id}`}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>
                        {selectedImage.width}×{selectedImage.height}
                      </span>
                      {selectedImage.file_size && <span>{(selectedImage.file_size / 1024 / 1024).toFixed(1)} MB</span>}
                      {selectedImage.artist && <span>by {selectedImage.artist}</span>}
                    </div>
                  </div>
                  <Badge variant={selectedImage.rating === "explicit" ? "destructive" : "secondary"}>
                    {selectedImage.rating?.toUpperCase() || "SAFE"}
                  </Badge>
                </div>
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Image {currentImageIndex + 1} of {filteredImages.length}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Full Size
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
