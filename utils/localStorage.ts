const FAVORITES_KEY = "waifu-favorites"
const SETTINGS_KEY = "waifu-settings"

interface Collections {
  [key: string]: {
    id: string
    name: string
    imageIds: string[]
  }
}

export const storage = {
  getFavorites: (): string[] => {
    if (typeof window === "undefined") return []
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  },

  addFavorite: (imageId: string) => {
    if (typeof window === "undefined") return
    const favorites = storage.getFavorites()
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, imageId]))
  },

  removeFavorite: (imageId: string) => {
    if (typeof window === "undefined") return
    const favorites = storage.getFavorites()
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.filter((id) => id !== imageId)))
  },

  getSettings: () => {
    if (typeof window === "undefined") return null
    const settings = localStorage.getItem(SETTINGS_KEY)
    return settings ? JSON.parse(settings) : null
  },

  saveSettings: (settings: any) => {
    if (typeof window === "undefined") return
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  },

  getCollections: (): Collections => {
    if (typeof window === "undefined") return {}
    const collections = localStorage.getItem("waifu-collections")
    return collections ? JSON.parse(collections) : {}
  },

  saveCollections: (collections: Collections) => {
    if (typeof window === "undefined") return
    localStorage.setItem("waifu-collections", JSON.stringify(collections))
  },

  addToCollection: (collectionId: string, imageId: string) => {
    if (typeof window === "undefined") return
    const collections = storage.getCollections()
    if (collections[collectionId]) {
      collections[collectionId].imageIds.push(imageId)
      storage.saveCollections(collections)
    }
  },

  removeFromCollection: (collectionId: string, imageId: string) => {
    if (typeof window === "undefined") return
    const collections = storage.getCollections()
    if (collections[collectionId]) {
      collections[collectionId].imageIds = collections[collectionId].imageIds.filter((id) => id !== imageId)
      storage.saveCollections(collections)
    }
  },

  createCollection: (name: string) => {
    if (typeof window === "undefined") return
    const collections = storage.getCollections()
    const id = Date.now().toString()
    collections[id] = { id, name, imageIds: [] }
    storage.saveCollections(collections)
    return id
  },

  deleteCollection: (id: string) => {
    if (typeof window === "undefined") return
    const collections = storage.getCollections()
    delete collections[id]
    storage.saveCollections(collections)
  },
}
