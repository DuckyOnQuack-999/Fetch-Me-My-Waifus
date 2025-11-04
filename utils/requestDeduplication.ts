type PendingRequest<T> = {
  promise: Promise<T>
  timestamp: number
}

class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest<any>>()
  private readonly cacheDuration = 5000 // 5 seconds

  /**
   * Deduplicate requests by key. If a request with the same key is already pending,
   * return the existing promise instead of making a new request.
   */
  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const pending = this.pendingRequests.get(key)

    // Return existing request if it's still fresh
    if (pending && now - pending.timestamp < this.cacheDuration) {
      return pending.promise
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up after request completes
      setTimeout(() => {
        this.pendingRequests.delete(key)
      }, this.cacheDuration)
    })

    this.pendingRequests.set(key, {
      promise,
      timestamp: now,
    })

    return promise
  }

  /**
   * Clear a specific request from the cache
   */
  clear(key: string): void {
    this.pendingRequests.delete(key)
  }

  /**
   * Clear all pending requests
   */
  clearAll(): void {
    this.pendingRequests.clear()
  }

  /**
   * Get the number of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size
  }
}

export const requestDeduplicator = new RequestDeduplicator()

/**
 * Create a deduplication key from parameters
 */
export function createRequestKey(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join("&")

  return `${endpoint}?${sortedParams}`
}
