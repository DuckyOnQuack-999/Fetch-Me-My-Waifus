import type { WaifuImage, Settings, Collection } from "@/types/waifu"

interface StorageStats {
  usage: {
    used: number
    available: number
    percentage: number
  }
  counts: {
    images: number
    favorites: number
    collections: number
    downloadHistory: number
  }
  lastUpdated: string
}

interface DownloadHistoryItem {
  id: string
  imageId: string | number
  filename: string
  url: string
  source: string
  timestamp: Date
  size?: number
  status: "completed" | "failed"
}

class LocalStorage {
  private readonly IMAGES_KEY = "waifu_images"
  private readonly FAVORITES_KEY = "waifu_favorites"
  private readonly COLLECTIONS_KEY = "waifu_collections"
  private readonly SETTINGS_KEY = "waifu_settings"
  private readonly DOWNLOAD_HISTORY_KEY = "waifu_download_history"
  private readonly CURRENT_USER_KEY = "waifu_current_user"
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB

  private getUserKey(key: string): string {
    const userId = this.getCurrentUserId()
    return userId ? `${key}_${userId}` : key
  }

  getCurrentUserId(): string | null {
    try {
      return localStorage.getItem(this.CURRENT_USER_KEY)
    } catch (error) {
      console.error("Failed to get current user ID:", error)
      return null
    }
  }

