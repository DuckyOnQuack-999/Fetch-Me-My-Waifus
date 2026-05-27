import type { ImageCategory, WaifuImage, SortOption, Settings, ApiSource } from "../types/waifu"
import { requestDeduplicator, createRequestKey } from "@/utils/requestDeduplication"
import { parseApiError, logApiError } from "@/utils/apiErrorHandler"
import { fetchWallhavenImages } from "@/app/actions/wallhaven"
import { fetchWaifuImImages, fetchWaifuPicsImages, fetchNekosBestImages } from "@/app/actions/waifu-apis"

const WAIFU_IM_API_BASE_URL = "https://api.waifu.im"
const WALLHAVEN_API_BASE_URL = "https://wallhaven.cc/api/v1"
const FEMBOYFINDER_API_BASE_URL = "https://femboyfinder.firestreaker2.gq"

type WaifuImApiResponse = {
  images: WaifuImage[]
}

type WaifuPicsApiResponse = {
  files: string[]
}

type NekosBestApiResponse = {
  results: Array<{
    artist_href: string
    artist_name: string
    source_url: string
    url: string
  }>
}

type WallhavenApiResponse = {
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
    query: string | null
    seed: string | null
  }
}

type FemboyFinderApiResponse = {
  error: boolean
  query: string
  url: string
  tags: string
  source: string
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage: string
    try {
      const errorData = await response.json()
      errorMessage = `API Error: ${errorData.message || response.statusText}`
    } catch (e) {
      errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

function buildProxyUrl(targetUrl: string, method: "GET" | "POST" = "GET"): string {
  // In SSR / server actions, call the external API directly (no CORS restriction)
  // In the browser, route through our proxy route handler
  if (typeof window === "undefined") return targetUrl
  return `/api/proxy?url=${encodeURIComponent(targetUrl)}`
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  const proxied = buildProxyUrl(url, (options.method as "GET" | "POST") ?? "GET")

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const fetchOptions: RequestInit = {
        ...options,
        signal: controller.signal,
      }

      // Only add CORS headers for direct (SSR) calls
      if (proxied === url) {
        fetchOptions.mode = "cors"
        fetchOptions.credentials = "omit"
      }

      const response = await fetch(proxied, fetchOptions)
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }

  throw new Error("All retry attempts failed")
}

export async function fetchImagesFromWaifuIm(
  category: ImageCategory,
  limit = 30,
  isNsfw = false,
  sortBy: SortOption = "RANDOM",
  page = 1,
  minWidth?: number,
  minHeight?: number,
  settings?: Settings,
): Promise<WaifuImage[]> {
  const requestKey = createRequestKey("waifu.im", { category, limit, isNsfw, sortBy, page, minWidth, minHeight })
  return requestDeduplicator.deduplicate(requestKey, async () => {
    const result = await fetchWaifuImImages(
      category, limit, isNsfw, sortBy, page, minWidth, minHeight, settings?.waifuImApiKey,
    )
    if (!result.success) {
      logApiError(parseApiError(new Error(result.error), "waifu.im"), { category, limit, isNsfw })
    }
    return result.images
  })
}

export async function fetchImagesFromWaifuPics(
  category: string,
  isNsfw = false,
  settings?: Settings,
  limit = 30,
): Promise<WaifuImage[]> {
  const requestKey = createRequestKey("waifu.pics", { category, isNsfw, limit })
  return requestDeduplicator.deduplicate(requestKey, async () => {
    const result = await fetchWaifuPicsImages(category, isNsfw, limit)
    if (!result.success) {
      logApiError(parseApiError(new Error(result.error), "waifu.pics"), { category, isNsfw, limit })
    }
    return result.images
  })
}

export async function fetchImagesFromNekosBest(
  category: string,
  settings?: Settings,
  limit = 30,
): Promise<WaifuImage[]> {
  const requestKey = createRequestKey("nekos.best", { category, limit })
  return requestDeduplicator.deduplicate(requestKey, async () => {
    const result = await fetchNekosBestImages(category, limit)
    if (!result.success) {
      logApiError(parseApiError(new Error(result.error), "nekos.best"), { category, limit })
    }
    return result.images
  })
}

export async function fetchImagesFromWallhaven(
  query: string,
  limit = 30,
  isNsfw = false,
  sortBy: SortOption = "RANDOM",
  page = 1,
  minWidth?: number,
  minHeight?: number,
  settings: Settings,
): Promise<WaifuImage[]> {
  const requestKey = createRequestKey("wallhaven", { query, limit, isNsfw, sortBy, page, minWidth, minHeight })

  return requestDeduplicator.deduplicate(requestKey, async () => {
    try {
      // Use the server action so the API key stays server-side
      const result = await fetchWallhavenImages(
        query,
        limit,
        isNsfw,
        sortBy === "RANDOM" ? "random" : "date_added",
        page,
        minWidth,
        minHeight,
      )

      if (!result.success) return []

      return result.images.map((image) => ({
        ...image,
        tags: Array.isArray(image.tags)
          ? image.tags.map((t: string | { name: string }) =>
              typeof t === "string" ? { name: t } : t,
            )
          : [],
        isFavorite: false,
      }))
    } catch (error) {
      const apiError = parseApiError(error, "wallhaven")
      logApiError(apiError, { query, limit, isNsfw })
      return []
    }
  })
}

export async function fetchImageFromFemboyFinder(query: string, settings: Settings): Promise<WaifuImage> {
  try {
    const actualQuery = query === "random" ? "astolfo" : query
    const url = `${FEMBOYFINDER_API_BASE_URL}/api/${actualQuery}`

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/2.0",
      },
    })

    const data = await handleApiResponse<any>(response)

    if (data.error) {
      throw new Error(data.query)
    }

    return {
      image_id: Date.now().toString(),
      url: data.url,
      preview_url: data.url,
      width: 0,
      height: 0,
      tags: data.tags.split(" ").map((tag: string) => ({
        name: tag,
      })),
      source: data.source,
      uploaded_at: new Date().toISOString(),
      isFavorite: false,
      fetchedFrom: "femboyfinder" as ApiSource,
      lastModified: new Date().toISOString(),
    }
  } catch (error) {
    const apiError = parseApiError(error, "femboyfinder")
    logApiError(apiError, { query })
    throw apiError
  }
}

