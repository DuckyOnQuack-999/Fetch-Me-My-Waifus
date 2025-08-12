'use client'

import React, { useState, useEffect } from 'react'
import { WaifuImage } from '@/types/waifu'
import { useSettings } from '@/context/settingsContext'
import { fetchFavorites } from '@/services/waifuApi'
import { GalleryTab } from './gallery-tab'
import { toast } from 'sonner'

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<WaifuImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true)
      try {
        const waifuImFavorites = await fetchFavorites('waifu.im', settings.waifuImApiKey)
        const waifuPicsFavorites = await fetchFavorites('waifu.pics', settings.waifuPicsApiKey)
        const nekosBestFavorites = await fetchFavorites('nekos.best', settings.nekosBestApiKey)
        
        setFavorites([...waifuImFavorites, ...waifuPicsFavorites, ...nekosBestFavorites])
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
        toast.error('Failed to load favorites')
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [settings])

  if (isLoading) {
    return <div>Loading favorites...</div>
  }

  return (
    <GalleryTab
      initialImages={favorites}
      onToggleFavorite={() => {}} // Implement this function if needed
      onSort={() => {}} // Implement this function if needed
      settings={settings}
      downloadHistory={[]}
    />
  )
}
