// Core type definitions for the Waifu Downloader application
export interface WaifuImage {
  id: string
  image_id: string
  url: string
  preview_url?: string
  thumbnail_url?: string
  filename?: string
  title?: string
  description?: string
  tags: string[]
  source: string
  category?: string
  width?: number
  height?: number
  file_size?: number
  format?: string
  created_at: string
  updated_at?: string
  downloaded_at?: string
  is_nsfw?: boolean
  rating?: number
  artist?: string
  artist_url?: string
  copyright?: string
  character?: string
  metadata?: {
    addedAt: string
    aspectRatio: number
    dominantColor?: string
    quality?: "low" | "medium" | "high"
    upscaled?: boolean
    originalUrl?: string
    downloadCount?: number
    viewCount?: number
    lastViewed?: string
  }
}

export interface Collection {
  id: string
  name: string
  description?: string
  imageIds: string[]
  created_at: string
  updated_at: string
  tags?: string[]
  isPublic?: boolean
  thumbnail?: string
  color?: string
  sortOrder?: "date" | "name" | "custom"
}

export interface Collections {
  [key: string]: Collection
}

export interface Settings {
  theme: "light" | "dark" | "system"
  downloadPath: string
  maxConcurrentDownloads: number
  autoUpscale: boolean
  imageQuality: "original" | "high" | "medium" | "low"
  enableNotifications: boolean
  autoTagging: boolean
  duplicateDetection: boolean
  apiKeys: {
    wallhaven?: string
    waifuIm?: string
    waifuPics?: string
    nekosBest?: string
    femboyFinder?: string
  }
  filters: {
    minWidth: number
    minHeight: number
    maxFileSize: number
    allowedFormats: string[]
    blockedTags: string[]
  }
  ui: {
    gridSize: "small" | "medium" | "large"
    showMetadata: boolean
    enableAnimations: boolean
    compactMode: boolean
  }
  privacy: {
    analytics: boolean
    crashReporting: boolean
    usageStats: boolean
  }
  lastUpdated?: string
}

export interface DownloadProgress {
  id: string
  url: string
  filename: string
  status: "pending" | "downloading" | "completed" | "failed" | "paused"
  progress: number
  speed: number
  eta: number
  error?: string
  startTime: string
  endTime?: string
  fileSize?: number
  downloadedBytes?: number
}

export interface DownloadBatch {
  id: string
  name: string
  urls: string[]
  progress: DownloadProgress[]
  status: "pending" | "downloading" | "completed" | "failed" | "paused"
  created_at: string
  completed_at?: string
  totalFiles: number
  completedFiles: number
  failedFiles: number
  totalSize?: number
  downloadedSize?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchFilters {
  query?: string
  tags?: string[]
  source?: string
  category?: string
  minWidth?: number
  minHeight?: number
  isNsfw?: boolean
  dateFrom?: string
  dateTo?: string
  sortBy?: "date" | "name" | "size" | "rating"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}

export interface ImageStats {
  totalImages: number
  totalFavorites: number
  totalCollections: number
  totalDownloads: number
  storageUsed: number
  averageRating: number
  topSources: Array<{ source: string; count: number }>
  topTags: Array<{ tag: string; count: number }>
  downloadHistory: Array<{
    date: string
    count: number
    size: number
  }>
}

export type ImageCategory =
  | "waifu"
  | "neko"
  | "shinobu"
  | "megumin"
  | "bully"
  | "cuddle"
  | "cry"
  | "hug"
  | "awoo"
  | "kiss"
  | "lick"
  | "pat"
  | "smug"
  | "bonk"
  | "yeet"
  | "blush"
  | "smile"
  | "wave"
  | "highfive"
  | "handhold"
  | "nom"
  | "bite"
  | "glomp"
  | "slap"
  | "kill"
  | "kick"
  | "happy"
  | "wink"
  | "poke"
  | "dance"
  | "cringe"
  | "maid"
  | "uniform"
  | "selfies"
  | "husbando"
  | "kitsune"

export type ApiSource = "all" | "waifu.im" | "waifu.pics" | "nekos.best" | "wallhaven" | "femboyfinder"

export type ViewMode = "grid" | "list" | "masonry"

export type SortOption = "date" | "name" | "size" | "rating" | "random"

export type FilterOption = "all" | "favorites" | "recent" | "untagged" | "nsfw" | "sfw"

// Event types for the application
export interface AppEvents {
  "image:downloaded": { image: WaifuImage }
  "image:favorited": { imageId: string; isFavorite: boolean }
  "image:deleted": { imageId: string }
  "collection:created": { collection: Collection }
  "collection:updated": { collection: Collection }
  "collection:deleted": { collectionId: string }
  "download:started": { batch: DownloadBatch }
  "download:progress": { progress: DownloadProgress }
  "download:completed": { batch: DownloadBatch }
  "download:failed": { batch: DownloadBatch; error: string }
  "settings:updated": { settings: Settings }
  "search:performed": { filters: SearchFilters; results: number }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
