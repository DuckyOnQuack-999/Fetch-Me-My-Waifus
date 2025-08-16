"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Download,
  Share,
  Trash2,
  Eye,
  ImageIcon,
  Folder,
  SortAsc,
  SortDesc,
  MoreHorizontal,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { toast } from "sonner"
import type { WaifuImage } from "@/types/waifu"

interface GalleryFilters {
  search: string
  category: string
  tags: string[]
  dateRange: string
  sortBy: string
  sortOrder: "asc" | "desc"
  showFavorites: boolean
  viewMode: "grid" | "list"
}

export function EnhancedImageGallery() {
  const { images, addToFavorites, removeFromFavorites, deleteImage } = useStorage()
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [filters, setFilters] = useState<GalleryFilters>({
    search: "",
    category: "all",
    tags: [],
    dateRange: "all",
    sortBy: "date",
    sortOrder: "desc",
    showFavorites: false,
    viewMode: "grid",
  })

  // Mock images for demonstration
  const [mockImages] = useState<WaifuImage[]>([
    {
      id: "1",
      url: "/placeholder.svg?height=400&width=300&text=Waifu+1",
      filename: "cute_anime_girl_001.jpg",
      category: "waifu",
      tags: ["cute", "anime", "girl", "pink_hair"],
      downloadedAt: new Date(Date.now() - 86400000),
      isFavorite: true,
      size: 1024000,
      dimensions: { width: 1920, height: 1080 },
      source: "waifu.im",
    },
    {
      id: "2",
      url: "/placeholder.svg?height=400&width=300&text=Neko+2",
      filename: "neko_kawaii_002.png",
      category: "neko",
      tags: ["neko", "kawaii", "cat_ears", "blue_eyes"],
      downloadedAt: new Date(Date.now() - 172800000),
      isFavorite: false,
      size: 2048000,
      dimensions: { width: 1920, height: 1080 },
      source: "nekos.best",
    },
    {
      id: "3",
      url: "/placeholder.svg?height=400&width=300&text=Shinobu+3",
      filename: "shinobu_smile_003.jpg",
      category: "shinobu",
      tags: ["shinobu", "smile", "blonde", "vampire"],
      downloadedAt: new Date(Date.now() - 259200000),
      isFavorite: true,
      size: 1536000,
      dimensions: { width: 1920, height: 1080 },
      source: "waifu.pics",
    },
    {
      id: "4",
      url: "/placeholder.svg?height=400&width=300&text=Megumin+4",
      filename: "megumin_explosion_004.jpg",
      category: "megumin",
      tags: ["megumin", "explosion", "red_eyes", "wizard"],
      downloadedAt: new Date(Date.now() - 345600000),
      isFavorite: false,
      size: 1792000,
      dimensions: { width: 1920, height: 1080 },
      source: "waifu.im",
    },
    {
      id: "5",
      url: "/placeholder.svg?height=400&width=300&text=Cuddle+5",
      filename: "anime_cuddle_005.png",
      category: "cuddle",
      tags: ["cuddle", "wholesome", "couple", "love"],
      downloadedAt: new Date(Date.now() - 432000000),
      isFavorite: true,
      size: 2304000,
      dimensions: { width: 1920, height: 1080 },
      source: "nekos.best",
    },
    {
      id: "6",
      url: "/placeholder.svg?height=400&width=300&text=Hug+6",
      filename: "warm_hug_006.jpg",
      category: "hug",
      tags: ["hug", "warm", "comfort", "friendship"],
      downloadedAt: new Date(Date.now() - 518400000),
      isFavorite: false,
      size: 1280000,
      dimensions: { width: 1920, height: 1080 },
      source: "waifu.pics",
    },
  ])

  const allImages = useMemo(() => [...images, ...mockImages], [images, mockImages])

  const filteredImages = useMemo(() => {
    let filtered = allImages

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (img) =>
          img.filename.toLowerCase().includes(filters.search.toLowerCase()) ||
          img.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((img) => img.category === filters.category)
    }

    // Favorites filter
    if (filters.showFavorites) {
      filtered = filtered.filter((img) => img.isFavorite)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case "date":
          comparison = a.downloadedAt.getTime() - b.downloadedAt.getTime()
          break
        case "name":
          comparison = a.filename.localeCompare(b.filename)
          break
        case "size":
          comparison = a.size - b.size
          break
        default:
          comparison = 0
      }
      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    return filtered
  }, [allImages, filters])

  const categories = useMemo(() => {
    const cats = new Set(allImages.map((img) => img.category))
    return Array.from(cats)
  }, [allImages])

  const allTags = useMemo(() => {
    const tags = new Set(allImages.flatMap((img) => img.tags))
    return Array.from(tags)
  }, [allImages])

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "favorite":
        selectedImages.forEach((id) => {
          const image = allImages.find((img) => img.id === id)
          if (image && !image.isFavorite) {
            addToFavorites(image)
          }
        })
        toast.success(`Added ${selectedImages.length} images to favorites`)
        break
      case "unfavorite":
        selectedImages.forEach((id) => {
          const image = allImages.find((img) => img.id === id)
          if (image && image.isFavorite) {
            removeFromFavorites(id)
          }
        })
        toast.success(`Removed ${selectedImages.length} images from favorites`)
        break
      case "delete":
        selectedImages.forEach((id) => deleteImage(id))
        toast.success(`Deleted ${selectedImages.length} images`)
        break
    }
    setSelectedImages([])
  }

  const stats = useMemo(() => {
    return {
      total: allImages.length,
      favorites: allImages.filter((img) => img.isFavorite).length,
      categories: categories.length,
      totalSize: allImages.reduce((sum, img) => sum + img.size, 0),
    }
  }, [allImages, categories])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Image Gallery</h2>
          <p className="text-muted-foreground">Browse and manage your downloaded images</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{stats.total} Images</Badge>
          <Badge variant="outline">{stats.favorites} Favorites</Badge>
          <Badge variant="outline">{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Images</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{stats.favorites}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{(stats.totalSize / 1024 / 1024).toFixed(1)}MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">File Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>View Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, viewMode: "grid" }))}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={filters.viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, viewMode: "list" }))}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }))
                    }
                  >
                    {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="favorites"
                    checked={filters.showFavorites}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, showFavorites: checked }))}
                  />
                  <Label htmlFor="favorites">Show Favorites Only</Label>
                </div>
              </div>

              {selectedImages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedImages.length} selected</span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("favorite")}>
                    <Heart className="h-4 w-4 mr-1" />
                    Favorite
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Gallery */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <AnimatePresence mode="wait">
          {filters.viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.filename}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleImageSelect(image.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => (image.isFavorite ? removeFromFavorites(image.id) : addToFavorites(image))}
                          >
                            <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-current text-pink-500" : ""}`} />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {selectedImages.includes(image.id) && (
                        <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      )}

                      {/* Favorite indicator */}
                      {image.isFavorite && (
                        <div className="absolute top-2 right-2">
                          <Heart className="h-5 w-5 fill-current text-pink-500" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate">{image.filename}</h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {image.category}
                          </Badge>
                          <span>{(image.size / 1024).toFixed(0)}KB</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{image.filename}</h3>
                            {image.isFavorite && <Heart className="h-4 w-4 fill-current text-pink-500 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {image.category}
                            </Badge>
                            <span>•</span>
                            <span>{(image.size / 1024).toFixed(0)}KB</span>
                            <span>•</span>
                            <span>
                              {image.dimensions.width}x{image.dimensions.height}
                            </span>
                            <span>•</span>
                            <span>{image.downloadedAt.toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {image.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => (image.isFavorite ? removeFromFavorites(image.id) : addToFavorites(image))}
                          >
                            <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-current text-pink-500" : ""}`} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
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

        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p>Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
