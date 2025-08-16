"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Heart, Grid3X3, List, Download, SortAsc, SortDesc, Eye, Wand2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { EnhancedImagePreview } from "@/components/enhanced-image-preview"
import { AIUpscaler } from "@/components/ai-upscaler"
import { BatchOperationsPanel } from "@/components/batch-operations-panel"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { toast } from "sonner"

export default function FavoritesPage() {
  const { images, favorites, toggleFavorite, removeImage, isFavorite } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedImageForPreview, setSelectedImageForPreview] = useState<any>(null)
  const [selectedImageForUpscale, setSelectedImageForUpscale] = useState<any>(null)

  const favoriteImages = useMemo(() => {
    return images.filter((image) => isFavorite(image.image_id.toString()))
  }, [images, favorites])

  const categories = useMemo(() => {
    const cats = new Set(favoriteImages.flatMap((img) => img.tags || []))
    return Array.from(cats).sort()
  }, [favoriteImages])

  const filteredAndSortedImages = useMemo(() => {
    const filtered = favoriteImages.filter((image) => {
      const matchesSearch =
        searchTerm === "" ||
        (image.filename || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || (image.tags || []).includes(selectedCategory)

      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          break
        case "name":
          comparison = (a.filename || "").localeCompare(b.filename || "")
          break
        case "size":
          comparison = (a.file_size || 0) - (b.file_size || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [favoriteImages, searchTerm, selectedCategory, sortBy, sortOrder])

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
      setSelectedImages(new Set(filteredAndSortedImages.map((img) => img.image_id.toString())))
    }
  }

  const handleDownloadImage = (image: any) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename || `image-${image.image_id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${image.filename}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                  Favorites
                </h1>
                <p className="text-muted-foreground">Your favorite images collection</p>
              </div>
              <Badge variant="secondary">{favoriteImages.length} favorites</Badge>
            </div>

            {favoriteImages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding images to your favorites by clicking the heart icon on any image.
                  </p>
                  <Button onClick={() => (window.location.href = "/gallery")}>Browse Gallery</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Batch Operations Panel */}
                {selectedImages.size > 0 && (
                  <BatchOperationsPanel
                    selectedImages={Array.from(selectedImages)}
                    onClearSelection={() => setSelectedImages(new Set())}
                  />
                )}

                {/* Search and Filter Bar */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search favorites..."
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

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
                          {filteredAndSortedImages.length} of {favoriteImages.length} favorites
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Images Grid */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                      : "space-y-4"
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
                                  </div>
                                </div>
                              </div>

                              <div className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm truncate">
                                    {image.filename || `Image ${image.image_id}`}
                                  </h4>
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
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
                                  <span>{new Date(image.created_at || Date.now()).toLocaleDateString()}</span>
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
                                    <h4 className="font-medium truncate">
                                      {image.filename || `Image ${image.image_id}`}
                                    </h4>
                                    <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
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
                                    <span>{image.source}</span>
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
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Image Preview Dialog */}
          <Dialog open={!!selectedImageForPreview} onOpenChange={() => setSelectedImageForPreview(null)}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>Image Preview</DialogTitle>
              </DialogHeader>
              {selectedImageForPreview && <EnhancedImagePreview image={selectedImageForPreview} />}
            </DialogContent>
          </Dialog>

          {/* AI Upscaler Dialog */}
          <Dialog open={!!selectedImageForUpscale} onOpenChange={() => setSelectedImageForUpscale(null)}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>AI Image Upscaler</DialogTitle>
              </DialogHeader>
              {selectedImageForUpscale && (
                <AIUpscaler image={selectedImageForUpscale} onClose={() => setSelectedImageForUpscale(null)} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
