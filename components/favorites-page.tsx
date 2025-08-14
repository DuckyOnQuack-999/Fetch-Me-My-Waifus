"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStorage } from "@/context/storageContext"
import { GalleryTab } from "./gallery-tab"
import { SumptuousHeart } from "./sumptuous-heart"
import { Heart, Search, Trash2, Star } from "lucide-react"
import { toast } from "sonner"

export function FavoritesPage() {
  const { images, favorites, removeFavorite, clearAllData } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  // Get favorite images
  const favoriteImages = images.filter((image) => favorites.includes(image.id))

  // Filter favorite images based on search
  const filteredFavorites = favoriteImages.filter(
    (image) =>
      image.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      image.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.filename?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRemoveFromFavorites = (imageId: string) => {
    removeFavorite(imageId)
    toast.success("Removed from favorites")
  }

  const handleBulkRemove = () => {
    if (selectedImages.length === 0) {
      toast.error("No images selected")
      return
    }

    selectedImages.forEach((imageId) => removeFavorite(imageId))
    setSelectedImages([])
    toast.success(`Removed ${selectedImages.length} images from favorites`)
  }

  const handleClearAllFavorites = () => {
    if (favorites.length === 0) {
      toast.error("No favorites to clear")
      return
    }

    favorites.forEach((imageId) => removeFavorite(imageId))
    toast.success("Cleared all favorites")
  }

  const handleImageDownload = (image: any) => {
    // Simulate download
    toast.success(`Downloading ${image.filename || "image"}...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/20 dark:via-rose-950/20 dark:to-red-950/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-200/30 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-red-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-pink-300/30 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SumptuousHeart />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">My Favorites</h1>
            <p className="text-muted-foreground">Your curated collection of favorite images</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-pink-200/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{favorites.length}</div>
              <p className="text-xs text-muted-foreground">{favorites.length === 1 ? "image" : "images"} saved</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-rose-200/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
              <Search className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{filteredFavorites.length}</div>
              <p className="text-xs text-muted-foreground">matching your search</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-200/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selected</CardTitle>
              <Star className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{selectedImages.length}</div>
              <p className="text-xs text-muted-foreground">
                {selectedImages.length === 1 ? "image" : "images"} selected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="glass-card border-pink-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-pink-500" />
              Search & Actions
            </CardTitle>
            <CardDescription>Search through your favorites and perform bulk actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search favorites by tags, source, filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleBulkRemove}
                  disabled={selectedImages.length === 0}
                  className="glow-button bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Selected ({selectedImages.length})
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClearAllFavorites}
                  disabled={favorites.length === 0}
                  className="glow-button-danger bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {searchTerm && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="glass-badge">
                  Searching: "{searchTerm}"
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")} className="text-xs">
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites Gallery */}
        {favorites.length === 0 ? (
          <Card className="glass-card border-pink-200/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-8xl mb-6 opacity-50">💖</div>
              <h3 className="text-2xl font-bold text-gradient mb-4">No Favorites Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start exploring and click the heart icon on images you love to add them to your favorites collection.
              </p>
              <Button className="glow-button">
                <Heart className="w-4 h-4 mr-2" />
                Start Exploring
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-card border-pink-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                Favorite Images
                <Badge variant="secondary" className="ml-auto glass-badge">
                  {filteredFavorites.length} of {favorites.length}
                </Badge>
              </CardTitle>
              <CardDescription>Your personally curated collection of beautiful images</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryTab
                images={favoriteImages}
                showFavoritesOnly={false}
                onImageDownload={handleImageDownload}
                onImageSelect={(image) => {
                  // Handle image selection for preview
                  console.log("Selected image:", image)
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {favorites.length > 0 && (
          <Card className="glass-card border-rose-200/50">
            <CardHeader>
              <CardTitle className="text-lg">Collection Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gradient">{favorites.length}</div>
                  <div className="text-sm text-muted-foreground">Total Favorites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {new Set(favoriteImages.map((img) => img.source)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Sources</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {new Set(favoriteImages.map((img) => img.category)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {favoriteImages.reduce((acc, img) => acc + (img.tags?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tags</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
