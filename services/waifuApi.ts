import type { ImageCategory, WaifuImage, SortOption, Settings, ApiSource } from "@/types/waifu"

const API_ENDPOINTS = {
  "waifu.im": "https://api.waifu.im/search",
  "waifu.pics": "https://api.waifu.pics/sfw",
  "nekos.best": "https://nekos.best/api/v2",
  wallhaven: "https://wallhaven.cc/api/v1/search",
  femboyfinder: "https://api.femboyfinder.com/v1",
}

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

// Enhanced error handling with retry logic and CORS support
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage: string
    try {
      const errorData = await response.json()
      errorMessage = `API Error: ${errorData.message || response.statusText}`
    } catch (e) {
      errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`
    }
    console.error("API Response Error:", errorMessage)
    throw new Error(errorMessage)
  }
  return response.json()
}

// Enhanced fetch with retry logic and better error handling
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: "cors", // Explicitly set CORS mode
        credentials: "omit", // Don't send credentials
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      console.warn(`Fetch attempt ${i + 1} failed:`, error)

      if (i === retries - 1) {
        throw error
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }

  throw new Error("All retry attempts failed")
}

export async function fetchFromWaifuIm(
  category: ImageCategory,
  count = 1,
  isNsfw = false,
  minWidth?: number,
  minHeight?: number,
): Promise<WaifuImage[]> {
  try {
    const params = new URLSearchParams({
      included_tags: category,
      height: minHeight?.toString() || "600",
      width: minWidth?.toString() || "800",
      is_nsfw: isNsfw.toString(),
      many: "true",
    })

    const response = await fetch(`${API_ENDPOINTS["waifu.im"]}?${params}`)
    const data = await response.json()

    if (!data.images || !Array.isArray(data.images)) {
      return []
    }

    return data.images.slice(0, count).map((img: any) => ({
      image_id: img.image_id || Math.random().toString(36),
      url: img.url,
      filename: img.url.split("/").pop() || `waifu-${Date.now()}.jpg`,
      width: img.width,
      height: img.height,
      file_size: img.byte_size,
      extension: img.extension,
      source: "waifu.im",
      tags: img.tags?.map((tag: any) => tag.name) || [category],
      artist: img.artist?.name,
      created_at: new Date().toISOString(),
      rating: isNsfw ? "questionable" : "safe",
    }))
  } catch (error) {
    console.error("Waifu.im API error:", error)
    return []
  }
}

export async function fetchFromWaifuPics(category: ImageCategory, count = 1, isNsfw = false): Promise<WaifuImage[]> {
  try {
    const images: WaifuImage[] = []
    const endpoint = isNsfw ? "nsfw" : "sfw"

    for (let i = 0; i < count; i++) {
      const response = await fetch(`${API_ENDPOINTS["waifu.pics"]}/${endpoint}/${category}`)
      const data = await response.json()

      if (data.url) {
        images.push({
          image_id: Math.random().toString(36),
          url: data.url,
          filename: data.url.split("/").pop() || `waifu-${Date.now()}.jpg`,
          source: "waifu.pics",
          tags: [category],
          created_at: new Date().toISOString(),
          rating: isNsfw ? "questionable" : "safe",
        })
      }
    }

    return images
  } catch (error) {
    console.error("Waifu.pics API error:", error)
    return []
  }
}

export async function fetchFromNekosBest(category: ImageCategory, count = 1): Promise<WaifuImage[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS["nekos.best"]}/${category}?amount=${Math.min(count, 20)}`)
    const data = await response.json()

    if (!data.results || !Array.isArray(data.results)) {
      return []
    }

    return data.results.map((img: any) => ({
      image_id: Math.random().toString(36),
      url: img.url,
      filename: img.url.split("/").pop() || `neko-${Date.now()}.jpg`,
      source: "nekos.best",
      tags: [category],
      artist: img.artist_name,
      created_at: new Date().toISOString(),
      rating: "safe",
    }))
  } catch (error) {
    console.error("Nekos.best API error:", error)
    return []
  }
}

