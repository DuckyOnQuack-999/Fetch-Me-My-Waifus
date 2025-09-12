interface CircuitBreakerOptions {
  failureThreshold: number
  resetTimeout: number
  monitoringPeriod: number
}

enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount = 0
  private lastFailureTime?: number
  private successCount = 0

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN
      } else {
        throw new Error("Circuit breaker is OPEN")
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++
      if (this.successCount >= 3) {
        this.state = CircuitState.CLOSED
        this.successCount = 0
      }
    }
  }

  private onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN
    }
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailureTime !== undefined && Date.now() - this.lastFailureTime >= this.options.resetTimeout
  }

  getState(): CircuitState {
    return this.state
  }
}

// API Service with circuit breakers
export class ApiService {
  private circuitBreakers = new Map<string, CircuitBreaker>()

  private getCircuitBreaker(apiName: string): CircuitBreaker {
    if (!this.circuitBreakers.has(apiName)) {
      this.circuitBreakers.set(
        apiName,
        new CircuitBreaker({
          failureThreshold: 3,
          resetTimeout: 30000, // 30 seconds
          monitoringPeriod: 60000, // 1 minute
        }),
      )
    }
    return this.circuitBreakers.get(apiName)!
  }

  async fetchWithCircuitBreaker<T>(apiName: string, operation: () => Promise<T>): Promise<T> {
    const circuitBreaker = this.getCircuitBreaker(apiName)
    return circuitBreaker.execute(operation)
  }

  getApiStatus(apiName: string): CircuitState {
    const circuitBreaker = this.circuitBreakers.get(apiName)
    return circuitBreaker?.getState() || CircuitState.CLOSED
  }
}

// Export the singleton instance and circuit breaker
export const apiService = new ApiService()
export const circuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000,
  monitoringPeriod: 60000,
})

// Export the enum for use in other files
export { CircuitState }
