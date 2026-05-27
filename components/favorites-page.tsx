"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Heart, Search, Grid3X3, List, Eye, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { EnhancedImagePreview } from "./enhanced-image-preview"
import { toast } from "sonner"
import type { WaifuImage } from "@/types/waifu"

function getTagName(tag: string | { name: string }): string {
  return typeof tag === "string" ? tag : tag?.name ?? ""
}

function getImageFilename(image: WaifuImage): string {
  if (image.filename) return image.filename
  const urlPart = image.url?.split("/").pop()?.split("?")[0]
  return urlPart || `image-${image.image_id}`
}

export function FavoritesPage() {
  const { images, favorites, toggleFavorite, isFavorite } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Use the favorites ID list as source of truth, then look up images
  const favoriteImages = useMemo(() => {
    const favSet = new Set(favorites.map(String))
    return images.filter((img) => favSet.has(String(img.image_id)))
  }, [images, favorites])

  const filteredFavorites = useMemo(() => {
    if (!searchTerm) return favoriteImages
    const lower = searchTerm.toLowerCase()
    return favoriteImages.filter((image) => {
      const filename = getImageFilename(image).toLowerCase()
      const tagMatch = (image.tags ?? []).some((tag) => getTagName(tag).toLowerCase().includes(lower))
      return filename.includes(lower) || tagMatch
    })
  }, [favoriteImages, searchTerm])

  const handleDownload = async (image: WaifuImage) => {
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(image.url)}`)
      if (!response.ok) throw new Error("Download failed")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getImageFilename(image)
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully")
    } catch {
      toast.error("Failed to download image")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Favorite Images
            <Badge variant="secondary">{favoriteImages.length} favorites</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredFavorites.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {favoriteImages.length === 0 ? "No favorites yet" : "No matching favorites"}
            </h3>
            <p className="text-muted-foreground">
              {favoriteImages.length === 0
                ? "Browse the gallery and heart images to add them here."
                : "Try adjusting your search."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grid / List */}
      {filteredFavorites.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredFavorites.map((image, index) => {
              const filename = getImageFilename(image)
              const tags = (image.tags ?? []).map(getTagName)
              const dateStr = image.uploaded_at || image.created_at || image.lastModified
              const dateLabel = dateStr ? new Date(dateStr).toLocaleDateString() : ""

              return (
                <motion.div
                  key={image.image_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <Card className="group cursor-pointer transition-all hover:shadow-lg">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={image.preview_url || image.url}
                            alt={filename}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(image.image_id) }}
                              >
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={(e) => { e.stopPropagation(); handleDownload(image) }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">{filename}</h4>
                            <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                            {tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{tags.length - 2}</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{image.source ?? image.fetchedFrom ?? ""}</span>
                            <span>{dateLabel}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="group hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <img
                              src={image.preview_url || image.url}
                              alt={filename}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{filename}</h4>
                              <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                            </div>
                            <div className="flex flex-wrap gap-1 mb-1">
                              {tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                              {tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{tags.length - 3}</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex gap-4">
                              <span>{image.source ?? image.fetchedFrom ?? ""}</span>
                              <span>{dateLabel}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <EnhancedImagePreview
                                  image={image}
                                  toggleFavorite={toggleFavorite}
                                  isFavorite={isFavorite}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline" onClick={() => handleDownload(image)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleFavorite(image.image_id)}>
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
