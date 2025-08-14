"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  getImages,
  saveImages,
  getFavorites,
  getCollections,
  saveCollections,
  addToFavorites,
  removeFromFavorites,
  addToDownloadHistory,
  getDownloadHistory,
} from "@/utils/localStorage"

interface StorageContextType {
  images: any[]
  favorites: any[]
  collections: any[]
  downloadHistory: any[]
  addImage: (image: any) => Promise<void>
  removeImage: (imageId: string) => Promise<void>
  toggleFavorite: (image: any) => Promise<void>
  isFavorite: (imageId: string) => boolean
  addCollection: (collection: any) => Promise<void>
  removeCollection: (collectionId: string) => Promise<void>
  addToHistory: (item: any) => Promise<void>
  isLoading: boolean
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [downloadHistory, setDownloadHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedImages, loadedFavorites, loadedCollections, loadedHistory] = await Promise.all([
          getImages(),
          getFavorites(),
          getCollections(),
          getDownloadHistory(),
        ])

        setImages(loadedImages || [])
        setFavorites(loadedFavorites || [])
        setCollections(loadedCollections || [])
        setDownloadHistory(loadedHistory || [])
      } catch (error) {
        console.error("Failed to load storage data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const addImage = async (image: any) => {
    try {
      const newImages = [image, ...images]
      setImages(newImages)
      await saveImages(newImages)
    } catch (error) {
      console.error("Failed to add image:", error)
    }
  }

  const removeImage = async (imageId: string) => {
    try {
      const newImages = images.filter((img) => img.id !== imageId)
      setImages(newImages)
      await saveImages(newImages)
    } catch (error) {
      console.error("Failed to remove image:", error)
    }
  }

  const toggleFavorite = async (image: any) => {
    try {
      const isFav = favorites.some((fav) => fav.id === image.id)
      if (isFav) {
        await removeFromFavorites(image.id)
        setFavorites((prev) => prev.filter((fav) => fav.id !== image.id))
      } else {
        await addToFavorites(image)
        setFavorites((prev) => [...prev, { ...image, addedAt: new Date().toISOString() }])
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const isFavorite = (imageId: string) => {
    return favorites.some((fav) => fav.id === imageId)
  }

  const addCollection = async (collection: any) => {
    try {
      const newCollections = [collection, ...collections]
      setCollections(newCollections)
      await saveCollections(newCollections)
    } catch (error) {
      console.error("Failed to add collection:", error)
    }
  }

  const removeCollection = async (collectionId: string) => {
    try {
      const newCollections = collections.filter((col) => col.id !== collectionId)
      setCollections(newCollections)
      await saveCollections(newCollections)
    } catch (error) {
      console.error("Failed to remove collection:", error)
    }
  }

  const addToHistory = async (item: any) => {
    try {
      await addToDownloadHistory(item)
      const newHistory = [{ ...item, timestamp: new Date().toISOString() }, ...downloadHistory]
      if (newHistory.length > 100) {
        newHistory.splice(100)
      }
      setDownloadHistory(newHistory)
    } catch (error) {
      console.error("Failed to add to history:", error)
    }
  }

  return (
    <StorageContext.Provider
      value={{
        images,
        favorites,
        collections,
        downloadHistory,
        addImage,
        removeImage,
        toggleFavorite,
        isFavorite,
        addCollection,
        removeCollection,
        addToHistory,
        isLoading,
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
