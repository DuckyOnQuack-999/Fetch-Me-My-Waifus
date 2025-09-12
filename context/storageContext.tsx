"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WaifuImage, Collections } from "@/types/waifu"
import { storage } from "@/utils/localStorage"

interface StorageContextType {
  // Images
  images: WaifuImage[]
  addImage: (image: WaifuImage) => boolean
  removeImage: (imageId: string | number) => boolean
  updateImage: (imageId: string | number, updates: Partial<WaifuImage>) => boolean

  // Favorites
  favorites: string[]
  isFavorite: (imageId: string | number) => boolean
  toggleFavorite: (imageId: string | number) => boolean
  addFavorite: (imageId: string | number) => boolean
  removeFavorite: (imageId: string | number) => boolean

  // Collections
  collections: Collections
  createCollection: (name: string, description?: string) => string | null
  deleteCollection: (collectionId: string) => boolean
  updateCollection: (collectionId: string, updates: Partial<any>) => boolean
  addToCollection: (collectionId: string, imageId: string | number) => boolean
  removeFromCollection: (collectionId: string, imageId: string | number) => boolean

  // Download History
  downloadHistory: any[]
  addDownloadRecord: (record: any) => boolean
  clearDownloadHistory: () => boolean

  // Utility
  exportData: () => any
  importData: (data: any) => boolean
  clearAllData: () => boolean
  getStorageStats: () => any
  isLoading: boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<WaifuImage[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<Collections>({})
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Migrate from old version if needed
        storage.migrateFromOldVersion()

        // Load all data
        const loadedImages = storage.getImages()
        const loadedFavorites = storage.getFavorites()
        const loadedCollections = storage.getCollections()
        const loadedHistory = storage.getDownloadHistory()

        setImages(loadedImages)
        setFavorites(loadedFavorites)
        setCollections(loadedCollections)
        setDownloadHistory(loadedHistory)
      } catch (error) {
        console.error("Failed to load storage data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Image management
  const addImage = (image: WaifuImage): boolean => {
    const success = storage.addImage(image)
    if (success) {
      setImages(storage.getImages())
    }
    return success
  }

  const removeImage = (imageId: string | number): boolean => {
    const success = storage.removeImage(imageId)
    if (success) {
      setImages(storage.getImages())
      // Also remove from favorites if it exists
      const id = imageId.toString()
      if (favorites.includes(id)) {
        storage.removeFavorite(id)
        setFavorites(storage.getFavorites())
      }
    }
    return success
  }

  const updateImage = (imageId: string | number, updates: Partial<WaifuImage>): boolean => {
    const success = storage.updateImage(imageId, updates)
    if (success) {
      setImages(storage.getImages())
    }
    return success
  }

  // Favorites management
  const isFavorite = (imageId: string | number): boolean => {
    return storage.isFavorite(imageId)
  }

  const toggleFavorite = (imageId: string | number): boolean => {
    const success = storage.toggleFavorite(imageId)
    if (success) {
      setFavorites(storage.getFavorites())
    }
    return success
  }

  const addFavorite = (imageId: string | number): boolean => {
    const success = storage.addFavorite(imageId)
    if (success) {
      setFavorites(storage.getFavorites())
    }
    return success
  }

  const removeFavorite = (imageId: string | number): boolean => {
    const success = storage.removeFavorite(imageId)
    if (success) {
      setFavorites(storage.getFavorites())
    }
    return success
  }

  // Collections management
  const createCollection = (name: string, description?: string): string | null => {
    const collectionId = storage.createCollection(name, description)
    if (collectionId) {
      setCollections(storage.getCollections())
    }
    return collectionId
  }

  const deleteCollection = (collectionId: string): boolean => {
    const success = storage.deleteCollection(collectionId)
    if (success) {
      setCollections(storage.getCollections())
    }
    return success
  }

  const updateCollection = (collectionId: string, updates: Partial<any>): boolean => {
    const success = storage.updateCollection(collectionId, updates)
    if (success) {
      setCollections(storage.getCollections())
    }
    return success
  }

  const addToCollection = (collectionId: string, imageId: string | number): boolean => {
    const success = storage.addToCollection(collectionId, imageId)
    if (success) {
      setCollections(storage.getCollections())
    }
    return success
  }

  const removeFromCollection = (collectionId: string, imageId: string | number): boolean => {
    const success = storage.removeFromCollection(collectionId, imageId)
    if (success) {
      setCollections(storage.getCollections())
    }
    return success
  }

  // Download history management
  const addDownloadRecord = (record: any): boolean => {
    const success = storage.addDownloadRecord(record)
    if (success) {
      setDownloadHistory(storage.getDownloadHistory())
    }
    return success
  }

  const clearDownloadHistory = (): boolean => {
    const success = storage.clearDownloadHistory()
    if (success) {
      setDownloadHistory([])
    }
    return success
  }

  // Utility functions
  const exportData = () => {
    return storage.exportData()
  }

  const importData = (data: any): boolean => {
    const success = storage.importData(data)
    if (success) {
      // Reload all data
      setImages(storage.getImages())
      setFavorites(storage.getFavorites())
      setCollections(storage.getCollections())
      setDownloadHistory(storage.getDownloadHistory())
    }
    return success
  }

  const clearAllData = (): boolean => {
    const success = storage.clearAllData()
    if (success) {
      setImages([])
      setFavorites([])
      setCollections({})
      setDownloadHistory([])
    }
    return success
  }

  const getStorageStats = () => {
    return storage.getStorageStats()
  }

  const contextValue: StorageContextType = {
    // Images
    images,
    addImage,
    removeImage,
    updateImage,

    // Favorites
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,

    // Collections
    collections,
    createCollection,
    deleteCollection,
    updateCollection,
    addToCollection,
    removeFromCollection,

    // Download History
    downloadHistory,
    addDownloadRecord,
    clearDownloadHistory,

    // Utility
    exportData,
    importData,
    clearAllData,
    getStorageStats,
    isLoading,
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
