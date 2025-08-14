"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WaifuImage, Collections } from "@/types/waifu"
import { storage } from "@/utils/localStorage"
import { toast } from "sonner"

interface StorageContextType {
  // Data
  images: WaifuImage[]
  favorites: string[]
  collections: Collections
  downloadHistory: any[]
  isLoading: boolean
  error: string | null

  // Image operations
  addImage: (image: WaifuImage) => Promise<boolean>
  removeImage: (imageId: string | number) => Promise<boolean>
  updateImage: (imageId: string | number, updates: Partial<WaifuImage>) => Promise<boolean>
  getImage: (imageId: string | number) => WaifuImage | null

  // Favorite operations
  addFavorite: (imageId: string | number) => Promise<boolean>
  removeFavorite: (imageId: string | number) => Promise<boolean>
  toggleFavorite: (imageId: string | number) => Promise<boolean>
  isFavorite: (imageId: string | number) => boolean
  getFavoriteImages: () => WaifuImage[]

  // Collection operations
  createCollection: (name: string, description?: string) => Promise<string | null>
  deleteCollection: (collectionId: string) => Promise<boolean>
  updateCollection: (collectionId: string, updates: any) => Promise<boolean>
  addToCollection: (collectionId: string, imageId: string | number) => Promise<boolean>
  removeFromCollection: (collectionId: string, imageId: string | number) => Promise<boolean>
  getCollectionImages: (collectionId: string) => WaifuImage[]

  // Download history operations
  addToDownloadHistory: (item: any) => Promise<boolean>
  clearDownloadHistory: () => Promise<boolean>

  // Bulk operations
  refreshData: () => Promise<void>
  exportData: () => any
  importData: (data: any) => Promise<boolean>
  clearAllData: () => Promise<boolean>

