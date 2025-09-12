// Core image types
export interface WaifuImage {
  image_id: string | number
  url: string
  preview_url?: string
  width: number
  height: number
  file_size?: number
  extension?: string
  signature?: string
  favorites?: number
  dominant_color?: string
  source?: string
  artist?: string
  character?: string
  series?: string
  rating?: "safe" | "questionable" | "explicit"
  created_at?: string
  updated_at?: string
  tags?: Array<{
    name: string
    description?: string
    is_nsfw?: boolean
  }>
  metadata?: {
    addedAt?: string
    dominantColor?: string
    aspectRatio?: number
    [key: string]: any
  }
  isFavorite?: boolean
  fetchedFrom?: ApiSource
  lastModified?: string
  filename?: string
}

// API and source types
export type ApiSource = "all" | "waifu.im" | "waifu.pics" | "nekos.best" | "wallhaven" | "femboyfinder"

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

export type SortOption = "RANDOM" | "NEWEST" | "OLDEST" | "FAVORITES" | "WIDTH" | "HEIGHT" | "FILE_SIZE"

export type ThemeMode = "light" | "dark" | "system"
export type Language = "en" | "ja" | "ko" | "zh"

// Settings interface
export interface Settings {
  // API Configuration
  concurrentDownloads: number
  retryAttempts: number
  autoStartDownloads: boolean
  apiSource: ApiSource
  waifuImApiKey: string
  wallhavenApiKey: string
  requestTimeout: number
  rateLimitDelay: number

  // Image Quality & Resolution
  minWidth: number
  minHeight: number
  minFileSize: number
  maxFileSize: number
  preferredFormat: string

  // Download Behavior
  allowNsfw: boolean
  skipDuplicates: boolean
  createSubfolders: boolean
  organizeBySource: boolean
  organizeByCategory: boolean
  downloadLocation: string

  // UI & Appearance
  themeMode: ThemeMode
  language: Language
  gridColumns: number
  previewImageSize: string
  showPreviewImages: boolean
  showImageDetails: boolean
  compactMode: boolean

  // Notifications & Sounds
  enableNotifications: boolean
  notifyOnDownloadComplete: boolean
  notifyOnError: boolean
  notifyOnNewImages: boolean
  notificationSound: string

  // Performance & Caching
  maxMemoryUsage: number
  maxCacheSize: number
  enableImageCache: boolean
  hardwareAcceleration: boolean

  // Advanced Features
  enableDebugMode: boolean
  enableExperimentalFeatures: boolean

  // Backup & Sync
  enableAutoBackup: boolean
  backupFrequency: string
}

// Download types
export type DownloadStatus = "pending" | "downloading" | "completed" | "failed" | "paused" | "cancelled"

export interface DownloadItem {
  id: string
  url: string
  filename: string
  status: DownloadStatus
  progress: number
  timestamp: Date
  addedAt: Date
  source?: ApiSource
  category?: ImageCategory
  tags?: string[]
  metadata?: any
  error?: string
  speed?: number
  eta?: number
  retries?: number
  startTime?: Date
  endTime?: Date
  filePath?: string
}

export interface DownloadProgress {
  downloaded: number
  total: number
  speed: number
  eta: number
  currentFile?: string
  errors?: string[]
}

// Collection types
export interface Collection {
  id: string
  name: string
  description?: string
  imageIds: string[]
  created_at: string
  updated_at: string
  tags?: string[]
}

export interface Collections {
  [key: string]: Collection
}

// Search and filter types
export interface SearchFilters {
  category?: ImageCategory
  tags?: string[]
  excludeTags?: string[]
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  aspectRatio?: "any" | "square" | "landscape" | "portrait"
  fileFormat?: string[]
  rating?: "any" | "safe" | "questionable" | "explicit"
  source?: ApiSource[]
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  timestamp: string
  source: ApiSource
}

export interface WaifuError {
  code: string
  message: string
  source: ApiSource
  timestamp: Date
  context?: any
}

export interface PerformanceMetrics {
  apiResponseTimes: {
    [key in ApiSource]: number[]
  }
  downloadSpeeds: number[]
  cacheHitRate: number
  errorRate: number
  memoryUsage: number
}

// Component prop types
export interface ImageGalleryProps {
  images: WaifuImage[]
  onImageSelect?: (image: WaifuImage) => void
  onImageDownload?: (image: WaifuImage) => void
  selectedImages?: Set<string>
  viewMode?: "grid" | "list"
  showFavorites?: boolean
}

export interface DownloadTabProps {
  onStartDownload?: (category: ImageCategory, limit: number, isNsfw: boolean, downloadPath: string) => void
  onPauseDownload?: () => void
  onStopDownload?: () => void
  downloadStatus?: DownloadStatus
  downloadProgress?: DownloadProgress
  settings?: Settings
}
