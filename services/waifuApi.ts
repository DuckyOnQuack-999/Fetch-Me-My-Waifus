import type { ImageCategory, WaifuImage, SortOption, Settings, ApiSource } from "../types/waifu"
import { requestDeduplicator, createRequestKey } from "@/utils/requestDeduplication"
import { parseApiError, logApiError } from "@/utils/apiErrorHandler"
import { fetchWallhavenImages } from "@/app/actions/wallhaven"

const WAIFU_IM_API_BASE_URL = "https://api.waifu.im"
const WAIFU_PICS_API_BASE_URL = "https://api.waifu.pics"
const NEKOS_BEST_API_BASE_URL = "https://nekos.best/api/v2"
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
    try {
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
        "Content-Type": "application/json",
      }

      if (settings?.waifuImApiKey) {
        headers["Authorization"] = `Bearer ${settings.waifuImApiKey}`
      }

      const url = `${WAIFU_IM_API_BASE_URL}/search?${params}`

      const response = await fetchWithRetry(url, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.images || !Array.isArray(data.images)) {
        return []
      }

      return data.images.map((image: any) => ({
        ...image,
        isFavorite: false,
        fetchedFrom: "waifu.im" as ApiSource,
        lastModified: new Date().toISOString(),
      }))
    } catch (error) {
      const apiError = parseApiError(error, "waifu.im")
      logApiError(apiError, { category, limit, isNsfw })
      return []
    }
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
    try {
      const type = isNsfw ? "nsfw" : "sfw"
      const url = `${WAIFU_PICS_API_BASE_URL}/many/${type}/${category}`

      const response = await fetchWithRetry(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WaifuDownloader/2.0",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.files || !Array.isArray(data.files)) {
        return []
      }

      return data.files.slice(0, limit).map((url: string, index: number) => ({
        image_id: Date.now() + index,
        url,
        preview_url: url,
        width: 0,
        height: 0,
        tags: [{ name: category }],
        source: "waifu.pics",
        uploaded_at: new Date().toISOString(),
        isFavorite: false,
        fetchedFrom: "waifu.pics" as ApiSource,
        lastModified: new Date().toISOString(),
      }))
    } catch (error) {
      const apiError = parseApiError(error, "waifu.pics")
      logApiError(apiError, { category, isNsfw, limit })
      return []
    }
  })
}

export async function fetchImagesFromNekosBest(
  category: string,
  settings?: Settings,
  limit = 30,
): Promise<WaifuImage[]> {
  const requestKey = createRequestKey("nekos.best", { category, limit })

  return requestDeduplicator.deduplicate(requestKey, async () => {
    try {
      const url = `${NEKOS_BEST_API_BASE_URL}/${category}?amount=${Math.min(limit, 20)}`

      const response = await fetchWithRetry(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "WaifuDownloader/2.0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.results || !Array.isArray(data.results)) {
        return []
      }

      return data.results.map((item: any, index: number) => ({
        image_id: Date.now() + index,
        url: item.url,
        preview_url: item.url,
        width: 0,
        height: 0,
        tags: [{ name: category }],
        source: "nekos.best",
        uploaded_at: new Date().toISOString(),
        isFavorite: false,
        fetchedFrom: "nekos.best" as ApiSource,
        lastModified: new Date().toISOString(),
      }))
    } catch (error) {
      const apiError = parseApiError(error, "nekos.best")
      logApiError(apiError, { category, limit })
      return []
    }
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
    let combinedImages: WaifuImage[] = []

    const categoryMappings = {
      "nekos.best": {
        waifu: "waifu",
        neko: "neko",
        husbando: "husbando",
        kitsune: "kitsune",
      },
      "waifu.pics": {
        waifu: "waifu",
        neko: "neko",
        shinobu: "shinobu",
        megumin: "megumin",
        bully: "bully",
        cuddle: "cuddle",
        cry: "cry",
        hug: "hug",
        awoo: "awoo",
        kiss: "kiss",
        lick: "lick",
        pat: "pat",
        smug: "smug",
        bonk: "bonk",
        yeet: "yeet",
        blush: "blush",
        smile: "smile",
        wave: "wave",
        highfive: "highfive",
        handhold: "handhold",
        nom: "nom",
        bite: "bite",
        glomp: "glomp",
        slap: "slap",
        kill: "kill",
        kick: "kick",
        happy: "happy",
        wink: "wink",
        poke: "poke",
        dance: "dance",
        cringe: "cringe",
      },
    }

    const activeSources = []
    if (apiSource === "all" || apiSource === "waifu.im") activeSources.push("waifu.im")
    if (apiSource === "all" || apiSource === "waifu.pics") activeSources.push("waifu.pics")
    if (apiSource === "all" || apiSource === "nekos.best") activeSources.push("nekos.best")
    if (apiSource === "all" || apiSource === "wallhaven") activeSources.push("wallhaven")
    if (apiSource === "all" || apiSource === "femboyfinder") activeSources.push("femboyfinder")

    const limitPerSource = Math.max(1, Math.floor(limit / Math.max(1, activeSources.length)))

    const fetchPromises = []

    if (apiSource === "all" || apiSource === "waifu.im") {
      fetchPromises.push(
        fetchImagesFromWaifuIm(category, limitPerSource, isNsfw, sortBy, page, minWidth, minHeight, settings).catch(
          () => [],
        ),
      )
    }

    if (apiSource === "all" || apiSource === "waifu.pics") {
      const validCategory =
        categoryMappings["waifu.pics"][category as keyof (typeof categoryMappings)["waifu.pics"]] || "waifu"
      fetchPromises.push(fetchImagesFromWaifuPics(validCategory, isNsfw, settings, limitPerSource).catch(() => []))
    }

    if (apiSource === "all" || apiSource === "nekos.best") {
      const validCategory =
        categoryMappings["nekos.best"][category as keyof (typeof categoryMappings)["nekos.best"]] || "waifu"
      fetchPromises.push(fetchImagesFromNekosBest(validCategory, settings, limitPerSource).catch(() => []))
    }

    if (apiSource === "all" || apiSource === "wallhaven") {
      fetchPromises.push(
        fetchImagesFromWallhaven(category, limitPerSource, isNsfw, sortBy, page, minWidth, minHeight, settings).catch(
          () => [],
        ),
      )
    }

    if (apiSource === "all" || apiSource === "femboyfinder") {
      const femboyPromises = Array(limitPerSource)
        .fill(null)
        .map(() => fetchImageFromFemboyFinder(category, settings).catch(() => null))

      fetchPromises.push(
        Promise.all(femboyPromises).then((results) => results.filter((img): img is WaifuImage => img !== null)),
      )
    }

    const results = await Promise.all(fetchPromises)
    combinedImages = results.flat()

    return combinedImages
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
