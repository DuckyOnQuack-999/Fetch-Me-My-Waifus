"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Download, Trash2, FolderPlus, Wand2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { toast } from "sonner"

interface BatchOperationsPanelProps {
  selectedImages: string[]
  onClearSelection: () => void
}

export function BatchOperationsPanel({ selectedImages, onClearSelection }: BatchOperationsPanelProps) {
  const { images, toggleFavorite, removeImage, createCollection, addToCollection, collections } = useStorage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingOperation, setProcessingOperation] = useState("")
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  const selectedImageObjects = images.filter((img) => selectedImages.includes(img.image_id.toString()))

  const handleBatchFavorite = async () => {
    setIsProcessing(true)
    setProcessingOperation("Adding to favorites...")
    setProcessingProgress(0)

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate processing time
        toggleFavorite(selectedImages[i])
        setProcessingProgress(((i + 1) / selectedImages.length) * 100)
      }
      toast.success(`Added ${selectedImages.length} images to favorites`)
      onClearSelection()
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleBatchDownload = async () => {
    setIsProcessing(true)
    setProcessingOperation("Downloading images...")
    setProcessingProgress(0)

    try {
      for (let i = 0; i < selectedImageObjects.length; i++) {
        const image = selectedImageObjects[i]
        await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate download time

        // Create download link
        const link = document.createElement("a")
        link.href = image.url
        link.download = image.filename || `image-${image.image_id}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setProcessingProgress(((i + 1) / selectedImageObjects.length) * 100)
      }
      toast.success(`Downloaded ${selectedImages.length} images`)
      onClearSelection()
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleBatchDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
      return
    }

    setIsProcessing(true)
    setProcessingOperation("Deleting images...")
    setProcessingProgress(0)

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate processing time
        removeImage(selectedImages[i])
        setProcessingProgress(((i + 1) / selectedImages.length) * 100)
      }
      toast.success(`Deleted ${selectedImages.length} images`)
      onClearSelection()
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleBatchUpscale = async () => {
    setIsProcessing(true)
    setProcessingOperation("Upscaling images...")
    setProcessingProgress(0)

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate upscaling time
        setProcessingProgress(((i + 1) / selectedImages.length) * 100)
      }
      toast.success(`Upscaled ${selectedImages.length} images`)
      onClearSelection()
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error("Collection name is required")
      return
    }

    const collection = createCollection({
      name: newCollectionName.trim(),
      description: `Collection with ${selectedImages.length} images`,
      imageIds: selectedImages,
      tags: [],
      isPublic: false,
    })

    toast.success(`Created collection "${newCollectionName}" with ${selectedImages.length} images`)
    setNewCollectionName("")
    setShowCreateCollection(false)
    onClearSelection()
  }

  const handleAddToCollection = (collectionId: string) => {
    selectedImages.forEach((imageId) => {
      addToCollection(collectionId, imageId)
    })

    const collection = collections[collectionId]
    toast.success(`Added ${selectedImages.length} images to "${collection?.name}"`)
    onClearSelection()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedImages.length} selected</Badge>
                  Batch Operations
                </CardTitle>
                <CardDescription>Perform actions on multiple images at once</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="font-medium">{processingOperation}</p>
                  <Progress value={processingProgress} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">{Math.round(processingProgress)}% complete</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleBatchFavorite}>
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>

                <Button size="sm" onClick={handleBatchDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>

                <Button size="sm" onClick={handleBatchUpscale}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Upscale
                </Button>

                <Dialog open={showCreateCollection} onOpenChange={setShowCreateCollection}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Collection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="collection-name">Collection Name</Label>
                        <Input
                          id="collection-name"
                          placeholder="Enter collection name"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateCollection(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateCollection}>Create Collection</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {Object.keys(collections).length > 0 && (
                  <Select onValueChange={handleAddToCollection}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add to collection..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(collections).map((collection) => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button size="sm" variant="destructive" onClick={handleBatchDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
