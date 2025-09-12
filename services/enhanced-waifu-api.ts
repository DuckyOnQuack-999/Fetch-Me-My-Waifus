import { apiService } from "./api-circuit-breaker"
import type { WaifuImage, ApiSource } from "@/types/waifu"

export interface FetchOptions {
  source: ApiSource
  category?: string
  type?: "sfw" | "nsfw"
  count?: number
  tags?: string[]
  orientation?: "portrait" | "landscape"
  resolution?: string
}

class EnhancedWaifuApi {
  private readonly API_ENDPOINTS = {
    "waifu.im": "https://api.waifu.im/search",
    "waifu.pics": "https://api.waifu.pics",
    "nekos.best": "https://nekos.best/api/v2",
    wallhaven: "https://wallhaven.cc/api/v1/search",
  }

  private readonly API_KEY = process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY || "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk"

  async fetchImages(options: FetchOptions): Promise<WaifuImage[]> {
    const { source, category = "waifu", type = "sfw", count = 1 } = options

    try {
      return await apiService.fetchWithCircuitBreaker(source, async () => {
        switch (source) {
          case "waifu.im":
            return this.fetchFromWaifuIm(options)
          case "waifu.pics":
            return this.fetchFromWaifuPics(options)
          case "nekos.best":
            return this.fetchFromNekosBest(options)
          case "wallhaven":
            return this.fetchFromWallhaven(options)
          default:
            throw new Error(`Unsupported API source: ${source}`)
        }
      })
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error)
      throw error
    }
  }

  private async fetchFromWaifuIm(options: FetchOptions): Promise<WaifuImage[]> {
    const { category, type, count, tags } = options

    const params = new URLSearchParams({
      selected_tags: category || "waifu",
      is_nsfw: type === "nsfw" ? "true" : "false",
    })

    if (tags && tags.length > 0) {
      params.append("included_tags", tags.join(","))
    }

    const response = await fetch(`${this.API_ENDPOINTS["waifu.im"]}?${params}`)
    if (!response.ok) {
      throw new Error(`Waifu.im API error: ${response.status}`)
    }

    const data = await response.json()

    return (
      data.images?.map((img: any) => ({
        id: img.image_id?.toString() || Math.random().toString(),
        url: img.url,
        source: "waifu.im" as ApiSource,
        category: category || "waifu",
        tags: img.tags || [],
        width: img.width,
        height: img.height,
        fileSize: img.byte_size,
        extension: img.extension,
        isNsfw: img.is_nsfw || false,
        uploadedAt: img.uploaded_at,
      })) || []
    )
  }

  private async fetchFromWaifuPics(options: FetchOptions): Promise<WaifuImage[]> {
    const { category, type, count } = options
    const endpoint = `${this.API_ENDPOINTS["waifu.pics"]}/${type}/${category}`

    const images: WaifuImage[] = []

    for (let i = 0; i < (count || 1); i++) {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Waifu.pics API error: ${response.status}`)
      }

      const data = await response.json()

      images.push({
        id: Math.random().toString(),
        url: data.url,
        source: "waifu.pics" as ApiSource,
        category: category || "waifu",
        tags: [category || "waifu"],
        isNsfw: type === "nsfw",
      })
    }

    return images
  }

  private async fetchFromNekosBest(options: FetchOptions): Promise<WaifuImage[]> {
    const { category, count } = options
    const endpoint = `${this.API_ENDPOINTS["nekos.best"]}/${category || "neko"}`

    const params = new URLSearchParams({
      amount: (count || 1).toString(),
    })

    const response = await fetch(`${endpoint}?${params}`)
    if (!response.ok) {
      throw new Error(`Nekos.best API error: ${response.status}`)
    }

    const data = await response.json()

    return (
      data.results?.map((img: any) => ({
        id: Math.random().toString(),
        url: img.url,
        source: "nekos.best" as ApiSource,
        category: category || "neko",
        tags: [category || "neko"],
        artist: img.artist_name,
        artistUrl: img.artist_href,
        sourceUrl: img.source_url,
      })) || []
    )
  }

  private async fetchFromWallhaven(options: FetchOptions): Promise<WaifuImage[]> {
    const { category, count, resolution } = options

    const params = new URLSearchParams({
      q: category || "anime",
      categories: "111", // General, Anime, People
      purity: "100", // SFW only for wallhaven
      per_page: (count || 1).toString(),
      apikey: this.API_KEY,
    })

    if (resolution) {
      params.append("resolutions", resolution)
    }

    const response = await fetch(`${this.API_ENDPOINTS.wallhaven}?${params}`)
    if (!response.ok) {
      throw new Error(`Wallhaven API error: ${response.status}`)
    }

    const data = await response.json()

    return (
      data.data?.map((img: any) => ({
        id: img.id,
        url: img.path,
        source: "wallhaven" as ApiSource,
        category: category || "anime",
        tags: img.tags?.map((tag: any) => tag.name) || [],
        width: img.resolution?.split("x")[0],
        height: img.resolution?.split("x")[1],
        fileSize: img.file_size,
        views: img.views,
        favorites: img.favorites,
        uploadedAt: img.created_at,
      })) || []
    )
  }

  async getCategories(source: ApiSource): Promise<string[]> {
    switch (source) {
      case "waifu.im":
        return ["waifu", "maid", "marin-kitagawa", "raiden-shogun", "oppai", "selfies", "uniform"]
      case "waifu.pics":
        return [
          "waifu",
          "neko",
          "shinobu",
          "megumin",
          "bully",
          "cuddle",
          "cry",
          "hug",
          "awoo",
          "kiss",
          "lick",
          "pat",
          "smug",
          "bonk",
          "yeet",
          "blush",
          "smile",
          "wave",
          "highfive",
          "handhold",
          "nom",
          "bite",
          "glomp",
          "slap",
          "kill",
          "kick",
          "happy",
          "wink",
          "poke",
          "dance",
          "cringe",
        ]
      case "nekos.best":
        return ["neko", "kitsune", "husbando", "waifu"]
      case "wallhaven":
        return ["anime", "manga", "waifu", "landscape", "abstract", "nature"]
      default:
        return []
    }
  }
}

export const enhancedWaifuApi = new EnhancedWaifuApi()
