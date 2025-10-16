/**
 * URL validation and sanitization utility
 * Prevents XSS attacks through malicious URLs
 */

const ALLOWED_PROTOCOLS = ["http:", "https:"]
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)

    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      console.warn("Invalid protocol:", parsed.protocol)
      return false
    }

    // Check file extension
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) => parsed.pathname.toLowerCase().endsWith(ext))

    if (!hasValidExtension && !parsed.pathname.includes("/placeholder.svg")) {
      console.warn("Invalid image extension:", parsed.pathname)
      return false
    }

    return true
  } catch (error) {
    console.error("Invalid URL:", error)
    return false
  }
}

export function sanitizeUrl(url: string): string {
  if (!isValidImageUrl(url)) {
    return "/placeholder.svg?height=400&width=300&text=Invalid+URL"
  }
  return url
}

export function isAllowedDomain(url: string, allowedDomains: string[]): boolean {
  try {
    const parsed = new URL(url)
    return allowedDomains.some((domain) => parsed.hostname.endsWith(domain))
  } catch (error) {
    return false
  }
}
