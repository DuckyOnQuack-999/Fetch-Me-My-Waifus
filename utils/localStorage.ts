import type { WaifuImage, Collection, Collections, Settings } from "@/types/waifu"

const STORAGE_KEYS = {
  IMAGES: "waifu-downloader-images-v2",
  FAVORITES: "waifu-downloader-favorites-v2",
  COLLECTIONS: "waifu-downloader-collections-v2",
  SETTINGS: "waifu-downloader-settings-v2",
  DOWNLOAD_HISTORY: "waifu-downloader-download-history-v2",
  CACHE: "waifu-downloader-cache-v2",
  USER_PREFERENCES: "waifu-downloader-preferences-v2",
  API_CACHE: "waifu-downloader-api-cache-v2",
  USER_PHOTOS: "waifu-user-photos",
  LEGACY_IMAGES: "waifu-downloader-images",
  LEGACY_FAVORITES: "waifu-downloader-favorites",
  LEGACY_COLLECTIONS: "waifu-downloader-collections",
  LEGACY_SETTINGS: "waifu-downloader-settings",
} as const

const STORAGE_QUOTA = {
  MAX_IMAGES: 10000,
  MAX_FAVORITES: 5000,
  MAX_COLLECTIONS: 1000,
  MAX_DOWNLOAD_HISTORY: 2000,
  MAX_CACHE_SIZE: 100 * 1024 * 1024,
  CLEANUP_THRESHOLD: 0.9,
} as const

