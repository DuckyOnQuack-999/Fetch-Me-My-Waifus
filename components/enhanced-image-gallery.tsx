"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Grid3X3, List, Heart, Download, Eye, ImageIcon, Filter, SortAsc } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ImageItem {
  id: string
  url: string
  thumbnail: string
  title: string
  tags: string[]
  category: string
  source: string
  dateAdded: Date
  isFavorite: boolean
  isDownloaded: boolean
  size: string
  dimensions: string
  rating: "safe" | "questionable" | "explicit"
}

export function EnhancedImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("dateAdded")
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data generation
  useEffect(() => {
    const generateMockImages = (): ImageItem[] => {
      const categories = ["anime", "manga", "game", "original", "character"]
      const sources = ["waifu.pics", "waifu.im", "nekos.best", "wallhaven"]
      const tags = ["cute", "beautiful", "cool", "elegant", "kawaii", "moe", "tsundere", "yandere", "school", "uniform"]
      const ratings: ("safe" | "questionable" | "explicit")[] = ["safe", "safe", "safe", "questionable", "explicit"]

      return Array.from({ length: 50 }, (_, i) => ({
        id: `img-${i + 1}`,
        url: `/placeholder.svg?height=600&width=400&text=Waifu ${i + 1}`,
        thumbnail: `/placeholder.svg?height=300&width=200&text=Thumb ${i + 1}`,
        title: `Anime Girl ${i + 1}`,
        tags: tags.slice(0, Math.floor(Math.random() * 5) + 2),
        category: categories[Math.floor(Math.random() * categories.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        isFavorite: Math.random() > 0.7,
        isDownloaded: Math.random() > 0.3,
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        dimensions: `${800 + Math.floor(Math.random() * 800)}x${600 + Math.floor(Math.random() * 600)}`,
        rating: ratings[Math.floor(Math.random() * ratings.length)],
      }))
    }

    setTimeout(() => {
      setImages(generateMockImages())
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort images
  const filteredImages = useMemo(() => {
    const filtered = images.filter((image) => {
      const matchesSearch =
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || image.category === selectedCategory
      const matchesSource = selectedSource === "all" || image.source === selectedSource

      return matchesSearch && matchesCategory && matchesSource
    })

    // Sort images
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dateAdded":
          return b.dateAdded.getTime() - a.dateAdded.getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
        case "source":
          return a.source.localeCompare(b.source)
        case "favorites":
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [images, searchQuery, selectedCategory, selectedSource, sortBy])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(images.map((img) => img.category)))
    return cats.sort()
  }, [images])

  const sources = useMemo(() => {
    const srcs = Array.from(new Set(images.map((img) => img.source)))
    return srcs.sort()
  }, [images])

  const toggleFavorite = (imageId: string) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img)))
  }

  const downloadImage = (imageId: string) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isDownloaded: true } : img)))
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "safe":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "questionable":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "explicit":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Image Gallery
          </h2>
          <p className="text-muted-foreground">Browse and manage your waifu collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <ImageIcon className="h-3 w-3" />
            {filteredImages.length} images
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="gap-1"
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images, tags, characters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAdded">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="source">Source</SelectItem>
                    <SelectItem value="favorites">Favorites First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gallery */}
      <AnimatePresence mode="wait">
        {filteredImages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No images found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedSource("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1",
            )}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                layout
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative">
                    <img
                      src={image.thumbnail || "/placeholder.svg"}
                      alt={image.title}
                      className={cn(
                        "w-full object-cover transition-transform duration-300 group-hover:scale-105",
                        viewMode === "grid" ? "h-48" : "h-32",
                      )}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(image)}
                        className="bg-white/90 hover:bg-white text-black"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleFavorite(image.id)}
                        className="bg-white/90 hover:bg-white text-black"
                      >
                        <Heart className={cn("h-4 w-4", image.isFavorite ? "fill-red-500 text-red-500" : "")} />
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(image.id)}
                        disabled={image.isDownloaded}
                        className="bg-white/90 hover:bg-white text-black disabled:opacity-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Status badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge variant="secondary" className={getRatingColor(image.rating)}>
                        {image.rating.toUpperCase()}
                      </Badge>
                      {image.isFavorite && (
                        <Badge variant="secondary" className="bg-red-500 text-white">
                          <Heart className="h-3 w-3" />
                        </Badge>
                      )}
                      {image.isDownloaded && (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          <Download className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm truncate mb-2">{image.title}</h3>

                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {image.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{image.source}</span>
                    </div>

                    {viewMode === "list" && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{image.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{image.dimensions}</span>
                          <span>{image.size}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Added {image.dateAdded.toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
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
            <div className="grid md:grid-cols-2 gap-0 h-full">
              <div className="relative bg-black flex items-center justify-center">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedImage.title}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFavorite(selectedImage.id)}
                        className="gap-1"
                      >
                        <Heart className={cn("h-4 w-4", selectedImage.isFavorite ? "fill-red-500 text-red-500" : "")} />
                        {selectedImage.isFavorite ? "Unfavorite" : "Favorite"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(selectedImage.id)}
                        className="gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline">{selectedImage.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source:</span>
                        <span>{selectedImage.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>{selectedImage.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{selectedImage.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <Badge variant="secondary" className={getRatingColor(selectedImage.rating)}>
                          {selectedImage.rating.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Added:</span>
                        <span>{selectedImage.dateAdded.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <Eye className="h-4 w-4" />
                        View Full Size
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <ImageIcon className="h-4 w-4" />
                        Add to Collection
                      </Button>
                    </div>
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
