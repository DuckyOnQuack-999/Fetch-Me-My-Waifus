export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, 0, endpoint)
    this.name = "NetworkError"
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string, endpoint?: string) {
    super(message, 408, endpoint)
    this.name = "TimeoutError"
  }
}

export class RateLimitError extends ApiError {
  constructor(
    message: string,
    endpoint?: string,
    public retryAfter?: number,
  ) {
    super(message, 429, endpoint)
    this.name = "RateLimitError"
  }
}

/**
 * Parse and categorize API errors
 */
export function parseApiError(error: unknown, endpoint?: string): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new NetworkError(error.message, endpoint)
    }

    // Timeout errors
    if (error.message.includes("timeout") || error.message.includes("aborted")) {
      return new TimeoutError("Request timeout", endpoint)
    }

    return new ApiError(error.message, undefined, endpoint, error)
  }

  return new ApiError("Unknown error occurred", undefined, endpoint)
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: ApiError): string {
  if (error instanceof NetworkError) {
    return "Network connection failed. Please check your internet connection."
  }

  if (error instanceof TimeoutError) {
    return "Request timed out. Please try again."
  }

  if (error instanceof RateLimitError) {
    const retryMessage = error.retryAfter
      ? ` Please try again in ${error.retryAfter} seconds.`
      : " Please try again later."
    return `Rate limit exceeded.${retryMessage}`
  }

  switch (error.statusCode) {
    case 400:
      return "Invalid request. Please check your input."
    case 401:
      return "Authentication required. Please check your API key."
    case 403:
      return "Access denied. Please check your permissions."
    case 404:
      return "Resource not found."
    case 500:
      return "Server error. Please try again later."
    case 503:
      return "Service temporarily unavailable. Please try again later."
    default:
      return error.message || "An unexpected error occurred."
  }
}

/**
 * Log error with context
 */
export function logApiError(error: ApiError, context?: Record<string, any>): void {
  const errorLog = {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    endpoint: error.endpoint,
    timestamp: new Date().toISOString(),
    ...context,
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", errorLog)
    if (error.originalError) {
      console.error("[Original Error]", error.originalError)
    }
  }

  // In production, send to error monitoring service
  // Example: Sentry.captureException(error, { extra: errorLog })
}
