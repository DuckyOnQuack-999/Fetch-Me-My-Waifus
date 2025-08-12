"use client"

import { useState, useEffect } from "react"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { CollectionsTab } from "./collections-tab"
import { fetchImagesFromMultipleSources } from "@/services/waifuApi"
import type { WaifuImage } from "@/types/waifu"
import { toast } from "sonner"

export function CollectionsPage() {
  const storage = useStorage()
  const { settings } = useSettings()
  const [collections, setCollections] = useState(storage.getCollections())
  const [images, setImages] = useState<WaifuImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true)
        const fetchedImages = await fetchImagesFromMultipleSources(
          "waifu",
          50,
          settings.allowNsfw,
          "RANDOM",
          1,
          undefined,
          undefined,
          settings,
        )
        setImages(fetchedImages)
      } catch (error) {
        console.error("Failed to load images:", error)
        toast.error("Failed to load images")
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [settings])

  const handleCreateCollection = (name: string) => {
    const id = storage.createCollection(name)
    setCollections(storage.getCollections())
    toast.success(`Collection "${name}" created`)
  }

  const handleDeleteCollection = (id: string) => {
    const collection = collections[id]
    storage.deleteCollection(id)
    setCollections(storage.getCollections())
    toast.success(`Collection "${collection?.name}" deleted`)
  }

  const handleAddToCollection = (collectionId: string, imageId: string) => {
    storage.addToCollection(collectionId, imageId)
    setCollections(storage.getCollections())
    toast.success("Image added to collection")
  }

  const handleRemoveFromCollection = (collectionId: string, imageId: string) => {
    storage.removeFromCollection(collectionId, imageId)
    setCollections(storage.getCollections())
    toast.success("Image removed from collection")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading collections...</p>
        </div>
      </div>
    )
  }

  return (
    <CollectionsTab
      collections={collections}
      onCreateCollection={handleCreateCollection}
      onDeleteCollection={handleDeleteCollection}
      onAddToCollection={handleAddToCollection}
      onRemoveFromCollection={handleRemoveFromCollection}
      images={images}
    />
  )
}
