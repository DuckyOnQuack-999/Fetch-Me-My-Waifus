import type { WaifuImage, ApiSource, SearchFilters } from "@/types/waifu"

// Format bytes to human readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Format time duration to human readable format
export function formatTime(seconds: number): string {
  if (seconds === 0 || !isFinite(seconds)) return "0s"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// Format date to relative time
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = typeof date === "string" ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

// Generate unique filename
export function generateFilename(image: WaifuImage, pattern = "original", customTemplate?: string): string {
  const timestamp = Date.now()
  const extension = getFileExtension(image.url) || "jpg"
  const id = image.image_id.toString()

  switch (pattern) {
    case "timestamp":
      return `${timestamp}.${extension}`
    case "id":
      return `${id}.${extension}`
    case "source_id":
      return `${image.source || "unknown"}_${id}.${extension}`
    case "character":
      return `${image.character || "unknown"}_${id}.${extension}`
    case "custom":
      if (customTemplate) {
        return customTemplate
          .replace("{id}", id)
          .replace("{timestamp}", timestamp.toString())
          .replace("{source}", image.source || "unknown")
          .replace("{character}", image.character || "unknown")
          .replace("{series}", image.series || "unknown")
          .replace("{artist}", image.artist || "unknown")
          .replace("{width}", image.width.toString())
          .replace("{height}", image.height.toString())
          .replace("{ext}", extension)
      }
      return `${id}.${extension}`
    case "original":
    default:
      const originalName = getOriginalFilename(image.url)
      return originalName || `${id}.${extension}`
  }
}

// Extract file extension from URL
export function getFileExtension(url: string): string | null {
  try {
    const pathname = new URL(url).pathname
    const match = pathname.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
    return match ? match[1].toLowerCase() : null
  } catch {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
    return match ? match[1].toLowerCase() : null
  }
}

// Extract original filename from URL
export function getOriginalFilename(url: string): string | null {
  try {
    const pathname = new URL(url).pathname
    const filename = pathname.split("/").pop()
    return filename && filename.includes(".") ? filename : null
  } catch {
    const filename = url.split("/").pop()
    return filename && filename.includes(".") ? filename : null
  }
}

// Calculate image aspect ratio
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

// Get aspect ratio category
export function getAspectRatioCategory(width: number, height: number): "square" | "landscape" | "portrait" {
  const ratio = calculateAspectRatio(width, height)
  if (ratio > 1.1) return "landscape"
  if (ratio < 0.9) return "portrait"
  return "square"
}

// Validate image dimensions
export function validateImageDimensions(
  image: WaifuImage,
  minWidth = 0,
  minHeight = 0,
  maxWidth: number = Number.POSITIVE_INFINITY,
  maxHeight: number = Number.POSITIVE_INFINITY,
): boolean {
  return image.width >= minWidth && image.height >= minHeight && image.width <= maxWidth && image.height <= maxHeight
}

// Filter images by search criteria
export function filterImages(images: WaifuImage[], filters: SearchFilters): WaifuImage[] {
  return images.filter((image) => {
    // Category filter
    if (filters.category && image.tags && !image.tags.includes(filters.category)) {
      return false
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const imageTags = image.tags || []
      const hasAllTags = filters.tags.every((tag) =>
        imageTags.some((imageTag) => imageTag.toLowerCase().includes(tag.toLowerCase())),
      )
      if (!hasAllTags) return false
    }

    // Exclude tags filter
    if (filters.excludeTags && filters.excludeTags.length > 0) {
      const imageTags = image.tags || []
      const hasExcludedTag = filters.excludeTags.some((tag) =>
        imageTags.some((imageTag) => imageTag.toLowerCase().includes(tag.toLowerCase())),
      )
      if (hasExcludedTag) return false
    }

    // Dimension filters
    if (filters.minWidth && image.width < filters.minWidth) return false
    if (filters.minHeight && image.height < filters.minHeight) return false
    if (filters.maxWidth && image.width > filters.maxWidth) return false
    if (filters.maxHeight && image.height > filters.maxHeight) return false

    // Aspect ratio filter
    if (filters.aspectRatio && filters.aspectRatio !== "any") {
      const category = getAspectRatioCategory(image.width, image.height)
      if (category !== filters.aspectRatio) return false
    }

    // File format filter
    if (filters.fileFormat && filters.fileFormat.length > 0) {
      const extension = getFileExtension(image.url)
      if (!extension || !filters.fileFormat.includes(extension)) return false
    }

    // Rating filter
    if (filters.rating && filters.rating !== "any" && image.rating !== filters.rating) {
      return false
    }

    // Source filter
    if (filters.source && filters.source.length > 0) {
      if (!image.source || !filters.source.includes(image.source as ApiSource)) {
        return false
      }
    }

    return true
  })
}

// Sort images
export function sortImages(images: WaifuImage[], sortBy: string, sortOrder: "asc" | "desc" = "desc"): WaifuImage[] {
  const sorted = [...images].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "NEWEST":
        comparison = new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        break
      case "OLDEST":
        comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        break
      case "WIDTH":
        comparison = a.width - b.width
        break
      case "HEIGHT":
        comparison = a.height - b.height
        break
      case "FILE_SIZE":
        comparison = (a.file_size || 0) - (b.file_size || 0)
        break
      case "RANDOM":
        comparison = Math.random() - 0.5
        break
      default:
        comparison = 0
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  return sorted
}

// Generate thumbnail URL
export function generateThumbnailUrl(imageUrl: string, size = 200): string {
  // This would typically integrate with a thumbnail service
  // For now, return the original URL
  return imageUrl
}

// Check if image is cached
export function isImageCached(imageUrl: string): boolean {
  try {
    const cached = localStorage.getItem(`image_cache_${btoa(imageUrl)}`)
    return !!cached
  } catch {
    return false
  }
}

// Cache image data
export function cacheImageData(imageUrl: string, data: string): void {
  try {
    localStorage.setItem(`image_cache_${btoa(imageUrl)}`, data)
  } catch (error) {
    console.warn("Failed to cache image data:", error)
  }
}

// Get cached image data
export function getCachedImageData(imageUrl: string): string | null {
  try {
    return localStorage.getItem(`image_cache_${btoa(imageUrl)}`)
  } catch {
    return null
  }
}

// Calculate download progress
export function calculateProgress(downloaded: number, total: number): number {
  if (total === 0) return 0
  return Math.min(100, Math.max(0, (downloaded / total) * 100))
}

// Calculate download speed
export function calculateSpeed(bytesDownloaded: number, timeElapsed: number): number {
  if (timeElapsed === 0) return 0
  return bytesDownloaded / (timeElapsed / 1000) // bytes per second
}

// Calculate ETA
export function calculateETA(remainingBytes: number, speed: number): number {
  if (speed === 0) return Number.POSITIVE_INFINITY
  return remainingBytes / speed // seconds
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validate image URL
export function isValidImageUrl(url: string): boolean {
  if (!isValidUrl(url)) return false

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"]
  const extension = getFileExtension(url)

  return extension ? imageExtensions.includes(extension) : false
}

// Generate color palette from image
export function generateColorPalette(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = extractDominantColors(imageData.data)

        resolve(colors)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageUrl
  })
}

// Extract dominant colors from image data
function extractDominantColors(data: Uint8ClampedArray): string[] {
  const colorMap = new Map<string, number>()

  // Sample every 10th pixel to improve performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const alpha = data[i + 3]

    // Skip transparent pixels
    if (alpha < 128) continue

    // Quantize colors to reduce noise
    const quantizedR = Math.floor(r / 32) * 32
    const quantizedG = Math.floor(g / 32) * 32
    const quantizedB = Math.floor(b / 32) * 32

    const color = `rgb(${quantizedR}, ${quantizedG}, ${quantizedB})`
    colorMap.set(color, (colorMap.get(color) || 0) + 1)
  }

  // Sort by frequency and return top 5 colors
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color)
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Create download blob
export function createDownloadBlob(data: ArrayBuffer, mimeType: string): Blob {
  return new Blob([data], { type: mimeType })
}

// Download file
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Compress image
export function compressImage(file: File, quality = 0.8, maxWidth = 1920, maxHeight = 1080): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to compress image"))
          }
        },
        "image/jpeg",
        quality,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}
