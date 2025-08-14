"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Download,
  Heart,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  Settings,
  Eye,
  Share2,
  ImageIcon,
  FolderOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { useStorage } from "@/context/storageContext"
import { fetchImagesFromMultipleSources } from "@/services/waifuApi"
import type { WaifuImage, ImageCategory, Collection } from "@/types/waifu"
import { SumptuousHeart } from "./sumptuous-heart"

export function CollectionsPage() {
  const { settings } = useSettings()
  const { collections, images, createCollection, updateCollection, deleteCollection } = useStorage()
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory>("waifu")
  const [isNsfw, setIsNsfw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionDescription, setNewCollectionDescription] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [previewImage, setPreviewImage] = useState<WaifuImage | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Convert collections object to array and filter/sort
  const collectionsArray = Object.values(collections)
  const filteredCollections = collectionsArray
    .filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (collection.description && collection.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (collection.tags && collection.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
    )
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "date":
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          break
        case "size":
          comparison = a.imageIds.length - b.imageIds.length
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return

    try {
      setIsLoading(true)
      setError(null)
      setLoadingProgress(10)

      // Fetch initial images for the collection
      const fetchedImages = await fetchImagesFromMultipleSources(
        selectedCategory,
        20,
        isNsfw,
        "RANDOM",
        1,
        settings.minWidth || 800,
        settings.minHeight || 600,
        settings,
        settings.apiSource || "all",
      )

      setLoadingProgress(80)

      const collectionId = createCollection(newCollectionName, newCollectionDescription)

      if (collectionId) {
        // Add fetched images to the collection
        fetchedImages.forEach((image) => {
          // Add image to storage first, then to collection
          // This would need to be implemented in the storage context
        })

        setLoadingProgress(100)
        setNewCollectionName("")
        setNewCollectionDescription("")
        setIsCreateDialogOpen(false)
      }
    } catch (err) {
      console.error("Error creating collection:", err)
      setError(err instanceof Error ? err.message : "Failed to create collection")
    } finally {
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }

  const handleAddImagesToCollection = async (collectionId: string) => {
    if (selectedImages.size === 0) return

    try {
      setIsLoading(true)
      const collection = collections[collectionId]
      if (!collection) return

      // In a real app, you'd fetch the actual image data
      // For now, we'll just update the collection
      const updatedCollection = {
        ...collection,
        updated_at: new Date().toISOString(),
      }

      updateCollection(collectionId, updatedCollection)
      setSelectedImages(new Set())
      setIsSelectionMode(false)
    } catch (err) {
      console.error("Error adding images to collection:", err)
      setError(err instanceof Error ? err.message : "Failed to add images")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagePreview = (image: WaifuImage) => {
    setPreviewImage(image)
    setIsPreviewOpen(true)
  }

  const handleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages)
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId)
    } else {
      newSelection.add(imageId)
    }
    setSelectedImages(newSelection)
  }

  const getCollectionImages = (collection: Collection): WaifuImage[] => {
    return images.filter((img) => collection.imageIds.includes(img.image_id.toString()))
  }

  const CollectionCard = ({ collection }: { collection: Collection }) => {
    const collectionImages = getCollectionImages(collection)
    const thumbnail = collectionImages[0]?.preview_url || collectionImages[0]?.url

    return (
      <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={thumbnail || "/placeholder.svg"}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=200&width=300&text=Collection"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">
                {collection.imageIds.length} images
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                {collection.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {collection.description || "No description"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setSelectedCollection(collection)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {collection.tags && collection.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {collection.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {collection.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{collection.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(collection.updated_at).toLocaleDateString()}
            </span>
            {collection.isPublic && (
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>
    )
  }

  const ImageGrid = ({ images }: { images: WaifuImage[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {images.map((image) => (
        <Card
          key={image.image_id}
          className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
          onClick={() => handleImagePreview(image)}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={image.preview_url || image.url}
              alt={`Image ${image.image_id}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=200&text=Image+Error"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {isSelectionMode && (
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedImages.has(image.image_id.toString())}
                  onChange={() => handleImageSelection(image.image_id.toString())}
                  className="w-4 h-4 rounded border-2 border-white bg-black/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                  {image.fetchedFrom || "Unknown"}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle favorite toggle
                    }}
                  >
                    <Heart className="w-3 h-3 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle download
                    }}
                  >
                    <Download className="w-3 h-3 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <SumptuousHeart className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                Collections
              </h1>
              <p className="text-muted-foreground">Organize and manage your waifu collections</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="border-primary/20 hover:border-primary/40"
            >
              {isSelectionMode ? <CheckCircle className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              {isSelectionMode ? "Exit Selection" : "Select Mode"}
            </Button>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <SumptuousHeart className="w-5 h-5" />
                    Create New Collection
                  </DialogTitle>
                  <DialogDescription>Create a new collection to organize your favorite images</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collection-name">Collection Name</Label>
                    <Input
                      id="collection-name"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Enter collection name..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="collection-description">Description (Optional)</Label>
                    <Input
                      id="collection-description"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      placeholder="Enter collection description..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="collection-category">Initial Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value as ImageCategory)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waifu">Waifu</SelectItem>
                        <SelectItem value="neko">Neko</SelectItem>
                        <SelectItem value="maid">Maid</SelectItem>
                        <SelectItem value="uniform">Uniform</SelectItem>
                        <SelectItem value="selfies">Selfies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="nsfw-toggle" checked={isNsfw} onCheckedChange={setIsNsfw} />
                    <Label htmlFor="nsfw-toggle">Include NSFW content</Label>
                  </div>

                  {isLoading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Creating collection...</span>
                        <span>{loadingProgress}%</span>
                      </div>
                      <Progress value={loadingProgress} className="h-2" />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCollection}
                    disabled={!newCollectionName.trim() || isLoading}
                    className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Create Collection
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "date" | "size")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border-primary/20 hover:border-primary/40"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="border-primary/20 hover:border-primary/40"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        {!selectedCollection ? (
          <div>
            {filteredCollections.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Collections Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No collections match your search." : "Create your first collection to get started."}
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Create Collection
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Collection Detail View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCollection(null)}
                  className="border-primary/20 hover:border-primary/40"
                >
                  ← Back to Collections
                </Button>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                    {selectedCollection.name}
                  </h2>
                  <p className="text-muted-foreground">{selectedCollection.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/20">
                  {selectedCollection.imageIds.length} images
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:border-primary/40 bg-transparent"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ImageGrid images={getCollectionImages(selectedCollection)} />
          </div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            {previewImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewImage.url || "/placeholder.svg"}
                    alt={`Image ${previewImage.image_id}`}
                    className="w-full max-h-[60vh] object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=400&width=600&text=Image+Preview+Error"
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{previewImage.fetchedFrom || "Unknown"}</Badge>
                    {previewImage.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-pink-500">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {previewImage.width && previewImage.height && (
                  <div className="text-sm text-muted-foreground">
                    Dimensions: {previewImage.width} × {previewImage.height}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
