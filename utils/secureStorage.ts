/**
 * Secure Storage Utility
 * Provides encrypted storage for sensitive data like API keys
 * Uses browser fingerprinting for device-specific encryption
 */

interface StorageItem {
  value: string
  timestamp: number
  encrypted: boolean
}

class SecureStorage {
  private readonly storagePrefix = "waifu_secure_"
  private encryptionKey: string | null = null

  constructor() {
    this.initializeEncryptionKey()
  }

  /**
   * Generate a device-specific encryption key based on browser fingerprint
   */
  private async initializeEncryptionKey(): Promise<void> {
    try {
      // Create a device fingerprint from available browser data
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset(),
        screen.width + "x" + screen.height,
        screen.colorDepth,
      ].join("|")

      // Generate a consistent key from fingerprint
      const encoder = new TextEncoder()
      const data = encoder.encode(fingerprint)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      this.encryptionKey = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    } catch (error) {
      console.error("Failed to initialize encryption key:", error)
      // Fallback to a static key (less secure, but functional)
      this.encryptionKey = "fallback-encryption-key-" + Date.now().toString(36)
    }
  }

  /**
   * Simple XOR encryption (NOTE: Use AES-256-GCM in production)
   */
  private encrypt(text: string): string {
    if (!this.encryptionKey) {
      throw new Error("Encryption key not initialized")
    }

    const key = this.encryptionKey
    let result = ""

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }

    // Convert to base64 for safe storage
    return btoa(result)
  }

  /**
   * Simple XOR decryption
   */
  private decrypt(encryptedText: string): string {
    if (!this.encryptionKey) {
      throw new Error("Encryption key not initialized")
    }

    try {
      const text = atob(encryptedText)
      const key = this.encryptionKey
      let result = ""

      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode)
      }

      return result
    } catch (error) {
      console.error("Decryption failed:", error)
      return ""
    }
  }

  /**
   * Store a value securely
   */
  async setItem(key: string, value: string, encrypt = true): Promise<void> {
    try {
      // Ensure encryption key is ready
      if (!this.encryptionKey) {
        await this.initializeEncryptionKey()
      }

      const storageItem: StorageItem = {
        value: encrypt ? this.encrypt(value) : value,
        timestamp: Date.now(),
        encrypted: encrypt,
      }

      localStorage.setItem(this.storagePrefix + key, JSON.stringify(storageItem))
    } catch (error) {
      console.error(`Failed to store item ${key}:`, error)
      throw new Error("Storage operation failed")
    }
  }

  /**
   * Retrieve a value securely
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const stored = localStorage.getItem(this.storagePrefix + key)

      if (!stored) {
        return null
      }

      const storageItem: StorageItem = JSON.parse(stored)

      // Check if item is expired (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - storageItem.timestamp > maxAge) {
        this.removeItem(key)
        return null
      }

      return storageItem.encrypted ? this.decrypt(storageItem.value) : storageItem.value
    } catch (error) {
      console.error(`Failed to retrieve item ${key}:`, error)
      return null
    }
  }

  /**
   * Remove a stored item
   */
  removeItem(key: string): void {
    localStorage.removeItem(this.storagePrefix + key)
  }

  /**
   * Clear all secure storage items
   */
  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  /**
   * Check if an item exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(this.storagePrefix + key) !== null
  }
}

// Singleton instance
export const secureStorage = new SecureStorage()

// Export type for external use
export type { StorageItem }
