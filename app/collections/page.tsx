"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FolderPlus, Search, Grid3X3, List, Edit, Trash2, Share2, ImageIcon, Plus, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { toast } from "sonner"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import type { Collection } from "@/types/waifu"

function CollectionsContent() {
  const { collections, images, createCollection, updateCollection, deleteCollection } = useStorage()

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    isPublic: false,
  })

  const collectionsArray = Object.values(collections || {})

  // Filter collections based on search
  const filteredCollections = collectionsArray.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast.error("Collection name is required")
      return
    }

    const collectionData: Omit<Collection, "id" | "created_at" | "updated_at"> = {
      name: newCollection.name.trim(),
      description: newCollection.description.trim() || undefined,
      imageIds: [],
      isPublic: newCollection.isPublic,
      tags: [],
    }

    createCollection(collectionData)
    setNewCollection({ name: "", description: "", isPublic: false })
    setIsCreateDialogOpen(false)
    toast.success("Collection created successfully!")
  }

  const handleDeleteCollection = (collectionId: string) => {
    deleteCollection(collectionId)
    toast.success("Collection deleted")
  }

  const getCollectionThumbnail = (collection: Collection) => {
    if (collection.thumbnail) return collection.thumbnail

    // Get first image from collection as thumbnail
    const firstImageId = collection.imageIds[0]
    if (firstImageId) {
      const image = images.find((img) => img.image_id.toString() === firstImageId)
      return image?.preview_url || image?.url
    }

    return null
  }

  const getCollectionImageCount = (collection: Collection) => {
    return collection.imageIds.length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderPlus className="h-8 w-8" />
            Collections
          </h1>
          <p className="text-muted-foreground">
            Organize your images into custom collections ({collectionsArray.length} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <FolderPlus className="h-3 w-3" />
            {filteredCollections.length} collections
          </Badge>
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
                <DialogDescription>Create a new collection to organize your favorite images</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collection-name">Collection Name</Label>
                  <Input
                    id="collection-name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter collection name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collection-description">Description (optional)</Label>
                  <Textarea
                    id="collection-description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your collection"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow others to view this collection</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newCollection.isPublic}
                    onChange={(e) => setNewCollection((prev) => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded"
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
      </motion.div>

      {/* Search and Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collections by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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

      {/* Collections Grid/List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {filteredCollections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderPlus className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {collectionsArray.length === 0 ? "No collections yet" : "No collections match your search"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {collectionsArray.length === 0
                  ? "Create your first collection to organize your favorite images"
                  : "Try adjusting your search criteria to find collections"}
              </p>
              {collectionsArray.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Collection
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === "grid" ? (
                  <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-muted">
                      {getCollectionThumbnail(collection) ? (
                        <img
                          src={getCollectionThumbnail(collection)! || "/placeholder.svg"}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCollection(collection.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {collection.isPublic && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            Public
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold truncate">{collection.name}</h3>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{getCollectionImageCount(collection)} images</span>
                          <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                        </div>
                        {collection.tags && collection.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {collection.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {collection.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{collection.tags.length - 2}
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
                        <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded">
                          {getCollectionThumbnail(collection) ? (
                            <img
                              src={getCollectionThumbnail(collection)! || "/placeholder.svg"}
                              alt={collection.name}
                              className="w-full h-full object-cover rounded"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          {collection.isPublic && (
                            <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs">
                              Public
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{collection.name}</h3>
                          {collection.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{collection.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{getCollectionImageCount(collection)} images</span>
                            <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
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
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteCollection(collection.id)}>
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

export default function CollectionsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>
          <CollectionsContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
