import type { WaifuImage, Collections, Settings } from "../types/waifu"

const STORAGE_KEYS = {
  FAVORITES: "waifu-downloader-favorites",
  COLLECTIONS: "waifu-downloader-collections",
  SETTINGS: "waifu-downloader-settings",
  IMAGES: "waifu-downloader-images",
  DOWNLOAD_HISTORY: "waifu-downloader-download-history",
} as const

// Safe localStorage operations with error handling
function safeGetItem(key: string): string | null {
  try {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    if (typeof window === "undefined") return false
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
    return false
  }
}

function safeRemoveItem(key: string): boolean {
  try {
    if (typeof window === "undefined") return false
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error)
    return false
  }
}

export const storage = {
  // Images management
  getImages(): WaifuImage[] {
    try {
      const stored = safeGetItem(STORAGE_KEYS.IMAGES)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error("Error parsing stored images:", error)
      return []
    }
  },

  setImages(images: WaifuImage[]): boolean {
    try {
      const validImages = Array.isArray(images) ? images : []
      return safeSetItem(STORAGE_KEYS.IMAGES, JSON.stringify(validImages))
    } catch (error) {
      console.error("Error storing images:", error)
      return false
    }
  },

  addImage(image: WaifuImage): boolean {
    try {
      const images = this.getImages()
      const exists = images.some((img) => img.image_id === image.image_id)
      if (!exists) {
        images.push(image)
        return this.setImages(images)
      }
      return true
    } catch (error) {
      console.error("Error adding image:", error)
      return false
    }
  },

  removeImage(imageId: string): boolean {
    try {
      const images = this.getImages()
      const filtered = images.filter((img) => img.image_id.toString() !== imageId)
      return this.setImages(filtered)
    } catch (error) {
      console.error("Error removing image:", error)
      return false
    }
  },

  // Favorites management
  getFavorites(): string[] {
    try {
      const stored = safeGetItem(STORAGE_KEYS.FAVORITES)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error("Error parsing stored favorites:", error)
      return []
    }
  },

  setFavorites(favorites: string[]): boolean {
    try {
      const validFavorites = Array.isArray(favorites) ? favorites : []
      return safeSetItem(STORAGE_KEYS.FAVORITES, JSON.stringify(validFavorites))
    } catch (error) {
      console.error("Error storing favorites:", error)
      return false
    }
  },

  addFavorite(imageId: string): boolean {
    try {
      const favorites = this.getFavorites()
      if (!favorites.includes(imageId)) {
        favorites.push(imageId)
        return this.setFavorites(favorites)
      }
      return true
    } catch (error) {
      console.error("Error adding favorite:", error)
      return false
    }
  },

  removeFavorite(imageId: string): boolean {
    try {
      const favorites = this.getFavorites()
      const filtered = favorites.filter((id) => id !== imageId)
      return this.setFavorites(filtered)
    } catch (error) {
      console.error("Error removing favorite:", error)
      return false
    }
  },

  // Collections management
  getCollections(): Collections {
    try {
      const stored = safeGetItem(STORAGE_KEYS.COLLECTIONS)
      if (!stored) return {}
      const parsed = JSON.parse(stored)
      return typeof parsed === "object" && parsed !== null ? parsed : {}
    } catch (error) {
      console.error("Error parsing stored collections:", error)
      return {}
    }
  },

  setCollections(collections: Collections): boolean {
    try {
      const validCollections = typeof collections === "object" && collections !== null ? collections : {}
      return safeSetItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(validCollections))
    } catch (error) {
      console.error("Error storing collections:", error)
      return false
    }
  },

  createCollection(name: string): string | undefined {
    try {
      const collections = this.getCollections()
      const id = `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      collections[id] = {
        id,
        name,
        imageIds: [],
      }
      const success = this.setCollections(collections)
      return success ? id : undefined
    } catch (error) {
      console.error("Error creating collection:", error)
      return undefined
    }
  },

  deleteCollection(id: string): boolean {
    try {
      const collections = this.getCollections()
      delete collections[id]
      return this.setCollections(collections)
    } catch (error) {
      console.error("Error deleting collection:", error)
      return false
    }
  },

  addToCollection(collectionId: string, imageId: string): boolean {
    try {
      const collections = this.getCollections()
      if (collections[collectionId] && !collections[collectionId].imageIds.includes(imageId)) {
        collections[collectionId].imageIds.push(imageId)
        return this.setCollections(collections)
      }
      return true
    } catch (error) {
      console.error("Error adding to collection:", error)
      return false
    }
  },

  removeFromCollection(collectionId: string, imageId: string): boolean {
    try {
      const collections = this.getCollections()
      if (collections[collectionId]) {
        collections[collectionId].imageIds = collections[collectionId].imageIds.filter((id) => id !== imageId)
        return this.setCollections(collections)
      }
      return true
    } catch (error) {
      console.error("Error removing from collection:", error)
      return false
    }
  },

  // Settings management
  getSettings(): Partial<Settings> {
    try {
      const stored = safeGetItem(STORAGE_KEYS.SETTINGS)
      if (!stored) return {}
      const parsed = JSON.parse(stored)
      return typeof parsed === "object" && parsed !== null ? parsed : {}
    } catch (error) {
      console.error("Error parsing stored settings:", error)
      return {}
    }
  },

  setSettings(settings: Partial<Settings>): boolean {
    try {
      const validSettings = typeof settings === "object" && settings !== null ? settings : {}
      return safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(validSettings))
    } catch (error) {
      console.error("Error storing settings:", error)
      return false
    }
  },

  // Download history management
  getDownloadHistory(): WaifuImage[] {
    try {
      const stored = safeGetItem(STORAGE_KEYS.DOWNLOAD_HISTORY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error("Error parsing download history:", error)
      return []
    }
  },

  addToDownloadHistory(image: WaifuImage): boolean {
    try {
      const history = this.getDownloadHistory()
      const exists = history.some((img) => img.image_id === image.image_id)
      if (!exists) {
        history.unshift(image) // Add to beginning
        // Keep only last 100 downloads
        const trimmed = history.slice(0, 100)
        return safeSetItem(STORAGE_KEYS.DOWNLOAD_HISTORY, JSON.stringify(trimmed))
      }
      return true
    } catch (error) {
      console.error("Error adding to download history:", error)
      return false
    }
  },

  clearDownloadHistory(): boolean {
    return safeRemoveItem(STORAGE_KEYS.DOWNLOAD_HISTORY)
  },

  // Utility methods
  clearAll(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        safeRemoveItem(key)
      })
      return true
    } catch (error) {
      console.error("Error clearing all storage:", error)
      return false
    }
  },

  getStorageSize(): number {
    try {
      if (typeof window === "undefined") return 0
      let total = 0
      Object.values(STORAGE_KEYS).forEach((key) => {
        const item = safeGetItem(key)
        if (item) {
          total += item.length
        }
      })
      return total
    } catch (error) {
      console.error("Error calculating storage size:", error)
      return 0
    }
  },
}
