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
} as const

const STORAGE_QUOTA = {
  MAX_IMAGES: 10000,
  MAX_FAVORITES: 5000,
  MAX_COLLECTIONS: 1000,
  MAX_DOWNLOAD_HISTORY: 2000,
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CLEANUP_THRESHOLD: 0.9,
} as const

class LocalStorageManager {
  private isClient = typeof window !== "undefined"
  private currentUserId: string | null = null

  setCurrentUser(userId: string | null): void {
    this.currentUserId = userId
  }

  initializeUserStorage(userId: string): void {
    const userPhotosKey = this.getUserPhotosKey(userId)
    if (!localStorage.getItem(userPhotosKey)) {
      localStorage.setItem(userPhotosKey, JSON.stringify([]))
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
      const percentage = (used / STORAGE_QUOTA.MAX_CACHE_SIZE) * 100

      return { used, available, percentage }
    } catch (error) {
      console.error("Failed to calculate storage usage:", error)
      return { used: 0, available: 0, percentage: 0 }
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
    const images = this.safeJsonParse<WaifuImage[]>(data, [])

    return images.slice(0, STORAGE_QUOTA.MAX_IMAGES).map((image, index) => ({
      ...image,
      image_id: image.image_id || `image-${Date.now()}-${index}`,
      created_at: image.created_at || new Date().toISOString(),
      metadata: {
        ...image.metadata,
        addedAt: image.metadata?.addedAt || new Date().toISOString(),
        aspectRatio: image.width && image.height ? image.width / image.height : 1,
      },
    }))
  }

  saveImages(images: WaifuImage[]): boolean {
    const key = this.getUserKey(STORAGE_KEYS.IMAGES)
    const trimmedImages = images.slice(0, STORAGE_QUOTA.MAX_IMAGES).map((image, index) => ({
      ...image,
      image_id: image.image_id || `image-${Date.now()}-${index}`,
    }))
    return this.safeSetItem(key, this.safeJsonStringify(trimmedImages))
  }

  addImage(image: WaifuImage): boolean {
    const images = this.getImages()
    const imageWithId = {
      ...image,
      image_id: image.image_id || `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: image.created_at || new Date().toISOString(),
      metadata: {
        ...image.metadata,
        addedAt: new Date().toISOString(),
        aspectRatio: image.width && image.height ? image.width / image.height : 1,
      },
    }

    const exists = images.some(
      (img) => (img.image_id && img.image_id === imageWithId.image_id) || (img.url && img.url === imageWithId.url),
    )

    if (exists) return true

    images.unshift(imageWithId)

    if (this.currentUserId) {
      this.saveUserPhoto(imageWithId)
    }

    return this.saveImages(images)
  }

  removeImage(imageId: string | number): boolean {
    if (!imageId) return false

    const images = this.getImages()
    const id = imageId.toString()
    const filtered = images.filter((img) => img.image_id?.toString() !== id)

    if (this.currentUserId) {
      this.removeUserPhoto(imageId)
    }

    return this.saveImages(filtered)
  }

  updateImage(imageId: string | number, updates: Partial<WaifuImage>): boolean {
    if (!imageId) return false

    const images = this.getImages()
    const id = imageId.toString()
    const updated = images.map((img) =>
      img.image_id?.toString() === id ? { ...img, ...updates, updated_at: new Date().toISOString() } : img,
    )
    return this.saveImages(updated)
  }

  getFavorites(): string[] {
    const key = this.getUserKey(STORAGE_KEYS.FAVORITES)
    const data = this.safeGetItem(key)
    const favorites = this.safeJsonParse<string[]>(data, [])
    return favorites.filter((fav) => typeof fav === "string" && fav.trim() !== "").slice(0, STORAGE_QUOTA.MAX_FAVORITES)
  }

  saveFavorites(favorites: string[]): boolean {
    const key = this.getUserKey(STORAGE_KEYS.FAVORITES)
    const validFavorites = favorites
      .filter((fav) => typeof fav === "string" && fav.trim() !== "")
      .slice(0, STORAGE_QUOTA.MAX_FAVORITES)
    return this.safeSetItem(key, this.safeJsonStringify(validFavorites))
  }

  addFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    const favorites = this.getFavorites()
    const id = imageId.toString()

    if (favorites.includes(id)) return true

    favorites.unshift(id)
    return this.saveFavorites(favorites)
  }

  removeFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    const favorites = this.getFavorites()
    const id = imageId.toString()
    const filtered = favorites.filter((fav) => fav !== id)
    return this.saveFavorites(filtered)
  }

  isFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    try {
      const favorites = this.getFavorites()
      const id = imageId.toString()
      return favorites.includes(id)
    } catch (error) {
      console.error("Failed to check favorite status:", error)
      return false
    }
  }

  toggleFavorite(imageId: string | number): boolean {
    if (!imageId) return false

    const id = imageId.toString()
    if (this.isFavorite(id)) {
      return this.removeFavorite(id)
    } else {
      return this.addFavorite(id)
    }
  }

  getCollections(): Collections {
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<Collections>(data, {})
  }

  saveCollections(collections: Collections): boolean {
    const key = this.getUserKey(STORAGE_KEYS.COLLECTIONS)
    const collectionEntries = Object.entries(collections)
    if (collectionEntries.length > STORAGE_QUOTA.MAX_COLLECTIONS) {
      const trimmed = Object.fromEntries(collectionEntries.slice(0, STORAGE_QUOTA.MAX_COLLECTIONS))
      return this.safeSetItem(key, this.safeJsonStringify(trimmed))
    }

    return this.safeSetItem(key, this.safeJsonStringify(collections))
  }

  createCollection(name: string, description?: string): string | null {
    if (!name || typeof name !== "string") return null

    const collections = this.getCollections()
    const id = `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newCollection: Collection = {
      id,
      name: name.trim(),
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
    if (!collectionId) return false

    const collections = this.getCollections()
    delete collections[collectionId]
    return this.saveCollections(collections)
  }

  updateCollection(collectionId: string, updates: Partial<Collection>): boolean {
    if (!collectionId || !updates) return false

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
    if (!collectionId || !imageId) return false

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
    if (!collectionId || !imageId) return false

    const collections = this.getCollections()
    const collection = collections[collectionId]

    if (!collection) return false

    const id = imageId.toString()
    collection.imageIds = collection.imageIds.filter((imgId) => imgId !== id)
    collection.updated_at = new Date().toISOString()

    return this.saveCollections(collections)
  }

  getSettings(): Partial<Settings> {
    const key = this.getUserKey(STORAGE_KEYS.SETTINGS)
    const data = this.safeGetItem(key)
    return this.safeJsonParse<Partial<Settings>>(data, {})
  }

  saveSettings(settings: Partial<Settings>): boolean {
    if (!settings || typeof settings !== "object") return false

    const key = this.getUserKey(STORAGE_KEYS.SETTINGS)
    const settingsWithTimestamp = {
      ...settings,
      lastUpdated: new Date().toISOString(),
    }
    return this.safeSetItem(key, this.safeJsonStringify(settingsWithTimestamp))
  }

  updateSettings(updates: Partial<Settings>): boolean {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...updates }
    return this.saveSettings(updatedSettings)
  }

  getDownloadHistory(): any[] {
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    const data = this.safeGetItem(key)
    const history = this.safeJsonParse<any[]>(data, [])
    return history.slice(0, STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY)
  }

  saveDownloadHistory(history: any[]): boolean {
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    const trimmed = history.slice(0, STORAGE_QUOTA.MAX_DOWNLOAD_HISTORY)
    return this.safeSetItem(key, this.safeJsonStringify(trimmed))
  }

  addToDownloadHistory(item: any): boolean {
    if (!item || typeof item !== "object") return false

    const history = this.getDownloadHistory()

    const historyItem = {
      ...item,
      id: item.id || `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    history.unshift(historyItem)
    return this.saveDownloadHistory(history)
  }

  addDownloadRecord(record: any): boolean {
    return this.addToDownloadHistory(record)
  }

  clearDownloadHistory(): boolean {
    const key = this.getUserKey(STORAGE_KEYS.DOWNLOAD_HISTORY)
    return this.safeSetItem(key, "[]")
  }

  getCacheItem(key: string): any {
    const cacheKey = `${STORAGE_KEYS.CACHE}-${key}`
    const data = this.safeGetItem(cacheKey)
    const cached = this.safeJsonParse<{ data: any; timestamp: number; ttl: number } | null>(data, null)

    if (!cached) return null

    if (Date.now() > cached.timestamp + cached.ttl) {
      this.safeRemoveItem(cacheKey)
      return null
    }

    return cached.data
  }

  setCacheItem(key: string, data: any, ttlMs = 3600000): boolean {
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
      const keysToRemove: string[] = []
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

  exportData(): any {
    return {
      images: this.getImages(),
      favorites: this.getFavorites(),
      collections: this.getCollections(),
      settings: this.getSettings(),
      downloadHistory: this.getDownloadHistory(),
      userPhotos: this.getUserPhotos(),
      exportedAt: new Date().toISOString(),
      version: "2.0",
      userId: this.currentUserId,
    }
  }

  importData(data: any): boolean {
    if (!data || typeof data !== "object") return false

    try {
      let success = true

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
        const userKey = this.getUserKey(key)
        this.safeRemoveItem(userKey)
      })

      this.clearCache()

      return true
    } catch (error) {
      console.error("Failed to clear all data:", error)
      return false
    }
  }

  getStorageStats(): {
    usage: { used: number; available: number; percentage: number }
    counts: {
      images: number
      favorites: number
      collections: number
      downloadHistory: number
      userPhotos: number
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
        userPhotos: this.getUserPhotos().length,
      },
      lastUpdated: new Date().toISOString(),
    }
  }

  migrateFromOldVersion(): boolean {
    try {
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

export const storage = new LocalStorageManager()

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
  migrateFromOldVersion,
} = storage

export default storage
