"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Search, Filter, Grid3X3, List, Heart, Download, Eye, Trash2, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import type { ImageCategory } from "@/types/waifu"

function GalleryContent() {
  const { images, toggleFavorite, removeImage } = useStorage()
  const { settings } = useSettings()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | "all">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">("newest")

  // Filter images based on search and category
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      image.character?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.series?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || image.tags?.includes(selectedCategory) || image.fetchedFrom === selectedCategory

    return (searchQuery === "" || matchesSearch) && matchesCategory
  })

  // Sort images
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      case "oldest":
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      case "name":
        return (a.character || "").localeCompare(b.character || "")
      case "size":
        return (b.file_size || 0) - (a.file_size || 0)
      default:
        return 0
    }
  })

  const handleToggleFavorite = (imageId: string | number) => {
    toggleFavorite(imageId.toString())
    toast.success("Favorite status updated")
  }

  const handleRemoveImage = (imageId: string | number) => {
    removeImage(imageId.toString())
    toast.success("Image removed from gallery")
  }

  const categories = [
    { value: "all", label: "All Images" },
    { value: "waifu", label: "Waifu" },
    { value: "neko", label: "Neko" },
    { value: "shinobu", label: "Shinobu" },
    { value: "megumin", label: "Megumin" },
    { value: "anime", label: "Anime" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Browse and manage your downloaded images ({images.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <ImageIcon className="h-3 w-3" />
            {filteredImages.length} images
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Heart className="h-3 w-3" />
            {images.filter((img) => img.isFavorite).length} favorites
          </Badge>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by tags, character, or series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Gallery */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {sortedImages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {images.length === 0
                  ? "Start downloading images to see them here"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {images.length === 0 && (
                <Button className="mt-4" onClick={() => (window.location.href = "/?tab=download")}>
                  <Download className="h-4 w-4 mr-2" />
                  Start Downloading
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-4"
            }
          >
            {sortedImages.map((image, index) => (
              <motion.div
                key={image.image_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === "grid" ? (
                  <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square">
                      <img
                        src={image.preview_url || image.url}
                        alt={image.character || "Anime image"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleToggleFavorite(image.image_id)}>
                          <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-current text-red-500" : ""}`} />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveImage(image.image_id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {image.isFavorite && (
                        <div className="absolute top-2 right-2">
                          <Heart className="h-5 w-5 fill-current text-red-500" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm truncate">{image.character || image.series || "Untitled"}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {image.width}×{image.height}
                          </span>
                          {image.file_size && <span>{(image.file_size / 1024 / 1024).toFixed(1)}MB</span>}
                        </div>
                        {image.tags && image.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {image.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {image.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{image.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <img
                            src={image.preview_url || image.url}
                            alt={image.character || "Anime image"}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                          {image.isFavorite && (
                            <Heart className="absolute -top-1 -right-1 h-4 w-4 fill-current text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{image.character || image.series || "Untitled"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {image.width}×{image.height} • {image.file_format?.toUpperCase()}
                            {image.file_size && ` • ${(image.file_size / 1024 / 1024).toFixed(1)}MB`}
                          </p>
                          {image.tags && image.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {image.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
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
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" onClick={() => handleToggleFavorite(image.image_id)}>
                            <Heart className={`h-4 w-4 ${image.isFavorite ? "fill-current text-red-500" : ""}`} />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveImage(image.image_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>
          <GalleryContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
