"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, Heart, Download, Eye, Calendar, Tag, ImageIcon, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: string
  url: string
  filename: string
  category: string
  tags: string[]
  isFavorite: boolean
  downloadedAt: Date
  size: number
  dimensions: { width: number; height: number }
}

export function EnhancedImageGallery() {
  const { images } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])

  // Mock data for demonstration
  const mockImages: GalleryImage[] = [
    {
      id: "1",
      url: "/placeholder.svg?height=300&width=200",
      filename: "waifu_001.jpg",
      category: "waifu",
      tags: ["anime", "girl", "cute"],
      isFavorite: true,
      downloadedAt: new Date(),
      size: 1024000,
      dimensions: { width: 1920, height: 1080 },
    },
    {
      id: "2",
      url: "/placeholder.svg?height=300&width=200",
      filename: "neko_002.jpg",
      category: "neko",
      tags: ["cat", "girl", "kawaii"],
      isFavorite: false,
      downloadedAt: new Date(Date.now() - 86400000),
      size: 856000,
      dimensions: { width: 1600, height: 900 },
    },
    {
      id: "3",
      url: "/placeholder.svg?height=300&width=200",
      filename: "shinobu_003.jpg",
      category: "shinobu",
      tags: ["demon", "slayer", "butterfly"],
      isFavorite: true,
      downloadedAt: new Date(Date.now() - 172800000),
      size: 1200000,
      dimensions: { width: 2560, height: 1440 },
    },
  ]

  useEffect(() => {
    let filtered = [...mockImages]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((img) => img.category === selectedCategory)
    }

    // Sort images
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.downloadedAt.getTime() - a.downloadedAt.getTime())
        break
      case "oldest":
        filtered.sort((a, b) => a.downloadedAt.getTime() - b.downloadedAt.getTime())
        break
      case "name":
        filtered.sort((a, b) => a.filename.localeCompare(b.filename))
        break
      case "size":
        filtered.sort((a, b) => b.size - a.size)
        break
    }

    setFilteredImages(filtered)
  }, [searchTerm, selectedCategory, sortBy])

  const categories = ["all", "waifu", "neko", "shinobu", "megumin"]
  const favoriteCount = filteredImages.filter((img) => img.isFavorite).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Image Gallery</h2>
          <p className="text-muted-foreground">
            Browse and manage your downloaded anime images ({filteredImages.length} items)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Heart className="h-3 w-3" />
            {favoriteCount} Favorites
          </Badge>
          <Badge variant="outline" className="gap-1">
            <ImageIcon className="h-3 w-3" />
            {filteredImages.length} Total
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center gap-2">
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

      {/* Gallery Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Images</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filteredImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.filename}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                          {/* Overlay Controls */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Heart className={cn("h-4 w-4", image.isFavorite && "fill-current text-red-500")} />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              {image.category}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm truncate">{image.filename}</h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{(image.size / 1024 / 1024).toFixed(1)} MB</span>
                              <span>
                                {image.dimensions.width}×{image.dimensions.height}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {image.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {image.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{image.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.filename}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate">{image.filename}</h4>
                                {image.isFavorite && (
                                  <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {image.category}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {image.downloadedAt.toLocaleDateString()}
                                </span>
                                <span>{(image.size / 1024 / 1024).toFixed(1)} MB</span>
                                <span>
                                  {image.dimensions.width}×{image.dimensions.height}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {image.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground">Start adding images to your favorites to see them here.</p>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recent downloads</h3>
              <p className="text-muted-foreground">Your recently downloaded images will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
