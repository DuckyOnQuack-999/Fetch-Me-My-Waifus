interface StorageStats {
  used: number
  available: number
  total: number
  usage: {
    used: number
    available: number
    percentage: number
  }
}

interface StorageData {
  images: any[]
  favorites: string[]
  collections: any[]
  settings: any
  downloadHistory: any[]
  [key: string]: any
}

class LocalStorageManager {
  private readonly STORAGE_KEY_PREFIX = "waifu_downloader_"
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB
  private readonly CLEANUP_THRESHOLD = 0.9 // 90% full

  private getKey(key: string): string {
    return `${this.STORAGE_KEY_PREFIX}${key}`
  }

  private safeJSONParse<T>(value: string | null, fallback: T): T {
    if (!value) return fallback

    try {
      return JSON.parse(value) as T
    } catch (error) {
      console.warn("Failed to parse JSON from localStorage:", error)
      return fallback
    }
  }

  private safeJSONStringify(value: any): string {
    try {
      return JSON.stringify(value)
    } catch (error) {
      console.error("Failed to stringify value for localStorage:", error)
      return "{}"
    }
  }

  private calculateStorageSize(): number {
    let total = 0
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(this.STORAGE_KEY_PREFIX)) {
          const value = localStorage.getItem(key)
          if (value) {
            total += key.length + value.length
          }
        }
      }
    } catch (error) {
      console.error("Error calculating storage size:", error)
    }
    return total
  }

  getStorageStats(): StorageStats {
    try {
      const used = this.calculateStorageSize()
      const available = Math.max(0, this.MAX_STORAGE_SIZE - used)
      const total = this.MAX_STORAGE_SIZE
      const percentage = Math.min(100, (used / total) * 100)

      return {
        used,
        available,
        total,
        usage: {
          used,
          available,
          percentage,
        },
      }
    } catch (error) {
      console.error("Error getting storage stats:", error)
      return {
        used: 0,
        available: this.MAX_STORAGE_SIZE,
        total: this.MAX_STORAGE_SIZE,
        usage: {
          used: 0,
          available: this.MAX_STORAGE_SIZE,
          percentage: 0,
        },
      }
    }
  }

  private shouldCleanup(): boolean {
    const stats = this.getStorageStats()
    return stats.usage.percentage >= this.CLEANUP_THRESHOLD * 100
  }

  private performCleanup(): void {
    try {
      // Remove oldest download history entries first
      const history = this.getDownloadHistory()
      if (history.length > 100) {
        const trimmedHistory = history.slice(-50) // Keep only last 50 entries
        this.setItem("downloadHistory", trimmedHistory)
      }

      // Remove old cached data
      const cacheKeys = ["imageCache", "apiCache", "tempData"]
      cacheKeys.forEach((key) => {
        try {
          localStorage.removeItem(this.getKey(key))
        } catch (error) {
          console.warn(`Failed to remove cache key ${key}:`, error)
        }
      })
    } catch (error) {
      console.error("Error during cleanup:", error)
    }
  }

  setItem<T>(key: string, value: T): boolean {
    try {
      const serializedValue = this.safeJSONStringify(value)
      const fullKey = this.getKey(key)

      // Check if we need cleanup before storing
      if (this.shouldCleanup()) {
        this.performCleanup()
      }

      localStorage.setItem(fullKey, serializedValue)
      return true
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error)

      // Try cleanup and retry once
      try {
        this.performCleanup()
        const serializedValue = this.safeJSONStringify(value)
        localStorage.setItem(this.getKey(key), serializedValue)
        return true
      } catch (retryError) {
        console.error(`Retry failed for localStorage item ${key}:`, retryError)
        return false
      }
    }
  }

  getItem<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(this.getKey(key))
      return this.safeJSONParse(value, fallback)
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error)
      return fallback
    }
  }

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error)
      return false
    }
  }

  // Specific methods for app data
  getImages(): any[] {
    return this.getItem("images", []).map((image: any, index: number) => ({
      ...image,
      id: image.id || `image_${index}_${Date.now()}`,
      url: image.url || "",
      tags: image.tags || [],
      source: image.source || "unknown",
      downloadedAt: image.downloadedAt || new Date().toISOString(),
    }))
  }

  setImages(images: any[]): boolean {
    const validatedImages = images.map((image, index) => ({
      ...image,
      id: image.id || `image_${index}_${Date.now()}`,
      url: image.url || "",
      tags: image.tags || [],
      source: image.source || "unknown",
      downloadedAt: image.downloadedAt || new Date().toISOString(),
    }))
    return this.setItem("images", validatedImages)
  }

  getFavorites(): string[] {
    return this.getItem("favorites", [])
  }

  setFavorites(favorites: string[]): boolean {
    const validFavorites = favorites.filter((id) => id && typeof id === "string")
    return this.setItem("favorites", validFavorites)
  }

  isFavorite(imageId: string): boolean {
    if (!imageId || typeof imageId !== "string") return false

    try {
      const favorites = this.getFavorites()
      return favorites.includes(imageId)
    } catch (error) {
      console.error("Error checking favorite status:", error)
      return false
    }
  }

  toggleFavorite(imageId: string): boolean {
    if (!imageId || typeof imageId !== "string") return false

    try {
      const favorites = this.getFavorites()
      const index = favorites.indexOf(imageId)

      if (index > -1) {
        favorites.splice(index, 1)
      } else {
        favorites.push(imageId)
      }

      return this.setFavorites(favorites)
    } catch (error) {
      console.error("Error toggling favorite:", error)
      return false
    }
  }

  getCollections(): any[] {
    return this.getItem("collections", [])
  }

  setCollections(collections: any[]): boolean {
    return this.setItem("collections", collections)
  }

  getSettings(): any {
    return this.getItem("settings", {
      theme: "system",
      downloadPath: "/downloads",
      autoUpscale: false,
      maxConcurrentDownloads: 3,
      apiKeys: {},
    })
  }

  setSettings(settings: any): boolean {
    return this.setItem("settings", settings)
  }

  getDownloadHistory(): any[] {
    return this.getItem("downloadHistory", [])
  }

  setDownloadHistory(history: any[]): boolean {
    return this.setItem("downloadHistory", history)
  }

  addToDownloadHistory(entry: any): boolean {
    try {
      const history = this.getDownloadHistory()
      const newEntry = {
        ...entry,
        id: entry.id || `download_${Date.now()}`,
        timestamp: entry.timestamp || new Date().toISOString(),
      }

      history.unshift(newEntry)

      // Keep only last 200 entries
      if (history.length > 200) {
        history.splice(200)
      }

      return this.setDownloadHistory(history)
    } catch (error) {
      console.error("Error adding to download history:", error)
      return false
    }
  }

  clearAllData(): boolean {
    try {
      const keys = ["images", "favorites", "collections", "downloadHistory", "settings"]
      keys.forEach((key) => this.removeItem(key))
      return true
    } catch (error) {
      console.error("Error clearing all data:", error)
      return false
    }
  }

  exportData(): StorageData | null {
    try {
      return {
        images: this.getImages(),
        favorites: this.getFavorites(),
        collections: this.getCollections(),
        settings: this.getSettings(),
        downloadHistory: this.getDownloadHistory(),
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      return null
    }
  }

  importData(data: Partial<StorageData>): boolean {
    try {
      if (data.images) this.setImages(data.images)
      if (data.favorites) this.setFavorites(data.favorites)
      if (data.collections) this.setCollections(data.collections)
      if (data.settings) this.setSettings(data.settings)
      if (data.downloadHistory) this.setDownloadHistory(data.downloadHistory)
      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }
}

export const storageManager = new LocalStorageManager()

// Convenience functions
export const getStorageStats = () => storageManager.getStorageStats()
export const getImages = () => storageManager.getImages()
export const setImages = (images: any[]) => storageManager.setImages(images)
export const getFavorites = () => storageManager.getFavorites()
export const setFavorites = (favorites: string[]) => storageManager.setFavorites(favorites)
export const isFavorite = (imageId: string) => storageManager.isFavorite(imageId)
export const toggleFavorite = (imageId: string) => storageManager.toggleFavorite(imageId)
export const getCollections = () => storageManager.getCollections()
export const setCollections = (collections: any[]) => storageManager.setCollections(collections)
export const getSettings = () => storageManager.getSettings()
export const setSettings = (settings: any) => storageManager.setSettings(settings)
export const getDownloadHistory = () => storageManager.getDownloadHistory()
export const addToDownloadHistory = (entry: any) => storageManager.addToDownloadHistory(entry)
