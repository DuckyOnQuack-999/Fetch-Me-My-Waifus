"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { storage } from "@/utils/localStorage"

interface StorageContextType {
  images: any[]
  favorites: any[]
  collections: any[]
  downloadHistory: any[]
  isLoading: boolean

  // Image operations
  addImage: (image: any) => void
  removeImage: (imageId: string) => void

  // Favorite operations
  addFavorite: (image: any) => void
  removeFavorite: (imageId: string) => void
  isFavorite: (imageId: string) => boolean

  // Collection operations
  addCollection: (collection: any) => void
  removeCollection: (collectionId: string) => void
  addImageToCollection: (collectionId: string, image: any) => void
  removeImageFromCollection: (collectionId: string, imageId: string) => void

  // Download history operations
  addDownloadRecord: (record: any) => void
  clearDownloadHistory: () => void

  // Utility operations
  refreshData: () => void
  exportData: () => any
  importData: (data: any) => boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = () => {
    try {
      setImages(storage.getImages())
      setFavorites(storage.getFavorites())
      setCollections(storage.getCollections())
      setDownloadHistory(storage.getDownloadHistory())
    } catch (error) {
      console.error("Failed to refresh data:", error)
    }
  }

  useEffect(() => {
    refreshData()
    setIsLoading(false)
  }, [])

  // Image operations
  const addImage = (image: any) => {
    if (storage.addImage(image)) {
      setImages(storage.getImages())
    }
  }

  const removeImage = (imageId: string) => {
    if (storage.removeImage(imageId)) {
      setImages(storage.getImages())
    }
  }

  // Favorite operations
  const addFavorite = (image: any) => {
    if (storage.addFavorite(image)) {
      setFavorites(storage.getFavorites())
    }
  }

  const removeFavorite = (imageId: string) => {
    if (storage.removeFavorite(imageId)) {
      setFavorites(storage.getFavorites())
    }
  }

  const isFavorite = (imageId: string) => {
    return storage.isFavorite(imageId)
  }

  // Collection operations
  const addCollection = (collection: any) => {
    if (storage.addCollection(collection)) {
      setCollections(storage.getCollections())
    }
  }

  const removeCollection = (collectionId: string) => {
    if (storage.removeCollection(collectionId)) {
      setCollections(storage.getCollections())
    }
  }

  const addImageToCollection = (collectionId: string, image: any) => {
    if (storage.addImageToCollection(collectionId, image)) {
      setCollections(storage.getCollections())
    }
  }

  const removeImageFromCollection = (collectionId: string, imageId: string) => {
    if (storage.removeImageFromCollection(collectionId, imageId)) {
      setCollections(storage.getCollections())
    }
  }

  // Download history operations
  const addDownloadRecord = (record: any) => {
    if (storage.addDownloadRecord(record)) {
      setDownloadHistory(storage.getDownloadHistory())
    }
  }

  const clearDownloadHistory = () => {
    if (storage.clearDownloadHistory()) {
      setDownloadHistory([])
    }
  }

  // Utility operations
  const exportData = () => {
    return storage.exportData()
  }

  const importData = (data: any) => {
    const success = storage.importData(data)
    if (success) {
      refreshData()
    }
    return success
  }

  return (
    <StorageContext.Provider
      value={{
        images,
        favorites,
        collections,
        downloadHistory,
        isLoading,
        addImage,
        removeImage,
        addFavorite,
        removeFavorite,
        isFavorite,
        addCollection,
        removeCollection,
        addImageToCollection,
        removeImageFromCollection,
        addDownloadRecord,
        clearDownloadHistory,
        refreshData,
        exportData,
        importData,
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
