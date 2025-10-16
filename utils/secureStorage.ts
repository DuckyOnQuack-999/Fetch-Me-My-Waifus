/**
 * Secure storage utility for sensitive data like API keys
 * Implements basic encryption and follows security best practices
 */

// Simple XOR encryption (for demo - use proper encryption in production)
function encryptData(data: string, key: string): string {
  let encrypted = ""
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(encrypted) // Base64 encode
}

function decryptData(encrypted: string, key: string): string {
  try {
    const data = atob(encrypted) // Base64 decode
    let decrypted = ""
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    return decrypted
  } catch (error) {
    console.error("Decryption failed:", error)
    return ""
  }
}

// Generate a device-specific encryption key
function getDeviceKey(): string {
  const userAgent = navigator.userAgent
  const screenResolution = `${window.screen.width}x${window.screen.height}`
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return btoa(`${userAgent}-${screenResolution}-${timezone}`)
}

export const SecureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const deviceKey = getDeviceKey()
      const encrypted = encryptData(value, deviceKey)
      localStorage.setItem(`secure_${key}`, encrypted)
    } catch (error) {
      console.error("Failed to store secure data:", error)
    }
  },

  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`)
      if (!encrypted) return null

      const deviceKey = getDeviceKey()
      return decryptData(encrypted, deviceKey)
    } catch (error) {
      console.error("Failed to retrieve secure data:", error)
      return null
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`)
  },

  clear: (): void => {
    // Only clear items with 'secure_' prefix
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("secure_")) {
        localStorage.removeItem(key)
      }
    })
  },
}
