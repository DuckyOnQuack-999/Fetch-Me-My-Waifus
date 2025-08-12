import type { ImageCategory, WaifuImage, SortOption, Settings, ApiSource } from "../types/waifu"

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
    console.error("API Response Error:", errorMessage)
    throw new Error(errorMessage)
  }
  return response.json()
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
    "User-Agent": "WaifuDownloader/1.0",
  }

  if (settings?.waifuImApiKey) {
    headers["Authorization"] = `Bearer ${settings.waifuImApiKey}`
  }

  const url = `${WAIFU_IM_API_BASE_URL}/search?${params}`

  try {
    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return data.images.map((image: any) => ({
      ...image,
      isFavorite: false,
      fetchedFrom: "waifu.im" as ApiSource,
      lastModified: new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching images from Waifu.im:", error)
    throw error
  }
}

export async function fetchImagesFromWaifuPics(
  category: string,
  isNsfw = false,
  settings?: Settings,
  limit = 30,
): Promise<WaifuImage[]> {
  const type = isNsfw ? "nsfw" : "sfw"
  const url = `https://api.waifu.pics/many/${type}/${category}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WaifuDownloader/1.0",
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

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
    console.error("Error fetching images from Waifu.pics:", error)
    throw error
  }
}

export async function fetchImagesFromNekosBest(
  category: string,
  settings?: Settings,
  limit = 30,
): Promise<WaifuImage[]> {
  const url = `https://nekos.best/api/v2/${category}?amount=${limit}`

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

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
    console.error("Error fetching images from Nekos.best:", error)
    throw error
  }
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
  try {
    console.log("Fetching images from Wallhaven:", { query, limit, isNsfw, sortBy, page, minWidth, minHeight })

    // Fixed: Wallhaven API requires API key for most requests
    if (!settings.wallhavenApiKey) {
      console.warn("Wallhaven API key not provided, skipping Wallhaven")
      return []
    }

    const params = new URLSearchParams({
      q: query,
      categories: "010", // Only anime category
      purity: isNsfw ? "011" : "100", // SFW or NSFW
      sorting: sortBy === "RANDOM" ? "random" : "favorites",
      order: "desc",
      page: String(page),
      apikey: settings.wallhavenApiKey,
    })

    if (limit > 0 && limit <= 100) {
      params.append("limit", String(limit))
    }

    if (minWidth && minHeight) {
      params.append("atleast", `${minWidth}x${minHeight}`)
    }

    const url = `${WALLHAVEN_API_BASE_URL}/search?${params}`
    console.log("Fetching from Wallhaven URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/1.0",
      },
      next: { revalidate: 60 },
    })

    const data = await handleApiResponse<WallhavenApiResponse>(response)
    console.log("Wallhaven API Response:", data)

    const transformedImages: WaifuImage[] = data.data.map((image) => ({
      image_id: image.id,
      url: image.path,
      preview_url: image.thumbs.large,
      extension: image.file_type.split("/")[1],
      width: image.dimension_x,
      height: image.dimension_y,
      signature: "",
      favorites: image.favorites,
      dominant_color: image.colors[0] || "#000000",
      source: image.source || "",
      uploaded_at: image.created_at,
      is_nsfw: image.purity !== "sfw",
      tags: image.tags.map((tag) => ({
        name: tag.name,
        description: tag.category,
        is_nsfw: tag.purity !== "sfw",
      })),
      isFavorite: false,
      fetchedFrom: "wallhaven" as ApiSource,
      lastModified: new Date().toISOString(),
    }))

    console.log("Transformed Wallhaven images:", transformedImages)

    return transformedImages
  } catch (error) {
    console.error("Error fetching images from Wallhaven:", error)
    // Don't throw error, just return empty array to allow other sources to work
    return []
  }
}

