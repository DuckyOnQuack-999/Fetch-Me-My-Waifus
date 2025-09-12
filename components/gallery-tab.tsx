"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Heart, Grid3X3, List, Eye, Download, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { EnhancedImagePreview } from "./enhanced-image-preview"
import { toast } from "sonner"

export function GalleryTab() {
  const { images, toggleFavorite, isFavorite } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedImage, setSelectedImage] = useState<any>(null)

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

  const filteredImages = useMemo(() => {
    const filtered = images.filter((image) => {
      const matchesSearch =
        searchTerm === "" ||
        image.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.tags || []).some((tag) =>
          (typeof tag === "string" ? tag : tag.name).toLowerCase().includes(searchTerm.toLowerCase()),
        )

      const matchesCategory =
        selectedCategory === "all" ||
        (image.tags || []).some((tag) => (typeof tag === "string" ? tag : tag.name) === selectedCategory)

      const matchesSource = selectedSource === "all" || image.source === selectedSource

      return matchesSearch && matchesCategory && matchesSource
    })

    // Sort images
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = (a.filename || "").localeCompare(b.filename || "")
          break
        case "size":
          comparison = (a.file_size || 0) - (b.file_size || 0)
          break
        case "date":
        default:
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [images, searchTerm, selectedCategory, selectedSource, sortBy, sortOrder])

  const handleDownload = async (image: any) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = image.filename || `image-${image.image_id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download image")
    }
  }

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
      <Card className="material-card">
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4 opacity-50">🖼️</div>
          <h3 className="text-lg font-semibold mb-2 neon-text">No Images Found</h3>
          <p className="text-muted-foreground">Start by downloading some images to see them here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 kawaii-heart" />
            Image Gallery
          </CardTitle>
          <CardDescription>Browse and manage your downloaded images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-effect"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] glass-effect">
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
                <SelectTrigger className="w-[120px] glass-effect">
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
                <SelectTrigger className="w-[100px] glass-effect">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="glass-effect"
              >
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
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-pink-500/20">
            <Badge variant="secondary" className="glass-effect">
              {filteredImages.length} images
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid/List */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"
        }
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.image_id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              {viewMode === "grid" ? (
                <Card className="group cursor-pointer transition-all hover:shadow-lg material-card kawaii-element">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={image.url || "/placeholder.svg?height=300&width=300"}
                        alt={image.filename || "Image"}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity glass-effect"
                                onClick={() => setSelectedImage(image)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              {selectedImage && <EnhancedImagePreview image={selectedImage} />}
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity glass-effect"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(image)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity glass-effect"
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
                        <Badge variant="outline" className="text-xs glass-effect">
                          {image.source || "Unknown"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {(image.tags || []).slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs glass-effect">
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
                <Card className="group cursor-pointer transition-all hover:shadow-md material-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
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
                          <Badge variant="outline" className="text-xs glass-effect">
                            {image.source || "Unknown"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {(image.tags || []).slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs glass-effect">
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="glass-effect bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            {selectedImage && <EnhancedImagePreview image={selectedImage} />}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(image)}
                          className="glass-effect"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toggleFavorite(image.image_id)
                            toast.success(isFavorite(image.image_id) ? "Added to favorites" : "Removed from favorites")
                          }}
                          className="glass-effect"
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
