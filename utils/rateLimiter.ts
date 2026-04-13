/**
 * Rate Limiter Utility
 * Implements token bucket algorithm for API rate limiting
 * Prevents quota exhaustion and ensures fair API usage
 */

interface RateLimitConfig {
  maxTokens: number
  refillRate: number // tokens per second
  refillInterval: number // milliseconds
}

interface RateLimitState {
  tokens: number
  lastRefill: number
  queue: Array<() => void>
}

class RateLimiter {
  private limits: Map<string, RateLimitState> = new Map()
  private configs: Map<string, RateLimitConfig> = new Map()

  // Default configurations for different API sources
  private readonly defaultConfigs: Record<string, RateLimitConfig> = {
    wallhaven: {
      maxTokens: 20,
      refillRate: 1,
      refillInterval: 1000, // 1 token per second
    },
    "waifu.im": {
      maxTokens: 30,
      refillRate: 2,
      refillInterval: 1000, // 2 tokens per second
    },
    "waifu.pics": {
      maxTokens: 50,
      refillRate: 5,
      refillInterval: 1000, // 5 tokens per second
    },
    "nekos.best": {
      maxTokens: 40,
      refillRate: 3,
      refillInterval: 1000, // 3 tokens per second
    },
    default: {
      maxTokens: 10,
      refillRate: 1,
      refillInterval: 1000, // Conservative default
    },
  }

  constructor() {
    // Initialize default configurations
    Object.entries(this.defaultConfigs).forEach(([source, config]) => {
      this.configs.set(source, config)
    })

    // Start refill interval for all sources
    setInterval(() => this.refillTokens(), 1000)
  }

  /**
   * Get or create rate limit state for a source
   */
  private getState(source: string): RateLimitState {
    if (!this.limits.has(source)) {
      const config = this.configs.get(source) || this.defaultConfigs["default"]
      this.limits.set(source, {
        tokens: config.maxTokens,
        lastRefill: Date.now(),
        queue: [],
      })
    }
    return this.limits.get(source)!
  }

  /**
   * Get configuration for a source
   */
  private getConfig(source: string): RateLimitConfig {
    return this.configs.get(source) || this.defaultConfigs["default"]
  }

  /**
   * Refill tokens for all sources based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now()

    this.limits.forEach((state, source) => {
      const config = this.getConfig(source)
      const elapsed = now - state.lastRefill
      const tokensToAdd = Math.floor(elapsed / config.refillInterval) * config.refillRate

      if (tokensToAdd > 0) {
        state.tokens = Math.min(config.maxTokens, state.tokens + tokensToAdd)
        state.lastRefill = now

        // Process queued requests if tokens are available
        this.processQueue(source)
      }
    })
  }

  /**
   * Process queued requests for a source
   */
  private processQueue(source: string): void {
    const state = this.getState(source)

    while (state.queue.length > 0 && state.tokens > 0) {
      const callback = state.queue.shift()
      state.tokens--
      callback?.()
    }
  }

  /**
   * Attempt to acquire a token for an API call
   */
  async acquire(source: string): Promise<void> {
    const state = this.getState(source)

    // If tokens are available, consume one immediately
    if (state.tokens > 0) {
      state.tokens--
      return Promise.resolve()
    }

    // Otherwise, queue the request
    return new Promise<void>((resolve) => {
      state.queue.push(resolve)
    })
  }

  /**
   * Try to acquire a token without waiting (returns false if unavailable)
   */
  tryAcquire(source: string): boolean {
    const state = this.getState(source)

    if (state.tokens > 0) {
      state.tokens--
      return true
    }

    return false
  }

  /**
   * Get current rate limit status for a source
   */
  getStatus(source: string): {
    available: number
    max: number
    queueLength: number
    refillRate: number
  } {
    const state = this.getState(source)
    const config = this.getConfig(source)

    return {
      available: state.tokens,
      max: config.maxTokens,
      queueLength: state.queue.length,
      refillRate: config.refillRate,
    }
  }

  /**
   * Update configuration for a specific source
   */
  setConfig(source: string, config: Partial<RateLimitConfig>): void {
    const currentConfig = this.getConfig(source)
    this.configs.set(source, { ...currentConfig, ...config })
  }

  /**
   * Reset rate limit for a source
   */
  reset(source: string): void {
    const config = this.getConfig(source)
    this.limits.set(source, {
      tokens: config.maxTokens,
      lastRefill: Date.now(),
      queue: [],
    })
  }

  /**
   * Clear all queued requests for a source
   */
  clearQueue(source: string): void {
    const state = this.getState(source)
    state.queue = []
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(source: string, fn: () => Promise<T>, options: { timeout?: number } = {}): Promise<T> {
    const { timeout = 30000 } = options

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Rate limit timeout")), timeout)
    })

    // Wait for token or timeout
    await Promise.race([this.acquire(source), timeoutPromise])

    // Execute function
    return fn()
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Export types for external use
export type { RateLimitConfig, RateLimitState }
