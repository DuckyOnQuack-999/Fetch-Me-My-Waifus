import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the Waifu Downloader application

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

/**
 * Format duration to human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
}

/**
 * Format time ago
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? "s" : ""} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years > 1 ? "s" : ""} ago`
  }
}

/**
 * Generate a unique ID
 */
export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T
  }

  if (typeof obj === "object") {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * Check if two objects are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (!a || !b || (typeof a !== "object" && typeof b !== "object")) {
    return a === b
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }

  if (a.prototype !== b.prototype) return false

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) {
    return false
  }

  return keys.every((k) => deepEqual(a[k], b[k]))
}

/**
 * Sanitize filename for safe file system usage
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace invalid characters
  return filename
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 255) // Limit length
}

/**
 * Extract file extension from URL or filename
 */
export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const extension = pathname.split(".").pop()?.toLowerCase()
    return extension || "jpg"
  } catch {
    // If URL parsing fails, try to extract from string directly
    const extension = url.split(".").pop()?.toLowerCase()
    return extension || "jpg"
  }
}

/**
 * Validate URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!isValidUrl(url)) return false

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"]
  const extension = getFileExtension(url)

  return imageExtensions.includes(extension)
}

/**
 * Calculate image aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

/**
 * Get dominant color from image (placeholder - would need canvas implementation)
 */
export function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    // This would require canvas implementation in a real app
    // For now, return a default color
    resolve("#6366f1")
  })
}

/**
 * Compress image (placeholder - would need canvas implementation)
 */
export function compressImage(file: File, quality = 0.8, maxWidth = 1920, maxHeight = 1080): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // This would require canvas implementation in a real app
    // For now, return the original file
    resolve(file)
  })
}

/**
 * Generate thumbnail (placeholder - would need canvas implementation)
 */
export function generateThumbnail(imageUrl: string, width = 300, height = 300): Promise<string> {
  return new Promise((resolve) => {
    // This would require canvas implementation in a real app
    // For now, return the original URL
    resolve(imageUrl)
  })
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
      return false
    }
  },

  clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },
}

/**
 * Array utility functions
 */
export const arrayUtils = {
  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  unique<T>(array: T[], key?: keyof T): T[] {
    if (!key) {
      return [...new Set(array)]
    }

    const seen = new Set()
    return array.filter((item) => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  },

  groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (groups, item) => {
        const value = String(item[key])
        if (!groups[value]) {
          groups[value] = []
        }
        groups[value].push(item)
        return groups
      },
      {} as Record<string, T[]>,
    )
  },
}

/**
 * Color utility functions
 */
export const colorUtils = {
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  },

  rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  },

  isLight(hex: string): boolean {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return true

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128
  },
}

/**
 * Performance monitoring utilities
 */
export const performance = {
  mark(name: string): void {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(name)
    }
  },

  measure(name: string, startMark: string, endMark?: string): number {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.measure(name, startMark, endMark)
      const entries = window.performance.getEntriesByName(name, "measure")
      return entries.length > 0 ? entries[entries.length - 1].duration : 0
    }
    return 0
  },

  clearMarks(name?: string): void {
    if (typeof window !== "undefined" && window.performance) {
      if (name) {
        window.performance.clearMarks(name)
      } else {
        window.performance.clearMarks()
      }
    }
  },
}

/**
 * Error handling utilities
 */
export const errorUtils = {
  isNetworkError(error: any): boolean {
    return error?.code === "NETWORK_ERROR" || error?.message?.includes("fetch") || error?.message?.includes("network")
  },

  isTimeoutError(error: any): boolean {
    return error?.code === "TIMEOUT" || error?.message?.includes("timeout")
  },

  isRateLimitError(error: any): boolean {
    return error?.status === 429 || error?.code === "RATE_LIMIT_EXCEEDED"
  },

  getErrorMessage(error: any): string {
    if (typeof error === "string") return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    return "An unknown error occurred"
  },
}
