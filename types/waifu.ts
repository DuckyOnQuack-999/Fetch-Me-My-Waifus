export interface WaifuImage {
  image_id: number
  url: string
  preview_url: string
  width: number
  height: number
  tags: Array<{
    name: string
    description?: string
  }>
  source?: string
  uploaded_at: string
  isFavorite?: boolean
  fetchedFrom?: ApiSource
  lastModified?: string
}

export interface Collections {
  [key: string]: {
    id: string
    name: string
    imageIds: string[]
  }
}

export type ImageCategory =
  | "waifu"
  | "maid"
  | "marin-kitagawa"
  | "mori-calliope"
  | "raiden-shogun"
  | "oppai"
  | "selfies"
  | "uniform"

export type SortOption = "RANDOM" | "NEWEST" | "OLDEST" | "POPULAR"

export type DownloadStatus = "idle" | "downloading" | "paused" | "completed" | "error"

export interface DownloadProgress {
  total: number
  downloaded: number
  speed: number
  eta: number
}

export interface DownloadItem {
  image: WaifuImage
  progress: number
  status: DownloadStatus
}

export interface Settings {
  waifuImApiKey: string
  waifuPicsApiKey: string
  nekosBestApiKey: string
  wallhavenApiKey: string
  downloadPath: string
  maxConcurrentDownloads: number
  enableNsfw: boolean
  defaultCategory: ImageCategory
  autoDownload: boolean
  theme: "light" | "dark" | "system"
}

export type ApiSource = "waifu.im" | "waifu.pics" | "nekos.best" | "wallhaven" | "femboyfinder" | "all"

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
  apiResponseTimes: Record<ApiSource, number[]>
  downloadSpeeds: number[]
  cacheHitRate: number
  errorRate: number
  memoryUsage: number
}
