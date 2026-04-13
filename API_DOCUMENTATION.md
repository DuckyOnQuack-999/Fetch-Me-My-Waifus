# Waifu Downloader API Documentation

**Version:** 2.0.0  
**Last Updated:** 2024-01-15  
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Supported APIs](#supported-apis)
3. [Authentication](#authentication)
4. [Rate Limiting](#rate-limiting)
5. [API Integration Details](#api-integration-details)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Waifu Downloader integrates with multiple anime/waifu image APIs to provide a comprehensive image fetching and management solution. This document provides complete integration details for all supported APIs.

### Architecture

\`\`\`
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
┌──────▼──────────────┐
│  Rate Limiter       │ ◄── Token bucket algorithm
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Circuit Breaker    │ ◄── Fault tolerance
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  API Services       │
└─┬──┬──┬──┬──────────┘
  │  │  │  │
  ▼  ▼  ▼  ▼
 W  W  W  N
 A  A  A  E
 L  I  I  K
 L  F  F  O
 H  U  U  S
 A  .  .  .
 V  I  P  B
 E  M  I  E
 N     C  S
       S  T
\`\`\`

---

## Supported APIs

| API | Base URL | Auth Required | Rate Limit | Status |
|-----|----------|---------------|------------|--------|
| **Wallhaven** | `https://wallhaven.cc/api/v1` | Yes (API Key) | 45 req/min | ✅ Active |
| **Waifu.im** | `https://api.waifu.im` | Optional | 100 req/min | ✅ Active |
| **Waifu.pics** | `https://api.waifu.pics` | No | 200 req/min | ✅ Active |
| **Nekos.best** | `https://nekos.best/api/v2` | No | 150 req/min | ✅ Active |

---

## Authentication

### Wallhaven API

**Required:** Yes  
**Method:** Query Parameter

\`\`\`typescript
const apiKey = process.env.WALLHAVEN_API_KEY || 'your-api-key'

const url = `https://wallhaven.cc/api/v1/search?apikey=${apiKey}&q=waifu`
\`\`\`

**Getting Your API Key:**
1. Visit [wallhaven.cc](https://wallhaven.cc/)
2. Create an account
3. Go to Settings → API
4. Generate new API key

### Waifu.im API

**Required:** Optional  
**Method:** Header (Bearer Token)

\`\`\`typescript
const headers = {
  'Authorization': `Bearer ${process.env.WAIFU_IM_API_KEY}`,
  'Content-Type': 'application/json',
}

fetch('https://api.waifu.im/search', { headers })
\`\`\`

**Benefits of Authentication:**
- Higher rate limits
- Access to NSFW content (if enabled)
- Priority support

### Waifu.pics & Nekos.best

**Required:** No  
**Authentication:** None needed for public endpoints

---

## Rate Limiting

### Implementation

Waifu Downloader uses a **token bucket algorithm** to prevent API quota exhaustion:

\`\`\`typescript
import { rateLimiter } from '@/utils/rateLimiter'

// Execute API call with rate limiting
await rateLimiter.execute('wallhaven', async () => {
  return fetch('https://wallhaven.cc/api/v1/search?q=waifu')
})
\`\`\`

### Configuration

\`\`\`typescript
// Default rate limits (tokens per second)
{
  'wallhaven': {
    maxTokens: 20,
    refillRate: 1,  // 1 token per second
  },
  'waifu.im': {
    maxTokens: 30,
    refillRate: 2,  // 2 tokens per second
  },
  'waifu.pics': {
    maxTokens: 50,
    refillRate: 5,  // 5 tokens per second
  },
  'nekos.best': {
    maxTokens: 40,
    refillRate: 3,  // 3 tokens per second
  },
}
\`\`\`

### Monitoring Rate Limits

\`\`\`typescript
const status = rateLimiter.getStatus('wallhaven')

console.log(`Available: ${status.available}/${status.max}`)
console.log(`Queue length: ${status.queueLength}`)
console.log(`Refill rate: ${status.refillRate}/second`)
\`\`\`

---

## API Integration Details

### 1. Wallhaven API

**Documentation:** https://wallhaven.cc/help/api

#### Search Images

\`\`\`typescript
interface WallhavenSearchParams {
  q?: string          // Search query
  categories?: string // '100' = general, '010' = anime, '001' = people
  purity?: string     // '100' = SFW, '010' = Sketchy, '001' = NSFW
  sorting?: string    // 'date_added', 'relevance', 'random', 'views'
  order?: string      // 'desc', 'asc'
  topRange?: string   // '1d', '3d', '1w', '1M', '3M', '6M', '1y'
  atleast?: string    // Minimum resolution '1920x1080'
  ratios?: string     // Aspect ratios '16x9,16x10'
  colors?: string     // Hex color '660000'
  page?: number       // Page number (default: 1)
}

async function searchWallhaven(params: WallhavenSearchParams) {
  const queryString = new URLSearchParams({
    apikey: process.env.WALLHAVEN_API_KEY!,
    ...params,
  }).toString()

  const response = await fetch(
    `https://wallhaven.cc/api/v1/search?${queryString}`
  )

  return response.json()
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "data": [
    {
      "id": "9d89j3",
      "url": "https://wallhaven.cc/w/9d89j3",
      "short_url": "https://whvn.cc/9d89j3",
      "views": 12345,
      "favorites": 123,
      "source": "https://pixiv.net/...",
      "purity": "sfw",
      "category": "anime",
      "dimension_x": 1920,
      "dimension_y": 1080,
      "resolution": "1920x1080",
      "ratio": "1.78",
      "file_size": 456789,
      "file_type": "image/jpeg",
      "created_at": "2024-01-15 12:00:00",
      "colors": ["#663399", "#CC6699"],
      "path": "https://w.wallhaven.cc/full/9d/wallhaven-9d89j3.jpg",
      "thumbs": {
        "large": "https://th.wallhaven.cc/lg/9d/9d89j3.jpg",
        "original": "https://th.wallhaven.cc/orig/9d/9d89j3.jpg",
        "small": "https://th.wallhaven.cc/small/9d/9d89j3.jpg"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 24,
    "total": 240
  }
}
\`\`\`

#### Get Specific Image

\`\`\`typescript
async function getWallhavenImage(id: string) {
  const response = await fetch(
    `https://wallhaven.cc/api/v1/w/${id}?apikey=${process.env.WALLHAVEN_API_KEY}`
  )
  
  return response.json()
}
\`\`\`

---

### 2. Waifu.im API

**Documentation:** https://docs.waifu.im/

#### Search Images

\`\`\`typescript
interface WaifuImSearchParams {
  included_tags?: string[]  // ['waifu', 'maid']
  excluded_tags?: string[]  // ['elf', 'marin-kitagawa']
  is_nsfw?: boolean | 'null'
  gif?: boolean
  order_by?: 'FAVOURITES' | 'UPLOADED_AT' | 'RANDOM'
  orientation?: 'LANDSCAPE' | 'PORTRAIT' | 'SQUARE'
  limit?: number
  many?: boolean
}

async function searchWaifuIm(params: WaifuImSearchParams) {
  const queryParams = new URLSearchParams()

  if (params.included_tags) {
    params.included_tags.forEach(tag => queryParams.append('included_tags', tag))
  }
  if (params.excluded_tags) {
    params.excluded_tags.forEach(tag => queryParams.append('excluded_tags', tag))
  }
  if (params.is_nsfw !== undefined) {
    queryParams.append('is_nsfw', params.is_nsfw.toString())
  }
  if (params.gif !== undefined) {
    queryParams.append('gif', params.gif.toString())
  }
  if (params.order_by) {
    queryParams.append('order_by', params.order_by)
  }
  if (params.orientation) {
    queryParams.append('orientation', params.orientation)
  }

  const response = await fetch(
    `https://api.waifu.im/search?${queryParams.toString()}`,
    {
      headers: {
        'Accept': 'application/json',
        'Accept-Version': 'v5',
      },
    }
  )

  return response.json()
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "images": [
    {
      "signature": "abc123def456",
      "extension": ".png",
      "image_id": 12345,
      "favourites": 42,
      "dominant_color": "#c8a0d1",
      "source": "https://twitter.com/...",
      "artist": {
        "artist_id": 123,
        "name": "Artist Name",
        "patreon": "https://patreon.com/...",
        "pixiv": "https://pixiv.net/..."
      },
      "uploaded_at": "2024-01-15T12:00:00.000000Z",
      "liked_at": null,
      "is_nsfw": false,
      "width": 1920,
      "height": 1080,
      "byte_size": 234567,
      "url": "https://cdn.waifu.im/...",
      "preview_url": "https://cdn.waifu.im/...",
      "tags": [
        {
          "tag_id": 1,
          "name": "waifu",
          "description": "Female anime character",
          "is_nsfw": false
        }
      ]
    }
  ]
}
\`\`\`

#### Get Random Image

\`\`\`typescript
async function getRandomWaifuIm() {
  const response = await fetch('https://api.waifu.im/search?is_nsfw=false')
  return response.json()
}
\`\`\`

---

### 3. Waifu.pics API

**Documentation:** https://waifu.pics/docs/

#### Get Random Image

\`\`\`typescript
type WaifuPicsType = 'sfw' | 'nsfw'
type WaifuPicsCategory = 
  | 'waifu' | 'neko' | 'shinobu' | 'megumin' | 'bully' 
  | 'cuddle' | 'cry' | 'hug' | 'awoo' | 'kiss' | 'lick' 
  | 'pat' | 'smug' | 'bonk' | 'yeet' | 'blush' | 'smile'
  | 'wave' | 'highfive' | 'handhold' | 'nom' | 'bite'
  | 'glomp' | 'slap' | 'kill' | 'kick' | 'happy' | 'wink'
  | 'poke' | 'dance' | 'cringe'

async function getWaifuPics(type: WaifuPicsType, category: WaifuPicsCategory) {
  const response = await fetch(
    `https://api.waifu.pics/${type}/${category}`
  )
  
  return response.json()
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "url": "https://cdn.waifu.pics/waifu/abc123.jpg"
}
\`\`\`

#### Get Multiple Images

\`\`\`typescript
async function getManyWaifuPics(
  type: WaifuPicsType, 
  category: WaifuPicsCategory,
  exclude: string[] = []
) {
  const response = await fetch(
    `https://api.waifu.pics/many/${type}/${category}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exclude }),
    }
  )
  
  return response.json()
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "files": [
    "https://cdn.waifu.pics/waifu/abc123.jpg",
    "https://cdn.waifu.pics/waifu/def456.jpg",
    "https://cdn.waifu.pics/waifu/ghi789.jpg"
  ]
}
\`\`\`

---

### 4. Nekos.best API

**Documentation:** https://docs.nekos.best/

#### Get Random Image

\`\`\`typescript
type NekosBestCategory =
  | 'neko' | 'kitsune' | 'husbando' | 'waifu'
  | 'hug' | 'pat' | 'kiss' | 'slap' | 'cuddle'
  | 'poke' | 'wave' | 'bite' | 'blush' | 'smile'
  | 'highfive' | 'handhold' | 'nom' | 'happy'
  | 'wink' | 'pout' | 'bored' | 'facepalm'
  | 'think' | 'shrug' | 'sleep' | 'thumbsup'

interface NekosBestParams {
  amount?: number  // 1-20
}

async function getNekosBest(
  category: NekosBestCategory,
  params?: NekosBestParams
) {
  const queryString = params?.amount 
    ? `?amount=${params.amount}` 
    : ''
  
  const response = await fetch(
    `https://nekos.best/api/v2/${category}${queryString}`
  )
  
  return response.json()
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "results": [
    {
      "artist_href": "https://twitter.com/...",
      "artist_name": "Artist Name",
      "source_url": "https://twitter.com/.../status/...",
      "url": "https://nekos.best/api/v2/neko/abc123.png",
      "anime_name": "Anime Title"
    }
  ]
}
\`\`\`

#### Search with Filters

\`\`\`typescript
async function searchNekosBest(category: NekosBestCategory, amount: number = 10) {
  const response = await fetch(
    `https://nekos.best/api/v2/${category}?amount=${Math.min(amount, 20)}`
  )
  
  const data = await response.json()
  return data.results
}
\`\`\`

---

## Error Handling

### Circuit Breaker Pattern

Waifu Downloader implements a circuit breaker to handle API failures gracefully:

\`\`\`typescript
import { CircuitBreaker } from '@/services/api-circuit-breaker'

const breaker = new CircuitBreaker({
  failureThreshold: 5,      // Open after 5 failures
  resetTimeout: 60000,      // Try again after 60 seconds
  monitoringPeriod: 120000, // Monitor over 2 minutes
})

async function safeApiCall(apiName: string, fetchFn: () => Promise<any>) {
  try {
    return await breaker.execute(apiName, fetchFn)
  } catch (error) {
    if (error.message.includes('Circuit breaker is OPEN')) {
      // Fallback to cached data or alternative API
      return getCachedData(apiName)
    }
    throw error
  }
}
\`\`\`

### Error Types

\`\`\`typescript
interface ApiError {
  code: string
  message: string
  statusCode: number
  apiSource: string
}

// Common error codes
const ERROR_CODES = {
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CIRCUIT_OPEN: 'CIRCUIT_OPEN',
} as const
\`\`\`

### Error Handling Example

\`\`\`typescript
async function handleApiRequest(source: string, url: string) {
  try {
    // Rate limiting
    await rateLimiter.execute(source, async () => {
      // Circuit breaker
      return await breaker.execute(source, async () => {
        // Actual API call with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        try {
          const response = await fetch(url, {
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          return response.json()
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      })
    })
  } catch (error: any) {
    // Handle specific errors
    if (error.name === 'AbortError') {
      throw {
        code: ERROR_CODES.TIMEOUT,
        message: 'Request timed out',
        statusCode: 408,
        apiSource: source,
      }
    }

    if (error.message.includes('Circuit breaker')) {
      throw {
        code: ERROR_CODES.CIRCUIT_OPEN,
        message: `${source} is temporarily unavailable`,
        statusCode: 503,
        apiSource: source,
      }
    }

    // Rethrow unknown errors
    throw error
  }
}
\`\`\`

---

## Code Examples

### Complete Integration Example

\`\`\`typescript
import { rateLimiter } from '@/utils/rateLimiter'
import { urlValidator } from '@/utils/urlValidator'
import { secureStorage } from '@/utils/secureStorage'

interface ImageResult {
  url: string
  thumbnail: string
  source: string
  tags: string[]
  resolution: string
}

class WaifuDownloaderAPI {
  private apiKeys: Map<string, string> = new Map()

  constructor() {
    this.loadApiKeys()
  }

  private async loadApiKeys() {
    const wallhavenKey = await secureStorage.getItem('wallhaven_api_key')
    const waifuImKey = await secureStorage.getItem('waifu_im_api_key')

    if (wallhavenKey) this.apiKeys.set('wallhaven', wallhavenKey)
    if (waifuImKey) this.apiKeys.set('waifu.im', waifuImKey)
  }

  async searchImages(query: string, source: string = 'wallhaven'): Promise<ImageResult[]> {
    // Rate limit the request
    return await rateLimiter.execute(source, async () => {
      let results: ImageResult[] = []

      switch (source) {
        case 'wallhaven':
          results = await this.searchWallhaven(query)
          break
        case 'waifu.im':
          results = await this.searchWaifuIm(query)
          break
        case 'waifu.pics':
          results = await this.searchWaifuPics(query)
          break
        case 'nekos.best':
          results = await this.searchNekosBest(query)
          break
      }

      // Validate all URLs
      return results.filter(result => {
        const validation = urlValidator.validateImageUrl(result.url)
        return validation.isValid
      })
    })
  }

  private async searchWallhaven(query: string): Promise<ImageResult[]> {
    const apiKey = this.apiKeys.get('wallhaven')
    if (!apiKey) throw new Error('Wallhaven API key not configured')

    const params = new URLSearchParams({
      apikey: apiKey,
      q: query,
      categories: '010', // Anime only
      purity: '100',     // SFW only
      sorting: 'relevance',
    })

    const response = await fetch(
      `https://wallhaven.cc/api/v1/search?${params.toString()}`
    )

    const data = await response.json()

    return data.data.map((item: any) => ({
      url: item.path,
      thumbnail: item.thumbs.large,
      source: item.url,
      tags: item.colors,
      resolution: item.resolution,
    }))
  }

  private async searchWaifuIm(query: string): Promise<ImageResult[]> {
    const params = new URLSearchParams({
      included_tags: query,
      is_nsfw: 'false',
    })

    const response = await fetch(
      `https://api.waifu.im/search?${params.toString()}`
    )

    const data = await response.json()

    return data.images.map((item: any) => ({
      url: item.url,
      thumbnail: item.preview_url,
      source: item.source || '',
      tags: item.tags.map((t: any) => t.name),
      resolution: `${item.width}x${item.height}`,
    }))
  }

  private async searchWaifuPics(category: string): Promise<ImageResult[]> {
    const response = await fetch(
      `https://api.waifu.pics/many/sfw/${category}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exclude: [] }),
      }
    )

    const data = await response.json()

    return data.files.map((url: string) => ({
      url,
      thumbnail: url,
      source: '',
      tags: [category],
      resolution: 'unknown',
    }))
  }

  private async searchNekosBest(category: string): Promise<ImageResult[]> {
    const response = await fetch(
      `https://nekos.best/api/v2/${category}?amount=10`
    )

    const data = await response.json()

    return data.results.map((item: any) => ({
      url: item.url,
      thumbnail: item.url,
      source: item.source_url || '',
      tags: [item.anime_name].filter(Boolean),
      resolution: 'unknown',
    }))
  }
}

