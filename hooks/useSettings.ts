"use client"

import { useState, useEffect, useCallback } from "react"
import type { Settings } from "@/types/waifu"
import { storage } from "@/lib/utils"

const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  downloadPath: "/downloads",
  maxConcurrentDownloads: 3,
  autoUpscale: false,
  imageQuality: "high",
  enableNotifications: true,
  autoTagging: true,
  duplicateDetection: true,
  apiKeys: {},
  filters: {
    minWidth: 800,
    minHeight: 600,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
    blockedTags: [],
  },
  ui: {
    gridSize: "medium",
    showMetadata: true,
    enableAnimations: true,
    compactMode: false,
  },
  privacy: {
    analytics: false,
    crashReporting: true,
    usageStats: false,
  },
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = storage.get("settings", DEFAULT_SETTINGS)
      setSettings({ ...DEFAULT_SETTINGS, ...savedSettings })
    } catch (err) {
      console.error("Failed to load settings:", err)
      setError("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      try {
        const updatedSettings = {
          ...settings,
          ...newSettings,
          lastUpdated: new Date().toISOString(),
        }

        setSettings(updatedSettings)
        storage.set("settings", updatedSettings)
        setError(null)

        return true
      } catch (err) {
        console.error("Failed to save settings:", err)
        setError("Failed to save settings")
        return false
      }
    },
    [settings],
  )

  // Update specific setting
  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      return saveSettings({ [key]: value })
    },
    [saveSettings],
  )

  // Reset settings to default
  const resetSettings = useCallback(() => {
    return saveSettings(DEFAULT_SETTINGS)
  }, [saveSettings])

  // Export settings
  const exportSettings = useCallback(() => {
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `waifu-downloader-settings-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      return true
    } catch (err) {
      console.error("Failed to export settings:", err)
      setError("Failed to export settings")
      return false
    }
  }, [settings])

  // Import settings
  const importSettings = useCallback(
    (file: File) => {
      return new Promise<boolean>((resolve) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target?.result as string)
            const success = saveSettings(importedSettings)
            resolve(success)
          } catch (err) {
            console.error("Failed to import settings:", err)
            setError("Failed to import settings - invalid file format")
            resolve(false)
          }
        }

        reader.onerror = () => {
          setError("Failed to read settings file")
          resolve(false)
        }

        reader.readAsText(file)
      })
    },
    [saveSettings],
  )

  return {
    settings,
    isLoading,
    error,
    saveSettings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  }
}
