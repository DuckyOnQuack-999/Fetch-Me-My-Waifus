import type { WaifuImage, Collection, Collections, Settings } from "@/types/waifu"

// Storage keys with versioning for future migrations
const STORAGE_KEYS = {
  IMAGES: "waifu-downloader-images-v2",
  FAVORITES: "waifu-downloader-favorites-v2",
  COLLECTIONS: "waifu-downloader-collections-v2",
  SETTINGS: "waifu-downloader-settings-v2",
  DOWNLOAD_HISTORY: "waifu-downloader-download-history-v2",
  CACHE: "waifu-downloader-cache-v2",
  USER_PREFERENCES: "waifu-downloader-preferences-v2",
  API_CACHE: "waifu-downloader-api-cache-v2",
} as const

// Storage quota management
const STORAGE_QUOTA = {
  MAX_IMAGES: 10000,
  MAX_FAVORITES: 5000,
  MAX_COLLECTIONS: 1000,
  MAX_DOWNLOAD_HISTORY: 2000,
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CLEANUP_THRESHOLD: 0.9, // Clean up when 90% full
} as const

class LocalStorageManager {
  private isClient = typeof window !== "undefined"

  // Safe JSON operations with error handling
  private safeJsonParse<T>(json: string | null, fallback: T): T {
    if (!json) return fallback
    try {
      const parsed = JSON.parse(json)
      return parsed !== null && parsed !== undefined ? parsed : fallback
    } catch (error) {
      console.warn("Failed to parse JSON from localStorage:", error)
      return fallback
    }
  }

  private safeJsonStringify(data: any): string {
    try {
      return JSON.stringify(data)
    } catch (error) {
      console.error("Failed to stringify data for localStorage:", error)
      return "{}"
    }
  }

