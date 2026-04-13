"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { WaifuImage, Collections } from "@/types/waifu"
import { storage } from "@/utils/localStorage"

interface StorageContextType {
  images: WaifuImage[]
  addImage: (image: WaifuImage) => boolean
  removeImage: (imageId: string | number) => boolean
  updateImage: (imageId: string | number, updates: Partial<WaifuImage>) => boolean

  favorites: string[]
  isFavorite: (imageId: string | number) => boolean
  toggleFavorite: (imageId: string | number) => boolean
  addFavorite: (imageId: string | number) => boolean
  removeFavorite: (imageId: string | number) => boolean

  collections: Collections
  createCollection: (name: string, description?: string) => string | null
  deleteCollection: (collectionId: string) => boolean
  updateCollection: (collectionId: string, updates: Partial<any>) => boolean
  addToCollection: (collectionId: string, imageId: string | number) => boolean
  removeFromCollection: (collectionId: string, imageId: string | number) => boolean

  downloadHistory: any[]
  addDownloadRecord: (record: any) => boolean
  clearDownloadHistory: () => boolean

  exportData: () => any
  importData: (data: any) => boolean
  clearAllData: () => boolean
  getStorageStats: () => any
  isLoading: boolean
  error: string | null
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<WaifuImage[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<Collections>({})
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null)

        if (storage && typeof storage.migrateFromOldVersion === "function") {
          try {
            await storage.migrateFromOldVersion()
            console.log("[v0] Storage migration completed successfully")
          } catch (migrationError) {
            console.warn("[v0] Migration skipped or failed:", migrationError)
          }
        }

        const loadedImages = Array.isArray(storage?.getImages?.()) ? storage.getImages() : []
        const loadedFavorites = Array.isArray(storage?.getFavorites?.()) ? storage.getFavorites() : []
        const loadedCollections = typeof storage?.getCollections?.() === "object" ? storage.getCollections() : {}
        const loadedHistory = Array.isArray(storage?.getDownloadHistory?.()) ? storage.getDownloadHistory() : []

        setImages(loadedImages)
        setFavorites(loadedFavorites)
        setCollections(loadedCollections)
        setDownloadHistory(loadedHistory)

