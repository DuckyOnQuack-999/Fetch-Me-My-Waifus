interface StorageData {
  images: any[]
  favorites: any[]
  collections: any[]
  downloadHistory: any[]
  settings: any
}

class LocalStorageManager {
  private getStorageKey(key: string): string {
    return `waifu-downloader-${key}`
  }

  private safeGet<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === "undefined") return defaultValue
      const item = localStorage.getItem(this.getStorageKey(key))
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return defaultValue
    }
  }

  private safeSet(key: string, value: any): boolean {
    try {
      if (typeof window === "undefined") return false
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  // Images
  getImages(): any[] {
    return this.safeGet("images", [])
  }

  saveImages(images: any[]): boolean {
    return this.safeSet("images", images)
  }

  addImage(image: any): boolean {
    const images = this.getImages()
    const updatedImages = [...images, { ...image, id: Date.now().toString() }]
    return this.saveImages(updatedImages)
  }

  removeImage(imageId: string): boolean {
    const images = this.getImages()
    const updatedImages = images.filter((img) => img.id !== imageId)
    return this.saveImages(updatedImages)
  }

  // Favorites
  getFavorites(): any[] {
    return this.safeGet("favorites", [])
  }

  saveFavorites(favorites: any[]): boolean {
    return this.safeSet("favorites", favorites)
  }

  addFavorite(image: any): boolean {
    const favorites = this.getFavorites()
    const exists = favorites.some((fav) => fav.id === image.id)
    if (!exists) {
      const updatedFavorites = [...favorites, { ...image, favoriteDate: new Date().toISOString() }]
      return this.saveFavorites(updatedFavorites)
    }
    return true
  }

  removeFavorite(imageId: string): boolean {
    const favorites = this.getFavorites()
    const updatedFavorites = favorites.filter((fav) => fav.id !== imageId)
    return this.saveFavorites(updatedFavorites)
  }

  isFavorite(imageId: string): boolean {
    const favorites = this.getFavorites()
    return favorites.some((fav) => fav.id === imageId)
  }

  // Collections
  getCollections(): any[] {
    return this.safeGet("collections", [])
  }

  saveCollections(collections: any[]): boolean {
    return this.safeSet("collections", collections)
  }

  addCollection(collection: any): boolean {
    const collections = this.getCollections()
    const newCollection = {
      ...collection,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      images: [],
    }
    const updatedCollections = [...collections, newCollection]
    return this.saveCollections(updatedCollections)
  }

  removeCollection(collectionId: string): boolean {
    const collections = this.getCollections()
    const updatedCollections = collections.filter((col) => col.id !== collectionId)
    return this.saveCollections(updatedCollections)
  }

  addImageToCollection(collectionId: string, image: any): boolean {
    const collections = this.getCollections()
    const updatedCollections = collections.map((col) => {
      if (col.id === collectionId) {
        const imageExists = col.images.some((img: any) => img.id === image.id)
        if (!imageExists) {
          return { ...col, images: [...col.images, image] }
        }
      }
      return col
    })
    return this.saveCollections(updatedCollections)
  }

  removeImageFromCollection(collectionId: string, imageId: string): boolean {
    const collections = this.getCollections()
    const updatedCollections = collections.map((col) => {
      if (col.id === collectionId) {
        return { ...col, images: col.images.filter((img: any) => img.id !== imageId) }
      }
      return col
    })
    return this.saveCollections(updatedCollections)
  }

  // Download History
  getDownloadHistory(): any[] {
    return this.safeGet("downloadHistory", [])
  }

  saveDownloadHistory(history: any[]): boolean {
    return this.safeSet("downloadHistory", history)
  }

  addDownloadRecord(record: any): boolean {
    const history = this.getDownloadHistory()
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    const updatedHistory = [newRecord, ...history].slice(0, 1000) // Keep last 1000 records
    return this.saveDownloadHistory(updatedHistory)
  }

  clearDownloadHistory(): boolean {
    return this.saveDownloadHistory([])
  }

  // Settings
  getSettings(): any {
    return this.safeGet("settings", {})
  }

  saveSettings(settings: any): boolean {
    return this.safeSet("settings", settings)
  }

  updateSettings(updates: any): boolean {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...updates }
    return this.saveSettings(updatedSettings)
  }

  // Utility methods
  clearAll(): boolean {
    try {
      if (typeof window === "undefined") return false
      const keys = ["images", "favorites", "collections", "downloadHistory", "settings"]
      keys.forEach((key) => {
        localStorage.removeItem(this.getStorageKey(key))
      })
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  }

  exportData(): StorageData | null {
    try {
      return {
        images: this.getImages(),
        favorites: this.getFavorites(),
        collections: this.getCollections(),
        downloadHistory: this.getDownloadHistory(),
        settings: this.getSettings(),
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      return null
    }
  }

  importData(data: StorageData): boolean {
    try {
      let success = true
      success = success && this.saveImages(data.images || [])
      success = success && this.saveFavorites(data.favorites || [])
      success = success && this.saveCollections(data.collections || [])
      success = success && this.saveDownloadHistory(data.downloadHistory || [])
      success = success && this.saveSettings(data.settings || {})
      return success
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  getStorageSize(): { used: number; available: number } {
    try {
      if (typeof window === "undefined") return { used: 0, available: 0 }

      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith("waifu-downloader-")) {
          used += localStorage[key].length
        }
      }

      // Estimate available space (5MB typical limit)
      const available = 5 * 1024 * 1024 - used

      return { used, available }
    } catch (error) {
      console.error("Error calculating storage size:", error)
      return { used: 0, available: 0 }
    }
  }
}

export const storage = new LocalStorageManager()
export default storage
