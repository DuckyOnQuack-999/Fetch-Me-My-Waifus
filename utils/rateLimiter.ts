/**
 * Token bucket rate limiter
 * Prevents API abuse and ensures compliance with rate limits
 */

interface RateLimiterConfig {
  maxTokens: number
  refillRate: number // tokens per second
  refillInterval: number // milliseconds
}

class TokenBucket {
  private tokens: number
  private lastRefill: number
  private config: RateLimiterConfig

  constructor(config: RateLimiterConfig) {
    this.config = config
    this.tokens = config.maxTokens
    this.lastRefill = Date.now()
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = now - this.lastRefill
    const tokensToAdd = (timePassed / this.config.refillInterval) * this.config.refillRate

    this.tokens = Math.min(this.config.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  tryConsume(tokens = 1): boolean {
    this.refill()

    if (this.tokens >= tokens) {
      this.tokens -= tokens
      return true
    }

    return false
  }

  getAvailableTokens(): number {
    this.refill()
    return Math.floor(this.tokens)
  }

  reset(): void {
    this.tokens = this.config.maxTokens
    this.lastRefill = Date.now()
  }
}

// Rate limiters for different API sources
const rateLimiters = new Map<string, TokenBucket>()

export function getRateLimiter(source: string): TokenBucket {
  if (!rateLimiters.has(source)) {
    // Default: 10 requests per second, refill 1 token per 100ms
    rateLimiters.set(
      source,
      new TokenBucket({
        maxTokens: 10,
        refillRate: 1,
        refillInterval: 100,
      }),
    )
  }
  return rateLimiters.get(source)!
}

export function canMakeRequest(source: string): boolean {
  return getRateLimiter(source).tryConsume()
}

export function getAvailableRequests(source: string): number {
  return getRateLimiter(source).getAvailableTokens()
}

export function resetRateLimiter(source: string): void {
  getRateLimiter(source).reset()
}
