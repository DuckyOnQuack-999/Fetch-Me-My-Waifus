"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Grid, List, Download, Heart, Trash2, Edit, Eye, FolderOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import type { Collection, WaifuImage } from "@/types/waifu"
import { toast } from "sonner"

export function CollectionsPage() {
  const { collections, addCollection, updateCollection, deleteCollection, images } = useStorage()
  const { settings } = useSettings()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "created" | "updated" | "size">("name")
  const [filterBy, setFilterBy] = useState<"all" | "public" | "private">("all")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    tags: [] as string[],
    isPublic: false,
  })

  // Convert collections object to array for filtering and sorting
  const collectionsArray = useMemo(() => Object.values(collections), [collections])

  // Helper function to get images for a collection
  const getCollectionImages = (collection: Collection): WaifuImage[] => {
    return collection.imageIds?.map((id) => images[id]).filter(Boolean) || []
  }

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    return collectionsArray
      .filter((collection) => {
        const matchesSearch =
          collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (collection.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (collection.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesFilter =
          filterBy === "all" ||
          (filterBy === "public" && collection.isPublic) ||
          (filterBy === "private" && !collection.isPublic)

        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name)
          case "created":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case "updated":
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          case "size":
            return (b.imageIds?.length || 0) - (a.imageIds?.length || 0)
          default:
            return 0
        }
      })
  }, [collectionsArray, searchQuery, filterBy, sortBy])

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast.error("Collection name is required")
      return
    }

    const collection: Omit<Collection, "id" | "createdAt" | "updatedAt"> = {
      name: newCollection.name.trim(),
      description: newCollection.description.trim(),
      tags: newCollection.tags,
      isPublic: newCollection.isPublic,
      imageIds: [],
    }

    addCollection(collection)
    setNewCollection({ name: "", description: "", tags: [], isPublic: false })
    setIsCreateDialogOpen(false)
    toast.success("Collection created successfully!")
  }

  const handleEditCollection = () => {
    if (!selectedCollection || !newCollection.name.trim()) {
      toast.error("Collection name is required")
      return
    }

    const updatedCollection: Collection = {
      ...selectedCollection,
      name: newCollection.name.trim(),
      description: newCollection.description.trim(),
      tags: newCollection.tags,
      isPublic: newCollection.isPublic,
      updatedAt: new Date().toISOString(),
    }

    updateCollection(selectedCollection.id, updatedCollection)
    setIsEditDialogOpen(false)
    setSelectedCollection(null)
    toast.success("Collection updated successfully!")
  }

  const handleDeleteCollection = (collection: Collection) => {
    if (window.confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
      deleteCollection(collection.id)
      toast.success("Collection deleted successfully!")
    }
  }

  const openEditDialog = (collection: Collection) => {
    setSelectedCollection(collection)
    setNewCollection({
      name: collection.name,
      description: collection.description || "",
      tags: collection.tags || [],
      isPublic: collection.isPublic || false,
    })
    setIsEditDialogOpen(true)
  }

  const addTagToNewCollection = (tag: string) => {
    if (tag.trim() && !newCollection.tags.includes(tag.trim())) {
      setNewCollection((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }))
    }
  }

  const removeTagFromNewCollection = (tagToRemove: string) => {
    setNewCollection((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Collections
          </h1>
          <p className="text-muted-foreground mt-1">Organize your favorite images into custom collections</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>Create a new collection to organize your favorite images.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter collection name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter collection description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newCollection.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTagFromNewCollection(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tags (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTagToNewCollection(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newCollection.isPublic}
                  onChange={(e) => setNewCollection((prev) => ({ ...prev, isPublic: e.target.checked }))}
                />
                <Label htmlFor="isPublic">Make collection public</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCollection}>Create Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="backdrop-blur-md bg-card/50 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collections Grid/List */}
      {filteredCollections.length === 0 ? (
        <Card className="backdrop-blur-md bg-card/50 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Create your first collection to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCollections.map((collection) => {
            const collectionImages = getCollectionImages(collection)
            const imageCount = collectionImages.length
            const previewImages = collectionImages.slice(0, 4)

            return (
              <Card
                key={collection.id}
                className="backdrop-blur-md bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {collection.name}
                      </CardTitle>
                      {collection.description && (
                        <CardDescription className="mt-1 line-clamp-2">{collection.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(collection)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCollection(collection)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  {/* Image Preview Grid */}
                  <div className="grid grid-cols-2 gap-1 mb-3 aspect-square rounded-lg overflow-hidden bg-muted/20">
                    {previewImages.length > 0 ? (
                      previewImages.map((image, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex items-center justify-center h-full text-muted-foreground">
                        <FolderOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {collection.tags && collection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {collection.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {collection.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{collection.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{imageCount} images</span>
                    <div className="flex items-center gap-2">
                      {collection.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
                      <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Update your collection details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={newCollection.name}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter collection name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newCollection.description}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter collection description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newCollection.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTagFromNewCollection(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTagToNewCollection(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isPublic"
                checked={newCollection.isPublic}
                onChange={(e) => setNewCollection((prev) => ({ ...prev, isPublic: e.target.checked }))}
              />
              <Label htmlFor="edit-isPublic">Make collection public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCollection}>Update Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
