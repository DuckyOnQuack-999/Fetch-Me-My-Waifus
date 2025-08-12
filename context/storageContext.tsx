"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Collections } from "../types/waifu"
import { storage } from "../utils/localStorage"

interface StorageContextType {
  favorites: string[]
  collections: Collections
  addFavorite: (imageId: string) => void
  removeFavorite: (imageId: string) => void
  createCollection: (name: string) => string | undefined
  deleteCollection: (id: string) => void
  addToCollection: (collectionId: string, imageId: string) => void
  removeFromCollection: (collectionId: string, imageId: string) => void
  getFavorites: () => string[]
  getCollections: () => Collections
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [collections, setCollections] = useState<Collections>({})

  useEffect(() => {
    setFavorites(storage.getFavorites())
    setCollections(storage.getCollections())
  }, [])

  const addFavorite = (imageId: string) => {
    storage.addFavorite(imageId)
    setFavorites(storage.getFavorites())
  }

  const removeFavorite = (imageId: string) => {
    storage.removeFavorite(imageId)
    setFavorites(storage.getFavorites())
  }

  const createCollection = (name: string) => {
    const id = storage.createCollection(name)
    setCollections(storage.getCollections())
    return id
  }

  const deleteCollection = (id: string) => {
    storage.deleteCollection(id)
    setCollections(storage.getCollections())
  }

  const addToCollection = (collectionId: string, imageId: string) => {
    storage.addToCollection(collectionId, imageId)
    setCollections(storage.getCollections())
  }

  const removeFromCollection = (collectionId: string, imageId: string) => {
    storage.removeFromCollection(collectionId, imageId)
    setCollections(storage.getCollections())
  }

  return (
    <StorageContext.Provider
      value={{
        favorites,
        collections,
        addFavorite,
        removeFavorite,
        createCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
        getFavorites: storage.getFavorites,
        getCollections: storage.getCollections,
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
