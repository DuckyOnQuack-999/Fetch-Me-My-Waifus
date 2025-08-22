// API-specific type definitions
export interface WaifuImResponse {
  images: Array<{
    signature: string
    extension: string
    image_id: number
    favorites: number
    dominant_color: string
    source: string
    artist: {
      artist_id: number
      name: string
      patreon: string | null
      pixiv: string | null
      twitter: string | null
      deviant_art: string | null
    } | null
    uploaded_at: string
    liked_at: string | null
    is_nsfw: boolean
    width: number
    height: number
    byte_size: number
    url: string
    preview_url: string
    tags: Array<{
      tag_id: number
      name: string
      description: string
      is_nsfw: boolean
    }>
  }>
}

export interface WaifuPicsResponse {
  url: string
}

export interface NekosBestResponse {
  results: Array<{
    artist_href: string
    artist_name: string
    source_url: string
    url: string
  }>
}

export interface WallhavenResponse {
  data: Array<{
    id: string
    url: string
    short_url: string
    views: number
    favorites: number
    source: string
    purity: string
    category: string
    dimension_x: number
    dimension_y: number
    resolution: string
    ratio: string
    file_size: number
    file_type: string
    created_at: string
    colors: string[]
    path: string
    thumbs: {
      large: string
      original: string
      small: string
    }
    tags: Array<{
      id: number
      name: string
      alias: string
      category_id: number
      category: string
      purity: string
      created_at: string
    }>
  }>
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface FemboyFinderResponse {
  url: string
  tags: string[]
  source?: string
}

// Circuit breaker states
export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN"

export interface CircuitBreakerConfig {
  failureThreshold: number
  recoveryTimeout: number
  monitoringPeriod: number
  expectedErrors: string[]
}

export interface ApiEndpoint {
  name: string
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  timeout: number
  retries: number
  circuitBreaker: CircuitBreakerConfig
  rateLimit: {
    requests: number
    window: number // in milliseconds
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
  endpoint?: string
  retryAfter?: number
}

export interface ApiMetrics {
  endpoint: string
  requests: number
  successes: number
  failures: number
  averageResponseTime: number
  lastRequest: string
  circuitBreakerState: CircuitBreakerState
}

// Rate limiting
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

// Caching
export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
  size: number
}

export interface CacheStats {
  hits: number
  misses: number
  size: number
  maxSize: number
  evictions: number
}

// Request/Response interceptors
export interface RequestInterceptor {
  onRequest?: (config: any) => any
  onRequestError?: (error: any) => any
}

export interface ResponseInterceptor {
  onResponse?: (response: any) => any
  onResponseError?: (error: any) => any
}

// Batch operations
export interface BatchRequest {
  id: string
  endpoint: string
  params: any
  priority: number
}

export interface BatchResponse<T> {
  id: string
  success: boolean
  data?: T
  error?: ApiError
}

// WebSocket events for real-time updates
export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
  id: string
}

export interface DownloadEvent extends WebSocketMessage {
  type: "download:progress" | "download:complete" | "download:error"
  payload: {
    downloadId: string
    progress?: number
    error?: string
    result?: any
  }
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string
  timeout: number
  retries: number
  headers: Record<string, string>
  interceptors: {
    request: RequestInterceptor[]
    response: ResponseInterceptor[]
  }
  cache: {
    enabled: boolean
    ttl: number
    maxSize: number
  }
  circuitBreaker: CircuitBreakerConfig
  rateLimit: {
    enabled: boolean
    requests: number
    window: number
  }
}