  private safeGetItem(key: string): string | null {
    if (!this.isClient) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Failed to get item from localStorage (${key}):`, error)
      return null
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    if (!this.isClient) return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Failed to set item in localStorage (${key}):`, error)
      // Try to free up space and retry
      if (error.name === "QuotaExceededError") {
        this.cleanupStorage()
        try {
          localStorage.setItem(key, value)
          return true
        } catch (retryError) {
          console.error("Failed to set item even after cleanup:", retryError)
        }
      }
      return false
    }
  }

  private safeRemoveItem(key: string): boolean {
    if (!this.isClient) return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove item from localStorage (${key}):`, error)
      return false
    }
  }

  // Storage quota management
  private getStorageUsage(): { used: number; available: number; percentage: number } {
    if (!this.isClient) return { used: 0, available: 0, percentage: 0 }

    try {
      let used = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("waifu-downloader-")) {
          const value = localStorage.getItem(key)
          if (value) {
            used += key.length + value.length
          }
        }
      }

      const available = STORAGE_QUOTA.MAX_CACHE_SIZE - used
      const percentage = used / STORAGE_QUOTA.MAX_CACHE_SIZE

      return { used, available, percentage }
    } catch (error) {
      console.error("Failed to calculate storage usage:", error)
      return { used: 0, available: 0, percentage: 0 }
    }
  }

  private cleanupStorage(): void {
    if (!this.isClient) return

    try {
      // Remove old cache entries first
      const cacheKeys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes("cache") || key?.includes("temp")) {
          cacheKeys.push(key)
        }
      }

      // Remove oldest cache entries
      cacheKeys
        .sort()
        .slice(0, Math.floor(cacheKeys.length * 0.5))
        .forEach((key) => {
          localStorage.removeItem(key)
        })

      // Trim download history if too large
      const history = this.getDownloadHistory()
      if (history.length > STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY) {
        const trimmed = history.slice(0, STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY)
        this.saveDownloadHistory(trimmed)
      }

      console.log("Storage cleanup completed")
    } catch (error) {
      console.error("Failed to cleanup storage:", error)
    }
  }

  // Images management
  getImages(): WaifuImage[] {
    const data = this.safeGetItem(STORAGE_KEYS.IMAGES)
    const images = this.safeJsonParse<WaifuImage[]>(data, [])

    // Ensure images don't exceed quota
    if (images.length > STORAGE_QUOTA.MAX_IMAGES) {
      return images.slice(0, STORAGE_QUOTA.MAX_IMAGES)
    }

    return images
  }

  saveImages(images: WaifuImage[]): boolean {
    // Trim if exceeding quota
    const trimmedImages = images.slice(0, STORAGE_QUOTA.MAX_IMAGES)
    return this.safeSetItem(STORAGE_KEYS.IMAGES, this.safeJsonStringify(trimmedImages))
  }

  addImage(image: WaifuImage): boolean {
    const images = this.getImages()

    // Check if image already exists
    const exists = images.some((img) => img.image_id === image.image_id || img.url === image.url)

    if (exists) return true

    // Add metadata
    const enhancedImage: WaifuImage = {
      ...image,
      created_at: image.created_at || new Date().toISOString(),
      metadata: {
        ...image.metadata,
        addedAt: new Date().toISOString(),
        dominantColor: image.metadata?.dominantColor,
        aspectRatio: image.width / image.height,
      },
    }

    images.unshift(enhancedImage) // Add to beginning
    return this.saveImages(images)
  }

  removeImage(imageId: string | number): boolean {
    const images = this.getImages()
    const filtered = images.filter((img) => img.image_id.toString() !== imageId.toString())
    return this.saveImages(filtered)
  }

  updateImage(imageId: string | number, updates: Partial<WaifuImage>): boolean {
    const images = this.getImages()
    const updated = images.map((img) =>
      img.image_id.toString() === imageId.toString()
        ? { ...img, ...updates, updated_at: new Date().toISOString() }
        : img,
    )
    return this.saveImages(updated)
  }

  // Favorites management
  getFavorites(): string[] {
    const data = this.safeGetItem(STORAGE_KEYS.FAVORITES)
    const favorites = this.safeJsonParse<string[]>(data, [])

    // Ensure favorites don't exceed quota
    if (favorites.length > STORAGE_QUOTA.MAX_FAVORITES) {
      return favorites.slice(0, STORAGE_QUOTA.MAX_FAVORITES)
    }

    return favorites
  }

  saveFavorites(favorites: string[]): boolean {
    const trimmed = favorites.slice(0, STORAGE_QUOTA.MAX_FAVORITES)
    return this.safeSetItem(STORAGE_KEYS.FAVORITES, this.safeJsonStringify(trimmed))
  }

  addFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    const id = imageId.toString()

    if (favorites.includes(id)) return true

    favorites.unshift(id) // Add to beginning
    return this.saveFavorites(favorites)
  }

  removeFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    const id = imageId.toString()
    const filtered = favorites.filter((fav) => fav !== id)
    return this.saveFavorites(filtered)
  }

  isFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    return favorites.includes(imageId.toString())
  }

  toggleFavorite(imageId: string | number): boolean {
    const id = imageId.toString()
    if (this.isFavorite(id)) {
      return this.removeFavorite(id)
    } else {
      return this.addFavorite(id)
    }
  }

  // Collections management
  getCollections(): Collections {
    const data = this.safeGetItem(STORAGE_KEYS.COLLECTIONS)
    return this.safeJsonParse<Collections>(data, {})
  }

  saveCollections(collections: Collections): boolean {
    // Ensure collections don't exceed quota
    const collectionEntries = Object.entries(collections)
    if (collectionEntries.length > STORAGE_QUOTA.MAX_COLLECTIONS) {
      const trimmed = Object.fromEntries(collectionEntries.slice(0, STORAGE_QUOTA.MAX_COLLECTIONS))
      return this.safeSetItem(STORAGE_KEYS.COLLECTIONS, this.safeJsonStringify(trimmed))
    }

    return this.safeSetItem(STORAGE_KEYS.COLLECTIONS, this.safeJsonStringify(collections))
  }

  createCollection(name: string, description?: string): string | null {
    const collections = this.getCollections()
    const id = `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newCollection: Collection = {
      id,
      name,
      description: description || "",
      imageIds: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    }

    collections[id] = newCollection

    if (this.saveCollections(collections)) {
      return id
    }

    return null
  }

  deleteCollection(collectionId: string): boolean {
    const collections = this.getCollections()
    delete collections[collectionId]
    return this.saveCollections(collections)
  }

  updateCollection(collectionId: string, updates: Partial<Collection>): boolean {
    const collections = this.getCollections()

    if (!collections[collectionId]) return false

    collections[collectionId] = {
      ...collections[collectionId],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    return this.saveCollections(collections)
  }

  addToCollection(collectionId: string, imageId: string | number): boolean {
    const collections = this.getCollections()
    const collection = collections[collectionId]

    if (!collection) return false

    const id = imageId.toString()
    if (!collection.imageIds.includes(id)) {
      collection.imageIds.push(id)
      collection.updated_at = new Date().toISOString()
      return this.saveCollections(collections)
    }

    return true
  }

  removeFromCollection(collectionId: string, imageId: string | number): boolean {
    const collections = this.getCollections()
    const collection = collections[collectionId]

    if (!collection) return false

    const id = imageId.toString()
    collection.imageIds = collection.imageIds.filter((imgId) => imgId !== id)
    collection.updated_at = new Date().toISOString()

    return this.saveCollections(collections)
  }

  // Settings management
  getSettings(): Partial<Settings> {
    const data = this.safeGetItem(STORAGE_KEYS.SETTINGS)
    return this.safeJsonParse<Partial<Settings>>(data, {})
  }

  saveSettings(settings: Partial<Settings>): boolean {
    const settingsWithTimestamp = {
      ...settings,
      lastUpdated: new Date().toISOString(),
    }
    return this.safeSetItem(STORAGE_KEYS.SETTINGS, this.safeJsonStringify(settingsWithTimestamp))
  }

  updateSettings(updates: Partial<Settings>): boolean {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...updates }
    return this.saveSettings(updatedSettings)
  }

  // Download history management
  getDownloadHistory(): any[] {
    const data = this.safeGetItem(STORAGE_KEYS.DOWNLOAD_HISTORY)
    const history = this.safeJsonParse<any[]>(data, [])

    // Ensure history doesn't exceed quota
    if (history.length > STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY) {
      return history.slice(0, STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY)
    }

    return history
  }

  saveDownloadHistory(history: any[]): boolean {
    const trimmed = history.slice(0, STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY)
    return this.safeSetItem(STORAGE_KEYS.DOWNLOAD_HISTORY, this.safeJsonStringify(trimmed))
  }

  addToDownloadHistory(item: any): boolean {
    const history = this.getDownloadHistory()

    const historyItem = {
      ...item,
      id: item.id || `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    history.unshift(historyItem) // Add to beginning
    return this.saveDownloadHistory(history)
  }

  clearDownloadHistory(): boolean {
    return this.safeSetItem(STORAGE_KEYS.DOWNLOAD_HISTORY, "[]")
  }

  // Cache management
  getCacheItem(key: string): any {
    const data = this.safeGetItem(`${STORAGE_KEYS.CACHE}-${key}`)
    const cached = this.safeJsonParse<{ data: any; timestamp: number; ttl: number } | null>(data, null)

    if (!cached) return null

    // Check if cache has expired
    if (Date.now() > cached.timestamp + cached.ttl) {
      this.safeRemoveItem(`${STORAGE_KEYS.CACHE}-${key}`)
      return null
    }

    return cached.data
  }

  setCacheItem(key: string, data: any, ttlMs = 3600000): boolean {
    // 1 hour default
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    }

    return this.safeSetItem(`${STORAGE_KEYS.CACHE}-${key}`, this.safeJsonStringify(cacheItem))
  }

  clearCache(): boolean {
    if (!this.isClient) return false

    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(STORAGE_KEYS.CACHE)) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error("Failed to clear cache:", error)
      return false
    }
  }

  // Bulk operations
  exportData(): any {
    return {
      images: this.getImages(),
      favorites: this.getFavorites(),
      collections: this.getCollections(),
      settings: this.getSettings(),
      downloadHistory: this.getDownloadHistory(),
      exportedAt: new Date().toISOString(),
      version: "2.0",
    }
  }

  importData(data: any): boolean {
    if (!data || typeof data !== "object") return false

    try {
      let success = true

      // Import with validation
      if (Array.isArray(data.images)) {
        success = success && this.saveImages(data.images)
      }

      if (Array.isArray(data.favorites)) {
        success = success && this.saveFavorites(data.favorites)
      }

      if (data.collections && typeof data.collections === "object") {
        success = success && this.saveCollections(data.collections)
      }

      if (data.settings && typeof data.settings === "object") {
        success = success && this.saveSettings(data.settings)
      }

      if (Array.isArray(data.downloadHistory)) {
        success = success && this.saveDownloadHistory(data.downloadHistory)
      }

      return success
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  }

  clearAllData(): boolean {
    if (!this.isClient) return false

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        this.safeRemoveItem(key)
      })

      // Clear cache items
      this.clearCache()

      return true
    } catch (error) {
      console.error("Failed to clear all data:", error)
      return false
    }
  }

  // Statistics and analytics
  getStorageStats(): {
    usage: { used: number; available: number; percentage: number }
    counts: {
      images: number
      favorites: number
      collections: number
      downloadHistory: number
    }
    lastUpdated: string
  } {
    const usage = this.getStorageUsage()

    return {
      usage,
      counts: {
        images: this.getImages().length,
        favorites: this.getFavorites().length,
        collections: Object.keys(this.getCollections()).length,
        downloadHistory: this.getDownloadHistory().length,
      },
      lastUpdated: new Date().toISOString(),
    }
  }

  // Migration utilities
  migrateFromOldVersion(): boolean {
    try {
      // Check for old version data
      const oldImages = this.safeGetItem("waifu-downloader-images")
      const oldFavorites = this.safeGetItem("waifu-downloader-favorites")
      const oldSettings = this.safeGetItem("waifu-downloader-settings")

      let migrated = false

      if (oldImages) {
        const images = this.safeJsonParse<WaifuImage[]>(oldImages, [])
        if (images.length > 0) {
          this.saveImages(images)
          this.safeRemoveItem("waifu-downloader-images")
          migrated = true
        }
      }

      if (oldFavorites) {
        const favorites = this.safeJsonParse<string[]>(oldFavorites, [])
        if (favorites.length > 0) {
          this.saveFavorites(favorites)
          this.safeRemoveItem("waifu-downloader-favorites")
          migrated = true
        }
      }

      if (oldSettings) {
        const settings = this.safeJsonParse<Partial<Settings>>(oldSettings, {})
        if (Object.keys(settings).length > 0) {
          this.saveSettings(settings)
          this.safeRemoveItem("waifu-downloader-settings")
          migrated = true
        }
      }

      if (migrated) {
        console.log("Successfully migrated data from old version")
      }

      return migrated
    } catch (error) {
      console.error("Failed to migrate from old version:", error)
      return false
    }
  }
}

// Create singleton instance
export const storage = new LocalStorageManager()

// Export individual functions for convenience
export const {
  getImages,
  saveImages,
  addImage,
  removeImage,
  updateImage,
  getFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
  getCollections,
  saveCollections,
  createCollection,
  deleteCollection,
  updateCollection,
  addToCollection,
  removeFromCollection,
  getSettings,
  saveSettings,
  updateSettings,
  getDownloadHistory,
  saveDownloadHistory,
  addToDownloadHistory,
  clearDownloadHistory,
  getCacheItem,
  setCacheItem,
  clearCache,
  exportData,
  importData,
  clearAllData,
  getStorageStats,
} = storage

export default storage