export async function fetchImagesFromMultipleSources(
  category: ImageCategory,
  limit = 30,
  isNsfw = false,
  sortBy: SortOption = "RANDOM",
  page = 1,
  minWidth?: number,
  minHeight?: number,
  settings: Settings,
  apiSource: ApiSource = "all",
): Promise<WaifuImage[]> {
  try {
    // Build query params for the /api/images route handler which runs purely server-side,
    // bypassing all Cloudflare browser challenges on external APIs.
    const params = new URLSearchParams({
      category,
      source: apiSource,
      limit: String(limit),
      nsfw: String(isNsfw),
      sort: sortBy,
      page: String(page),
    })
    if (minWidth) params.set("minWidth", String(minWidth))
    if (minHeight) params.set("minHeight", String(minHeight))
    if (settings?.waifuImApiKey) params.set("waifuKey", settings.waifuImApiKey)

    // Use relative URL so it works in both browser and SSR contexts
    const baseUrl = typeof window === "undefined"
      ? (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000")
      : ""

    const res = await fetch(`${baseUrl}/api/images?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }))
      logApiError(
        parseApiError(new Error(err.message ?? res.statusText), "multiple-sources"),
        { category, limit, isNsfw, apiSource },
      )
      return []
    }

    const data = await res.json()

    if (data.errors?.length) {
      for (const e of data.errors) {
        console.warn("[waifuApi] partial source failure:", e)
      }
    }

    return data.images ?? []
  } catch (error) {
    const apiError = parseApiError(error, "multiple-sources")
    logApiError(apiError, { category, limit, isNsfw, apiSource })
    return []
  }
}

export async function downloadImage(imageUrl: string): Promise<Blob> {
  const response = await fetchWithRetry(imageUrl, {
    method: "GET",
    headers: {
      "User-Agent": "WaifuDownloader/2.0",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
  }
  return response.blob()
}

export function saveImageToFile(blob: Blob, fileName: string): Promise<void> {
  return new Promise((resolve) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    resolve()
  })
}

export async function fetchCategories(): Promise<ImageCategory[]> {
  try {
    const response = await fetchWithRetry(`${WAIFU_IM_API_BASE_URL}/tags`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/2.0",
      },
    })

    const data = await handleApiResponse<{ versatile: { name: string }[] }>(response)
    return data.versatile.map((tag) => tag.name as ImageCategory)
  } catch (error) {
    return ["waifu", "neko", "maid", "uniform", "selfies"]
  }
}

export async function fetchRandomImage(settings: Settings): Promise<WaifuImage> {
  try {
    const sources = ["waifu.pics", "nekos.best"]
    const randomSource = sources[Math.floor(Math.random() * sources.length)]

    switch (randomSource) {
      case "waifu.pics":
        const waifuPicsImages = await fetchImagesFromWaifuPics("waifu", false, settings, 1)
        if (waifuPicsImages.length > 0) return waifuPicsImages[0]
        break
      case "nekos.best":
        const nekosBestImages = await fetchImagesFromNekosBest("waifu", settings, 1)
        if (nekosBestImages.length > 0) return nekosBestImages[0]
        break
    }

    throw new Error("No images available from any source")
  } catch (error) {
    throw error
  }
}

export async function fetchFavorites(source: ApiSource, apiKey?: string): Promise<WaifuImage[]> {
  return []
}
