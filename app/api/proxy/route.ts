import { type NextRequest, NextResponse } from "next/server"

// Allowlist of domains we permit proxying to
const ALLOWED_DOMAINS = [
  "api.waifu.im",
  "api.waifu.pics",
  "nekos.best",
  "wallhaven.cc",
  "femboyfinder.firestreaker2.gq",
  "cdn.waifu.im",
  "i.waifu.pics",
  "cdn.nekos.best",
  "w.wallhaven.cc",
  "th.wallhaven.cc",
]

function isAllowed(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return ALLOWED_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  if (!isAllowed(targetUrl)) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 })
  }

  try {
    const headers: HeadersInit = {
      "User-Agent": "WaifuDownloader/2.0",
      Accept: "application/json, image/*, */*",
    }

    // Forward Wallhaven API key if targeting Wallhaven
    const wallhavenKey = process.env.WALLHAVEN_API_KEY
    if (wallhavenKey && targetUrl.includes("wallhaven.cc")) {
      headers["Authorization"] = `Token ${wallhavenKey}`
    }

    const response = await fetch(targetUrl, { headers, next: { revalidate: 60 } })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream"

    // For images — stream the blob back
    if (contentType.startsWith("image/")) {
      const blob = await response.arrayBuffer()
      return new NextResponse(blob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      })
    }

    // For JSON — return parsed
    const data = await response.json()
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=30" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Proxy fetch failed: ${message}` }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  if (!isAllowed(targetUrl)) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 })
  }

  try {
    const body = await request.text()
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WaifuDownloader/2.0",
        Accept: "application/json",
      },
      body,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Proxy fetch failed: ${message}` }, { status: 502 })
  }
}