        console.log("[v0] Storage loaded successfully:", {
          images: loadedImages.length,
          favorites: loadedFavorites.length,
          collections: Object.keys(loadedCollections).length,
          history: loadedHistory.length,
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load storage data"
        console.error("[v0] Storage load error:", errorMessage, err)
        setError(errorMessage)

        setImages([])
        setFavorites([])
        setCollections({})
        setDownloadHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const addImage = useCallback((image: WaifuImage): boolean => {
    try {
      const success = storage.addImage(image)
      if (success) {
        setImages(storage.getImages())
      }
      return success
    } catch (err) {
      console.error("Failed to add image:", err)
      return false
    }
  }, [])

  const removeImage = useCallback(
    (imageId: string | number): boolean => {
      try {
        const success = storage.removeImage(imageId)
        if (success) {
          setImages(storage.getImages())
          const id = imageId.toString()
          if (favorites.includes(id)) {
            storage.removeFavorite(id)
            setFavorites(storage.getFavorites())
          }
        }
        return success
      } catch (err) {
        console.error("Failed to remove image:", err)
        return false
      }
    },
    [favorites],
  )

  const updateImage = useCallback((imageId: string | number, updates: Partial<WaifuImage>): boolean => {
    try {
      const success = storage.updateImage(imageId, updates)
      if (success) {
        setImages(storage.getImages())
      }
      return success
    } catch (err) {
      console.error("Failed to update image:", err)
      return false
    }
  }, [])

  const isFavorite = useCallback((imageId: string | number): boolean => {
    try {
      return storage.isFavorite(imageId)
    } catch {
      return false
    }
  }, [])

  const toggleFavorite = useCallback((imageId: string | number): boolean => {
    try {
      const success = storage.toggleFavorite(imageId)
      if (success) {
        setFavorites(storage.getFavorites())
      }
      return success
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
      return false
    }
  }, [])

  const addFavorite = useCallback((imageId: string | number): boolean => {
    try {
      const success = storage.addFavorite(imageId)
      if (success) {
        setFavorites(storage.getFavorites())
      }
      return success
    } catch (err) {
      console.error("Failed to add favorite:", err)
      return false
    }
  }, [])

  const removeFavorite = useCallback((imageId: string | number): boolean => {
    try {
      const success = storage.removeFavorite(imageId)
      if (success) {
        setFavorites(storage.getFavorites())
      }
      return success
    } catch (err) {
      console.error("Failed to remove favorite:", err)
      return false
    }
  }, [])

  const createCollection = useCallback((name: string, description?: string): string | null => {
    try {
      const collectionId = storage.createCollection(name, description)
      if (collectionId) {
        setCollections(storage.getCollections())
      }
      return collectionId
    } catch (err) {
      console.error("Failed to create collection:", err)
      return null
    }
  }, [])

  const deleteCollection = useCallback((collectionId: string): boolean => {
    try {
      const success = storage.deleteCollection(collectionId)
      if (success) {
        setCollections(storage.getCollections())
      }
      return success
    } catch (err) {
      console.error("Failed to delete collection:", err)
      return false
    }
  }, [])

  const updateCollection = useCallback((collectionId: string, updates: Partial<any>): boolean => {
    try {
      const success = storage.updateCollection(collectionId, updates)
      if (success) {
        setCollections(storage.getCollections())
      }
      return success
    } catch (err) {
      console.error("Failed to update collection:", err)
      return false
    }
  }, [])

  const addToCollection = useCallback((collectionId: string, imageId: string | number): boolean => {
    try {
      const success = storage.addToCollection(collectionId, imageId)
      if (success) {
        setCollections(storage.getCollections())
      }
      return success
    } catch (err) {
      console.error("Failed to add to collection:", err)
      return false
    }
  }, [])

  const removeFromCollection = useCallback((collectionId: string, imageId: string | number): boolean => {
    try {
      const success = storage.removeFromCollection(collectionId, imageId)
      if (success) {
        setCollections(storage.getCollections())
      }
      return success
    } catch (err) {
      console.error("Failed to remove from collection:", err)
      return false
    }
  }, [])

  const addDownloadRecord = useCallback((record: any): boolean => {
    try {
      const success = storage.addDownloadRecord(record)
      if (success) {
        setDownloadHistory(storage.getDownloadHistory())
      }
      return success
    } catch (err) {
      console.error("Failed to add download record:", err)
      return false
    }
  }, [])

  const clearDownloadHistory = useCallback((): boolean => {
    try {
      const success = storage.clearDownloadHistory()
      if (success) {
        setDownloadHistory([])
      }
      return success
    } catch (err) {
      console.error("Failed to clear download history:", err)
      return false
    }
  }, [])

  const exportData = useCallback(() => {
    try {
      return storage.exportData()
    } catch (err) {
      console.error("Failed to export data:", err)
      return null
    }
  }, [])

  const importData = useCallback((data: any): boolean => {
    try {
      const success = storage.importData(data)
      if (success) {
        setImages(storage.getImages())
        setFavorites(storage.getFavorites())
        setCollections(storage.getCollections())
        setDownloadHistory(storage.getDownloadHistory())
      }
      return success
    } catch (err) {
      console.error("Failed to import data:", err)
      return false
    }
  }, [])

  const clearAllData = useCallback((): boolean => {
    try {
      const success = storage.clearAllData()
      if (success) {
        setImages([])
        setFavorites([])
        setCollections({})
        setDownloadHistory([])
      }
      return success
    } catch (err) {
      console.error("Failed to clear all data:", err)
      return false
    }
  }, [])

  const getStorageStats = useCallback(() => {
    try {
      return storage.getStorageStats()
    } catch (err) {
      console.error("Failed to get storage stats:", err)
      return {
        usage: { used: 0, available: 100 * 1024 * 1024, percentage: 0 },
        counts: {
          images: images.length,
          favorites: favorites.length,
          collections: Object.keys(collections).length,
          downloadHistory: downloadHistory.length,
          userPhotos: 0,
        },
        lastUpdated: new Date().toISOString(),
      }
    }
  }, [images.length, favorites.length, collections, downloadHistory.length])

  const contextValue: StorageContextType = {
    images,
    addImage,
    removeImage,
    updateImage,

    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,

    collections,
    createCollection,
    deleteCollection,
    updateCollection,
    addToCollection,
    removeFromCollection,

    downloadHistory,
    addDownloadRecord,
    clearDownloadHistory,

    exportData,
    importData,
    clearAllData,
    getStorageStats,
    isLoading,
    error,
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
