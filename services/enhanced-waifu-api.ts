import type {
  ImageCategory,
  WaifuImage,
  SortOption,
  Settings,
  ApiResponse,
  ApiSource,
  WaifuError,
  PerformanceMetrics,
} from "../types/waifu"

// Enhanced API service with comprehensive error handling and performance monitoring
class EnhancedWaifuApiService {
  private performanceMetrics: PerformanceMetrics = {
    apiResponseTimes: {
      all: [],
      "waifu.im": [],
      "waifu.pics": [],
      "nekos.best": [],
      wallhaven: [],
      femboyfinder: [],
    },
    downloadSpeeds: [],
    cacheHitRate: 0,
    errorRate: 0,
    memoryUsage: 0,
  }

  private cache = new Map<string, any>()
  private rateLimiter = new Map<ApiSource, number>()

  // Enhanced error handling with retry logic
  private async handleApiRequest<T>(
    url: string,
    options: RequestInit,
    source: ApiSource,
    retries = 3,
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now()

    try {
      // Rate limiting check
      if (this.isRateLimited(source)) {
        throw new Error(`Rate limited for ${source}`)
      }

      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const responseTime = performance.now() - startTime

      // Update performance metrics
      this.performanceMetrics.apiResponseTimes[source].push(responseTime)

      return {
        data,
        success: true,
        timestamp: new Date().toISOString(),
        source,
      }
    } catch (error) {
      if (retries > 0) {
        await this.delay(1000 * (4 - retries)) // Exponential backoff
        return this.handleApiRequest(url, options, source, retries - 1)
      }

      throw this.createWaifuError(error as Error, source, url)
    }
  }

  private isRateLimited(source: ApiSource): boolean {
    const lastRequest = this.rateLimiter.get(source) || 0
    const now = Date.now()
    const minInterval = 1000 // 1 second between requests

    if (now - lastRequest < minInterval) {
      return true
    }

    this.rateLimiter.set(source, now)
    return false
  }

