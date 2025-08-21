interface StorageData {
  images: any[]
  favorites: string[]
  collections: any
  downloadHistory: any[]
  settings: any
  version: string
}

// Storage quota management
const STORAGE_QUOTA = {
  MAX_IMAGES: 10000,
  MAX_FAVORITES: 5000,
  MAX_COLLECTIONS: 1000,
  MAX_DOWNLOAD_HISTORY: 1000,
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CLEANUP_THRESHOLD: 0.9, // Clean up when 90% full
} as const

class LocalStorageManager {
  private readonly STORAGE_KEY = "waifu-downloader"
  private readonly VERSION = "2.0.0"
  private isClient = typeof window !== "undefined"

  // Safe JSON operations with error handling
  private safeJsonParse<T>(data: string | null, fallback: T): T {
    if (!data) return fallback
    try {
      return JSON.parse(data) || fallback
    } catch (error) {
      console.warn("Failed to parse JSON data:", error)
      return fallback
    }
  }

  private safeJsonStringify(data: any): string {
    try {
      return JSON.stringify(data)
    } catch (error) {
      console.error("Failed to stringify data:", error)
      return "{}"
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

  // Get storage data with migration support
  private getStorageData(): StorageData {
    const defaultData: StorageData = {
      images: [],
      favorites: [],
      collections: {},
      downloadHistory: [],
      settings: {},
      version: this.VERSION,
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      const parsed = this.safeJsonParse(data, defaultData)

      // Migration logic
      if (!parsed.version || parsed.version !== this.VERSION) {
        return this.migrateData(parsed)
      }

      return { ...defaultData, ...parsed }
    } catch (error) {
      console.error("Failed to get storage data:", error)
      return defaultData
    }
  }

  // Save storage data safely
  private saveStorageData(data: Partial<StorageData>): boolean {
    try {
      const currentData = this.getStorageData()
      const newData = { ...currentData, ...data, version: this.VERSION }
      localStorage.setItem(this.STORAGE_KEY, this.safeJsonStringify(newData))
      return true
    } catch (error) {
      console.error("Failed to save storage data:", error)
      return false
    }
  }

  // Migrate data from older versions
  private migrateData(oldData: any): StorageData {
    const newData: StorageData = {
      images: [],
      favorites: [],
      collections: {},
      downloadHistory: [],
      settings: {},
      version: this.VERSION,
    }

    try {
      // Migrate images with proper ID generation
      if (Array.isArray(oldData.images)) {
        newData.images = oldData.images.map((image: any, index: number) => ({
          ...image,
          id: image.id || `migrated-${index}-${Date.now()}`,
          createdAt: image.createdAt || new Date().toISOString(),
          tags: Array.isArray(image.tags) ? image.tags : [],
        }))
      }

      // Migrate favorites with validation
      if (Array.isArray(oldData.favorites)) {
        newData.favorites = oldData.favorites.filter((id: any) => typeof id === "string" && id.trim() !== "")
      }

      // Migrate other data
      if (oldData.collections && typeof oldData.collections === "object") {
        newData.collections = oldData.collections
      }

      if (Array.isArray(oldData.downloadHistory)) {
        newData.downloadHistory = oldData.downloadHistory
      }

      if (oldData.settings && typeof oldData.settings === "object") {
        newData.settings = oldData.settings
      }

      // Save migrated data
      this.saveStorageData(newData)
      console.log("Data migrated successfully to version", this.VERSION)

      return newData
    } catch (error) {
      console.error("Migration failed:", error)
      return newData
    }
  }

  // Images management
  getImages(): any[] {
    const data = this.getStorageData()
    return data.images || []
  }

  addImage(image: any): boolean {
    if (!image || typeof image !== "object") return false

    try {
      const images = this.getImages()
      const imageWithId = {
        ...image,
        id: image.id || `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: image.createdAt || new Date().toISOString(),
        tags: Array.isArray(image.tags) ? image.tags : [],
      }

      // Check for duplicates
      const exists = images.some(
        (existing) => existing.id === imageWithId.id || (existing.url && existing.url === imageWithId.url),
      )

      if (exists) {
        console.warn("Image already exists")
        return false
      }

      images.push(imageWithId)
      return this.saveStorageData({ images })
    } catch (error) {
      console.error("Failed to add image:", error)
      return false
    }
  }

  removeImage(imageId: string | number): boolean {
    if (!imageId) return false

    try {
      const id = imageId.toString()
      const images = this.getImages()
      const filteredImages = images.filter((image) => image.id !== id)

      if (filteredImages.length === images.length) {
        console.warn("Image not found for removal")
        return false
      }

      return this.saveStorageData({ images: filteredImages })
    } catch (error) {
      console.error("Failed to remove image:", error)
      return false
    }
  }

  updateImage(imageId: string | number, updates: any): boolean {
    if (!imageId || !updates) return false

    try {
      const id = imageId.toString()
      const images = this.getImages()
      const imageIndex = images.findIndex((image) => image.id === id)

      if (imageIndex === -1) {
        console.warn("Image not found for update")
        return false
      }

      images[imageIndex] = { ...images[imageIndex], ...updates }
      return this.saveStorageData({ images })
    } catch (error) {
      console.error("Failed to update image:", error)
      return false
    }
  }

  // Favorites management
  getFavorites(): string[] {
    const data = this.getStorageData()
    return Array.isArray(data.favorites) ? data.favorites : []
  }

  isFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    try {
      const id = imageId.toString()
      const favorites = this.getFavorites()
      return favorites.includes(id)
    } catch (error) {
      console.error("Failed to check favorite status:", error)
      return false
    }
  }

  addFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    try {
      const id = imageId.toString()
      const favorites = this.getFavorites()

      if (favorites.includes(id)) {
        return true // Already a favorite
      }

      favorites.push(id)
      return this.saveStorageData({ favorites })
    } catch (error) {
      console.error("Failed to add favorite:", error)
      return false
    }
  }

  removeFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    try {
      const id = imageId.toString()
      const favorites = this.getFavorites()
      const filteredFavorites = favorites.filter((favId) => favId !== id)

      return this.saveStorageData({ favorites: filteredFavorites })
    } catch (error) {
      console.error("Failed to remove favorite:", error)
      return false
    }
  }

  toggleFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    try {
      const id = imageId.toString()
      return this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
      return false
    }
  }

  // Collections management
  getCollections(): any {
    const data = this.getStorageData()
    return data.collections || {}
  }

  createCollection(name: string, description?: string): string | null {
    if (!name || typeof name !== "string") return null

    try {
      const collections = this.getCollections()
      const collectionId = `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      collections[collectionId] = {
        id: collectionId,
        name: name.trim(),
        description: description || "",
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return this.saveStorageData({ collections }) ? collectionId : null
    } catch (error) {
      console.error("Failed to create collection:", error)
      return null
    }
  }

  deleteCollection(collectionId: string): boolean {
    if (!collectionId) return false

    try {
      const collections = this.getCollections()
      if (!collections[collectionId]) return false

      delete collections[collectionId]
      return this.saveStorageData({ collections })
    } catch (error) {
      console.error("Failed to delete collection:", error)
      return false
    }
  }

  updateCollection(collectionId: string, updates: any): boolean {
    if (!collectionId || !updates) return false

    try {
      const collections = this.getCollections()
      if (!collections[collectionId]) return false

      collections[collectionId] = {
        ...collections[collectionId],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      return this.saveStorageData({ collections })
    } catch (error) {
      console.error("Failed to update collection:", error)
      return false
    }
  }

  addToCollection(collectionId: string, imageId: string | number): boolean {
    if (!collectionId || !imageId) return false

    try {
      const id = imageId.toString()
      const collections = this.getCollections()
      const collection = collections[collectionId]

      if (!collection) return false

      if (!Array.isArray(collection.images)) {
        collection.images = []
      }

      if (!collection.images.includes(id)) {
        collection.images.push(id)
        collection.updatedAt = new Date().toISOString()
        return this.saveStorageData({ collections })
      }

      return true // Already in collection
    } catch (error) {
      console.error("Failed to add to collection:", error)
      return false
    }
  }

  removeFromCollection(collectionId: string, imageId: string | number): boolean {
    if (!collectionId || !imageId) return false

    try {
      const id = imageId.toString()
      const collections = this.getCollections()
      const collection = collections[collectionId]

      if (!collection || !Array.isArray(collection.images)) return false

      collection.images = collection.images.filter((imgId: string) => imgId !== id)
      collection.updatedAt = new Date().toISOString()

      return this.saveStorageData({ collections })
    } catch (error) {
      console.error("Failed to remove from collection:", error)
      return false
    }
  }

  // Download history
  getDownloadHistory(): any[] {
    const data = this.getStorageData()
    return Array.isArray(data.downloadHistory) ? data.downloadHistory : []
  }

  addDownloadRecord(record: any): boolean {
    if (!record || typeof record !== "object") return false

    try {
      const history = this.getDownloadHistory()
      const recordWithId = {
        ...record,
        id: record.id || `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: record.timestamp || new Date().toISOString(),
      }

      history.unshift(recordWithId) // Add to beginning

      // Keep only last 1000 records
      if (history.length > 1000) {
        history.splice(1000)
      }

      return this.saveStorageData({ downloadHistory: history })
    } catch (error) {
      console.error("Failed to add download record:", error)
      return false
    }
  }

  clearDownloadHistory(): boolean {
    try {
      return this.saveStorageData({ downloadHistory: [] })
    } catch (error) {
      console.error("Failed to clear download history:", error)
      return false
    }
  }

  // Settings management
  getSettings(): any {
    const data = this.getStorageData()
    return data.settings || {}
  }

  saveSettings(settings: any): boolean {
    if (!settings || typeof settings !== "object") return false

    try {
      return this.saveStorageData({ settings })
    } catch (error) {
      console.error("Failed to save settings:", error)
      return false
    }
  }

  // Utility functions
  exportData(): any {
    try {
      return this.getStorageData()
    } catch (error) {
      console.error("Failed to export data:", error)
      return null
    }
  }

  importData(data: any): boolean {
    if (!data || typeof data !== "object") return false

    try {
      // Validate and sanitize imported data
      const sanitizedData: Partial<StorageData> = {}

      if (Array.isArray(data.images)) {
        sanitizedData.images = data.images.map((image: any, index: number) => ({
          ...image,
          id: image.id || `imported-${index}-${Date.now()}`,
          createdAt: image.createdAt || new Date().toISOString(),
          tags: Array.isArray(image.tags) ? image.tags : [],
        }))
      }

      if (Array.isArray(data.favorites)) {
        sanitizedData.favorites = data.favorites.filter((id: any) => typeof id === "string" && id.trim() !== "")
      }

      if (data.collections && typeof data.collections === "object") {
        sanitizedData.collections = data.collections
      }

      if (Array.isArray(data.downloadHistory)) {
        sanitizedData.downloadHistory = data.downloadHistory
      }

      if (data.settings && typeof data.settings === "object") {
        sanitizedData.settings = data.settings
      }

      return this.saveStorageData(sanitizedData)
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  }

  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      return true
    } catch (error) {
      console.error("Failed to clear all data:", error)
      return false
    }
  }

  getStorageStats(): any {
    try {
      const data = this.getStorageData()
      const dataString = this.safeJsonStringify(data)

      return {
        totalImages: data.images?.length || 0,
        totalFavorites: data.favorites?.length || 0,
        totalCollections: Object.keys(data.collections || {}).length,
        totalDownloads: data.downloadHistory?.length || 0,
        storageSize: new Blob([dataString]).size,
        version: data.version,
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Failed to get storage stats:", error)
      return {
        totalImages: 0,
        totalFavorites: 0,
        totalCollections: 0,
        totalDownloads: 0,
        storageSize: 0,
        version: this.VERSION,
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  // Migration helper
  migrateFromOldVersion(): boolean {
    try {
      const data = this.getStorageData()
      // Migration is handled automatically in getStorageData
      return true
    } catch (error) {
      console.error("Migration failed:", error)
      return false
    }
  }
}

export const storage = new LocalStorageManager()
