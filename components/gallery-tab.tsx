"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon, Heart, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useStorage } from "@/context/storageContext"
import { useDownload } from "@/context/downloadContext"
import { useSettings } from "@/context/settingsContext"
import { SumptuousHeart } from "@/components/sumptuous-heart"

interface GalleryImage {
  id: string
  src: string
  alt: string
  source: string
  category: string
}

export function GalleryTab() {
  const { images, addFavorite, removeFavorite, favorites } = useStorage()
  const { addDownload } = useDownload()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleFavorite = (image: GalleryImage) => {
    if (favorites?.some((fav) => fav.id === image.id)) {
      removeFavorite(image.id)
    } else {
      addFavorite(image)
    }
  }

  const handleDownload = (image: GalleryImage) => {
    addDownload({
      id: image.id,
      src: image.src,
      title: image.alt,
      source: image.source,
      timestamp: new Date().toISOString(),
    })
  }

  const isFavorite = useCallback(
    (image: GalleryImage) => {
      return favorites?.some((fav) => fav.id === image.id)
    },
    [favorites],
  )

  useEffect(() => {
    if (images) {
      const results = images.filter((image) => image.alt.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredImages(results)
    }
  }, [searchTerm, images])

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="space-y-6">
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Gallery
          </CardTitle>
          <CardDescription>Browse and manage your downloaded images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              >
                <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-48 object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="icon" onClick={() => handleFavorite(image)}>
                      {isFavorite(image) ? <SumptuousHeart size={20} fill /> : <Heart size={20} />}
                    </Button>
                    <Button variant="secondary" size="icon" onClick={() => handleDownload(image)}>
                      <Download size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
