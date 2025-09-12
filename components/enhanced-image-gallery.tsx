"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Heart, Grid3X3, List, Download, SortAsc, SortDesc, Eye, Wand2, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { WaifuImage } from "@/types/waifu"

interface EnhancedImageGalleryProps {
  images: WaifuImage[]
  handleImageSelect: (imageId: string) => void
  handleSelectAll: () => void
  handleDownloadImage: (image: WaifuImage) => void
  selectedImages: Set<string>
  selectedImageForPreview: WaifuImage | null
  setSelectedImageForPreview: (image: WaifuImage | null) => void
  selectedImageForUpscale: WaifuImage | null
  setSelectedImageForUpscale: (image: WaifuImage | null) => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedSource: string
  setSelectedSource: (source: string) => void
  sortBy: "date" | "name" | "size"
  setSortBy: (sort: "date" | "name" | "size") => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  toggleFavorite: (imageId: string | number) => boolean
  isFavorite: (imageId: string | number) => boolean
}

export function EnhancedImageGallery({
  images,
  handleImageSelect,
  handleSelectAll,
  handleDownloadImage,
  selectedImages,
  selectedImageForPreview,
  setSelectedImageForPreview,
  selectedImageForUpscale,
  setSelectedImageForUpscale,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  toggleFavorite,
  isFavorite,
}: EnhancedImageGalleryProps) {
  const [showFilters, setShowFilters] = useState(false)

  const categories = useMemo(() => {
    const cats = new Set(
      images.flatMap((img) => img.tags?.map((tag) => (typeof tag === "string" ? tag : tag.name)) || []),
    )
    return Array.from(cats).sort()
  }, [images])

  const sources = useMemo(() => {
    const srcs = new Set(images.map((img) => img.source).filter(Boolean))
    return Array.from(srcs).sort()
  }, [images])

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatResolution = (width?: number, height?: number) => {
    if (!width || !height) return "Unknown"
    return `${width} × ${height}`
  }

  if (!images || images.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4 opacity-50">🖼️</div>
          <h3 className="text-lg font-semibold mb-2">No Images Found</h3>
          <p className="text-muted-foreground">Start by downloading some images to see them here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Gallery</h1>
          <p className="text-muted-foreground">Browse and manage your image collection</p>
        </div>
        <Badge variant="secondary">{images.length} images</Badge>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-[120px]">
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

              <Select value={sortBy} onValueChange={(value: "date" | "name" | "size") => setSortBy(value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selection Controls */}
          {images.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedImages.size === images.length ? "Deselect All" : "Select All"}
                </Button>
                {selectedImages.size > 0 && <Badge variant="secondary">{selectedImages.size} selected</Badge>}
              </div>

              <div className="text-sm text-muted-foreground">{images.length} images</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images Grid/List */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"
        }
      >
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={image.image_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              {viewMode === "grid" ? (
                <Card
                  className={`group cursor-pointer transition-all hover:shadow-lg ${
                    selectedImages.has(image.image_id.toString()) ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={image.url || "/placeholder.svg?height=300&width=300"}
                        alt={image.filename || "Image"}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImageSelect(image.image_id.toString())
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedImages.has(image.image_id.toString())}
                              onChange={() => handleImageSelect(image.image_id.toString())}
                              className="h-4 w-4"
                            />
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImageForPreview(image)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadImage(image)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImageForUpscale(image)
                            }}
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(image.image_id)
                              toast.success(
                                isFavorite(image.image_id) ? "Added to favorites" : "Removed from favorites",
                              )
                            }}
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorite(image.image_id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm truncate">{image.filename || `Image ${image.image_id}`}</h4>
                        <Badge variant="outline" className="text-xs">
                          {image.source || "Unknown"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {(image.tags || []).slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {typeof tag === "string" ? tag : tag.name}
                          </Badge>
                        ))}
                        {(image.tags || []).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(image.tags || []).length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatResolution(image.width, image.height)}</span>
                        <span>{formatFileSize(image.file_size)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className={`group cursor-pointer transition-all hover:shadow-md ${
                    selectedImages.has(image.image_id.toString()) ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedImages.has(image.image_id.toString())}
                          onChange={() => handleImageSelect(image.image_id.toString())}
                          className="h-4 w-4"
                        />
                      </div>

                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={image.url || "/placeholder.svg?height=64&width=64"}
                          alt={image.filename || "Image"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{image.filename || `Image ${image.image_id}`}</h4>
                          <Badge variant="outline" className="text-xs">
                            {image.source || "Unknown"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {(image.tags || []).slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {typeof tag === "string" ? tag : tag.name}
                            </Badge>
                          ))}
                          {(image.tags || []).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(image.tags || []).length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatResolution(image.width, image.height)}</span>
                          <span>{formatFileSize(image.file_size)}</span>
                          <span>{new Date(image.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedImageForPreview(image)}>
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => handleDownloadImage(image)}>
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => setSelectedImageForUpscale(image)}>
                          <Wand2 className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toggleFavorite(image.image_id)
                            toast.success(isFavorite(image.image_id) ? "Added to favorites" : "Removed from favorites")
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${isFavorite(image.image_id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
