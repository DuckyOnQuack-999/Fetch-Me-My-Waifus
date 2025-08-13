"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { WaifuImage, Collections } from "../types/waifu"
import { storage } from "../utils/localStorage"

interface StorageContextType {
  images: WaifuImage[]
  favorites: string[]
  collections: Collections
  addImage: (image: WaifuImage) => void
  removeImage: (imageId: string) => void
  addFavorite: (imageId: string) => void
  removeFavorite: (imageId: string) => void
  toggleFavorite: (imageId: string) => void
  createCollection: (name: string) => string | undefined
  deleteCollection: (id: string) => void
  addToCollection: (collectionId: string, imageId: string) => void
  removeFromCollection: (collectionId: string, imageId: string) => void
  getFavorites: () => string[]
  getCollections: () => Collections
  getImages: () => WaifuImage[]
  refreshData: () => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<WaifuImage[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<Collections>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data from localStorage
  useEffect(() => {
    try {
      const storedImages = storage.getImages()
      const storedFavorites = storage.getFavorites()
      const storedCollections = storage.getCollections()

      console.log("Loading from storage:", {
        images: storedImages.length,
        favorites: storedFavorites.length,
        collections: Object.keys(storedCollections).length,
      })

      setImages(Array.isArray(storedImages) ? storedImages : [])
      setFavorites(Array.isArray(storedFavorites) ? storedFavorites : [])
      setCollections(typeof storedCollections === "object" && storedCollections !== null ? storedCollections : {})
      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing storage context:", error)
      // Set safe defaults
      setImages([])
      setFavorites([])
      setCollections({})
      setIsInitialized(true)
    }
  }, [])

  const refreshData = () => {
    try {
      const storedImages = storage.getImages()
      const storedFavorites = storage.getFavorites()
      const storedCollections = storage.getCollections()

      setImages(Array.isArray(storedImages) ? storedImages : [])
      setFavorites(Array.isArray(storedFavorites) ? storedFavorites : [])
      setCollections(typeof storedCollections === "object" && storedCollections !== null ? storedCollections : {})
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }

  const addImage = (image: WaifuImage) => {
    try {
      if (storage.addImage(image)) {
        setImages((prev) => {
          const exists = prev.some((img) => img.image_id === image.image_id)
          return exists ? prev : [...prev, image]
        })
      }
    } catch (error) {
      console.error("Error adding image:", error)
    }
  }

  const removeImage = (imageId: string) => {
    try {
      if (storage.removeImage(imageId)) {
        setImages((prev) => prev.filter((img) => img.image_id.toString() !== imageId))
      }
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  const addFavorite = (imageId: string) => {
    try {
      if (storage.addFavorite(imageId)) {
        setFavorites((prev) => (prev.includes(imageId) ? prev : [...prev, imageId]))
        // Update the image's favorite status
        setImages((prev) =>
          prev.map((img) => (img.image_id.toString() === imageId ? { ...img, isFavorite: true } : img)),
        )
      }
    } catch (error) {
      console.error("Error adding favorite:", error)
    }
  }

  const removeFavorite = (imageId: string) => {
    try {
      if (storage.removeFavorite(imageId)) {
        setFavorites((prev) => prev.filter((id) => id !== imageId))
        // Update the image's favorite status
        setImages((prev) =>
          prev.map((img) => (img.image_id.toString() === imageId ? { ...img, isFavorite: false } : img)),
        )
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  const toggleFavorite = (imageId: string) => {
    try {
      const isFavorite = favorites.includes(imageId)
      if (isFavorite) {
        removeFavorite(imageId)
      } else {
        addFavorite(imageId)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const createCollection = (name: string) => {
    try {
      const id = storage.createCollection(name)
      if (id) {
        setCollections(storage.getCollections())
      }
      return id
    } catch (error) {
      console.error("Error creating collection:", error)
      return undefined
    }
  }

  const deleteCollection = (id: string) => {
    try {
      if (storage.deleteCollection(id)) {
        setCollections(storage.getCollections())
      }
    } catch (error) {
      console.error("Error deleting collection:", error)
    }
  }

  const addToCollection = (collectionId: string, imageId: string) => {
    try {
      if (storage.addToCollection(collectionId, imageId)) {
        setCollections(storage.getCollections())
      }
    } catch (error) {
      console.error("Error adding to collection:", error)
    }
  }

  const removeFromCollection = (collectionId: string, imageId: string) => {
    try {
      if (storage.removeFromCollection(collectionId, imageId)) {
        setCollections(storage.getCollections())
      }
    } catch (error) {
      console.error("Error removing from collection:", error)
    }
  }

  const getFavorites = () => {
    try {
      return storage.getFavorites()
    } catch (error) {
      console.error("Error getting favorites:", error)
      return []
    }
  }

  const getCollections = () => {
    try {
      return storage.getCollections()
    } catch (error) {
      console.error("Error getting collections:", error)
      return {}
    }
  }

  const getImages = () => {
    try {
      return storage.getImages()
    } catch (error) {
      console.error("Error getting images:", error)
      return []
    }
  }

  // Don't render children until initialized to prevent hydration issues
  if (!isInitialized) {
    return null
  }

  return (
    <StorageContext.Provider
      value={{
        images: Array.isArray(images) ? images : [],
        favorites: Array.isArray(favorites) ? favorites : [],
        collections: typeof collections === "object" && collections !== null ? collections : {},
        addImage,
        removeImage,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        createCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
        getFavorites,
        getCollections,
        getImages,
        refreshData,
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
