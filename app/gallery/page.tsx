"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Grid3X3, List, Heart, Eye, Download, Trash2, Wand2, ImageIcon, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { EnhancedImagePreview } from "@/components/enhanced-image-preview"
import { AIUpscaler } from "@/components/ai-upscaler"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { toast } from "sonner"

export default function GalleryPage() {
  const { images, toggleFavorite, removeImage } = useStorage()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedImageForUpscale, setSelectedImageForUpscale] = useState<any>(null)

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
        (image.filename || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || (image.tags || []).includes(selectedCategory)
      const matchesSource = selectedSource === "all" || image.source === selectedSource

      return matchesSearch && matchesCategory && matchesSource
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
          break
        case "name":
          comparison = (a.filename || "").localeCompare(b.filename || "")
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
      setSelectedImages(new Set(filteredAndSortedImages.map((img) => img.image_id.toString())))
    }
  }

  const handleBatchFavorite = () => {
    selectedImages.forEach((id) => toggleFavorite(id))
    toast.success(`Updated ${selectedImages.size} images`)
    setSelectedImages(new Set())
  }

  const handleBatchDelete = () => {
    selectedImages.forEach((id) => removeImage(id))
    toast.success(`Deleted ${selectedImages.size} images`)
    setSelectedImages(new Set())
  }

  const handleDownloadImage = (image: any) => {
    // Create a download link
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
                <h1 className="text-3xl font-bold">Gallery</h1>
                <p className="text-muted-foreground">Browse and manage your downloaded images</p>
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
                      {selectedImages.size > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{selectedImages.size} selected</Badge>
                          <Button variant="outline" size="sm" onClick={handleBatchFavorite}>
                            <Heart className="h-4 w-4 mr-1" />
                            Favorite
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleBatchDelete}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {filteredAndSortedImages.length} of {images.length} images
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                                      toggleFavorite(image.image_id.toString())
                                    }}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                                    />
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
                                {image.isFavorite && (
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                                )}
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
                                <span>{new Date(image.timestamp || Date.now()).toLocaleDateString()}</span>
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
                                  {image.isFavorite && (
                                    <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                                  )}
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
                                  <span>{new Date(image.timestamp || Date.now()).toLocaleDateString()}</span>
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

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleFavorite(image.image_id.toString())}
                                >
                                  <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
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
            )}
          </div>

          {/* AI Upscaler Dialog */}
          <Dialog open={!!selectedImageForUpscale} onOpenChange={() => setSelectedImageForUpscale(null)}>
            <DialogContent className="max-w-4xl">
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
