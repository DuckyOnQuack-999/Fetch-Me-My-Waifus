export interface WaifuImage {
  image_id: number | string
  url: string
  preview_url?: string
  width: number
  height: number
  file_size?: number
  file_format?: string
  tags?: string[]
  source?: string
  artist?: string
  character?: string
  series?: string
  rating?: "safe" | "questionable" | "explicit"
  created_at?: string
  updated_at?: string
  isFavorite?: boolean
  isDownloaded?: boolean
  downloadPath?: string
  fetchedFrom?: ApiSource
  lastModified?: string
  metadata?: {
    dominantColor?: string
    aspectRatio?: number
    quality?: number
    [key: string]: any
  }
}

export interface Collection {
  id: string
  name: string
  description?: string
  imageIds: string[]
  created_at: string
  updated_at: string
  thumbnail?: string
  isPublic?: boolean
  tags?: string[]
}

export interface Collections {
  [key: string]: Collection
}

export interface DownloadProgress {
  downloaded: number
  total: number
  speed: number
  eta: number
  currentFile?: string
  errors?: string[]
}

export type DownloadStatus = "idle" | "downloading" | "paused" | "completed" | "error"

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
  | "marin-kitagawa"
  | "mori-calliope"
  | "raiden-shogun"
  | "oppai"
  | "selfies"
  | "uniform"
  | "husbando"
  | "kitsune"
  | "anime"
  | "general"
  | "people"
  | "astolfo"
  | "felix"
  | "hideri"
  | "saika"
  | "venti"

export type ApiSource = "waifu.im" | "waifu.pics" | "nekos.best" | "wallhaven" | "femboyfinder" | "all"

export type SortOption = "RANDOM" | "NEWEST" | "OLDEST" | "MOST_LIKED" | "HIGHEST_RATED"

export interface Settings {
  // API Configuration
  concurrentDownloads: number
  retryAttempts: number
  autoStartDownloads: boolean
  defaultSortOption: SortOption
  apiSource: ApiSource
  waifuImApiKey: string
  waifuPicsApiKey: string
  nekosBestApiKey: string
  wallhavenApiKey: string
  femboyFinderApiKey?: string
  requestTimeout: number
  rateLimitDelay: number

  // Image Quality & Resolution
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
  useCustomResolution: boolean
  selectedPreset: string
  minFileSize: number
  maxFileSize: number
  allowedFormats: string[]
  preferredFormat: string
  compressionLevel: "none" | "low" | "medium" | "high"

  // Download Behavior
  imagesPerPage: number
  enableNsfw: boolean
  skipDuplicates: boolean
  createSubfolders: boolean
  organizeByDate: boolean
  organizeBySource: boolean
  organizeByCategory: boolean
  downloadLocation: string
  tempDownloadLocation: string
  maxConcurrentDownloads: number
  defaultCategory: ImageCategory
  autoDownload: boolean

  // File Management
  fileNamingPattern: string
  customNamingTemplate: string
  preserveOriginalNames: boolean
  addMetadataToFilename: boolean
  createThumbnails: boolean
  thumbnailSize: number

  // UI & Appearance
  themeMode: "light" | "dark" | "system"
  language: string
  showPreviewImages: boolean
  previewImageSize: "small" | "medium" | "large"
  gridColumns: number
  showImageDetails: boolean
  showDownloadProgress: boolean
  compactMode: boolean

  // Notifications & Sounds
  enableNotifications: boolean
  notifyOnDownloadComplete: boolean
  notifyOnError: boolean
  notifyOnNewImages: boolean
  notificationSound: string
  customSoundPath: string
  showSystemTrayIcon: boolean
  minimizeToTray: boolean

  // Performance & Caching
  enableImageCache: boolean
  maxCacheSize: number
  cacheExpiryDays: number
  preloadImages: boolean
  enableLazyLoading: boolean
  maxMemoryUsage: number
  enableHardwareAcceleration: boolean

  // Privacy & Security
  enableAnalytics: boolean
  shareUsageData: boolean
  enableContentFiltering: boolean
  blockedTags: string[]
  allowedDomains: string[]
  enableProxySupport: boolean
  proxyUrl: string
  proxyUsername: string
  proxyPassword: string

  // Backup & Sync
  enableAutoBackup: boolean
  backupFrequency: "never" | "daily" | "weekly" | "monthly"
  backupLocation: string
  maxBackupFiles: number
  enableCloudSync: boolean
  cloudSyncProvider: "none" | "google" | "dropbox" | "onedrive"

  // Advanced Features
  enableBatchDownload: boolean
  enableScheduledDownloads: boolean
  scheduledDownloadTime: string
  enableAutoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  enableDebugMode: boolean
  logLevel: "error" | "warn" | "info" | "debug"
  maxLogFileSize: number

  // Experimental Features
  enableExperimentalFeatures: boolean
  enableAITagging: boolean
  enableImageUpscaling: boolean
  upscalingFactor: number
  enableDuplicateDetection: boolean
  duplicateThreshold: number
}

export interface DownloadItem {
  id: string
  url: string
  filename: string
  status: "pending" | "downloading" | "completed" | "failed" | "paused"
  progress: number
  speed?: number
  eta?: number
  error?: string
  timestamp: Date
  source: ApiSource
  category?: ImageCategory
  tags?: string[]
  addedAt: Date
  metadata?: WaifuImage
}

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
  context?: Record<string, any>
}

export interface PerformanceMetrics {
  apiResponseTimes: Record<ApiSource | "all", number[]>
  downloadSpeeds: number[]
  cacheHitRate: number
  errorRate: number
  memoryUsage: number
}

export interface ApiStatusData {
  name: string
  displayName: string
  url: string
  endpoint: string
  status: "online" | "offline" | "degraded" | "checking"
  latency?: number
  lastChecked: Date
  description: string
  features: string[]
  keyRequired: boolean
  keyName: keyof Settings
  rateLimit?: {
    requests: number
    window: number
    remaining?: number
    resetTime?: Date
  }
  statistics?: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageLatency: number
  }
}

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
  rating?: "safe" | "questionable" | "explicit" | "any"
  source?: ApiSource[]
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: SortOption
  sortOrder?: "asc" | "desc"
}

export interface GalleryViewOptions {
  layout: "grid" | "masonry" | "list"
  columns: number
  showDetails: boolean
  showTags: boolean
  showMetadata: boolean
  imageSize: "small" | "medium" | "large"
  spacing: "compact" | "normal" | "relaxed"
}

export interface UserPreferences {
  favoriteCategories: ImageCategory[]
  blockedTags: string[]
  preferredSources: ApiSource[]
  defaultFilters: SearchFilters
  gallerySettings: GalleryViewOptions
  downloadSettings: Partial<Settings>
  shortcuts: Record<string, string>
  customTheme?: {
    primaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
  }
}
