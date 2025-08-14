interface StorageData {
  images: any[]
  favorites: string[]
  collections: any[]
  downloadHistory: any[]
  settings: any
}

class LocalStorage {
  private isClient = typeof window !== "undefined"

  private getStorageKey(key: string): string {
    return `waifu-downloader-${key}`
  }

  private safeGetItem(key: string): string | null {
    if (!this.isClient) return null
    try {
      return localStorage.getItem(this.getStorageKey(key))
    } catch (error) {
      console.error(`Error getting item ${key}:`, error)
      return null
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    if (!this.isClient) return false
    try {
      localStorage.setItem(this.getStorageKey(key), value)
      return true
    } catch (error) {
      console.error(`Error setting item ${key}:`, error)
      return false
    }
  }

  private safeRemoveItem(key: string): boolean {
    if (!this.isClient) return false
    try {
      localStorage.removeItem(this.getStorageKey(key))
      return true
    } catch (error) {
      console.error(`Error removing item ${key}:`, error)
      return false
    }
  }

  // Images
  getImages(): any[] {
    const data = this.safeGetItem("images")
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing images:", error)
      return []
    }
  }

  saveImages(images: any[]): boolean {
    return this.safeSetItem("images", JSON.stringify(images || []))
  }

  addImage(image: any): boolean {
    const images = this.getImages()
    const exists = images.some((img) => img.id === image.id)
    if (!exists) {
      images.push(image)
      return this.saveImages(images)
    }
    return true
  }

  removeImage(imageId: string): boolean {
    const images = this.getImages()
    const filtered = images.filter((img) => img.id !== imageId)
    return this.saveImages(filtered)
  }

  // Favorites
  getFavorites(): string[] {
    const data = this.safeGetItem("favorites")
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing favorites:", error)
      return []
    }
  }

  saveFavorites(favorites: string[]): boolean {
    return this.safeSetItem("favorites", JSON.stringify(favorites || []))
  }

  addFavorite(imageId: string): boolean {
    const favorites = this.getFavorites()
    if (!favorites.includes(imageId)) {
      favorites.push(imageId)
      return this.saveFavorites(favorites)
    }
    return true
  }

  removeFavorite(imageId: string): boolean {
    const favorites = this.getFavorites()
    const filtered = favorites.filter((id) => id !== imageId)
    return this.saveFavorites(filtered)
  }

  isFavorite(imageId: string): boolean {
    const favorites = this.getFavorites()
    return favorites.includes(imageId)
  }

  // Collections
  getCollections(): any[] {
    const data = this.safeGetItem("collections")
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing collections:", error)
      return []
    }
  }

  saveCollections(collections: any[]): boolean {
    return this.safeSetItem("collections", JSON.stringify(collections || []))
  }

  addCollection(collection: any): boolean {
    const collections = this.getCollections()
    const exists = collections.some((col) => col.id === collection.id)
    if (!exists) {
      collections.push(collection)
      return this.saveCollections(collections)
    }
    return true
  }

  removeCollection(collectionId: string): boolean {
    const collections = this.getCollections()
    const filtered = collections.filter((col) => col.id !== collectionId)
    return this.saveCollections(filtered)
  }

  updateCollection(collectionId: string, updates: any): boolean {
    const collections = this.getCollections()
    const index = collections.findIndex((col) => col.id === collectionId)
    if (index !== -1) {
      collections[index] = { ...collections[index], ...updates }
      return this.saveCollections(collections)
    }
    return false
  }

  // Download History
  getDownloadHistory(): any[] {
    const data = this.safeGetItem("downloadHistory")
    if (!data) return []
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing download history:", error)
      return []
    }
  }

  saveDownloadHistory(history: any[]): boolean {
    return this.safeSetItem("downloadHistory", JSON.stringify(history || []))
  }

  addDownloadRecord(record: any): boolean {
    const history = this.getDownloadHistory()
    history.unshift(record) // Add to beginning
    // Keep only last 1000 records
    if (history.length > 1000) {
      history.splice(1000)
    }
    return this.saveDownloadHistory(history)
  }

  clearDownloadHistory(): boolean {
    return this.safeSetItem("downloadHistory", JSON.stringify([]))
  }

  // Settings
  getSettings(): any {
    const data = this.safeGetItem("settings")
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing settings:", error)
      return null
    }
  }

  saveSettings(settings: any): boolean {
    return this.safeSetItem("settings", JSON.stringify(settings || {}))
  }

  // Bulk operations
  clearAll(): boolean {
    if (!this.isClient) return false
    try {
      const keys = ["images", "favorites", "collections", "downloadHistory", "settings"]
      keys.forEach((key) => this.safeRemoveItem(key))
      return true
    } catch (error) {
      console.error("Error clearing all data:", error)
      return false
    }
  }

  exportData(): string {
    const data: StorageData = {
      images: this.getImages(),
      favorites: this.getFavorites(),
      collections: this.getCollections(),
      downloadHistory: this.getDownloadHistory(),
      settings: this.getSettings(),
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data: StorageData = JSON.parse(jsonData)

      if (data.images) this.saveImages(data.images)
      if (data.favorites) this.saveFavorites(data.favorites)
      if (data.collections) this.saveCollections(data.collections)
      if (data.downloadHistory) this.saveDownloadHistory(data.downloadHistory)
      if (data.settings) this.saveSettings(data.settings)

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  // Storage info
  getStorageInfo(): { used: number; available: number; total: number } {
    if (!this.isClient) return { used: 0, available: 0, total: 0 }

    try {
      let used = 0
      const keys = ["images", "favorites", "collections", "downloadHistory", "settings"]

      keys.forEach((key) => {
        const data = this.safeGetItem(key)
        if (data) {
          used += new Blob([data]).size
        }
      })

      // Estimate available storage (5MB typical localStorage limit)
      const total = 5 * 1024 * 1024 // 5MB
      const available = total - used

      return { used, available, total }
    } catch (error) {
      console.error("Error getting storage info:", error)
      return { used: 0, available: 0, total: 0 }
    }
  }
}

export const storage = new LocalStorage()
