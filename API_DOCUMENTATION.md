# Waifu Downloader API Documentation

## Overview

This document provides comprehensive documentation for all API integrations used in the Waifu Downloader application.

---

## Supported APIs

### 1. Waifu.im API

**Base URL**: `https://api.waifu.im`  
**Authentication**: Bearer token (optional)  
**Rate Limit**: 10 requests/second

#### Endpoints

##### GET `/search`
Search for anime images by tags and filters.

**Parameters**:
\`\`\`typescript
{
  included_tags: string      // Category filter
  is_nsfw: boolean           // NSFW content flag
  order_by: string           // Sort order (RANDOM, NEWEST, etc.)
  many: boolean              // Return multiple results
  page: number               // Page number
  limit?: number             // Results per page (max 30)
  width?: string             // Min width filter (>=1920)
  height?: string            // Min height filter (>=1080)
}
\`\`\`

**Response**:
\`\`\`typescript
{
  images: Array<{
    image_id: number
    url: string
    preview_url: string
    width: number
    height: number
    tags: Array<{
      name: string
      description?: string
      is_nsfw: boolean
    }>
    source?: string
    artist?: string
    uploaded_at: string
  }>
}
\`\`\`

**Example**:
\`\`\`typescript
const response = await fetch(
  'https://api.waifu.im/search?included_tags=waifu&is_nsfw=false&limit=10',
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
  }
)
\`\`\`

---

### 2. Waifu.pics API

**Base URL**: `https://api.waifu.pics`  
**Authentication**: None  
**Rate Limit**: 5 requests/second

#### Endpoints

##### POST `/many/{type}/{category}`
Get multiple random images.

**Parameters**:
- `type`: "sfw" | "nsfw"
- `category`: "waifu" | "neko" | "shinobu" | etc.

**Request Body**:
\`\`\`json
{
  "exclude": []  // Optional: image IDs to exclude
}
\`\`\`

**Response**:
\`\`\`typescript
{
  files: string[]  // Array of image URLs
}
\`\`\`

**Example**:
\`\`\`typescript
const response = await fetch(
  'https://api.waifu.pics/many/sfw/waifu',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  }
)
\`\`\`

---

### 3. Nekos.best API

**Base URL**: `https://nekos.best/api/v2`  
**Authentication**: None  
**Rate Limit**: 3 requests/second

#### Endpoints

##### GET `/{category}`
Get random images from a category.

**Parameters**:
- `amount`: number (1-20, default 1)

**Response**:
\`\`\`typescript
{
  results: Array<{
    artist_href: string
    artist_name: string
    source_url: string
    url: string
  }>
}
\`\`\`

**Example**:
\`\`\`typescript
const response = await fetch(
  'https://nekos.best/api/v2/neko?amount=10'
)
\`\`\`

---

### 4. Wallhaven API

**Base URL**: `https://wallhaven.cc/api/v1`  
**Authentication**: API key (required for NSFW)  
**Rate Limit**: 45 requests/minute

#### Endpoints

##### GET `/search`
Search for wallpapers with advanced filters.

**Parameters**:
\`\`\`typescript
{
  q: string                // Search query
  categories: string       // "111" = all categories
  purity: string          // "100" = SFW, "011" = NSFW
  sorting: string         // "random", "date_added", "favorites"
  order: string           // "desc", "asc"
  page: number            // Page number
  apikey: string          // Your API key
  atleast?: string        // Min resolution (e.g., "1920x1080")
  ratios?: string         // Aspect ratios
  colors?: string         // Dominant color filter
}
\`\`\`

**Response**:
\`\`\`typescript
{
  data: Array<{
    id: string
    url: string
    path: string
    dimension_x: number
    dimension_y: number
    resolution: string
    file_size: number
    file_type: string
    created_at: string
    colors: string[]
    favorites: number
    views: number
    tags: Array<{
      id: number
      name: string
      category: string
      purity: string
    }>
    thumbs: {
      large: string
      original: string
      small: string
    }
  }>
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
\`\`\`

**Example**:
\`\`\`typescript
const response = await fetch(
  'https://wallhaven.cc/api/v1/search?q=anime&categories=010&purity=100&apikey=YOUR_KEY'
)
\`\`\`

---

### 5. FemboyFinder API

**Base URL**: `https://femboyfinder.firestreaker2.gq`  
**Authentication**: None  
**Rate Limit**: 2 requests/second

#### Endpoints

##### GET `/api/{category}`
Get a random femboy image.

**Response**:
\`\`\`typescript
{
  error: boolean
  query: string
  url: string
  tags: string
  source: string
}
\`\`\`

**Example**:
\`\`\`typescript
const response = await fetch(
  'https://femboyfinder.firestreaker2.gq/api/astolfo'
)
\`\`\`

---

## Rate Limiting Implementation

All API calls are rate-limited using a token bucket algorithm:

\`\`\`typescript
import { canMakeRequest, getAvailableRequests } from '@/utils/rateLimiter'

// Check before making request
if (!canMakeRequest('wallhaven')) {
  const available = getAvailableRequests('wallhaven')
  throw new Error(`Rate limit exceeded. Try again in ${10 - available} seconds`)
}

// Make request
const response = await fetch(url)
\`\`\`

---

## Error Handling

All API calls implement retry logic with exponential backoff:

\`\`\`typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
}
\`\`\`

---

## Security Best Practices

### 1. API Key Storage
\`\`\`typescript
import { SecureStorage } from '@/utils/secureStorage'

// Store
SecureStorage.setItem('wallhavenApiKey', key)

// Retrieve
const key = SecureStorage.getItem('wallhavenApiKey')
\`\`\`

### 2. URL Validation
\`\`\`typescript
import { sanitizeUrl } from '@/utils/urlValidator'

const safeUrl = sanitizeUrl(image.url)
\`\`\`

### 3. CORS Configuration
\`\`\`typescript
const response = await fetch(url, {
  mode: 'cors',
  credentials: 'same-origin',
  headers: {
    'Origin': window.location.origin
  }
})
\`\`\`

---

## Testing

### Unit Tests
\`\`\`bash
npm run test:api
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

### API Health Check
\`\`\`typescript
async function checkApiHealth(source: ApiSource): Promise<boolean> {
  try {
    const response = await fetch(getHealthEndpoint(source))
    return response.ok
  } catch {
    return false
  }
}
\`\`\`

---

## Troubleshooting

### Issue: "Rate limit exceeded"
**Solution**: Reduce concurrent requests or increase delay between calls

### Issue: "API key invalid"
**Solution**: Verify API key in settings, regenerate if necessary

### Issue: "CORS error"
**Solution**: Check if API supports CORS, use proxy if needed

### Issue: "Images not loading"
**Solution**: Verify URL validation is not blocking legitimate images

---

## API Limits Summary

| API | Rate Limit | Max Results | Auth Required |
|-----|-----------|-------------|---------------|
| Waifu.im | 10/s | 30 | Optional |
| Waifu.pics | 5/s | 30 | No |
| Nekos.best | 3/s | 20 | No |
| Wallhaven | 45/min | 100 | For NSFW |
| FemboyFinder | 2/s | 1 | No |

---

## Support

For API issues:
- Check [Status Page](https://status.waifudownloader.com)
- Report bugs: [GitHub Issues](https://github.com/waifudownloader/issues)
- Community: [Discord](https://discord.gg/waifudownloader)

---

**Documentation Version**: 2.0  
**Last Updated**: 2024-01-15
