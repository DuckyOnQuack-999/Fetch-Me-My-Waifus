"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, Trash2, X, Archive, Share } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useStorage } from "@/context/storageContext"

interface BatchOperationsPanelProps {
  selectedImages: string[]
  onClearSelection: () => void
}

export function BatchOperationsPanel({ selectedImages, onClearSelection }: BatchOperationsPanelProps) {
  const { images, toggleFavorite, removeImage } = useStorage()
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedImageData = images.filter((img) => selectedImages.includes(img.image_id))

  const handleBatchFavorite = async () => {
    setIsProcessing(true)
    try {
      for (const imageId of selectedImages) {
        toggleFavorite(imageId)
      }
      toast.success(`${selectedImages.length} images added to favorites`)
      onClearSelection()
    } catch (error) {
      toast.error("Failed to update favorites")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchDownload = async () => {
    setIsProcessing(true)
    try {
      for (const image of selectedImageData) {
        const response = await fetch(image.url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = image.filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Small delay to prevent overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      toast.success(`${selectedImages.length} images downloaded`)
      onClearSelection()
    } catch (error) {
      toast.error("Failed to download images")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) {
      return
    }

    setIsProcessing(true)
    try {
      for (const imageId of selectedImages) {
        removeImage(imageId)
      }
      toast.success(`${selectedImages.length} images deleted`)
      onClearSelection()
    } catch (error) {
      toast.error("Failed to delete images")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchShare = async () => {
    try {
      const urls = selectedImageData.map((img) => img.url).join("\n")

      if (navigator.share && selectedImages.length === 1) {
        await navigator.share({
          title: selectedImageData[0].filename,
          url: selectedImageData[0].url,
        })
      } else {
        await navigator.clipboard.writeText(urls)
        toast.success("Image URLs copied to clipboard")
      }
    } catch (error) {
      toast.error("Failed to share images")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" />
              Batch Operations
              <Badge variant="secondary">{selectedImages.length} selected</Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleBatchFavorite}
              disabled={isProcessing}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Heart className="h-4 w-4" />
              Add to Favorites
            </Button>

            <Button
              onClick={handleBatchDownload}
              disabled={isProcessing}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Download All
            </Button>

            <Button
              onClick={handleBatchShare}
              disabled={isProcessing}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>

            <Button
              onClick={handleBatchDelete}
              disabled={isProcessing}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-3 text-sm text-muted-foreground">Processing {selectedImages.length} images...</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
