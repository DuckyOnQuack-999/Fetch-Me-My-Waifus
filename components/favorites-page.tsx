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

export function FavoritesPage() {
  const { images, toggleFavorite } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const favoriteImages = useMemo(() => {
    return images.filter((image) => image.isFavorite)
  }, [images])

  const filteredFavorites = useMemo(() => {
    return favoriteImages.filter(
      (image) =>
        searchTerm === "" ||
        image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [favoriteImages, searchTerm])

  const handleDownload = async (image: any) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = image.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully!")
    } catch (error) {
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

      {/* Favorites Grid/List */}
      {filteredFavorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {favoriteImages.length === 0 ? "No favorites yet" : "No matching favorites"}
            </h3>
            <p className="text-muted-foreground">
              {favoriteImages.length === 0
                ? "Start adding images to your favorites to see them here!"
                : "Try adjusting your search criteria."}
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
            {filteredFavorites.map((image, index) => (
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
                          src={image.url || "/placeholder.svg"}
                          alt={image.filename}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(image.image_id)
                              }}
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(image)
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm truncate">{image.filename}</h4>
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
                          <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="group cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
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
                            <span>{new Date(image.timestamp).toLocaleDateString()}</span>
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
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
