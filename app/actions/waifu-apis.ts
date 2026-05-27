"use server"

import type { WaifuImage, ApiSource, ImageCategory, SortOption } from "@/types/waifu"

const WAIFU_IM_API = "https://api.waifu.im"
const WAIFU_PICS_API = "https://api.waifu.pics"
const NEKOS_BEST_API = "https://nekos.best/api/v2"

// Shared fetch helper with browser-like headers to pass Cloudflare
async function serverFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; WaifuDownloader/2.0; +https://github.com/waifu-downloader)",
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      ...(options.headers ?? {}),
    },
    next: { revalidate: 0 },
  })
}

// ----- waifu.im -----
export async function fetchWaifuImImages(
  category: ImageCategory = "waifu",
  limit = 30,
  isNsfw = false,
  sortBy: SortOption = "RANDOM",
  page = 1,
  minWidth?: number,
  minHeight?: number,
  apiKey?: string,
): Promise<{ success: boolean; images: WaifuImage[]; error?: string }> {
  try {
    const params = new URLSearchParams({
      included_tags: category,
      is_nsfw: String(isNsfw),
      order_by: sortBy,
      many: "true",
      page: String(page),
      limit: String(Math.min(limit, 30)),
    })
    if (minWidth) params.append("width", `>=${minWidth}`)
    if (minHeight) params.append("height", `>=${minHeight}`)

    const headers: Record<string, string> = {}
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`

    const response = await serverFetch(`${WAIFU_IM_API}/search?${params}`, { headers })

    if (!response.ok) {
      const text = await response.text()
      return { success: false, images: [], error: `waifu.im ${response.status}: ${text.slice(0, 200)}` }
    }

    const data = await response.json()
    if (!data.images || !Array.isArray(data.images)) {
      return { success: false, images: [], error: "Unexpected response shape from waifu.im" }
    }

    const images: WaifuImage[] = data.images.map((img: any) => ({
      image_id: img.image_id ?? img.id ?? String(Date.now() + Math.random()),
      url: img.url,
      preview_url: img.preview_url ?? img.url,
      width: img.width ?? 0,
      height: img.height ?? 0,
      file_size: img.byte_size,
      extension: img.extension,
      favorites: img.favorites,
      dominant_color: img.dominant_color,
      source: img.source ?? "",
      artist: img.artist?.name,
      is_nsfw: img.is_nsfw,
      uploaded_at: img.uploaded_at,
      tags: Array.isArray(img.tags)
        ? img.tags.map((t: any) => ({ name: t.name ?? String(t), is_nsfw: t.is_nsfw }))
        : [],
      isFavorite: false,
      fetchedFrom: "waifu.im" as ApiSource,
      lastModified: new Date().toISOString(),
    }))

    return { success: true, images }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, images: [], error: `waifu.im fetch failed: ${message}` }
  }
}

// ----- waifu.pics -----
export async function fetchWaifuPicsImages(
  category: string,
  isNsfw = false,
  limit = 30,
): Promise<{ success: boolean; images: WaifuImage[]; error?: string }> {
  try {
    const type = isNsfw ? "nsfw" : "sfw"
    const url = `${WAIFU_PICS_API}/many/${type}/${category}`

    const response = await serverFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      return { success: false, images: [], error: `waifu.pics ${response.status}` }
    }

    const data = await response.json()
    if (!data.files || !Array.isArray(data.files)) {
      return { success: false, images: [], error: "Unexpected response from waifu.pics" }
    }

    const images: WaifuImage[] = data.files.slice(0, limit).map((fileUrl: string, index: number) => ({
      image_id: `waifupics-${Date.now()}-${index}`,
      url: fileUrl,
      preview_url: fileUrl,
      width: 0,
      height: 0,
      tags: [{ name: category }],
      source: "waifu.pics",
      uploaded_at: new Date().toISOString(),
      isFavorite: false,
      fetchedFrom: "waifu.pics" as ApiSource,
      lastModified: new Date().toISOString(),
    }))

    return { success: true, images }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, images: [], error: `waifu.pics fetch failed: ${message}` }
  }
}

// ----- nekos.best -----
export async function fetchNekosBestImages(
  category: string,
  limit = 20,
): Promise<{ success: boolean; images: WaifuImage[]; error?: string }> {
  try {
    const amount = Math.min(limit, 20)
    const url = `${NEKOS_BEST_API}/${category}?amount=${amount}`

    const response = await serverFetch(url)

    if (!response.ok) {
      return { success: false, images: [], error: `nekos.best ${response.status}` }
    }

    const data = await response.json()
    if (!data.results || !Array.isArray(data.results)) {
      return { success: false, images: [], error: "Unexpected response from nekos.best" }
    }

    const images: WaifuImage[] = data.results.map((item: any, index: number) => ({
      image_id: `nekosbest-${Date.now()}-${index}`,
      url: item.url,
      preview_url: item.url,
      width: 0,
      height: 0,
      artist: item.artist_name,
      source: item.source_url ?? item.artist_href,
      tags: [{ name: category }],
      uploaded_at: new Date().toISOString(),
      isFavorite: false,
      fetchedFrom: "nekos.best" as ApiSource,
      lastModified: new Date().toISOString(),
    }))

    return { success: true, images }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { success: false, images: [], error: `nekos.best fetch failed: ${message}` }
  }
}
