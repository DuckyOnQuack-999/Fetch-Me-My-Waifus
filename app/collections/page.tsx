"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FolderOpen, Edit, Trash2, ImageIcon, Search, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { toast } from "sonner"
import type { Collection } from "@/types/waifu"

export default function Collections() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>
          <CollectionsPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function CollectionsPage() {
  const {
    images,
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
  } = useStorage()
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    tags: "",
  })

  const collectionsArray = useMemo(() => {
    return Object.values(collections)
  }, [collections])

  const filteredCollections = useMemo(() => {
    return collectionsArray.filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (collection.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [collectionsArray, searchTerm])

  const collectionImages = useMemo(() => {
    if (!selectedCollection) return []
    return images.filter((image) => selectedCollection.imageIds.includes(image.image_id.toString()))
  }, [selectedCollection, images])

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast.error("Collection name is required")
      return
    }

    const collectionId = createCollection(newCollection.name.trim(), newCollection.description.trim())

    if (collectionId) {
      // Update with tags if provided
      if (newCollection.tags.trim()) {
        const tags = newCollection.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
        updateCollection(collectionId, { tags })
      }

      setNewCollection({ name: "", description: "", tags: "" })
      setIsCreateDialogOpen(false)
      toast.success("Collection created successfully")
    }
  }

  const handleUpdateCollection = () => {
    if (!editingCollection || !editingCollection.name.trim()) {
      toast.error("Collection name is required")
      return
    }

    updateCollection(editingCollection.id, editingCollection)
    setEditingCollection(null)
    toast.success("Collection updated successfully")
  }

  const handleDeleteCollection = (collectionId: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      deleteCollection(collectionId)
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null)
      }
      toast.success("Collection deleted successfully")
    }
  }

  const handleRemoveImageFromCollection = (imageId: string) => {
    if (selectedCollection) {
      removeFromCollection(selectedCollection.id, imageId)
      toast.success("Image removed from collection")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderOpen className="h-8 w-8 text-primary" />
            Collections
          </h1>
          <p className="text-muted-foreground">Organize your images into custom collections</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{collectionsArray.length} collections</Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter collection name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter collection description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                    value={newCollection.tags}
                    onChange={(e) => setNewCollection((prev) => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCollection}>Create Collection</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {collectionsArray.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground mb-4">Create your first collection to organize your images.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCollections.map((collection) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{collection.name}</CardTitle>
                        {collection.description && (
                          <CardDescription className="mt-1">{collection.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingCollection(collection)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCollection(collection.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Collection Preview */}
                      <div className="grid grid-cols-3 gap-2 h-24">
                        {collection.imageIds.slice(0, 3).map((imageId) => {
                          const image = images.find((img) => img.image_id.toString() === imageId)
                          return image ? (
                            <div key={imageId} className="aspect-square rounded overflow-hidden bg-muted">
                              <img
                                src={image.url || "/placeholder.svg?height=80&width=80"}
                                alt={image.filename || "Image"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              key={imageId}
                              className="aspect-square rounded bg-muted flex items-center justify-center"
                            >
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )
                        })}
                        {collection.imageIds.length === 0 && (
                          <div className="col-span-3 flex items-center justify-center h-full bg-muted rounded">
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No images</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Collection Stats */}
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{collection.imageIds.length} images</Badge>
                        <Button size="sm" onClick={() => setSelectedCollection(collection)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Collection
                        </Button>
                      </div>

                      {/* Tags */}
                      {collection.tags && collection.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Collection Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          {editingCollection && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Collection Name</Label>
                <Input
                  id="edit-name"
                  value={editingCollection.name}
                  onChange={(e) => setEditingCollection((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCollection.description || ""}
                  onChange={(e) =>
                    setEditingCollection((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags</Label>
                <Input
                  id="edit-tags"
                  value={(editingCollection.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditingCollection((prev) =>
                      prev
                        ? {
                            ...prev,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCollection(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCollection}>Update Collection</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Collection View Dialog */}
      <Dialog open={!!selectedCollection} onOpenChange={() => setSelectedCollection(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{selectedCollection?.name}</DialogTitle>
            {selectedCollection?.description && (
              <p className="text-muted-foreground">{selectedCollection.description}</p>
            )}
          </DialogHeader>
          {selectedCollection && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{collectionImages.length} images</Badge>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/gallery?collection=${selectedCollection.id}`
                  }}
                >
                  View in Gallery
                </Button>
              </div>

              {collectionImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">This collection is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                  {collectionImages.map((image) => (
                    <div key={image.image_id} className="group relative aspect-square rounded overflow-hidden">
                      <img
                        src={image.url || "/placeholder.svg?height=150&width=150"}
                        alt={image.filename || "Image"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImageFromCollection(image.image_id.toString())}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
