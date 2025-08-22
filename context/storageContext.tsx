"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useStorage } from "@/hooks/useStorage"
import type { WaifuImage, Collection, Collections } from "@/types/waifu"

interface StorageContextType {
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

const StorageContext = createContext<StorageContextType | undefined>(undefined)

interface StorageProviderProps {
  children: ReactNode
}

export function StorageProvider({ children }: StorageProviderProps) {
  const storageHook = useStorage()

  return <StorageContext.Provider value={storageHook}>{children}</StorageContext.Provider>
}

export function useStorageContext() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorageContext must be used within a StorageProvider")
  }
  return context
}

// Export for backward compatibility
export { useStorageContext as useStorage }