// Export singleton
export const waifuAPI = new WaifuDownloaderAPI()
\`\`\`

### Usage in Component

\`\`\`typescript
'use client'

import { useState } from 'react'
import { waifuAPI } from '@/services/waifuApi'
import { toast } from 'sonner'

export function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return

    setLoading(true)
    try {
      const images = await waifuAPI.searchImages(query, 'wallhaven')
      setResults(images)
      toast.success(`Found ${images.length} images`)
    } catch (error: any) {
      toast.error(error.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for waifus..."
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {results.map((image, index) => (
          <img
            key={index}
            src={image.thumbnail || "/placeholder.svg"}
            alt={image.tags.join(', ')}
            className="w-full h-48 object-cover rounded-md"
          />
        ))}
      </div>
    </div>
  )
}
\`\`\`

---

## Troubleshooting

### Common Issues

#### 1. "Rate limit exceeded"

**Cause:** Too many requests in short time  
**Solution:**
\`\`\`typescript
// Check rate limit status
const status = rateLimiter.getStatus('wallhaven')
console.log(`Available tokens: ${status.available}`)

// Wait for token availability
await rateLimiter.execute('wallhaven', yourApiCall)
\`\`\`

#### 2. "Invalid API key"

**Cause:** API key not set or incorrect  
**Solution:**
\`\`\`typescript
// Set API key securely
import { secureStorage } from '@/utils/secureStorage'

await secureStorage.setItem('wallhaven_api_key', 'YOUR_KEY', true)
\`\`\`

#### 3. "CORS error"

**Cause:** Browser blocking cross-origin requests  
**Solution:** Use Next.js API routes as proxy:

\`\`\`typescript
// app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  const response = await fetch(targetUrl!)
  const data = await response.json()

  return Response.json(data)
}
\`\`\`

#### 4. "Circuit breaker open"

**Cause:** Too many consecutive failures  
**Solution:**
\`\`\`typescript
// Wait for circuit breaker to reset (60 seconds)
// Or manually reset it
breaker.reset('wallhaven')
\`\`\`

---

## Best Practices

### 1. Always Use Rate Limiting

\`\`\`typescript
// ✅ Good
await rateLimiter.execute('wallhaven', () => fetch(url))

// ❌ Bad
await fetch(url)
\`\`\`

### 2. Validate URLs Before Rendering

\`\`\`typescript
// ✅ Good
const validation = urlValidator.validateImageUrl(url)
if (validation.isValid) {
  return <img src={validation.sanitizedUrl || "/placeholder.svg"} />
}

// ❌ Bad
return <img src={url || "/placeholder.svg"} />
\`\`\`

### 3. Handle Errors Gracefully

\`\`\`typescript
// ✅ Good
try {
  const data = await waifuAPI.searchImages(query)
  setResults(data)
} catch (error) {
  toast.error('Search failed. Please try again.')
  setResults([])
}

// ❌ Bad
const data = await waifuAPI.searchImages(query)
setResults(data)
\`\`\`

### 4. Cache Results

\`\`\`typescript
// ✅ Good
import { imageCache } from '@/utils/imageCache'

const cachedData = await imageCache.get(cacheKey)
if (cachedData) return cachedData

const freshData = await waifuAPI.searchImages(query)
await imageCache.set(cacheKey, freshData, 3600)
\`\`\`

---

## API Response Types

\`\`\`typescript
// Unified response type
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: {
    page: number
    totalPages: number
    totalResults: number
  }
}

// Image metadata type
interface ImageMetadata {
  id: string
  url: string
  thumbnailUrl: string
  sourceUrl?: string
  artist?: {
    name: string
    profileUrl?: string
  }
  tags: string[]
  resolution: {
    width: number
    height: number
  }
  fileSize?: number
  uploadedAt?: string
  favorites?: number
  views?: number
  nsfw: boolean
}
\`\`\`

---

## Testing

### Unit Tests

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest'
import { waifuAPI } from '@/services/waifuApi'

describe('WaifuAPI', () => {
  it('should search images successfully', async () => {
    const results = await waifuAPI.searchImages('maid', 'wallhaven')
    expect(results).toBeInstanceOf(Array)
    expect(results.length).toBeGreaterThan(0)
  })

  it('should handle rate limiting', async () => {
    const promises = Array(30).fill(null).map(() =>
      waifuAPI.searchImages('test', 'wallhaven')
    )

    await expect(Promise.all(promises)).resolves.toBeDefined()
  })

  it('should validate URLs', async () => {
    const results = await waifuAPI.searchImages('test', 'wallhaven')
    results.forEach(result => {
      expect(result.url).toMatch(/^https?:\/\//)
    })
  })
})
\`\`\`

---

## Changelog

### v2.0.0 (2024-01-15)
- ✨ Added secure storage for API keys
- ✨ Implemented rate limiting with token bucket
- ✨ Added URL validation and sanitization
- 🔒 Enhanced security with circuit breaker
- 📚 Complete API documentation

### v1.0.0 (2023-12-01)
- 🎉 Initial release
- ✨ Support for 4 waifu APIs
- ✨ Basic search and download functionality

---

**Document Maintained By:** DuckyCoder AI Development Team  
**Support:** api-support@waifudownloader.com  
**Last Review:** 2024-01-15
