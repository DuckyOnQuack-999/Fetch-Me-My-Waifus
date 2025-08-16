"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Grid3X3, List, Heart, Download, Eye, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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
      const categories = ["anime", "manga", "game", "original"]
      const sources = ["waifu.pics", "waifu.im", "nekos.best", "wallhaven"]
      const tags = ["cute", "beautiful", "cool", "elegant", "kawaii", "moe", "tsundere", "yandere"]

      return Array.from({ length: 50 }, (_, i) => ({
        id: `img-${i + 1}`,
        url: `/placeholder.svg?height=400&width=300&text=Waifu ${i + 1}`,
        thumbnail: `/placeholder.svg?height=200&width=150&text=Thumb ${i + 1}`,
        title: `Anime Girl ${i + 1}`,
        tags: tags.slice(0, Math.floor(Math.random() * 4) + 1),
        category: categories[Math.floor(Math.random() * categories.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        isFavorite: Math.random() > 0.7,
        isDownloaded: Math.random() > 0.3,
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        dimensions: `${800 + Math.floor(Math.random() * 400)}x${600 + Math.floor(Math.random() * 400)}`,
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Image Gallery</h2>
          <p className="text-muted-foreground">Browse and manage your waifu collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredImages.length} images</Badge>
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[150px]">
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">Date Added</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="source">Source</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1",
        )}
      >
        {filteredImages.map((image) => (
          <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={image.thumbnail || "/placeholder.svg"} alt={image.title} className="w-full h-48 object-cover" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" onClick={() => setSelectedImage(image)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Button size="sm" variant="secondary" onClick={() => toggleFavorite(image.id)}>
                  <Heart className={cn("h-4 w-4", image.isFavorite ? "fill-red-500 text-red-500" : "")} />
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => downloadImage(image.id)}
                  disabled={image.isDownloaded}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Status badges */}
              <div className="absolute top-2 right-2 flex gap-1">
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
              <h3 className="font-medium text-sm truncate">{image.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {image.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{image.source}</span>
              </div>

              {viewMode === "list" && (
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{image.dimensions}</span>
                    <span>{image.size}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedImage.title}</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleFavorite(selectedImage.id)}>
                      <Heart className={cn("h-4 w-4", selectedImage.isFavorite ? "fill-red-500 text-red-500" : "")} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadImage(selectedImage.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={selectedImage.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

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
                        <span className="text-muted-foreground">Added:</span>
                        <span>{selectedImage.dateAdded.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty state */}
      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
      )}
    </div>
  )
}
