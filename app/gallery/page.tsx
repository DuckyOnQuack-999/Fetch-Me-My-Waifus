"use client"

import { Suspense } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useStorage } from "@/context/storageContext"
import { useState } from "react"

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground neon-text">Loading gallery...</p>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const { images, toggleFavorite, isFavorite } = useStorage()
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [selectedImageForPreview, setSelectedImageForPreview] = useState<any>(null)
  const [selectedImageForUpscale, setSelectedImageForUpscale] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const handleImageSelect = (imageId: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedImages(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set())
    } else {
      setSelectedImages(new Set(images.map((img) => img.image_id.toString())))
    }
  }

  const handleDownloadImage = async (image: any) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = image.filename || `image-${image.image_id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-pink-500/20 px-4 glass-effect">
          <SidebarTrigger className="-ml-1 kawaii-heart" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="neon-text">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="neon-text">Gallery</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<LoadingFallback />}>
            <EnhancedImageGallery
              images={images}
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
          </Suspense>
        </div>
      </SidebarInset>
    </>
  )
}
