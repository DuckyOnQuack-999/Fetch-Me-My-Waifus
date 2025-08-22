import type { WaifuImResponse, WaifuPicsResponse, NekosBestResponse, WallhavenResponse } from "@/types/api"
import type { WaifuImage, ImageCategory, ApiSource, Settings } from "@/types/waifu"
import { generateId, isValidImageUrl } from "@/lib/utils"

// API endpoints configuration
const API_ENDPOINTS = {
  WAIFU_IM: "https://api.waifu.im/search",
  WAIFU_PICS: "https://api.waifu.pics",
  NEKOS_BEST: "https://nekos.best/api/v2",
  WALLHAVEN: "https://wallhaven.cc/api/v1/search",
  FEMBOY_FINDER: "https://femboyfinder.firestreaker2.gq/api",
}

// Rate limiting configuration
const RATE_LIMITS = {
  WAIFU_IM: { requests: 10, window: 60000 }, // 10 requests per minute
  WAIFU_PICS: { requests: 30, window: 60000 }, // 30 requests per minute
  NEKOS_BEST: { requests: 20, window: 60000 }, // 20 requests per minute
  WALLHAVEN: { requests: 45, window: 60000 }, // 45 requests per minute
  FEMBOY_FINDER: { requests: 15, window: 60000 }, // 15 requests per minute
}

// Request tracking for rate limiting
const requestTracker = new Map<string, number[]>()

/**
 * Check if we can make a request to the given API
 */
function canMakeRequest(apiName: string): boolean {
  const now = Date.now()
  const limit = RATE_LIMITS[apiName as keyof typeof RATE_LIMITS]

  if (!limit) return true

  const requests = requestTracker.get(apiName) || []
  const recentRequests = requests.filter((time) => now - time < limit.window)

  return recentRequests.length < limit.requests
}

/**
 * Track a request for rate limiting
 */
function trackRequest(apiName: string): void {
  const now = Date.now()
  const requests = requestTracker.get(apiName) || []
  requests.push(now)
  requestTracker.set(apiName, requests)
}

/**
 * Generic fetch with error handling and retries
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": "WaifuDownloader/1.0",
          Accept: "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

/**
 * Fetch images from Waifu.im API
 */
export async function fetchFromWaifuIm(
  category: ImageCategory,
  count = 1,
  isNsfw = false,
  minWidth = 0,
  minHeight = 0,
): Promise<WaifuImage[]> {
  if (!canMakeRequest("WAIFU_IM")) {
    throw new Error("Rate limit exceeded for Waifu.im API")
  }

  const params = new URLSearchParams({
    included_tags: category,
    many: "true",
    full: "true",
    ...(count > 1 && { many: "true" }),
    ...(minWidth > 0 && { width: `>=${minWidth}` }),
    ...(minHeight > 0 && { height: `>=${minHeight}` }),
    is_nsfw: isNsfw.toString(),
  })

  trackRequest("WAIFU_IM")

  const response = await fetchWithRetry(`${API_ENDPOINTS.WAIFU_IM}?${params}`)
  const data: WaifuImResponse = await response.json()

  if (!data.images || data.images.length === 0) {
    return []
  }

  return data.images.slice(0, count).map((img) => ({
    id: generateId("waifu_im"),
    image_id: img.image_id.toString(),
    url: img.url,
    preview_url: img.preview_url,
    filename: `waifu_im_${img.image_id}.${img.extension}`,
    tags: img.tags.map((tag) => tag.name),
    source: "waifu.im",
    category,
    width: img.width,
    height: img.height,
    file_size: img.byte_size,
    format: img.extension,
    created_at: new Date().toISOString(),
    is_nsfw: img.is_nsfw,
    artist: img.artist?.name,
    artist_url: img.artist?.pixiv || img.artist?.twitter,
    metadata: {
      addedAt: new Date().toISOString(),
      aspectRatio: img.width / img.height,
      dominantColor: img.dominant_color,
      quality: "high",
    },
  }))
}

/**
 * Fetch images from Waifu.pics API
 */