export async function fetchImageFromFemboyFinder(query: string, settings: Settings): Promise<WaifuImage> {
  try {
    // If query is 'random', use a default category
    const actualQuery = query === "random" ? "astolfo" : query
    const url = `${FEMBOYFINDER_API_BASE_URL}/api/${actualQuery}`
    console.log("Fetching from FemboyFinder URL:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/1.0",
      },
      next: { revalidate: 60 },
    })

    const data = await handleApiResponse<FemboyFinderApiResponse>(response)
    console.log("FemboyFinder API Response:", data)

    if (data.error) {
      throw new Error(data.query)
    }

    const transformedImage: WaifuImage = {
      image_id: Date.now().toString(),
      url: data.url,
      preview_url: data.url,
      width: 0, // FemboyFinder API doesn't provide image dimensions
      height: 0,
      tags: data.tags.split(" ").map((tag) => ({
        name: tag,
      })),
      source: data.source,
      uploaded_at: new Date().toISOString(),
      isFavorite: false,
      fetchedFrom: "femboyfinder" as ApiSource,
      lastModified: new Date().toISOString(),
    }

    console.log("Transformed FemboyFinder image:", transformedImage)

    return transformedImage
  } catch (error) {
    console.error("Error fetching image from FemboyFinder:", error)
    throw error
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
    console.log("Fetching images from multiple sources:", {
      category,
      limit,
      isNsfw,
      sortBy,
      page,
      minWidth,
      minHeight,
      apiSource,
    })
    let combinedImages: WaifuImage[] = []

    // Map categories to valid endpoints for each API
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

    // Calculate limits per source
    const activeSources = []
    if (apiSource === "all" || apiSource === "waifu.im") activeSources.push("waifu.im")
    if (apiSource === "all" || apiSource === "waifu.pics") activeSources.push("waifu.pics")
    if (apiSource === "all" || apiSource === "nekos.best") activeSources.push("nekos.best")
    if (apiSource === "all" || apiSource === "wallhaven") activeSources.push("wallhaven")
    if (apiSource === "all" || apiSource === "femboyfinder") activeSources.push("femboyfinder")

    const limitPerSource = Math.max(1, Math.floor(limit / Math.max(1, activeSources.length)))

    if (apiSource === "all" || apiSource === "waifu.im") {
      try {
        const waifuImImages = await fetchImagesFromWaifuIm(
          category,
          limitPerSource,
          isNsfw,
          sortBy,
          page,
          minWidth,
          minHeight,
          settings,
        )
        console.log(`Fetched ${waifuImImages.length} images from Waifu.im`)
        combinedImages = [...combinedImages, ...waifuImImages]
      } catch (error) {
        console.error("Error fetching from Waifu.im:", error)
      }
    }

    if (apiSource === "all" || apiSource === "waifu.pics") {
      try {
        const validCategory =
          categoryMappings["waifu.pics"][category as keyof (typeof categoryMappings)["waifu.pics"]] || "waifu"
        const waifuPicsImages = await fetchImagesFromWaifuPics(validCategory, isNsfw, settings, limitPerSource)
        console.log(`Fetched ${waifuPicsImages.length} images from Waifu Pics`)
        combinedImages = [...combinedImages, ...waifuPicsImages]
      } catch (error) {
        console.error("Error fetching from Waifu Pics:", error)
      }
    }

    if (apiSource === "all" || apiSource === "nekos.best") {
      try {
        const validCategory =
          categoryMappings["nekos.best"][category as keyof (typeof categoryMappings)["nekos.best"]] || "waifu"

        console.log("Attempting to fetch from Nekos.best...")
        const nekosBestImages = await fetchImagesFromNekosBest(validCategory, settings, limitPerSource)
        console.log("Fetched images from Nekos.best (or fallback)")
        combinedImages = [...combinedImages, ...nekosBestImages]
      } catch (error) {
        console.error("Error in Nekos.best section:", error)
        // Continue with other sources
      }
    }

    if (apiSource === "all" || apiSource === "wallhaven") {
      try {
        const wallhavenImages = await fetchImagesFromWallhaven(
          category,
          limitPerSource,
          isNsfw,
          sortBy,
          page,
          minWidth,
          minHeight,
          settings,
        )
        console.log(`Fetched ${wallhavenImages.length} images from Wallhaven`)
        combinedImages = [...combinedImages, ...wallhavenImages]
      } catch (error) {
        console.error("Error fetching from Wallhaven:", error)
      }
    }

    if (apiSource === "all" || apiSource === "femboyfinder") {
      try {
        const femboyFinderPromises = Array(limitPerSource)
          .fill(null)
          .map(() => fetchImageFromFemboyFinder(category, settings))
        const femboyFinderImages = await Promise.all(femboyFinderPromises)
        console.log(`Fetched ${femboyFinderImages.length} images from FemboyFinder`)
        combinedImages = [...combinedImages, ...femboyFinderImages]
      } catch (error) {
        console.error("Error fetching from FemboyFinder:", error)
      }
    }

    if (combinedImages.length === 0) {
      throw new Error("No images could be fetched from any source")
    }

    console.log(`Total images fetched: ${combinedImages.length}`)
    return combinedImages
  } catch (error) {
    console.error("Error fetching images from multiple sources:", error)
    throw error
  }
}

export async function downloadImage(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl)
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
    const response = await fetch(`${WAIFU_IM_API_BASE_URL}/tags`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
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
    // Include nekos.best back in random sources
    const sources = ["waifu.im", "waifu.pics", "nekos.best"]
    const randomSource = sources[Math.floor(Math.random() * sources.length)]

    switch (randomSource) {
      case "waifu.im":
        const waifuImImages = await fetchImagesFromWaifuIm(
          "waifu",
          1,
          false,
          "RANDOM",
          1,
          undefined,
          undefined,
          settings,
        )
        return waifuImImages[0]
      case "waifu.pics":
        const waifuPicsImages = await fetchImagesFromWaifuPics("waifu", false, settings, 1)
        return waifuPicsImages[0]
      case "nekos.best":
        const nekosBestImages = await fetchImagesFromNekosBest("waifu", settings, 1)
        return nekosBestImages[0]
      default:
        throw new Error("Invalid source")
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