  setCurrentUser(userId: string): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, userId)
    } catch (error) {
      console.error("Failed to set current user:", error)
    }
  }

  initializeUserStorage(userId: string): void {
    try {
      const keys = [
        `${this.IMAGES_KEY}_${userId}`,
        `${this.FAVORITES_KEY}_${userId}`,
        `${this.COLLECTIONS_KEY}_${userId}`,
        `${this.DOWNLOAD_HISTORY_KEY}_${userId}`,
      ]

      keys.forEach((key) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify([]))
        }
      })
    } catch (error) {
      console.error("Failed to initialize user storage:", error)
    }
  }

  getImages(): WaifuImage[] {
    try {
      const data = localStorage.getItem(this.getUserKey(this.IMAGES_KEY))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Failed to get images:", error)
      return []
    }
  }

  saveImages(images: WaifuImage[]): void {
    try {
      const data = JSON.stringify(images)
      if (data.length > this.MAX_STORAGE_SIZE) {
        console.warn("Storage limit exceeded, removing oldest images")
        const reducedImages = images.slice(-100)
        localStorage.setItem(this.getUserKey(this.IMAGES_KEY), JSON.stringify(reducedImages))
      } else {
        localStorage.setItem(this.getUserKey(this.IMAGES_KEY), data)
      }
    } catch (error) {
      console.error("Failed to save images:", error)
      if (error instanceof Error && error.name === "QuotaExceededError") {
        this.clearOldData()
      }
    }
  }

  addImage(image: WaifuImage): void {
    const images = this.getImages()
    const exists = images.some((img) => img.image_id === image.image_id)
    if (!exists) {
      images.push(image)
      this.saveImages(images)
    }
  }

  removeImage(imageId: string | number): void {
    const images = this.getImages()
    const filtered = images.filter((img) => img.image_id !== imageId)
    this.saveImages(filtered)
  }

  getFavorites(): (string | number)[] {
    try {
      const data = localStorage.getItem(this.getUserKey(this.FAVORITES_KEY))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Failed to get favorites:", error)
      return []
    }
  }

  saveFavorites(favorites: (string | number)[]): void {
    try {
      localStorage.setItem(this.getUserKey(this.FAVORITES_KEY), JSON.stringify(favorites))
    } catch (error) {
      console.error("Failed to save favorites:", error)
    }
  }

  toggleFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    const index = favorites.indexOf(imageId)

    if (index > -1) {
      favorites.splice(index, 1)
      this.saveFavorites(favorites)
      return false
    } else {
      favorites.push(imageId)
      this.saveFavorites(favorites)
      return true
    }
  }

  isFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    return favorites.includes(imageId)
  }

  getCollections(): Collection[] {
    try {
      const data = localStorage.getItem(this.getUserKey(this.COLLECTIONS_KEY))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Failed to get collections:", error)
      return []
    }
  }

  saveCollections(collections: Collection[]): void {
    try {
      localStorage.setItem(this.getUserKey(this.COLLECTIONS_KEY), JSON.stringify(collections))
    } catch (error) {
      console.error("Failed to save collections:", error)
    }
  }

  createCollection(name: string, description?: string): Collection {
    const collections = this.getCollections()
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name,
      description,
      imageIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    collections.push(newCollection)
    this.saveCollections(collections)
    return newCollection
  }

  addToCollection(collectionId: string, imageId: string | number): void {
    const collections = this.getCollections()
    const collection = collections.find((c) => c.id === collectionId)
    if (collection && !collection.imageIds.includes(imageId)) {
      collection.imageIds.push(imageId)
      collection.updatedAt = new Date()
      this.saveCollections(collections)
    }
  }

  removeFromCollection(collectionId: string, imageId: string | number): void {
    const collections = this.getCollections()
    const collection = collections.find((c) => c.id === collectionId)
    if (collection) {
      collection.imageIds = collection.imageIds.filter((id) => id !== imageId)
      collection.updatedAt = new Date()
      this.saveCollections(collections)
    }
  }

  deleteCollection(collectionId: string): void {
    const collections = this.getCollections()
    const filtered = collections.filter((c) => c.id !== collectionId)
    this.saveCollections(filtered)
  }

  getSettings(): Settings | null {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Failed to get settings:", error)
      return null
    }
  }

  saveSettings(settings: Settings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  getDownloadHistory(): DownloadHistoryItem[] {
    try {
      const data = localStorage.getItem(this.getUserKey(this.DOWNLOAD_HISTORY_KEY))
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Failed to get download history:", error)
      return []
    }
  }

  addToDownloadHistory(item: Omit<DownloadHistoryItem, "id" | "timestamp">): void {
    const history = this.getDownloadHistory()
    const newItem: DownloadHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    history.unshift(newItem)

    const maxHistory = 1000
    if (history.length > maxHistory) {
      history.splice(maxHistory)
    }

    try {
      localStorage.setItem(this.getUserKey(this.DOWNLOAD_HISTORY_KEY), JSON.stringify(history))
    } catch (error) {
      console.error("Failed to save download history:", error)
    }
  }

  clearDownloadHistory(): void {
    try {
      localStorage.setItem(this.getUserKey(this.DOWNLOAD_HISTORY_KEY), JSON.stringify([]))
    } catch (error) {
      console.error("Failed to clear download history:", error)
    }
  }

  getStorageStats(): StorageStats {
    try {
      const images = this.getImages()
      const favorites = this.getFavorites()
      const collections = this.getCollections()
      const history = this.getDownloadHistory()

      const used = new Blob([
        JSON.stringify(images),
        JSON.stringify(favorites),
        JSON.stringify(collections),
        JSON.stringify(history),
      ]).size

      const available = this.MAX_STORAGE_SIZE
      const percentage = (used / available) * 100

      return {
        usage: {
          used,
          available,
          percentage,
        },
        counts: {
          images: images.length,
          favorites: favorites.length,
          collections: collections.length,
          downloadHistory: history.length,
        },
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Failed to get storage stats:", error)
      return {
        usage: { used: 0, available: this.MAX_STORAGE_SIZE, percentage: 0 },
        counts: { images: 0, favorites: 0, collections: 0, downloadHistory: 0 },
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  private clearOldData(): void {
    try {
      const images = this.getImages()
      const reducedImages = images.slice(-50)
      this.saveImages(reducedImages)

      const history = this.getDownloadHistory()
      const reducedHistory = history.slice(0, 100)
      localStorage.setItem(this.getUserKey(this.DOWNLOAD_HISTORY_KEY), JSON.stringify(reducedHistory))

      console.log("Cleared old data to free up storage")
    } catch (error) {
      console.error("Failed to clear old data:", error)
    }
  }

  clearAllData(): void {
    try {
      const userId = this.getCurrentUserId()
      if (userId) {
        const keys = [
          `${this.IMAGES_KEY}_${userId}`,
          `${this.FAVORITES_KEY}_${userId}`,
          `${this.COLLECTIONS_KEY}_${userId}`,
          `${this.DOWNLOAD_HISTORY_KEY}_${userId}`,
        ]
        keys.forEach((key) => localStorage.removeItem(key))
      }
      console.log("All user data cleared")
    } catch (error) {
      console.error("Failed to clear all data:", error)
    }
  }

  exportData(): string {
    try {
      const data = {
        images: this.getImages(),
        favorites: this.getFavorites(),
        collections: this.getCollections(),
        history: this.getDownloadHistory(),
        settings: this.getSettings(),
        exportDate: new Date().toISOString(),
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error("Failed to export data:", error)
      return "{}"
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.images) this.saveImages(data.images)
      if (data.favorites) this.saveFavorites(data.favorites)
      if (data.collections) this.saveCollections(data.collections)
      if (data.settings) this.saveSettings(data.settings)

      return true
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  }
}

export const storage = new LocalStorage()
export type { StorageStats, DownloadHistoryItem }
