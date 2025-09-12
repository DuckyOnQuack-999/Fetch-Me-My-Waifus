"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"
import { EnhancedImagePreview } from "@/components/enhanced-image-preview"
import { AIUpscaler } from "@/components/ai-upscaler"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { toast } from "sonner"

export default function GalleryPage() {
  const { images, toggleFavorite, removeImage, isFavorite } = useStorage()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedImageForPreview, setSelectedImageForPreview] = useState<any>(null)
  const [selectedImageForUpscale, setSelectedImageForUpscale] = useState<any>(null)

  const categories = useMemo(() => {
    const cats = new Set(images.flatMap((img) => img.tags || []))
    return Array.from(cats).sort()
  }, [images])

  const sources = useMemo(() => {
    const srcs = new Set(images.map((img) => img.source).filter(Boolean))
    return Array.from(srcs).sort()
  }, [images])

  const filteredAndSortedImages = useMemo(() => {
    const filtered = images.filter((image) => {
      const matchesSearch =
        searchTerm === "" ||
        (image.filename || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || (image.tags || []).includes(selectedCategory)
      const matchesSource = selectedSource === "all" || image.source === selectedSource

      return matchesSearch && matchesCategory && matchesSource
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          break
        case "name":
          comparison = (a.filename || "").localeCompare(b.filename || "")
          break
        case "size":
          comparison = (a.file_size || 0) - (b.file_size || 0)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [images, searchTerm, selectedCategory, selectedSource, sortBy, sortOrder])

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedImages.size === filteredAndSortedImages.length) {
      setSelectedImages(new Set())
    } else {
      setSelectedImages(new Set(filteredAndSortedImages.map((img) => img.image_id.toString())))
    }
  }

  const handleDownloadImage = (image: any) => {
    const link = document.createElement("a")
    link.href = image.url
    link.download = image.filename || `image-${image.image_id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloading ${image.filename}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>

          <EnhancedImageGallery
            images={filteredAndSortedImages}
            handleImageSelect={handleImageSelect}
            handleSelectAll={handleSelectAll}
            handleDownloadImage={handleDownloadImage}
            selectedImages={selectedImages}
            selectedImageForPreview={selectedImageForPreview}
            setSelectedImageForPreview={setSelectedImageForPreview}
            selectedImageForUpscale={selectedImageForUpscale}
            setSelectedImageForUpscale={setSelectedImageForUpscale}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />

          {/* Image Preview Dialog */}
          <Dialog open={!!selectedImageForPreview} onOpenChange={() => setSelectedImageForPreview(null)}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>Image Preview</DialogTitle>
              </DialogHeader>
              {selectedImageForPreview && <EnhancedImagePreview image={selectedImageForPreview} />}
            </DialogContent>
          </Dialog>

          {/* AI Upscaler Dialog */}
          <Dialog open={!!selectedImageForUpscale} onOpenChange={() => setSelectedImageForUpscale(null)}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>AI Image Upscaler</DialogTitle>
              </DialogHeader>
              {selectedImageForUpscale && (
                <AIUpscaler image={selectedImageForUpscale} onClose={() => setSelectedImageForUpscale(null)} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