export async function fetchFromWaifuPics(category: ImageCategory, count = 1, isNsfw = false): Promise<WaifuImage[]> {
  if (!canMakeRequest("WAIFU_PICS")) {
    throw new Error("Rate limit exceeded for Waifu.pics API")
  }

  const results: WaifuImage[] = []
  const endpoint = isNsfw ? "nsfw" : "sfw"

  for (let i = 0; i < count; i++) {
    try {
      trackRequest("WAIFU_PICS")

      const response = await fetchWithRetry(`${API_ENDPOINTS.WAIFU_PICS}/${endpoint}/${category}`)
      const data: WaifuPicsResponse = await response.json()

      if (data.url && isValidImageUrl(data.url)) {
        results.push({
          id: generateId("waifu_pics"),
          image_id: generateId("waifu_pics"),
          url: data.url,
          filename: `waifu_pics_${category}_${i + 1}.jpg`,
          tags: [category],
          source: "waifu.pics",
          category,
          created_at: new Date().toISOString(),
          is_nsfw: isNsfw,
          metadata: {
            addedAt: new Date().toISOString(),
            aspectRatio: 1,
            quality: "medium",
          },
        })
      }

      // Small delay between requests to be respectful
      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.warn(`Failed to fetch image ${i + 1} from Waifu.pics:`, error)
    }
  }

  return results
}

/**
 * Fetch images from Nekos.best API
 */
export async function fetchFromNekosBest(category: ImageCategory, count = 1): Promise<WaifuImage[]> {
  if (!canMakeRequest("NEKOS_BEST")) {
    throw new Error("Rate limit exceeded for Nekos.best API")
  }

  const params = new URLSearchParams({
    amount: Math.min(count, 20).toString(), // API limit is 20
  })

  trackRequest("NEKOS_BEST")

  const response = await fetchWithRetry(`${API_ENDPOINTS.NEKOS_BEST}/${category}?${params}`)
  const data: NekosBestResponse = await response.json()

  if (!data.results || data.results.length === 0) {
    return []
  }

  return data.results.slice(0, count).map((img, index) => ({
    id: generateId("nekos_best"),
    image_id: generateId("nekos_best"),
    url: img.url,
    filename: `nekos_best_${category}_${index + 1}.jpg`,
    tags: [category, "neko"],
    source: "nekos.best",
    category,
    created_at: new Date().toISOString(),
    artist: img.artist_name,
    artist_url: img.artist_href,
    metadata: {
      addedAt: new Date().toISOString(),
      aspectRatio: 1,
      quality: "high",
      originalUrl: img.source_url,
    },
  }))
}

/**
 * Fetch images from Wallhaven API
 */
export async function fetchFromWallhaven(
  category = "anime",
  count = 1,
  isNsfw = false,
  minWidth = 0,
  minHeight = 0,
  apiKey?: string,
): Promise<WaifuImage[]> {
  if (!canMakeRequest("WALLHAVEN")) {
    throw new Error("Rate limit exceeded for Wallhaven API")
  }

  const params = new URLSearchParams({
    categories: "010", // Anime category
    purity: isNsfw ? "110" : "100", // SFW or SFW+Sketchy
    sorting: "random",
    per_page: Math.min(count, 24).toString(), // API limit is 24
    ...(minWidth > 0 && { atleast: `${minWidth}x${minHeight}` }),
    ...(apiKey && { apikey: apiKey }),
  })

  trackRequest("WALLHAVEN")

  const response = await fetchWithRetry(`${API_ENDPOINTS.WALLHAVEN}?${params}`)
  const data: WallhavenResponse = await response.json()

  if (!data.data || data.data.length === 0) {
    return []
  }

  return data.data.slice(0, count).map((img) => ({
    id: generateId("wallhaven"),
    image_id: img.id,
    url: img.path,
    preview_url: img.thumbs.large,
    thumbnail_url: img.thumbs.small,
    filename: `wallhaven_${img.id}.${img.file_type.split("/")[1]}`,
    tags: img.tags.map((tag) => tag.name),
    source: "wallhaven",
    category: "anime",
    width: img.dimension_x,
    height: img.dimension_y,
    file_size: img.file_size,
    format: img.file_type.split("/")[1],
    created_at: new Date().toISOString(),
    is_nsfw: img.purity === "nsfw",
    metadata: {
      addedAt: new Date().toISOString(),
      aspectRatio: img.dimension_x / img.dimension_y,
      quality: "high",
      viewCount: img.views,
      downloadCount: img.favorites,
    },
  }))
}

/**
 * Fetch images from multiple sources
 */
