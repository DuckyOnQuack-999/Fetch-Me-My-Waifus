import type { WaifuImage, ApiSource, ImageCategory, ImageType } from "@/types/waifu"
import { circuitBreaker } from "./api-circuit-breaker"

interface ApiConfig {
  baseUrl: string
  apiKey?: string
  rateLimit: number
  timeout: number
}

const API_CONFIGS: Record<ApiSource, ApiConfig> = {
  "waifu.pics": {
    baseUrl: "https://api.waifu.pics",
    rateLimit: 1000,
    timeout: 10000,
  },
  "waifu.im": {
    baseUrl: "https://api.waifu.im",
    rateLimit: 1000,
    timeout: 10000,
  },
  "nekos.best": {
    baseUrl: "https://nekos.best/api/v2",
    rateLimit: 1000,
    timeout: 10000,
  },
  wallhaven: {
    baseUrl: "https://wallhaven.cc/api/v1",
    apiKey: process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY || "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk",
    rateLimit: 500,
    timeout: 15000,
  },
}

class EnhancedWaifuApi {
  private lastRequestTime: Record<ApiSource, number> = {
    "waifu.pics": 0,
    "waifu.im": 0,
    "nekos.best": 0,
    wallhaven: 0,
  }

  private async rateLimit(source: ApiSource): Promise<void> {
    const config = API_CONFIGS[source]
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime[source]
    const minInterval = 1000 / (config.rateLimit / 60) // Convert to ms per request

    if (timeSinceLastRequest < minInterval) {
      await new Promise((resolve) => setTimeout(resolve, minInterval - timeSinceLastRequest))
    }

    this.lastRequestTime[source] = Date.now()
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async fetchFromWaifuPics(category: ImageCategory, type: ImageType, count = 1): Promise<WaifuImage[]> {
    return circuitBreaker.execute(async () => {
      await this.rateLimit("waifu.pics")

      const config = API_CONFIGS["waifu.pics"]
      const images: WaifuImage[] = []

      for (let i = 0; i < count; i++) {
        const url = `${config.baseUrl}/${type}/${category}`
        const response = await this.fetchWithTimeout(url, {}, config.timeout)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        images.push({
          id: `waifu-pics-${Date.now()}-${i}`,
          url: data.url,
          source: "waifu.pics",
          category,
          type,
          tags: [category],
          metadata: {
            width: 0,
            height: 0,
            fileSize: 0,
            format: data.url.split(".").pop() || "jpg",
          },
          downloadedAt: new Date(),
        })

        // Small delay between requests
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }

      return images
    })
  }

  async fetchFromWaifuIm(category: ImageCategory, type: ImageType, count = 1): Promise<WaifuImage[]> {
    return circuitBreaker.execute(async () => {
      await this.rateLimit("waifu.im")

      const config = API_CONFIGS["waifu.im"]
      const params = new URLSearchParams({
        selected_tags: category,
        is_nsfw: type === "nsfw" ? "true" : "false",
        many: "true",
        limit: Math.min(count, 30).toString(),
      })

      const url = `${config.baseUrl}/search?${params}`
      const response = await this.fetchWithTimeout(url, {}, config.timeout)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return data.images.slice(0, count).map((img: any, index: number) => ({
        id: `waifu-im-${Date.now()}-${index}`,
        url: img.url,
        source: "waifu.im" as ApiSource,
        category,
        type,
        tags: img.tags || [category],
        metadata: {
          width: img.width || 0,
          height: img.height || 0,
          fileSize: img.byte_size || 0,
          format: img.extension || "jpg",
        },
        downloadedAt: new Date(),
      }))
    })
  }

  async fetchFromNekosBest(category: ImageCategory, count = 1): Promise<WaifuImage[]> {
    return circuitBreaker.execute(async () => {
      await this.rateLimit("nekos.best")

      const config = API_CONFIGS["nekos.best"]
      const images: WaifuImage[] = []

      for (let i = 0; i < count; i++) {
        const url = `${config.baseUrl}/${category}`
        const response = await this.fetchWithTimeout(url, {}, config.timeout)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        images.push({
          id: `nekos-best-${Date.now()}-${i}`,
          url: data.results[0]?.url || data.url,
          source: "nekos.best",
          category,
          type: "sfw",
          tags: [category],
          metadata: {
            width: 0,
            height: 0,
            fileSize: 0,
            format: "jpg",
          },
          downloadedAt: new Date(),
        })

        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }

      return images
    })
  }

  async fetchFromWallhaven(category: string, count = 1): Promise<WaifuImage[]> {
    return circuitBreaker.execute(async () => {
      await this.rateLimit("wallhaven")

      const config = API_CONFIGS.wallhaven
      const params = new URLSearchParams({
        q: category,
        categories: "111",
        purity: "100",
        sorting: "random",
        per_page: Math.min(count, 24).toString(),
        apikey: config.apiKey || "",
      })

      const url = `${config.baseUrl}/search?${params}`
      const response = await this.fetchWithTimeout(url, {}, config.timeout)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return data.data.slice(0, count).map((img: any, index: number) => ({
        id: `wallhaven-${Date.now()}-${index}`,
        url: img.path,
        source: "wallhaven" as ApiSource,
        category: category as ImageCategory,
        type: "sfw" as ImageType,
        tags: img.tags || [category],
        metadata: {
          width: img.resolution?.split("x")[0] || 0,
          height: img.resolution?.split("x")[1] || 0,
          fileSize: img.file_size || 0,
          format: img.file_type || "jpg",
        },
        downloadedAt: new Date(),
      }))
    })
  }

  async fetchImages(
    source: ApiSource,
    category: ImageCategory,
    type: ImageType = "sfw",
    count = 1,
  ): Promise<WaifuImage[]> {
    try {
      switch (source) {
        case "waifu.pics":
          return await this.fetchFromWaifuPics(category, type, count)
        case "waifu.im":
          return await this.fetchFromWaifuIm(category, type, count)
        case "nekos.best":
          return await this.fetchFromNekosBest(category, count)
        case "wallhaven":
          return await this.fetchFromWallhaven(category, count)
        default:
          throw new Error(`Unsupported API source: ${source}`)
      }
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error)
      throw error
    }
  }

  async getApiStatus(source: ApiSource): Promise<{ status: "online" | "offline" | "degraded"; responseTime: number }> {
    try {
      const startTime = Date.now()
      const config = API_CONFIGS[source]

      const response = await this.fetchWithTimeout(
        source === "wallhaven" ? `${config.baseUrl}/search?q=test&per_page=1` : config.baseUrl,
        { method: "HEAD" },
        5000,
      )

      const responseTime = Date.now() - startTime

      return {
        status: response.ok ? (responseTime > 2000 ? "degraded" : "online") : "offline",
        responseTime,
      }
    } catch (error) {
      return {
        status: "offline",
        responseTime: -1,
      }
    }
  }
}

export const enhancedWaifuApi = new EnhancedWaifuApi()
