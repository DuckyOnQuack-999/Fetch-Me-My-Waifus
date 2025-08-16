"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Grid3X3, List, Heart, Eye, Calendar, Tag, ImageIcon, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { EnhancedImagePreview } from "./enhanced-image-preview"
import { BatchOperationsPanel } from "./batch-operations-panel"

export function EnhancedImageGallery() {
  const { images, toggleFavorite } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [showBatchPanel, setShowBatchPanel] = useState(false)

  const categories = useMemo(() => {
    const cats = new Set(images.flatMap((img) => img.tags || []))
    return Array.from(cats).sort()
  }, [images])

  const sources = useMemo(() => {
    const srcs = new Set(images.map((img) => img.source).filter(Boolean))
    return Array.from(srcs).sort()
  }, [images])

  const filteredAndSortedImages = useMemo(() => {
    const filtered = images.filter((image) => {
      const matchesSearch =
        searchTerm === "" ||
        image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || (image.tags || []).includes(selectedCategory)

      const matchesSource = selectedSource === "all" || image.source === selectedSource

      return matchesSearch && matchesCategory && matchesSource
    })

    // Sort images
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case "name":
          comparison = a.filename.localeCompare(b.filename)
          break
        case "size":
          comparison = (a.size || 0) - (b.size || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [images, searchTerm, selectedCategory, selectedSource, sortBy, sortOrder])

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedImages.size === filteredAndSortedImages.length) {
      setSelectedImages(new Set())
    } else {
      setSelectedImages(new Set(filteredAndSortedImages.map((img) => img.image_id)))
    }
  }

  useEffect(() => {
    setShowBatchPanel(selectedImages.size > 0)
  }, [selectedImages.size])

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images by name or tags..."
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
            </div>
          </div>

          {/* Selection Controls */}
          {filteredAndSortedImages.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedImages.size === filteredAndSortedImages.length ? "Deselect All" : "Select All"}
                </Button>
                {selectedImages.size > 0 && <Badge variant="secondary">{selectedImages.size} selected</Badge>}
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredAndSortedImages.length} of {images.length} images
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Operations Panel */}
      <AnimatePresence>
        {showBatchPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BatchOperationsPanel
              selectedImages={Array.from(selectedImages)}
              onClearSelection={() => setSelectedImages(new Set())}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Gallery */}
      {filteredAndSortedImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">
              {images.length === 0
                ? "Start downloading some images to see them here!"
                : "Try adjusting your search or filter criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredAndSortedImages.map((image, index) => (
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
                      selectedImages.has(image.image_id) ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.filename}
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
                                handleImageSelect(image.image_id)
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedImages.has(image.image_id)}
                                onChange={() => handleImageSelect(image.image_id)}
                                className="h-4 w-4"
                              />
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(image.image_id)
                              }}
                            >
                              <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm truncate">{image.filename}</h4>
                          {image.isFavorite && <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {(image.tags || []).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(image.tags || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(image.tags || []).length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{image.source}</span>
                          <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    className={`group cursor-pointer transition-all hover:shadow-md ${
                      selectedImages.has(image.image_id) ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedImages.has(image.image_id)}
                            onChange={() => handleImageSelect(image.image_id)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.filename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{image.filename}</h4>
                            {image.isFavorite && <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {(image.tags || []).slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {(image.tags || []).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(image.tags || []).length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {image.source}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(image.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <EnhancedImagePreview image={image} />
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" variant="outline" onClick={() => toggleFavorite(image.image_id)}>
                            <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
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
      )}
    </div>
  )
}
