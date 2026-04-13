"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FolderPlus, Folder, Search, Grid3X3, List, Eye, Edit, Trash2, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { toast } from "sonner"

interface Collection {
  id: string
  name: string
  description: string
  imageIds: string[]
  createdAt: Date
  updatedAt: Date
}

export function CollectionsPage() {
  const { images } = useStorage()
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
  })

  const filteredCollections = useMemo(() => {
    return collections.filter(
      (collection) =>
        searchTerm === "" ||
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [collections, searchTerm])

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast.error("Collection name is required")
      return
    }

    const collection: Collection = {
      id: `collection_${Date.now()}`,
      name: newCollection.name.trim(),
      description: newCollection.description.trim(),
      imageIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCollections((prev) => [...prev, collection])
    setNewCollection({ name: "", description: "" })
    setIsCreateDialogOpen(false)
    toast.success("Collection created successfully!")
  }

  const handleDeleteCollection = (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) {
      return
    }

    setCollections((prev) => prev.filter((c) => c.id !== collectionId))
    toast.success("Collection deleted successfully!")
  }

  const getCollectionImages = (collection: Collection) => {
    return images.filter((img) => collection.imageIds.includes(img.image_id))
  }

  const getCollectionThumbnail = (collection: Collection) => {
    const collectionImages = getCollectionImages(collection)
    return collectionImages[0]?.url || "/placeholder.svg?height=200&width=200"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-6 w-6 text-primary" />
              Collections
              <Badge variant="secondary">{collections.length} collections</Badge>
            </CardTitle>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FolderPlus className="h-4 w-4" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="collection-name">Name</Label>
                    <Input
                      id="collection-name"
                      placeholder="Enter collection name"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collection-description">Description</Label>
                    <Textarea
                      id="collection-description"
                      placeholder="Enter collection description (optional)"
                      value={newCollection.description}
                      onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
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
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
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

      {/* Collections Grid/List */}
      {filteredCollections.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {collections.length === 0 ? "No collections yet" : "No matching collections"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {collections.length === 0
                ? "Create your first collection to organize your images!"
                : "Try adjusting your search criteria."}
            </p>
            {collections.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Collection
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredCollections.map((collection, index) => {
              const collectionImages = getCollectionImages(collection)
              const thumbnail = getCollectionThumbnail(collection)

              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <Card className="group cursor-pointer transition-all hover:shadow-lg">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                          {collectionImages.length > 0 ? (
                            <img
                              src={thumbnail || "/placeholder.svg"}
                              alt={collection.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Handle edit
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCollection(collection.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold truncate">{collection.name}</h4>
                            <Badge variant="secondary">{collectionImages.length}</Badge>
                          </div>

                          {collection.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{collection.description}</p>
                          )}

                          <div className="text-xs text-muted-foreground">
                            Created {collection.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="group cursor-pointer transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            {collectionImages.length > 0 ? (
                              <img
                                src={thumbnail || "/placeholder.svg"}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{collection.name}</h4>
                              <Badge variant="secondary">{collectionImages.length} images</Badge>
                            </div>

                            {collection.description && (
                              <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                                {collection.description}
                              </p>
                            )}

                            <div className="text-xs text-muted-foreground">
                              Created {collection.createdAt.toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCollection(collection.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