export async function fetchImagesFromMultipleSources(
  category: ImageCategory,
  count = 10,
  isNsfw = false,
  sortBy = "RANDOM",
  page = 1,
  minWidth = 0,
  minHeight = 0,
  settings: Settings,
  apiSource: ApiSource = "all",
): Promise<WaifuImage[]> {
  const results: WaifuImage[] = []
  const errors: string[] = []

  // Determine which APIs to use
  const apisToUse: ApiSource[] =
    apiSource === "all" ? ["waifu.im", "waifu.pics", "nekos.best", "wallhaven"] : [apiSource]

  // Calculate images per API
  const imagesPerApi = Math.ceil(count / apisToUse.length)

  // Fetch from each API concurrently
  const fetchPromises = apisToUse.map(async (api) => {
    try {
      switch (api) {
        case "waifu.im":
          return await fetchFromWaifuIm(category, imagesPerApi, isNsfw, minWidth, minHeight)

        case "waifu.pics":
          return await fetchFromWaifuPics(category, imagesPerApi, isNsfw)

        case "nekos.best":
          // Nekos.best doesn't support NSFW filtering
          if (!isNsfw) {
            return await fetchFromNekosBest(category, imagesPerApi)
          }
          return []

        case "wallhaven":
          return await fetchFromWallhaven(
            "anime",
            imagesPerApi,
            isNsfw,
            minWidth,
            minHeight,
            settings.apiKeys.wallhaven,
          )

        default:
          return []
      }
    } catch (error) {
      console.error(`Failed to fetch from ${api}:`, error)
      errors.push(`${api}: ${error instanceof Error ? error.message : "Unknown error"}`)
      return []
    }
  })

  // Wait for all API calls to complete
  const apiResults = await Promise.allSettled(fetchPromises)

  // Collect successful results
  apiResults.forEach((result, index) => {
    if (result.status === "fulfilled") {
      results.push(...result.value)
    } else {
      const apiName = apisToUse[index]
      errors.push(`${apiName}: ${result.reason}`)
    }
  })

  // Shuffle results if random sorting
  if (sortBy === "RANDOM") {
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[results[i], results[j]] = [results[j], results[i]]
    }
  }

  // Apply additional filtering
  let filteredResults = results.filter((img) => {
    // Filter by dimensions
    if (minWidth > 0 && img.width && img.width < minWidth) return false
    if (minHeight > 0 && img.height && img.height < minHeight) return false

    // Filter by blocked tags
    if (settings.filters.blockedTags.length > 0) {
      const hasBlockedTag = img.tags.some((tag) => settings.filters.blockedTags.includes(tag.toLowerCase()))
      if (hasBlockedTag) return false
    }

    // Filter by allowed formats
    if (settings.filters.allowedFormats.length > 0 && img.format) {
      if (!settings.filters.allowedFormats.includes(img.format.toLowerCase())) return false
    }

    return true
  })

  // Limit to requested count
  filteredResults = filteredResults.slice(0, count)

  // Log any errors
  if (errors.length > 0) {
    console.warn("API fetch errors:", errors)
  }

  return filteredResults
}

/**
 * Test API connectivity
 */
export async function testApiConnectivity(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  const tests = [
    { name: "waifu.im", test: () => fetchFromWaifuIm("waifu", 1) },
    { name: "waifu.pics", test: () => fetchFromWaifuPics("waifu", 1) },
    { name: "nekos.best", test: () => fetchFromNekosBest("waifu", 1) },
    { name: "wallhaven", test: () => fetchFromWallhaven("anime", 1) },
  ]

  await Promise.allSettled(
    tests.map(async ({ name, test }) => {
      try {
        await test()
        results[name] = true
      } catch (error) {
        console.warn(`API test failed for ${name}:`, error)
        results[name] = false
      }
    }),
  )

  return results
}

/**
 * Get API status and statistics
 */
export function getApiStats(): Record<string, any> {
  const stats: Record<string, any> = {}

  for (const [apiName, requests] of requestTracker.entries()) {
    const now = Date.now()
    const limit = RATE_LIMITS[apiName as keyof typeof RATE_LIMITS]

    if (limit) {
      const recentRequests = requests.filter((time) => now - time < limit.window)
      stats[apiName] = {
        recentRequests: recentRequests.length,
        limit: limit.requests,
        windowMs: limit.window,
        canMakeRequest: recentRequests.length < limit.requests,
      }
    }
  }

  return stats
}
