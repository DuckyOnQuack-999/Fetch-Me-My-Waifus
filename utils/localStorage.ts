import type { Settings } from "@/context/settingsContext"

// Storage keys
const STORAGE_KEYS = {
  SETTINGS: "waifu-downloader-settings",
  IMAGES: "waifu-downloader-images",
  FAVORITES: "waifu-downloader-favorites",
  COLLECTIONS: "waifu-downloader-collections",
  DOWNLOAD_HISTORY: "waifu-downloader-download-history",
} as const

// Safe JSON parsing with fallback
function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) || fallback
  } catch {
    return fallback
  }
}

// Safe JSON stringify
function safeJsonStringify(data: any): string {
  try {
    return JSON.stringify(data)
  } catch {
    return "{}"
  }
}

// Settings operations
export async function getSettings(): Promise<Settings | null> {
  try {
    if (typeof window === "undefined") return null
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return safeJsonParse(settings, null)
  } catch (error) {
    console.error("Error getting settings:", error)
    return null
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.SETTINGS, safeJsonStringify(settings))
  } catch (error) {
    console.error("Error saving settings:", error)
  }
}

// Images operations
export async function getImages(): Promise<any[]> {
  try {
    if (typeof window === "undefined") return []
    const images = localStorage.getItem(STORAGE_KEYS.IMAGES)
    return safeJsonParse(images, [])
  } catch (error) {
    console.error("Error getting images:", error)
    return []
  }
}

export async function saveImages(images: any[]): Promise<void> {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.IMAGES, safeJsonStringify(images))
  } catch (error) {
    console.error("Error saving images:", error)
  }
}

// Favorites operations
export async function getFavorites(): Promise<any[]> {
  try {
    if (typeof window === "undefined") return []
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES)
    return safeJsonParse(favorites, [])
  } catch (error) {
    console.error("Error getting favorites:", error)
    return []
  }
}

export async function saveFavorites(favorites: any[]): Promise<void> {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.FAVORITES, safeJsonStringify(favorites))
  } catch (error) {
    console.error("Error saving favorites:", error)
  }
}

export async function addToFavorites(image: any): Promise<void> {
  try {
    const favorites = await getFavorites()
    const exists = favorites.some((fav) => fav.id === image.id)
    if (!exists) {
      favorites.push({ ...image, addedAt: new Date().toISOString() })
      await saveFavorites(favorites)
    }
  } catch (error) {
    console.error("Error adding to favorites:", error)
  }
}

export async function removeFromFavorites(imageId: string): Promise<void> {
  try {
    const favorites = await getFavorites()
    const filtered = favorites.filter((fav) => fav.id !== imageId)
    await saveFavorites(filtered)
  } catch (error) {
    console.error("Error removing from favorites:", error)
  }
}

// Collections operations
export async function getCollections(): Promise<any[]> {
  try {
    if (typeof window === "undefined") return []
    const collections = localStorage.getItem(STORAGE_KEYS.COLLECTIONS)
    return safeJsonParse(collections, [])
  } catch (error) {
    console.error("Error getting collections:", error)
    return []
  }
}

export async function saveCollections(collections: any[]): Promise<void> {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, safeJsonStringify(collections))
  } catch (error) {
    console.error("Error saving collections:", error)
  }
}

// Download history operations
export async function getDownloadHistory(): Promise<any[]> {
  try {
    if (typeof window === "undefined") return []
    const history = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY)
    return safeJsonParse(history, [])
  } catch (error) {
    console.error("Error getting download history:", error)
    return []
  }
}

export async function saveDownloadHistory(history: any[]): Promise<void> {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.DOWNLOAD_HISTORY, safeJsonStringify(history))
  } catch (error) {
    console.error("Error saving download history:", error)
  }
}

export async function addToDownloadHistory(item: any): Promise<void> {
  try {
    const history = await getDownloadHistory()
    history.unshift({ ...item, timestamp: new Date().toISOString() })
    // Keep only last 100 items
    if (history.length > 100) {
      history.splice(100)
    }
    await saveDownloadHistory(history)
  } catch (error) {
    console.error("Error adding to download history:", error)
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Error clearing all data:", error)
  }
}