  // Statistics
  getStorageStats: () => any
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<WaifuImage[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<Collections>({})
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on mount
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load all data concurrently
      const [loadedImages, loadedFavorites, loadedCollections, loadedHistory] = await Promise.all([
        Promise.resolve(storage.getImages()),
        Promise.resolve(storage.getFavorites()),
        Promise.resolve(storage.getCollections()),
        Promise.resolve(storage.getDownloadHistory()),
      ])

      setImages(loadedImages || [])
      setFavorites(loadedFavorites || [])
      setCollections(loadedCollections || {})
      setDownloadHistory(loadedHistory || [])
    } catch (err) {
      console.error("Failed to load storage data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")

      // Set safe defaults
      setImages([])
      setFavorites([])
      setCollections({})
      setDownloadHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  // Image operations
  const addImage = async (image: WaifuImage): Promise<boolean> => {
    try {
      const success = storage.addImage(image)
      if (success) {
        setImages(storage.getImages())
        toast.success(`Added image: ${image.image_id}`)
      }
      return success
    } catch (err) {
      console.error("Failed to add image:", err)
      toast.error("Failed to add image")
      return false
    }
  }

  const removeImage = async (imageId: string | number): Promise<boolean> => {
    try {
      const success = storage.removeImage(imageId)
      if (success) {
        setImages(storage.getImages())
        // Also remove from favorites if it exists
        if (storage.isFavorite(imageId)) {
          storage.removeFavorite(imageId)
          setFavorites(storage.getFavorites())
        }
        toast.success("Image removed")
      }
      return success
    } catch (err) {
      console.error("Failed to remove image:", err)
      toast.error("Failed to remove image")
      return false
    }
  }

  const updateImage = async (imageId: string | number, updates: Partial<WaifuImage>): Promise<boolean> => {
    try {
      const success = storage.updateImage(imageId, updates)
      if (success) {
        setImages(storage.getImages())
        toast.success("Image updated")
      }
      return success
    } catch (err) {
      console.error("Failed to update image:", err)
      toast.error("Failed to update image")
      return false
    }
  }

  const getImage = (imageId: string | number): WaifuImage | null => {
    return images.find((img) => img.image_id.toString() === imageId.toString()) || null
  }

  // Favorite operations
  const addFavorite = async (imageId: string | number): Promise<boolean> => {
    try {
      const success = storage.addFavorite(imageId)
      if (success) {
        setFavorites(storage.getFavorites())
        toast.success("Added to favorites")
      }
      return success
    } catch (err) {
      console.error("Failed to add favorite:", err)
      toast.error("Failed to add to favorites")
      return false
    }
  }

  const removeFavorite = async (imageId: string | number): Promise<boolean> => {
    try {
      const success = storage.removeFavorite(imageId)
      if (success) {
        setFavorites(storage.getFavorites())
        toast.success("Removed from favorites")
      }
      return success
    } catch (err) {
      console.error("Failed to remove favorite:", err)
      toast.error("Failed to remove from favorites")
      return false
    }
  }

  const toggleFavorite = async (imageId: string | number): Promise<boolean> => {
    try {
      const success = storage.toggleFavorite(imageId)
      if (success) {
        setFavorites(storage.getFavorites())
        const isFav = storage.isFavorite(imageId)
        toast.success(isFav ? "Added to favorites" : "Removed from favorites")
      }
      return success
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
      toast.error("Failed to update favorites")
      return false
    }
  }

  const isFavorite = (imageId: string | number): boolean => {
    return favorites.includes(imageId.toString())
  }

  const getFavoriteImages = (): WaifuImage[] => {
    return images.filter((img) => favorites.includes(img.image_id.toString()))
  }

  // Collection operations
  const createCollection = async (name: string, description?: string): Promise<string | null> => {
    try {
      const collectionId = storage.createCollection(name, description)
      if (collectionId) {
        setCollections(storage.getCollections())
        toast.success(`Created collection: ${name}`)
      }
      return collectionId
    } catch (err) {
      console.error("Failed to create collection:", err)
      toast.error("Failed to create collection")
      return null
    }
  }

  const deleteCollection = async (collectionId: string): Promise<boolean> => {
    try {
      const success = storage.deleteCollection(collectionId)
      if (success) {
        setCollections(storage.getCollections())
        toast.success("Collection deleted")
      }
      return success
    } catch (err) {
      console.error("Failed to delete collection:", err)
      toast.error("Failed to delete collection")
      return false
    }
  }

  const updateCollection = async (collectionId: string, updates: any): Promise<boolean> => {
    try {
      const success = storage.updateCollection(collectionId, updates)
      if (success) {
        setCollections(storage.getCollections())
        toast.success("Collection updated")
      }
      return success
    } catch (err) {
      console.error("Failed to update collection:", err)
      toast.error("Failed to update collection")
      return false
    }
  }

  const addToCollection = async (collectionId: string, imageId: string | number): Promise<boolean> => {
    try {
      const success = storage.addToCollection(collectionId, imageId)
      if (success) {
        setCollections(storage.getCollections())
        toast.success("Added to collection")
      }
      return success
    } catch (err) {
      console.error("Failed to add to collection:", err)
      toast.error("Failed to add to collection")
      return false
    }
  }

  const removeFromCollection = async (collectionId: string, imageId: string | number): Promise<boolean> => {
    try {
      const success = storage.removeFromCollection(collectionId, imageId)
      if (success) {
        setCollections(storage.getCollections())
        toast.success("Removed from collection")
      }
      return success
    } catch (err) {
      console.error("Failed to remove from collection:", err)
      toast.error("Failed to remove from collection")
      return false
    }
  }

  const getCollectionImages = (collectionId: string): WaifuImage[] => {
    const collection = collections[collectionId]
    if (!collection) return []

    return images.filter((img) => collection.imageIds.includes(img.image_id.toString()))
  }

  // Download history operations
  const addToDownloadHistory = async (item: any): Promise<boolean> => {
    try {
      const success = storage.addToDownloadHistory(item)
      if (success) {
        setDownloadHistory(storage.getDownloadHistory())
      }
      return success
    } catch (err) {
      console.error("Failed to add to download history:", err)
      return false
    }
  }

  const clearDownloadHistory = async (): Promise<boolean> => {
    try {
      const success = storage.clearDownloadHistory()
      if (success) {
        setDownloadHistory([])
        toast.success("Download history cleared")
      }
      return success
    } catch (err) {
      console.error("Failed to clear download history:", err)
      toast.error("Failed to clear download history")
      return false
    }
  }

  // Bulk operations
  const exportData = () => {
    try {
      return storage.exportData()
    } catch (err) {
      console.error("Failed to export data:", err)
      toast.error("Failed to export data")
      return null
    }
  }

  const importData = async (data: any): Promise<boolean> => {
    try {
      const success = storage.importData(data)
      if (success) {
        await refreshData()
        toast.success("Data imported successfully")
      }
      return success
    } catch (err) {
      console.error("Failed to import data:", err)
      toast.error("Failed to import data")
      return false
    }
  }

  const clearAllData = async (): Promise<boolean> => {
    try {
      const success = storage.clearAllData()
      if (success) {
        setImages([])
        setFavorites([])
        setCollections({})
        setDownloadHistory([])
        toast.success("All data cleared")
      }
      return success
    } catch (err) {
      console.error("Failed to clear all data:", err)
      toast.error("Failed to clear data")
      return false
    }
  }

  const getStorageStats = () => {
    try {
      return storage.getStorageStats()
    } catch (err) {
      console.error("Failed to get storage stats:", err)
      return null
    }
  }

  const contextValue: StorageContextType = {
    // Data
    images,
    favorites,
    collections,
    downloadHistory,
    isLoading,
    error,

    // Image operations
    addImage,
    removeImage,
    updateImage,
    getImage,

    // Favorite operations
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteImages,

    // Collection operations
    createCollection,
    deleteCollection,
    updateCollection,
    addToCollection,
    removeFromCollection,
    getCollectionImages,

    // Download history operations
    addToDownloadHistory,
    clearDownloadHistory,

    // Bulk operations
    refreshData,
    exportData,
    importData,
    clearAllData,

    // Statistics
    getStorageStats,
  }

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
