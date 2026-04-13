/**
 * URL Validator Utility
 * Prevents XSS attacks through malicious URLs
 * Validates image URLs from external APIs
 */

interface ValidationResult {
  isValid: boolean
  reason?: string
  sanitizedUrl?: string
}

class URLValidator {
  private readonly allowedProtocols = ["http:", "https:"]
  private readonly allowedImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"]
  private readonly blockedPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /file:/i,
    /<script/i,
    /on\w+=/i, // Block event handlers like onclick=
  ]

  /**
   * Validate a URL for security and format
   */
  validate(url: string): ValidationResult {
    if (!url || typeof url !== "string") {
      return {
        isValid: false,
        reason: "URL is empty or not a string",
      }
    }

    // Check for blocked patterns
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(url)) {
        return {
          isValid: false,
          reason: `URL contains blocked pattern: ${pattern}`,
        }
      }
    }

    try {
      const parsed = new URL(url)

      // Validate protocol
      if (!this.allowedProtocols.includes(parsed.protocol)) {
        return {
          isValid: false,
          reason: `Protocol ${parsed.protocol} is not allowed`,
        }
      }

      // Check for suspicious localhost or private IP access
      if (this.isPrivateIP(parsed.hostname)) {
        return {
          isValid: false,
          reason: "Access to private IPs is not allowed",
        }
      }

      return {
        isValid: true,
        sanitizedUrl: parsed.href,
      }
    } catch (error) {
      return {
        isValid: false,
        reason: "Invalid URL format",
      }
    }
  }

  /**
   * Validate specifically for image URLs
   */
  validateImageUrl(url: string): ValidationResult {
    const baseValidation = this.validate(url)

    if (!baseValidation.isValid) {
      return baseValidation
    }

    try {
      const parsed = new URL(url)
      const pathname = parsed.pathname.toLowerCase()

      // Check if URL has a valid image extension
      const hasValidExtension = this.allowedImageExtensions.some((ext) => pathname.endsWith(ext))

      // Also check if it's an API endpoint that returns images (without extension)
      const isApiEndpoint = pathname.includes("/api/") || pathname.includes("/cdn/") || pathname.includes("/images/")

      if (!hasValidExtension && !isApiEndpoint) {
        return {
          isValid: false,
          reason: "URL does not appear to be an image",
        }
      }

      return {
        isValid: true,
        sanitizedUrl: parsed.href,
      }
    } catch (error) {
      return {
        isValid: false,
        reason: "Failed to parse image URL",
      }
    }
  }

  /**
   * Check if hostname is a private IP
   */
  private isPrivateIP(hostname: string): boolean {
    // Check for localhost
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return true
    }

    // Check for private IPv4 ranges
    const privateIPv4Patterns = [/^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./]

    return privateIPv4Patterns.some((pattern) => pattern.test(hostname))
  }

  /**
   * Sanitize a URL by removing potentially dangerous components
   */
  sanitize(url: string): string {
    try {
      const parsed = new URL(url)

      // Remove hash and search params that might contain XSS
      parsed.hash = ""

      // Remove potentially dangerous search params
      const dangerousParams = ["callback", "jsonp", "redirect", "return"]
      dangerousParams.forEach((param) => parsed.searchParams.delete(param))

      return parsed.href
    } catch (error) {
      // If parsing fails, return empty string (invalid URL)
      return ""
    }
  }

  /**
   * Validate multiple URLs at once
   */
  validateBatch(urls: string[]): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>()

    urls.forEach((url) => {
      results.set(url, this.validate(url))
    })

    return results
  }
}

// Singleton instance
export const urlValidator = new URLValidator()

// Export type for external use
export type { ValidationResult }