export async function fetchFromWallhaven(
  category: string,
  count = 1,
  apiKey?: string,
  minWidth?: number,
  minHeight?: number,
): Promise<WaifuImage[]> {
  try {
    const params = new URLSearchParams({
      q: category,
      categories: "111",
      purity: "100",
      sorting: "random",
      per_page: Math.min(count, 24).toString(),
    })

    if (apiKey) {
      params.append("apikey", apiKey)
    }

    if (minWidth && minHeight) {
      params.append("atleast", `${minWidth}x${minHeight}`)
    }

    const response = await fetch(`${API_ENDPOINTS.wallhaven}?${params}`)
    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    return data.data.map((img: any) => ({
      image_id: img.id,
      url: img.path,
      filename: `wallhaven-${img.id}.${img.file_type}`,
      width: img.resolution?.split("x")[0] ? Number.parseInt(img.resolution.split("x")[0]) : undefined,
      height: img.resolution?.split("x")[1] ? Number.parseInt(img.resolution.split("x")[1]) : undefined,
      file_size: img.file_size,
      source: "wallhaven",
      tags: img.tags?.map((tag: any) => tag.name) || [category],
      created_at: img.created_at,
      favorites: img.favorites,
      rating: "safe",
    }))
  } catch (error) {
    console.error("Wallhaven API error:", error)
    return []
  }
}

export async function fetchImagesFromMultipleSources(
  category: ImageCategory,
  count: number,
  isNsfw = false,
  sortOption: SortOption = "RANDOM",
  page = 1,
  minWidth?: number,
  minHeight?: number,
  settings?: Settings,
  apiSource: ApiSource = "all",
): Promise<WaifuImage[]> {
  const allImages: WaifuImage[] = []
  const imagesPerSource = apiSource === "all" ? Math.ceil(count / 3) : count

  try {
    if (apiSource === "all" || apiSource === "waifu.im") {
      const waifuImImages = await fetchFromWaifuIm(category, imagesPerSource, isNsfw, minWidth, minHeight)
      allImages.push(...waifuImImages)
    }

    if (apiSource === "all" || apiSource === "waifu.pics") {
      const waifuPicsImages = await fetchFromWaifuPics(category, imagesPerSource, isNsfw)
      allImages.push(...waifuPicsImages)
    }

    if (apiSource === "all" || apiSource === "nekos.best") {
      const nekosBestImages = await fetchFromNekosBest(category, imagesPerSource)
      allImages.push(...nekosBestImages)
    }

    if ((apiSource === "all" || apiSource === "wallhaven") && settings?.wallhavenApiKey) {
      const wallhavenImages = await fetchFromWallhaven(
        category,
        imagesPerSource,
        settings.wallhavenApiKey,
        minWidth,
        minHeight,
      )
      allImages.push(...wallhavenImages)
    }

    // Shuffle and limit results
    const shuffled = allImages.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  } catch (error) {
    console.error("Multi-source fetch error:", error)
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
  return new Promise((resolve, reject) => {
    console.log(`Saving image: ${fileName}`)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style.display = "none"
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    console.log(`Image saved: ${fileName}`)
    resolve()
  })
}

export async function fetchCategories(): Promise<ImageCategory[]> {
  try {
    const response = await fetchWithRetry(`${API_ENDPOINTS["waifu.im"]}/tags`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/2.0",
      },
    })

    const data = await handleApiResponse<{ versatile: { name: string }[] }>(response)
    return data.versatile.map((tag) => tag.name as ImageCategory)
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return default categories if API fails
    return ["waifu", "neko", "maid", "uniform", "selfies"]
  }
}

export async function fetchRandomImage(settings: Settings): Promise<WaifuImage> {
  try {
    const sources = ["waifu.pics", "nekos.best"] // Removed waifu.im temporarily due to CORS issues
    const randomSource = sources[Math.floor(Math.random() * sources.length)]

    switch (randomSource) {
      case "waifu.pics":
        const waifuPicsImages = await fetchFromWaifuPics("waifu", 1, false)
        if (waifuPicsImages.length > 0) return waifuPicsImages[0]
        break
      case "nekos.best":
        const nekosBestImages = await fetchFromNekosBest("waifu", 1)
        if (nekosBestImages.length > 0) return nekosBestImages[0]
        break
    }

    // Fallback if all sources fail
    return {
      image_id: "fallback-1",
      url: "/placeholder.svg?height=400&width=300&text=Random+Image+Unavailable",
      filename: "placeholder.svg",
      source: "fallback",
      tags: ["fallback"],
      created_at: new Date().toISOString(),
      rating: "safe",
    }
  } catch (error) {
    console.error("Error fetching random image:", error)
    throw error
  }
}

export async function fetchFavorites(source: ApiSource, apiKey?: string): Promise<WaifuImage[]> {
  // This would typically fetch user's favorites from the API
  // For now, return empty array as most APIs don't support favorites
  return []
}
