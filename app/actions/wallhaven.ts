"use server"

interface WallhavenImage {
  id: string
  path: string
  thumbs: {
    large: string
    original: string
    small: string
  }
  resolution: string
  file_size: number
  tags?: Array<{ name: string }>
  purity: string
  created_at: string
}

interface WallhavenResponse {
  data: WallhavenImage[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export async function fetchWallhavenImages(
  query: string,
  limit = 30,
  isNsfw = false,
  sortBy = "random",
  page = 1,
  minWidth?: number,
  minHeight?: number,
) {
  try {
    const params = new URLSearchParams({
      q: query,
      categories: "111",
      purity: isNsfw ? "111" : "100",
      sorting: sortBy === "RANDOM" ? "random" : "date_added",
      order: "desc",
      page: String(page),
      atleast: minWidth && minHeight ? `${minWidth}x${minHeight}` : "1920x1080",
    })

    const headers: HeadersInit = {
      "User-Agent": "WaifuDownloader/2.0",
    }

    // API key is only accessed server-side
    const apiKey = process.env.WALLHAVEN_API_KEY
    if (apiKey) {
      headers["X-API-Key"] = apiKey
    }

    const url = `https://wallhaven.cc/api/v1/search?${params}`

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Wallhaven API error: ${response.status}`)
    }

    const data: WallhavenResponse = await response.json()

    return {
      success: true,
      images: data.data.map((item) => ({
        image_id: item.id,
        url: item.path,
        preview_url: item.thumbs.large,
        width: Number.parseInt(item.resolution.split("x")[0]),
        height: Number.parseInt(item.resolution.split("x")[1]),
        file_size: item.file_size,
        tags: item.tags?.map((tag) => tag.name) || [],
        source: "wallhaven",
        rating: item.purity === "sfw" ? "safe" : item.purity === "sketchy" ? "questionable" : "explicit",
        created_at: item.created_at,
        fetchedFrom: "wallhaven" as const,
        lastModified: new Date().toISOString(),
      })),
      meta: data.meta,
    }
  } catch (error) {
    console.error("Error fetching from Wallhaven:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      images: [],
    }
  }
}
