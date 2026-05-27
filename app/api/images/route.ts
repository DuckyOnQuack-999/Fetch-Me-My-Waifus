import { type NextRequest, NextResponse } from "next/server"
import type { WaifuImage, ApiSource, ImageCategory, SortOption } from "@/types/waifu"

// ─── Shared server-side fetch helper ────────────────────────────────────────
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        // Browser-like headers to pass Cloudflare managed challenge
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: url.startsWith("https://api.waifu.im") ? "https://www.waifu.im/" : undefined,
        ...(options.headers ?? {}),
      } as HeadersInit,
      cache: "no-store",
    })
  } finally {
    clearTimeout(timeout)
  }
}

// ─── waifu.im ───────────────────────────────────────────────────────────────
async function fetchWaifuIm(
  category: string,
  limit: number,
  isNsfw: boolean,
  sortBy: string,
  page: number,
  minWidth?: number,
  minHeight?: number,
  apiKey?: string,
): Promise<WaifuImage[]> {
  const params = new URLSearchParams({
    included_tags: category,
    is_nsfw: String(isNsfw),
    order_by: sortBy.toUpperCase(),
    many: "true",
    page: String(page),
    limit: String(Math.min(limit, 30)),
  })
  if (minWidth) params.append("width", `>=${minWidth}`)
  if (minHeight) params.append("height", `>=${minHeight}`)

  const headers: Record<string, string> = {}
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
  // Always send the waifu.im API key from env if available
  const envKey = process.env.WAIFU_API_KEY
  if (envKey && !apiKey) headers["Authorization"] = `Bearer ${envKey}`

  const res = await apiFetch(`https://api.waifu.im/search?${params}`, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`waifu.im ${res.status}: ${body.slice(0, 120)}`)
  }

  const data = await res.json()
  if (!Array.isArray(data?.images)) return []

  return data.images.map((img: any) => ({
    image_id: img.image_id ?? img.id ?? `waifuim-${Date.now()}-${Math.random()}`,
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
}

// ─── waifu.pics ─────────────────────────────────────────────────────────────
async function fetchWaifuPics(category: string, isNsfw: boolean, limit: number): Promise<WaifuImage[]> {
  const type = isNsfw ? "nsfw" : "sfw"
  const res = await apiFetch(`https://api.waifu.pics/many/${type}/${category}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  })
  if (!res.ok) throw new Error(`waifu.pics ${res.status}`)

  const data = await res.json()
  if (!Array.isArray(data?.files)) return []

  return data.files.slice(0, limit).map((url: string, i: number) => ({
    image_id: `waifupics-${Date.now()}-${i}`,
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
}

// ─── nekos.best ─────────────────────────────────────────────────────────────
async function fetchNekosBest(category: string, limit: number): Promise<WaifuImage[]> {
  const res = await apiFetch(`https://nekos.best/api/v2/${category}?amount=${Math.min(limit, 20)}`)
  if (!res.ok) throw new Error(`nekos.best ${res.status}`)

  const data = await res.json()
  if (!Array.isArray(data?.results)) return []

  return data.results.map((item: any, i: number) => ({
    image_id: `nekosbest-${Date.now()}-${i}`,
    url: item.url,
    preview_url: item.url,
    width: 0,
    height: 0,
    artist: item.artist_name,
    source: item.source_url ?? item.artist_href ?? "",
    tags: [{ name: category }],
    uploaded_at: new Date().toISOString(),
    isFavorite: false,
    fetchedFrom: "nekos.best" as ApiSource,
    lastModified: new Date().toISOString(),
  }))
}

// ─── wallhaven ──────────────────────────────────────────────────────────────
async function fetchWallhaven(
  query: string,
  limit: number,
  isNsfw: boolean,
  sortBy: string,
  page: number,
  minWidth?: number,
  minHeight?: number,
): Promise<WaifuImage[]> {
  const apiKey = process.env.WALLHAVEN_API_KEY
  const params = new URLSearchParams({
    q: query,
    categories: "111",
    purity: isNsfw ? "111" : "100",
    sorting: sortBy.toLowerCase() === "random" ? "random" : "date_added",
    order: "desc",
    page: String(page),
  })
  if (minWidth && minHeight) params.append("atleast", `${minWidth}x${minHeight}`)

  const headers: Record<string, string> = { "User-Agent": "WaifuDownloader/2.0" }
  if (apiKey) headers["X-API-Key"] = apiKey

  const res = await apiFetch(`https://wallhaven.cc/api/v1/search?${params}`, { headers })
  if (!res.ok) throw new Error(`wallhaven ${res.status}`)

  const data = await res.json()
  if (!Array.isArray(data?.data)) return []

  return data.data.slice(0, limit).map((item: any) => ({
    image_id: item.id,
    url: item.path,
    preview_url: item.thumbs?.large ?? item.path,
    width: item.dimension_x ?? 0,
    height: item.dimension_y ?? 0,
    file_size: item.file_size,
    extension: item.file_type?.split("/")[1],
    favorites: item.favorites,
    dominant_color: item.colors?.[0],
    source: item.source ?? "",
    is_nsfw: item.purity !== "sfw",
    uploaded_at: item.created_at,
    tags: Array.isArray(item.tags)
      ? item.tags.map((t: any) => ({ name: t.name ?? String(t), is_nsfw: t.purity !== "sfw" }))
      : [],
    rating: item.purity === "sfw" ? "safe" : item.purity === "sketchy" ? "questionable" : "explicit",
    isFavorite: false,
    fetchedFrom: "wallhaven" as ApiSource,
    lastModified: new Date().toISOString(),
  }))
}

// ─── Category mapping helpers ────────────────────────────────────────────────
const WAIFU_PICS_CATEGORIES = new Set([
  "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss","lick",
  "pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold","nom","bite",
  "glomp","slap","kill","kick","happy","wink","poke","dance","cringe",
])
const NEKOS_BEST_CATEGORIES = new Set(["waifu","neko","husbando","kitsune"])

// ─── Route handler ───────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams

  const category = (sp.get("category") ?? "waifu") as ImageCategory
  const apiSource = (sp.get("source") ?? "all") as ApiSource
  const limit = Math.max(1, Math.min(100, Number(sp.get("limit") ?? 10)))
  const isNsfw = sp.get("nsfw") === "true"
  const sortBy = (sp.get("sort") ?? "RANDOM") as SortOption
  const page = Math.max(1, Number(sp.get("page") ?? 1))
  const minWidth = sp.get("minWidth") ? Number(sp.get("minWidth")) : undefined
  const minHeight = sp.get("minHeight") ? Number(sp.get("minHeight")) : undefined
  const userWaifuKey = sp.get("waifuKey") ?? undefined

  const sources = apiSource === "all"
    ? (["waifu.im", "waifu.pics", "nekos.best", "wallhaven"] as const)
    : ([apiSource] as const)

  const limitPerSource = Math.max(1, Math.ceil(limit / sources.length))

  const results = await Promise.allSettled(
    sources.map(async (src) => {
      switch (src) {
        case "waifu.im":
          return fetchWaifuIm(category, limitPerSource, isNsfw, sortBy, page, minWidth, minHeight, userWaifuKey)

        case "waifu.pics": {
          const cat = WAIFU_PICS_CATEGORIES.has(category) ? category : "waifu"
          return fetchWaifuPics(cat, isNsfw, limitPerSource)
        }

        case "nekos.best": {
          const cat = NEKOS_BEST_CATEGORIES.has(category) ? category : "waifu"
          return fetchNekosBest(cat, limitPerSource)
        }

        case "wallhaven":
          return fetchWallhaven(category, limitPerSource, isNsfw, sortBy, page, minWidth, minHeight)

        default:
          return []
      }
    }),
  )

  const images: WaifuImage[] = []
  const errors: string[] = []

  for (const r of results) {
    if (r.status === "fulfilled") {
      images.push(...r.value)
    } else {
      const msg = r.reason instanceof Error ? r.reason.message : String(r.reason)
      errors.push(msg)
      console.error("[api/images]", msg)
    }
  }

  if (images.length === 0 && errors.length > 0) {
    return NextResponse.json(
      { success: false, images: [], errors, message: "All sources failed. Check server logs." },
      { status: 502 },
    )
  }

  return NextResponse.json(
    { success: true, images: images.slice(0, limit), count: images.length, errors },
    { headers: { "Cache-Control": "no-store" } },
  )
}
