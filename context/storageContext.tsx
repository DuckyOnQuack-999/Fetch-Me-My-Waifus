"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { storage } from "@/utils/localStorage"

interface StorageContextType {
  images: any[]
  favorites: string[]
  collections: any[]
  downloadHistory: any[]
  isLoading: boolean

  // Image operations
  addImage: (image: any) => void
  removeImage: (imageId: string) => void
  updateImage: (imageId: string, updates: any) => void

  // Favorite operations
  addFavorite: (imageId: string) => void
  removeFavorite: (imageId: string) => void
  isFavorite: (imageId: string) => boolean
  toggleFavorite: (imageId: string) => void

  // Collection operations
  addCollection: (collection: any) => void
  removeCollection: (collectionId: string) => void
  updateCollection: (collectionId: string, updates: any) => void

  // Download history operations
  addDownloadRecord: (record: any) => void
  clearDownloadHistory: () => void

  // Bulk operations
  clearAllData: () => void
  exportData: () => string
  importData: (jsonData: string) => boolean

  // Storage info
  getStorageInfo: () => { used: number; available: number; total: number }
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export const StorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        setImages(storage.getImages() || [])
        setFavorites(storage.getFavorites() || [])
        setCollections(storage.getCollections() || [])
        setDownloadHistory(storage.getDownloadHistory() || [])
      } catch (error) {
        console.error("Error loading storage data:", error)
        // Set default empty arrays on error
        setImages([])
        setFavorites([])
        setCollections([])
        setDownloadHistory([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Image operations
  const addImage = (image: any) => {
    const newImages = [...images]
    const exists = newImages.some((img) => img.id === image.id)
    if (!exists) {
      newImages.push(image)
      setImages(newImages)
      storage.saveImages(newImages)
    }
  }

  const removeImage = (imageId: string) => {
    const newImages = images.filter((img) => img.id !== imageId)
    setImages(newImages)
    storage.saveImages(newImages)

    // Also remove from favorites if it exists
    if (favorites.includes(imageId)) {
      removeFavorite(imageId)
    }
  }

  const updateImage = (imageId: string, updates: any) => {
    const newImages = images.map((img) => (img.id === imageId ? { ...img, ...updates } : img))
    setImages(newImages)
    storage.saveImages(newImages)
  }

  // Favorite operations
  const addFavorite = (imageId: string) => {
    if (!favorites.includes(imageId)) {
      const newFavorites = [...favorites, imageId]
      setFavorites(newFavorites)
      storage.saveFavorites(newFavorites)
    }
  }

  const removeFavorite = (imageId: string) => {
    const newFavorites = favorites.filter((id) => id !== imageId)
    setFavorites(newFavorites)
    storage.saveFavorites(newFavorites)
  }

  const isFavorite = (imageId: string) => {
    return favorites.includes(imageId)
  }

  const toggleFavorite = (imageId: string) => {
    if (isFavorite(imageId)) {
      removeFavorite(imageId)
    } else {
      addFavorite(imageId)
    }
  }

  // Collection operations
  const addCollection = (collection: any) => {
    const newCollections = [...collections]
    const exists = newCollections.some((col) => col.id === collection.id)
    if (!exists) {
      newCollections.push(collection)
      setCollections(newCollections)
      storage.saveCollections(newCollections)
    }
  }

  const removeCollection = (collectionId: string) => {
    const newCollections = collections.filter((col) => col.id !== collectionId)
    setCollections(newCollections)
    storage.saveCollections(newCollections)
  }

  const updateCollection = (collectionId: string, updates: any) => {
    const newCollections = collections.map((col) => (col.id === collectionId ? { ...col, ...updates } : col))
    setCollections(newCollections)
    storage.saveCollections(newCollections)
  }

  // Download history operations
  const addDownloadRecord = (record: any) => {
    const newHistory = [record, ...downloadHistory]
    // Keep only last 1000 records
    if (newHistory.length > 1000) {
      newHistory.splice(1000)
    }
    setDownloadHistory(newHistory)
    storage.saveDownloadHistory(newHistory)
  }

  const clearDownloadHistory = () => {
    setDownloadHistory([])
    storage.clearDownloadHistory()
  }

  // Bulk operations
  const clearAllData = () => {
    setImages([])
    setFavorites([])
    setCollections([])
    setDownloadHistory([])
    storage.clearAll()
  }

  const exportData = () => {
    return storage.exportData()
  }

  const importData = (jsonData: string) => {
    const success = storage.importData(jsonData)
    if (success) {
      // Reload data from storage
      setImages(storage.getImages() || [])
      setFavorites(storage.getFavorites() || [])
      setCollections(storage.getCollections() || [])
      setDownloadHistory(storage.getDownloadHistory() || [])
    }
    return success
  }

  const getStorageInfo = () => {
    return storage.getStorageInfo()
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
        updateImage,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        addCollection,
        removeCollection,
        updateCollection,
        addDownloadRecord,
        clearDownloadHistory,
        clearAllData,
        exportData,
        importData,
        getStorageInfo,
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
