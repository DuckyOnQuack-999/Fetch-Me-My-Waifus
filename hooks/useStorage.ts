"use client"

import { useState, useEffect, useCallback } from "react"
import type { WaifuImage, Collection, Collections } from "@/types/waifu"
import { storage, generateId } from "@/lib/utils"

interface UseStorageReturn {
  // Images
  images: WaifuImage[]
  addImage: (image: Omit<WaifuImage, "id" | "created_at">) => boolean
  removeImage: (imageId: string) => boolean
  updateImage: (imageId: string, updates: Partial<WaifuImage>) => boolean
  getImage: (imageId: string) => WaifuImage | undefined

  // Favorites
  favorites: string[]
  addFavorite: (imageId: string) => boolean
  removeFavorite: (imageId: string) => boolean
  toggleFavorite: (imageId: string) => boolean
  isFavorite: (imageId: string) => boolean

  // Collections
  collections: Collections
  createCollection: (name: string, description?: string) => string | null
  updateCollection: (collectionId: string, updates: Partial<Collection>) => boolean
  deleteCollection: (collectionId: string) => boolean
  addToCollection: (collectionId: string, imageId: string) => boolean
  removeFromCollection: (collectionId: string, imageId: string) => boolean
  getCollection: (collectionId: string) => Collection | undefined

  // Storage stats
  getStorageStats: () => {
    usage: { used: number; available: number; percentage: number }
    counts: { images: number; favorites: number; collections: number; downloadHistory: number }
    lastUpdated: string
  }

  // Bulk operations
  exportData: () => any
  importData: (data: any) => boolean
  clearAllData: () => boolean

  // Loading state
  isLoading: boolean
  error: string | null
}

const STORAGE_KEYS = {
  IMAGES: "waifu_images",
  FAVORITES: "waifu_favorites",
  COLLECTIONS: "waifu_collections",
  DOWNLOAD_HISTORY: "waifu_download_history",
}

const MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB

export function useStorage(): UseStorageReturn {
  const [images, setImages] = useState<WaifuImage[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<Collections>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true)

      const loadedImages = storage.get<WaifuImage[]>(STORAGE_KEYS.IMAGES, [])
      const loadedFavorites = storage.get<string[]>(STORAGE_KEYS.FAVORITES, [])
      const loadedCollections = storage.get<Collections>(STORAGE_KEYS.COLLECTIONS, {})

      // Validate and sanitize loaded data
      const validImages = loadedImages.map((img, index) => ({
        ...img,
        id: img.id || generateId("img"),
        image_id: img.image_id || img.id || generateId("img"),
        tags: Array.isArray(img.tags) ? img.tags : [],
        created_at: img.created_at || new Date().toISOString(),
        metadata: {
          addedAt: new Date().toISOString(),
          aspectRatio: img.width && img.height ? img.width / img.height : 1,
          ...img.metadata,
        },
      }))

      const validFavorites = loadedFavorites.filter((id) => typeof id === "string" && id.trim() !== "")

      setImages(validImages)
      setFavorites(validFavorites)
      setCollections(loadedCollections)
      setError(null)
    } catch (err) {
      console.error("Failed to load storage data:", err)
      setError("Failed to load data from storage")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save images to localStorage
  const saveImages = useCallback((newImages: WaifuImage[]) => {
    try {
      const success = storage.set(STORAGE_KEYS.IMAGES, newImages)
      if (success) {
        setImages(newImages)
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to save images:", err)
      setError("Failed to save images")
      return false
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    try {
      const success = storage.set(STORAGE_KEYS.FAVORITES, newFavorites)
      if (success) {
        setFavorites(newFavorites)
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to save favorites:", err)
      setError("Failed to save favorites")
      return false
    }
  }, [])

  // Save collections to localStorage
  const saveCollections = useCallback((newCollections: Collections) => {
    try {
      const success = storage.set(STORAGE_KEYS.COLLECTIONS, newCollections)
      if (success) {
        setCollections(newCollections)
        return true
      }
      return false
    } catch (err) {
      console.error("Failed to save collections:", err)
      setError("Failed to save collections")
      return false
    }
  }, [])

  // Image operations
  const addImage = useCallback(
    (imageData: Omit<WaifuImage, "id" | "created_at">) => {
      const newImage: WaifuImage = {
        ...imageData,
        id: generateId("img"),
        created_at: new Date().toISOString(),
        metadata: {
          addedAt: new Date().toISOString(),
          aspectRatio: imageData.width && imageData.height ? imageData.width / imageData.height : 1,
          ...imageData.metadata,
        },
      }

      // Check for duplicates
      const isDuplicate = images.some(
        (img) => img.url === newImage.url || (img.image_id && img.image_id === newImage.image_id),
      )

      if (isDuplicate) {
        return false
      }

      const updatedImages = [newImage, ...images]
      return saveImages(updatedImages)
    },
    [images, saveImages],
  )

  const removeImage = useCallback(
    (imageId: string) => {
      const updatedImages = images.filter((img) => img.id !== imageId && img.image_id !== imageId)

      // Also remove from favorites
      const updatedFavorites = favorites.filter((id) => id !== imageId)
      saveFavorites(updatedFavorites)

      // Remove from collections
      const updatedCollections = { ...collections }
      Object.keys(updatedCollections).forEach((collectionId) => {
        updatedCollections[collectionId].imageIds = updatedCollections[collectionId].imageIds.filter(
          (id) => id !== imageId,
        )
      })
      saveCollections(updatedCollections)

      return saveImages(updatedImages)
    },
    [images, favorites, collections, saveImages, saveFavorites, saveCollections],
  )

  const updateImage = useCallback(
    (imageId: string, updates: Partial<WaifuImage>) => {
      const updatedImages = images.map((img) =>
        img.id === imageId || img.image_id === imageId
          ? {
              ...img,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : img,
      )
      return saveImages(updatedImages)
    },
    [images, saveImages],
  )

  const getImage = useCallback(
    (imageId: string) => {
      return images.find((img) => img.id === imageId || img.image_id === imageId)
    },
    [images],
  )

  // Favorite operations
  const addFavorite = useCallback(
    (imageId: string) => {
      if (favorites.includes(imageId)) {
        return true
      }
      const updatedFavorites = [imageId, ...favorites]
      return saveFavorites(updatedFavorites)
    },
    [favorites, saveFavorites],
  )

  const removeFavorite = useCallback(
    (imageId: string) => {
      const updatedFavorites = favorites.filter((id) => id !== imageId)
      return saveFavorites(updatedFavorites)
    },
    [favorites, saveFavorites],
  )

  const toggleFavorite = useCallback(
    (imageId: string) => {
      if (favorites.includes(imageId)) {
        return removeFavorite(imageId)
      } else {
        return addFavorite(imageId)
      }
    },
    [favorites, addFavorite, removeFavorite],
  )

  const isFavorite = useCallback(
    (imageId: string) => {
      return favorites.includes(imageId)
    },
    [favorites],
  )

  // Collection operations
  const createCollection = useCallback(
    (name: string, description?: string) => {
      const id = generateId("collection")
      const newCollection: Collection = {
        id,
        name: name.trim(),
        description: description || "",
        imageIds: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: [],
      }

      const updatedCollections = {
        ...collections,
        [id]: newCollection,
      }

      const success = saveCollections(updatedCollections)
      return success ? id : null
    },
    [collections, saveCollections],
  )

  const updateCollection = useCallback(
    (collectionId: string, updates: Partial<Collection>) => {
      if (!collections[collectionId]) {
        return false
      }

      const updatedCollections = {
        ...collections,
        [collectionId]: {
          ...collections[collectionId],
          ...updates,
          updated_at: new Date().toISOString(),
        },
      }

      return saveCollections(updatedCollections)
    },
    [collections, saveCollections],
  )

  const deleteCollection = useCallback(
    (collectionId: string) => {
      const updatedCollections = { ...collections }
      delete updatedCollections[collectionId]
      return saveCollections(updatedCollections)
    },
    [collections, saveCollections],
  )

  const addToCollection = useCallback(
    (collectionId: string, imageId: string) => {
      const collection = collections[collectionId]
      if (!collection || collection.imageIds.includes(imageId)) {
        return false
      }

      const updatedCollection = {
        ...collection,
        imageIds: [...collection.imageIds, imageId],
        updated_at: new Date().toISOString(),
      }

      return updateCollection(collectionId, updatedCollection)
    },
    [collections, updateCollection],
  )

  const removeFromCollection = useCallback(
    (collectionId: string, imageId: string) => {
      const collection = collections[collectionId]
      if (!collection) {
        return false
      }

      const updatedCollection = {
        ...collection,
        imageIds: collection.imageIds.filter((id) => id !== imageId),
        updated_at: new Date().toISOString(),
      }

      return updateCollection(collectionId, updatedCollection)
    },
    [collections, updateCollection],
  )

  const getCollection = useCallback(
    (collectionId: string) => {
      return collections[collectionId]
    },
    [collections],
  )

  // Storage statistics
  const getStorageStats = useCallback(() => {
    try {
      // Calculate storage usage (approximate)
      const imagesSize = JSON.stringify(images).length
      const favoritesSize = JSON.stringify(favorites).length
      const collectionsSize = JSON.stringify(collections).length
      const totalUsed = imagesSize + favoritesSize + collectionsSize

      const usage = {
        used: totalUsed,
        available: Math.max(0, MAX_STORAGE_SIZE - totalUsed),
        percentage: Math.min(100, (totalUsed / MAX_STORAGE_SIZE) * 100),
      }

      const counts = {
        images: images.length,
        favorites: favorites.length,
        collections: Object.keys(collections).length,
        downloadHistory: storage.get(STORAGE_KEYS.DOWNLOAD_HISTORY, []).length,
      }

      return {
        usage,
        counts,
        lastUpdated: new Date().toISOString(),
      }
    } catch (err) {
      console.error("Failed to calculate storage stats:", err)
      return {
        usage: { used: 0, available: MAX_STORAGE_SIZE, percentage: 0 },
        counts: { images: 0, favorites: 0, collections: 0, downloadHistory: 0 },
        lastUpdated: new Date().toISOString(),
      }
    }
  }, [images, favorites, collections])

  // Bulk operations
  const exportData = useCallback(() => {
    return {
      images,
      favorites,
      collections,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }
  }, [images, favorites, collections])

  const importData = useCallback(
    (data: any) => {
      try {
        if (data.images && Array.isArray(data.images)) {
          saveImages(data.images)
        }
        if (data.favorites && Array.isArray(data.favorites)) {
          saveFavorites(data.favorites)
        }
        if (data.collections && typeof data.collections === "object") {
          saveCollections(data.collections)
        }
        return true
      } catch (err) {
        console.error("Failed to import data:", err)
        setError("Failed to import data")
        return false
      }
    },
    [saveImages, saveFavorites, saveCollections],
  )

  const clearAllData = useCallback(() => {
    try {
      storage.remove(STORAGE_KEYS.IMAGES)
      storage.remove(STORAGE_KEYS.FAVORITES)
      storage.remove(STORAGE_KEYS.COLLECTIONS)
      storage.remove(STORAGE_KEYS.DOWNLOAD_HISTORY)

      setImages([])
      setFavorites([])
      setCollections({})
      setError(null)

      return true
    } catch (err) {
      console.error("Failed to clear data:", err)
      setError("Failed to clear data")
      return false
    }
  }, [])

  return {
    // Images
    images,
    addImage,
    removeImage,
    updateImage,
    getImage,

    // Favorites
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,

    // Collections
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    getCollection,

    // Storage stats
    getStorageStats,

    // Bulk operations
    exportData,
    importData,
    clearAllData,

    // State
    isLoading,
    error,
  }
}
