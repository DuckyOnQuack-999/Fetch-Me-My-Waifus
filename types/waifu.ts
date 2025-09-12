export interface WaifuImage {
  image_id: string | number
  url: string
  filename?: string
  width?: number
  height?: number
  file_size?: number
  extension?: string
  source?: string
  tags?: Array<string | { name: string; id?: number }>
  artist?: string
  character?: string
  series?: string
  rating?: "safe" | "questionable" | "explicit"
  dominant_color?: string
  created_at?: string
  updated_at?: string
  favorites?: number
  isFavorite?: boolean
  timestamp?: number
}

export interface DownloadItem {
  id: string
  url: string
  filename: string
  status: "pending" | "downloading" | "completed" | "failed" | "paused"
  progress: number
  category?: ImageCategory
  tags?: string[]
  addedAt: Date
  completedAt?: Date
  error?: string
}

export interface DownloadProgress {
  downloaded: number
  total: number
  speed: number
  eta: number
  currentFile?: string
  errors?: string[]
}

export type DownloadStatus = "idle" | "downloading" | "paused" | "completed" | "failed"

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

export type SortOption = "RANDOM" | "NEWEST" | "OLDEST" | "POPULAR" | "RELEVANCE"

export type ThemeMode = "light" | "dark" | "system"

export type Language = "en" | "ja" | "ko" | "zh"

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
  femboyFinderApiKey: string
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
  compressionLevel: string

  // Download Behavior
  imagesPerPage: number
  enableNsfw: boolean
  allowNsfw?: boolean
  skipDuplicates: boolean
  createSubfolders: boolean
  organizeByDate: boolean
  organizeBySource: boolean
  organizeByCategory: boolean
  downloadLocation: string
  downloadPath?: string
  tempDownloadLocation: string
  maxConcurrentDownloads: number
  defaultCategory: ImageCategory
  autoDownload: boolean

  // File Management
  fileNamingPattern: string
  namingPattern?: string
  customNamingTemplate: string
  preserveOriginalNames: boolean
  addMetadataToFilename: boolean
  createThumbnails: boolean
  thumbnailSize: number

  // UI & Appearance
  themeMode: ThemeMode
  theme?: ThemeMode
  language: Language
  showPreviewImages: boolean
  previewImageSize: string
  gridColumns: number
  showImageDetails: boolean
  showDownloadProgress: boolean
  compactMode: boolean
  defaultGalleryView?: string
  enableAnimations?: boolean

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
  cacheSize?: number
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
  showContentWarnings?: boolean
  enableCrashReports?: boolean

  // Backup & Sync
  enableAutoBackup: boolean
  backupFrequency: string
  backupLocation: string
  maxBackupFiles: number
  enableCloudSync: boolean
  cloudSyncProvider: string

  // Advanced Features
  enableBatchDownload: boolean
  enableScheduledDownloads: boolean
  scheduledDownloadTime: string
  enableAutoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  enableDebugMode: boolean
  debugMode?: boolean
  logLevel: string
  maxLogFileSize: number

  // Experimental Features
  enableExperimentalFeatures: boolean
  experimentalFeatures?: boolean
  enableAITagging: boolean
  enableImageUpscaling: boolean
  upscalingFactor: number
  enableDuplicateDetection: boolean
  duplicateThreshold: number
  enableRateLimit?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