class LocalStorageManager {
  private isClient = typeof window !== "undefined"
  private currentUserId: string | null = null

  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId
  }

  initializeUserStorage(userId: string): void {
    if (!this.isClient) return
    const userPhotosKey = this.getUserPhotosKey(userId)
    if (!localStorage.getItem(userPhotosKey)) {
      localStorage.setItem(userPhotosKey, JSON.stringify([]))
    }
  }

  migrateFromOldVersion(): void {
    if (!this.isClient) return

    try {
      const legacyImages = localStorage.getItem(STORAGE_KEYS.LEGACY_IMAGES)
      if (legacyImages && !localStorage.getItem(STORAGE_KEYS.IMAGES)) {
        localStorage.setItem(STORAGE_KEYS.IMAGES, legacyImages)
        localStorage.removeItem(STORAGE_KEYS.LEGACY_IMAGES)
      }

      const legacyFavorites = localStorage.getItem(STORAGE_KEYS.LEGACY_FAVORITES)
      if (legacyFavorites && !localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, legacyFavorites)
        localStorage.removeItem(STORAGE_KEYS.LEGACY_FAVORITES)
      }

      const legacyCollections = localStorage.getItem(STORAGE_KEYS.LEGACY_COLLECTIONS)
      if (legacyCollections && !localStorage.getItem(STORAGE_KEYS.COLLECTIONS)) {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, legacyCollections)
        localStorage.removeItem(STORAGE_KEYS.LEGACY_COLLECTIONS)
      }

      const legacySettings = localStorage.getItem(STORAGE_KEYS.LEGACY_SETTINGS)
      if (legacySettings && !localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, legacySettings)
        localStorage.removeItem(STORAGE_KEYS.LEGACY_SETTINGS)
      }

      console.log("[Storage] Migration completed successfully")
    } catch (error) {
      console.warn("[Storage] Migration skipped or failed:", error)
    }
  }

  private getUserPhotosKey(userId?: string): string {
    const id = userId || this.currentUserId
    return id ? `${STORAGE_KEYS.USER_PHOTOS}-${id}` : STORAGE_KEYS.USER_PHOTOS
  }

  private getUserKey(key: string, userId?: string): string {
    const id = userId || this.currentUserId
    return id ? `${key}-user-${id}` : key
  }

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
      if (error instanceof Error && error.name === "QuotaExceededError") {
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

  private getStorageUsage(): { used: number; available: number; percentage: number } {
    if (!this.isClient) return { used: 0, available: STORAGE_QUOTA.MAX_CACHE_SIZE, percentage: 0 }

    try {
      let used = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("waifu-")) {
          const value = localStorage.getItem(key)
          if (value) {
            used += key.length + value.length
          }
        }
      }

      const available = Math.max(0, STORAGE_QUOTA.MAX_CACHE_SIZE - used)
      const percentage = Math.min(100, (used / STORAGE_QUOTA.MAX_CACHE_SIZE) * 100)

      return { used, available, percentage }
    } catch (error) {
      console.error("Failed to calculate storage usage:", error)
      return { used: 0, available: STORAGE_QUOTA.MAX_CACHE_SIZE, percentage: 0 }
    }
  }

  private cleanupStorage(): void {
    if (!this.isClient) return

    try {
      const cacheKeys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes("cache") || key?.includes("temp")) {
          cacheKeys.push(key)
        }
      }

      cacheKeys
        .sort()
        .slice(0, Math.floor(cacheKeys.length * 0.5))
        .forEach((key) => {
          localStorage.removeItem(key)
        })

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

  getUserPhotos(): WaifuImage[] {
    if (!this.currentUserId) return []
    const key = this.getUserPhotosKey()
    const data = this.safeGetItem(key)
    return this.safeJsonParse<WaifuImage[]>(data, [])
  }

  saveUserPhoto(image: WaifuImage): boolean {
    if (!this.currentUserId) return false
    const photos = this.getUserPhotos()
    const imageWithId = {
      ...image,
      image_id: image.image_id || `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUserId,
      created_at: image.created_at || new Date().toISOString(),
    }
    photos.unshift(imageWithId)
    const key = this.getUserPhotosKey()
    return this.safeSetItem(key, this.safeJsonStringify(photos))
  }

  removeUserPhoto(imageId: string | number): boolean {
    if (!this.currentUserId) return false
    const photos = this.getUserPhotos()
    const filtered = photos.filter((img) => img.image_id?.toString() !== imageId.toString())
    const key = this.getUserPhotosKey()
    return this.safeSetItem(key, this.safeJsonStringify(filtered))
  }

  getImages(): WaifuImage[] {
    const key = this.getUserKey(STORAGE_KEYS.IMAGES)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<WaifuImage[]>(data, [])
  }

  addImage(image: WaifuImage): boolean {
    const images = this.getImages()
    if (images.length >= STORAGE_QUOTA.MAX_IMAGES) {
      console.warn("Maximum image limit reached")
      return false
    }
    const imageWithId = {
      ...image,
      image_id: image.image_id || `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    images.unshift(imageWithId)
    const key = this.getUserKey(STORAGE_KEYS.IMAGES)
    return this.safeSetItem(key, this.safeJsonStringify(images))
  }

  removeImage(imageId: string | number): boolean {
    const images = this.getImages()
    const filtered = images.filter((img) => img.image_id?.toString() !== imageId.toString())
    const key = this.getUserKey(STORAGE_KEYS.IMAGES)
    return this.safeSetItem(key, this.safeJsonStringify(filtered))
  }

  updateImage(imageId: string | number, updates: Partial<WaifuImage>): boolean {
    const images = this.getImages()
    const index = images.findIndex((img) => img.image_id?.toString() === imageId.toString())
    if (index === -1) return false
    images[index] = { ...images[index], ...updates }
    const key = this.getUserKey(STORAGE_KEYS.IMAGES)
    return this.safeSetItem(key, this.safeJsonStringify(images))
  }

  getFavorites(): string[] {
    const key = this.getUserKey(STORAGE_KEYS.FAVORITES)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<string[]>(data, [])
  }

  isFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    return favorites.includes(imageId.toString())
  }

  addFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    const id = imageId.toString()
    if (favorites.includes(id)) return true
    if (favorites.length >= STORAGE_QUOTA.MAX_FAVORITES) {
      console.warn("Maximum favorites limit reached")
      return false
    }
    favorites.unshift(id)
    const key = this.getUserKey(STORAGE_KEYS.FAVORITES)
    return this.safeSetItem(key, this.safeJsonStringify(favorites))
  }

  removeFavorite(imageId: string | number): boolean {
    const favorites = this.getFavorites()
    const filtered = favorites.filter((id) => id !== imageId.toString())
    const key = this.getUserKey(STORAGE_KEYS.FAVORITES)
    return this.safeSetItem(key, this.safeJsonStringify(filtered))
  }

  toggleFavorite(imageId: string | number): boolean {
    if (this.isFavorite(imageId)) {
      return this.removeFavorite(imageId)
    }
    return this.addFavorite(imageId)
  }

  getCollections(): Collections {
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<Collections>(data, {})
  }

  createCollection(name: string, description?: string): string | null {
    const collections = this.getCollections()
    if (Object.keys(collections).length >= STORAGE_QUOTA.MAX_COLLECTIONS) {
      console.warn("Maximum collections limit reached")
      return null
    }
    const collectionId = `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    collections[collectionId] = {
      id: collectionId,
      name,
      description: description || "",
      imageIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    if (this.safeSetItem(key, this.safeJsonStringify(collections))) {
      return collectionId
    }
    return null
  }

  deleteCollection(collectionId: string): boolean {
    const collections = this.getCollections()
    if (!collections[collectionId]) return false
    delete collections[collectionId]
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    return this.safeSetItem(key, this.safeJsonStringify(collections))
  }

  updateCollection(collectionId: string, updates: Partial<Collection>): boolean {
    const collections = this.getCollections()
    if (!collections[collectionId]) return false
    collections[collectionId] = {
      ...collections[collectionId],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    return this.safeSetItem(key, this.safeJsonStringify(collections))
  }

  addToCollection(collectionId: string, imageId: string | number): boolean {
    const collections = this.getCollections()
    if (!collections[collectionId]) return false
    const id = imageId.toString()
    if (!collections[collectionId].imageIds.includes(id)) {
      collections[collectionId].imageIds.push(id)
      collections[collectionId].updatedAt = new Date().toISOString()
    }
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    return this.safeSetItem(key, this.safeJsonStringify(collections))
  }

  removeFromCollection(collectionId: string, imageId: string | number): boolean {
    const collections = this.getCollections()
    if (!collections[collectionId]) return false
    collections[collectionId].imageIds = collections[collectionId].imageIds.filter((id) => id !== imageId.toString())
    collections[collectionId].updatedAt = new Date().toISOString()
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    return this.safeSetItem(key, this.safeJsonStringify(collections))
  }

  getDownloadHistory(): any[] {
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<any[]>(data, [])
  }

  addDownloadRecord(record: any): boolean {
    const history = this.getDownloadHistory()
    history.unshift({
      ...record,
      id: record.id || `download-${Date.now()}`,
      timestamp: record.timestamp || new Date().toISOString(),
    })
    if (history.length > STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY) {
      history.pop()
    }
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    return this.safeSetItem(key, this.safeJsonStringify(history))
  }

  saveDownloadHistory(history: any[]): boolean {
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    return this.safeSetItem(key, this.safeJsonStringify(history))
  }

  clearDownloadHistory(): boolean {
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    return this.safeSetItem(key, "[]")
  }

  getSettings(): Settings | null {
    const key = this.getUserKey(STORAGE_KEYS.SETTINGS)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<Settings | null>(data, null)
  }

  saveSettings(settings: Settings): boolean {
    const key = this.getUserKey(STORAGE_KEYS.SETTINGS)
    return this.safeSetItem(key, this.safeJsonStringify(settings))
  }

  exportData(): any {
    return {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      images: this.getImages(),
      favorites: this.getFavorites(),
      collections: this.getCollections(),
      settings: this.getSettings(),
      downloadHistory: this.getDownloadHistory(),
    }
  }

  importData(data: any): boolean {
    try {
      if (data.images) {
        const key = this.getUserKey(STORAGE_KEYS.IMAGES)
        this.safeSetItem(key, this.safeJsonStringify(data.images))
      }
      if (data.favorites) {
        const key = this.getUserKey(STORAGE_KEYS.FAVORITES)
        this.safeSetItem(key, this.safeJsonStringify(data.favorites))
      }
      if (data.collections) {
        const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
        this.safeSetItem(key, this.safeJsonStringify(data.collections))
      }
      if (data.settings) {
        const key = this.getUserKey(STORAGE_KEYS.SETTINGS)
        this.safeSetItem(key, this.safeJsonStringify(data.settings))
      }
      if (data.downloadHistory) {
        const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
        this.safeSetItem(key, this.safeJsonStringify(data.downloadHistory))
      }
      return true
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  }

  clearAllData(): boolean {
    try {
      const keys = [
        STORAGE_KEYS.IMAGES,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.COLLECTIONS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.DOWNLOAD_HISTORY,
        STORAGE_KEYS.CACHE,
        STORAGE_KEYS.API_CACHE,
      ]
      keys.forEach((key) => {
        this.safeRemoveItem(this.getUserKey(key))
      })
      return true
    } catch (error) {
      console.error("Failed to clear all data:", error)
      return false
    }
  }

  getStorageStats(): {
    usage: { used: number; available: number; percentage: number }
    counts: { images: number; favorites: number; collections: number; downloadHistory: number; userPhotos: number }
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
        userPhotos: this.getUserPhotos().length,
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}

export const storage = new LocalStorageManager()
export default storage