  private createWaifuError(error: Error, source: ApiSource, context?: string): WaifuError {
    return {
      code: "API_ERROR",
      message: error.message,
      source,
      timestamp: new Date(),
      context: { url: context },
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Enhanced image fetching with better error handling and caching
  async fetchImagesFromWaifuIm(
    category: ImageCategory,
    limit = 30,
    isNsfw = false,
    sortBy: SortOption = "RANDOM",
    page = 1,
    minWidth?: number,
    minHeight?: number,
    settings?: Settings,
  ): Promise<WaifuImage[]> {
    const cacheKey = `waifu.im:${category}:${limit}:${isNsfw}:${sortBy}:${page}`

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const params = new URLSearchParams({
      included_tags: category,
      is_nsfw: String(isNsfw),
      order_by: sortBy,
      many: "true",
      page: String(page),
    })

    if (limit > 0) {
      params.append("limit", String(limit))
    }

    if (minWidth) {
      params.append("width", `>=${minWidth}`)
    }
    if (minHeight) {
      params.append("height", `>=${minHeight}`)
    }

    const headers: HeadersInit = {
      Accept: "application/json",
      "User-Agent": "WaifuDownloader/2.0",
    }

    if (settings?.waifuImApiKey) {
      headers["Authorization"] = `Bearer ${settings.waifuImApiKey}`
    }

    const url = `https://api.waifu.im/search?${params}`

    try {
      const response = await this.handleApiRequest<{ images: WaifuImage[] }>(url, { headers }, "waifu.im")

      const transformedImages = response.data.images.map((image) => ({
        ...image,
        isFavorite: false,
        fetchedFrom: "waifu.im" as ApiSource,
        lastModified: new Date().toISOString(),
      }))

      // Cache the result
      this.cache.set(cacheKey, transformedImages)

      return transformedImages
    } catch (error) {
      console.error("Error fetching images from Waifu.im:", error)
      throw error
    }
  }

  // Enhanced Waifu.pics API implementation
  async fetchImagesFromWaifuPics(
    category: ImageCategory,
    isNsfw = false,
    settings?: Settings,
    limit = 30,
  ): Promise<WaifuImage[]> {
    const cacheKey = `waifu.pics:${category}:${isNsfw}:${limit}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const baseUrl = "https://api.waifu.pics"
    const endpoint = isNsfw ? "nsfw" : "sfw"
    const images: WaifuImage[] = []

    try {
      // Fetch multiple images since waifu.pics returns one at a time
      const promises = Array.from({ length: limit }, async (_, index) => {
        const url = `${baseUrl}/${endpoint}/${category}`

        try {
          const response = await this.handleApiRequest<{ url: string }>(url, {}, "waifu.pics")

          return {
            image_id: `waifu-pics-${Date.now()}-${index}`,
            url: response.data.url,
            width: 1920, // Default dimensions
            height: 1080,
            tags: [category],
            source: "waifu.pics",
            rating: isNsfw ? "explicit" : "safe",
            created_at: new Date().toISOString(),
            fetchedFrom: "waifu.pics" as ApiSource,
            lastModified: new Date().toISOString(),
          } as WaifuImage
        } catch (error) {
          console.warn(`Failed to fetch image ${index + 1} from waifu.pics:`, error)
          return null
        }
      })

      const results = await Promise.allSettled(promises)
      const validImages = results
        .filter(
          (result): result is PromiseFulfilledResult<WaifuImage> =>
            result.status === "fulfilled" && result.value !== null,
        )
        .map((result) => result.value)

      this.cache.set(cacheKey, validImages)
      return validImages
    } catch (error) {
      console.error("Error fetching images from Waifu.pics:", error)
      throw error
    }
  }

  // Enhanced Nekos.best API implementation
  async fetchImagesFromNekosBest(category: ImageCategory, settings?: Settings, limit = 30): Promise<WaifuImage[]> {
    const cacheKey = `nekos.best:${category}:${limit}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const url = `https://nekos.best/api/v2/${category}?amount=${Math.min(limit, 20)}`

    try {
      const response = await this.handleApiRequest<{ results: any[] }>(url, {}, "nekos.best")

      const transformedImages = response.data.results.map((item, index) => ({
        image_id: `nekos-best-${Date.now()}-${index}`,
        url: item.url,
        width: 1920,
        height: 1080,
        tags: [category],
        source: "nekos.best",
        artist: item.artist_name,
        rating: "safe",
        created_at: new Date().toISOString(),
        fetchedFrom: "nekos.best" as ApiSource,
        lastModified: new Date().toISOString(),
      })) as WaifuImage[]

      this.cache.set(cacheKey, transformedImages)
      return transformedImages
    } catch (error) {
      console.error("Error fetching images from Nekos.best:", error)
      throw error
    }
  }

  // Enhanced Wallhaven API implementation
  async fetchImagesFromWallhaven(
    query: string,
    limit = 30,
    isNsfw = false,
    sortBy: SortOption = "RANDOM",
    page = 1,
    minWidth?: number,
    minHeight?: number,
    settings?: Settings,
  ): Promise<WaifuImage[]> {
    const cacheKey = `wallhaven:${query}:${limit}:${isNsfw}:${sortBy}:${page}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const params = new URLSearchParams({
      q: query,
      categories: "111", // General, Anime, People
      purity: isNsfw ? "111" : "100", // SFW, Sketchy, NSFW
      sorting: sortBy === "RANDOM" ? "random" : "date_added",
      order: "desc",
      page: String(page),
      atleast: minWidth && minHeight ? `${minWidth}x${minHeight}` : "1920x1080",
    })

    const headers: HeadersInit = {
      "User-Agent": "WaifuDownloader/2.0",
    }

    if (settings?.wallhavenApiKey) {
      headers["X-API-Key"] = settings.wallhavenApiKey
    }

    const url = `https://wallhaven.cc/api/v1/search?${params}`

    try {
      const response = await this.handleApiRequest<{ data: any[] }>(url, { headers }, "wallhaven")

      const transformedImages = response.data.data.map((item) => ({
        image_id: item.id,
        url: item.path,
        preview_url: item.thumbs.large,
        width: item.resolution.split("x")[0],
        height: item.resolution.split("x")[1],
        file_size: item.file_size,
        tags: item.tags?.map((tag: any) => tag.name) || [],
        source: "wallhaven",
        rating: item.purity === "sfw" ? "safe" : item.purity === "sketchy" ? "questionable" : "explicit",
        created_at: item.created_at,
        fetchedFrom: "wallhaven" as ApiSource,
        lastModified: new Date().toISOString(),
      })) as WaifuImage[]

      this.cache.set(cacheKey, transformedImages)
      return transformedImages
    } catch (error) {
      console.error("Error fetching images from Wallhaven:", error)
      throw error
    }
  }

  // Enhanced Femboy Finder API implementation
  async fetchImagesFromFemboyFinder(category: string, settings?: Settings, limit = 30): Promise<WaifuImage[]> {
    const cacheKey = `femboyfinder:${category}:${limit}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const url = `https://femboyfinder.firestreaker2.gq/api/${category}`

    try {
      const images: WaifuImage[] = []

      // Fetch multiple images
      for (let i = 0; i < limit; i++) {
        try {
          const response = await this.handleApiRequest<{ url: string }>(url, {}, "femboyfinder")

          images.push({
            image_id: `femboyfinder-${Date.now()}-${i}`,
            url: response.data.url,
            width: 1920,
            height: 1080,
            tags: [category, "femboy"],
            source: "femboyfinder",
            rating: "questionable",
            created_at: new Date().toISOString(),
            fetchedFrom: "femboyfinder" as ApiSource,
            lastModified: new Date().toISOString(),
          } as WaifuImage)
        } catch (error) {
          console.warn(`Failed to fetch image ${i + 1} from femboyfinder:`, error)
        }
      }

      this.cache.set(cacheKey, images)
      return images
    } catch (error) {
      console.error("Error fetching images from Femboy Finder:", error)
      throw error
    }
  }

  // Enhanced multi-source fetching with parallel processing and fallbacks
  async fetchImagesFromMultipleSources(
    category: ImageCategory,
    limit = 30,
    isNsfw = false,
    sortBy: SortOption = "RANDOM",
    page = 1,
    minWidth?: number,
    minHeight?: number,
    settings?: Settings,
    apiSource: ApiSource = "all",
  ): Promise<WaifuImage[]> {
    const sources: ApiSource[] =
      apiSource === "all" ? ["waifu.im", "waifu.pics", "nekos.best", "wallhaven", "femboyfinder"] : [apiSource]

    const fetchPromises = sources.map(async (source) => {
      try {
        switch (source) {
          case "waifu.im":
            return await this.fetchImagesFromWaifuIm(
              category,
              Math.floor(limit / sources.length),
              isNsfw,
              sortBy,
              page,
              minWidth,
              minHeight,
              settings,
            )
          case "waifu.pics":
            return await this.fetchImagesFromWaifuPics(category, isNsfw, settings, Math.floor(limit / sources.length))
          case "nekos.best":
            return await this.fetchImagesFromNekosBest(category, settings, Math.floor(limit / sources.length))
          case "wallhaven":
            return await this.fetchImagesFromWallhaven(
              category,
              Math.floor(limit / sources.length),
              isNsfw,
              sortBy,
              page,
              minWidth,
              minHeight,
              settings,
            )
          case "femboyfinder":
            return await this.fetchImagesFromFemboyFinder(category, settings, Math.floor(limit / sources.length))
          default:
            return []
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${source}:`, error)
        return []
      }
    })

    const results = await Promise.allSettled(fetchPromises)
    const combinedImages = results
      .filter((result): result is PromiseFulfilledResult<WaifuImage[]> => result.status === "fulfilled")
      .flatMap((result) => result.value)

    if (combinedImages.length === 0) {
      throw new Error("No images could be fetched from any source")
    }

    return combinedImages
  }

  // Performance monitoring methods
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheSize(): number {
    return this.cache.size
  }
}

// Export singleton instance
export const waifuApiService = new EnhancedWaifuApiService()

// Legacy exports for backward compatibility
export const fetchImagesFromMultipleSources = waifuApiService.fetchImagesFromMultipleSources.bind(waifuApiService)
export const downloadImage = async (imageUrl: string): Promise<Blob> => {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
  }
  return response.blob()
}
