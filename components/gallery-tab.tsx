"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { Search, Filter, Grid3X3, List, Heart, Download, Eye, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { WaifuImage } from "@/types/waifu"

export function GalleryTab() {
  const { images, toggleFavorite, removeImage } = useStorage()
  const { settings } = useSettings()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size" | "favorites">("date")
  const [filterBy, setFilterBy] = useState<"all" | "favorites" | "nsfw" | "sfw">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [filteredImages, setFilteredImages] = useState<WaifuImage[]>([])

  // Ensure images is always an array
  const safeImages = Array.isArray(images) ? images : []

  useEffect(() => {
    let filtered = [...safeImages]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (image) =>
          image.tags?.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          image.source?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    switch (filterBy) {
      case "favorites":
        filtered = filtered.filter((image) => image.isFavorite)
        break
      case "nsfw":
        filtered = filtered.filter((image) => image.is_nsfw)
        break
      case "sfw":
        filtered = filtered.filter((image) => !image.is_nsfw)
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.uploaded_at || 0).getTime() - new Date(a.uploaded_at || 0).getTime()
        case "name":
          return (a.tags?.[0]?.name || "").localeCompare(b.tags?.[0]?.name || "")
        case "size":
          return (b.fileSize || 0) - (a.fileSize || 0)
        case "favorites":
          return (b.favorites || 0) - (a.favorites || 0)
        default:
          return 0
      }
    })

    setFilteredImages(filtered)
  }, [safeImages, searchQuery, sortBy, filterBy])

  const handleImageSelect = (imageId: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedImages(newSelected)
  }

  const handleBulkAction = (action: "favorite" | "delete" | "download") => {
    selectedImages.forEach((imageId) => {
      switch (action) {
        case "favorite":
          toggleFavorite(imageId)
          break
        case "delete":
          removeImage(imageId)
          break
        case "download":
          // Implement bulk download
          break
      }
    })
    setSelectedImages(new Set())
  }

  if (!safeImages || safeImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
        <p className="text-muted-foreground mb-4">Start downloading some images to see them here!</p>
        <Button onClick={() => (window.location.href = "/?tab=download")}>
          <Download className="mr-2 h-4 w-4" />
          Start Downloading
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Gallery
          </h2>
          <p className="text-muted-foreground">
            {filteredImages.length} of {safeImages.length} images
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="glow-button"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="glow-button"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[180px] glass-card">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="size">File Size</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
          <SelectTrigger className="w-[180px] glass-card">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Images</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
            <SelectItem value="sfw">SFW Only</SelectItem>
            <SelectItem value="nsfw">NSFW Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedImages.size > 0 && (
        <div className="flex items-center gap-2 p-4 glass-card rounded-lg">
          <span className="text-sm font-medium">{selectedImages.size} selected</span>
          <Button size="sm" onClick={() => handleBulkAction("favorite")} className="glow-button">
            <Heart className="mr-2 h-4 w-4" />
            Favorite
          </Button>
          <Button size="sm" onClick={() => handleBulkAction("download")} className="glow-button">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedImages(new Set())}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Image Grid/List */}
      <AnimatePresence>
        {viewMode === "grid" ? (
          <div
            className={`grid gap-4 ${
              settings.gridColumns === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : settings.gridColumns === 4
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : settings.gridColumns === 5
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
            }`}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group relative overflow-hidden glass-card hover:glow-border transition-all duration-300">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={image.preview_url || image.url}
                      alt={image.tags?.[0]?.name || "Image"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant={image.isFavorite ? "default" : "secondary"}
                          onClick={() => toggleFavorite(image.image_id.toString())}
                          className="glow-button"
                        >
                          <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-current" : ""}`} />
                        </Button>
                        <Button size="sm" variant="secondary" className="glow-button">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="glow-button">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {image.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag.name} variant="secondary" className="text-xs glass-card">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-white/80">
                          {image.width}x{image.height} • {image.extension?.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Selection checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.has(image.image_id.toString())}
                        onChange={() => handleImageSelect(image.image_id.toString())}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </div>

                    {/* NSFW indicator */}
                    {image.is_nsfw && (
                      <Badge className="absolute top-2 left-1/2 transform -translate-x-1/2" variant="destructive">
                        NSFW
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className="p-4 glass-card">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.image_id.toString())}
                      onChange={() => handleImageSelect(image.image_id.toString())}
                      className="w-4 h-4 rounded border-gray-300"
                    />

                    <div className="w-16 h-16 relative rounded overflow-hidden">
                      <Image
                        src={image.preview_url || image.url}
                        alt={image.tags?.[0]?.name || "Image"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate gradient-text">{image.tags?.[0]?.name || "Untitled"}</h3>
                        {image.is_nsfw && (
                          <Badge variant="destructive" className="text-xs">
                            NSFW
                          </Badge>
                        )}
                        {image.isFavorite && <Heart className="h-4 w-4 fill-current text-red-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {image.width}x{image.height} • {image.extension?.toUpperCase()} • {image.source}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags?.slice(0, 5).map((tag) => (
                          <Badge key={tag.name} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant={image.isFavorite ? "default" : "outline"}
                        onClick={() => toggleFavorite(image.image_id.toString())}
                        className="glow-button"
                      >
                        <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <Button size="sm" variant="outline" className="glow-button bg-transparent">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="glow-button bg-transparent">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeImage(image.image_id.toString())}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {filteredImages.length === 0 && safeImages.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
