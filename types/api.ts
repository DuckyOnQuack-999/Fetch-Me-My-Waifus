export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  timestamp: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ApiEndpoint {
  name: string
  url: string
  status: "online" | "degraded" | "offline"
  lastChecked: Date
  responseTime?: number
}

export interface CircuitBreakerState {
  state: "CLOSED" | "OPEN" | "HALF_OPEN"
  failureCount: number
  lastFailureTime?: number
}
