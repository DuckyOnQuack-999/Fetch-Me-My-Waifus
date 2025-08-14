// Helper function to safely parse JSON with a fallback
const safeParseJSON = <T>(json: string | null, fallback: T): T => {\
  if (!json) return fallback
  try {\
    return JSON.parse(json) as T
  } catch (e) {
    console.error("Error parsing JSON:", e)\
    return fallback
  }
}

// Helper function to safely stringify and save JSON
const safeStringifyAndSave = (key: string, data: any): void => {\
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e)
  }
}

// Storage keys
const KEYS = {\
  FAVORITES: "waifu-favorites",
  COLLECTIONS: "waifu-collections",
  SETTINGS: "waifu-settings",
  DOWNLOAD_HISTORY: "waifu-download-history",
  CACHE: "waifu-cache",
}

// Storage utility
export const storage = {
  // Favorites\
  getFavorites: (): WaifuImage[] => {\
    return safeParseJSON<WaifuImage[]>(localStorage.getItem(KEYS.FAVORITES), [])
  },
  
  saveFavorites: (favorites: WaifuImage[]): void => {
    safeStringifyAndSave(KEYS.FAVORITES, favorites)
  },
  
  addFavorite: (image: WaifuImage): void => {\
    const favorites = storage.getFavorites()
    // Check if image already exists in favorites
    if (!favorites.some(fav => fav.image_id === image.image_id)) {
      favorites.push({ ...image, isFavorite: true })\
      storage.saveFavorites(favorites)
    }
  },
  
  removeFavorite: (imageId: number): void => {\
    const favorites = storage.getFavorites()
    const updatedFavorites = favorites.filter(img => img.image_id !== imageId)
    storage.saveFavorites(updatedFavorites)
  },
  
  // Collections
  getCollections: (): Collections => {\
    return safeParseJSON<Collections>(localStorage.getItem(KEYS.COLLECTIONS), {})
  },
  
  saveCollections: (collections: Collections): void => {
    safeStringifyAndSave(KEYS.COLLECTIONS, collections)
  },
  
  addCollection: (name: string): string => {\
    const collections = storage.getCollections()
    const id = `collection-${Date.now()}`
    collections[id] = {
      id,
      name,\
      imageIds: []
    }
    storage.saveCollections(collections)
    return id
  },
  
  removeCollection: (id: string): void => {\
    const collections = storage.getCollections()
    if (collections[id]) {
      delete collections[id]\
      storage.saveCollections(collections)
    }
  },
  
  addImageToCollection: (collectionId: string, imageId: string): void => {\
    const collections = storage.getCollections()
    if (collections[collectionId]) {\
      if (!collections[collectionId].imageIds.includes(imageId)) {
        collections[collectionId].imageIds.push(imageId)\
        storage.saveCollections(collections)
      }
    }
  },
  
  removeImageFromCollection: (collectionId: string, imageId: string): void => {\
    const collections = storage.getCollections()
    if (collections[collectionId]) {
      collections[collectionId].imageIds = collections[collectionId].imageIds.filter(id => id !== imageId)\
      storage.saveCollections(collections)
    }
  },
  
  // Settings
  getSettings: (): Settings | undefined => {\
    return safeParseJSON<Settings | undefined>(localStorage.getItem(KEYS.SETTINGS), undefined)
  },
  
  saveSettings: (settings: Settings): void => {
    safeStringifyAndSave(KEYS.SETTINGS, settings)
  },
  
  // Download History
  getDownloadHistory: (): WaifuImage[] => {\
    return safeParseJSON<WaifuImage[]>(localStorage.getItem(KEYS.DOWNLOAD_HISTORY), [])
  },
  
  addToDownloadHistory: (image: WaifuImage): void => {\
    const history = storage.getDownloadHistory()
    if (!history.some(img => img.image_id === image.image_id)) {
      history.push({
        ...image,
        lastModified: new Date().toISOString()
      })\
      safeStringifyAndSave(KEYS.DOWNLOAD_HISTORY, history)
    }
  },
  
  clearDownloadHistory: (): void => {
    localStorage.removeItem(KEYS.DOWNLOAD_HISTORY)
  },
  
  // Cache
  getCachedImage: (url: string): string | null => {\
    const cache = safeParseJSON<Record<string, string>>(localStorage.getItem(KEYS.CACHE), {})
    return cache[url] || null
  },
  
  cacheImage: (url: string, dataUrl: string): void => {\
    try {\
      const cache = safeParseJSON<Record<string, string>>(localStorage.getItem(KEYS.CACHE), {})
      cache[url] = dataUrl
      safeStringifyAndSave(KEYS.CACHE, cache)
    } catch (e) {
      console.error("Error caching image:", e)
      // If we hit storage limits, clear the cache and try again\
      localStorage.removeItem(KEYS.CACHE)
      const cache = {}
      cache[url] = dataUrl
      safeStringifyAndSave(KEYS.CACHE, cache)
    }
  },
  
  clearCache: (): void => {
    localStorage.removeItem(KEYS.CACHE)
  },
  
  // Utility functions
  clear: (): void => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key))
  },
  
  getStorageUsage: (): number => {\
    let total = 0\
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          total += key.length + value.length
        }
      }
    }
    return total
  }
}
