"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Settings } from "@/types/waifu"
import { storage } from "@/utils/localStorage"

// Default settings with comprehensive configuration
const DEFAULT_SETTINGS: Settings = {
  // API Configuration
  concurrentDownloads: 3,
  retryAttempts: 3,
  autoStartDownloads: true,
  defaultSortOption: "RANDOM",
  apiSource: "all",
  waifuImApiKey: "",
  waifuPicsApiKey: "",
  nekosBestApiKey: "",
  wallhavenApiKey: process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY || "",
  femboyFinderApiKey: "",
  requestTimeout: 30000,
  rateLimitDelay: 1000,

  // Image Quality & Resolution
  minWidth: 800,
  minHeight: 600,
  maxWidth: 4096,
  maxHeight: 4096,
  useCustomResolution: false,
  selectedPreset: "Full HD (1080p)",
  minFileSize: 50, // KB
  maxFileSize: 10, // MB
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  preferredFormat: "original",
  compressionLevel: "none",

  // Download Behavior
  imagesPerPage: 30,
  enableNsfw: false,
  skipDuplicates: true,
  createSubfolders: true,
  organizeByDate: false,
  organizeBySource: true,
  organizeByCategory: true,
  downloadLocation: "./downloads",
  tempDownloadLocation: "./temp",
  maxConcurrentDownloads: 5,
  defaultCategory: "waifu",
  autoDownload: false,

  // File Management
  fileNamingPattern: "original",
  customNamingTemplate: "{source}_{id}_{timestamp}.{ext}",
  preserveOriginalNames: true,
  addMetadataToFilename: false,
  createThumbnails: true,
  thumbnailSize: 200,

  // UI & Appearance
  themeMode: "system",
  language: "en",
  showPreviewImages: true,
  previewImageSize: "medium",
  gridColumns: 4,
  showImageDetails: true,
  showDownloadProgress: true,
  compactMode: false,

  // Notifications & Sounds
  enableNotifications: true,
  notifyOnDownloadComplete: true,
  notifyOnError: true,
  notifyOnNewImages: false,
  notificationSound: "default",
  customSoundPath: "",
  showSystemTrayIcon: false,
  minimizeToTray: false,

  // Performance & Caching
  enableImageCache: true,
  maxCacheSize: 500, // MB
  cacheExpiryDays: 7,
  preloadImages: true,
  enableLazyLoading: true,
  maxMemoryUsage: 2048, // MB
  enableHardwareAcceleration: true,

  // Privacy & Security
  enableAnalytics: false,
  shareUsageData: false,
  enableContentFiltering: true,
  blockedTags: ["gore", "violence", "explicit"],
  allowedDomains: [],
  enableProxySupport: false,
  proxyUrl: "",
  proxyUsername: "",
  proxyPassword: "",

  // Backup & Sync
  enableAutoBackup: false,
  backupFrequency: "weekly",
  backupLocation: "./backups",
  maxBackupFiles: 10,
  enableCloudSync: false,
  cloudSyncProvider: "none",

  // Advanced Features
  enableBatchDownload: true,
  enableScheduledDownloads: false,
  scheduledDownloadTime: "02:00",
  enableAutoUpdate: true,
  checkForUpdatesOnStartup: true,
  enableDebugMode: false,
  logLevel: "info",
  maxLogFileSize: 10, // MB

  // Experimental Features
  enableExperimentalFeatures: false,
  enableAITagging: false,
  enableImageUpscaling: false,
  upscalingFactor: 2,
  enableDuplicateDetection: true,
  duplicateThreshold: 0.95,
}

interface SettingsContextType {
  settings: Settings
  isLoading: boolean
  error: string | null
  saveSettings: (newSettings: Partial<Settings>) => boolean
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => boolean
  resetSettings: () => boolean
  exportSettings: () => boolean
  importSettings: (file: File) => Promise<boolean>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = storage.getSettings()
        const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings }
        setSettings(mergedSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
        setError("Failed to load settings")
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: Partial<Settings>): boolean => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)
      storage.saveSettings(updatedSettings)
      return true
    } catch (error) {
      console.error("Failed to save settings:", error)
      setError("Failed to save settings")
      return false
    }
  }

  // Update a specific setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]): boolean => {
    try {
      const updatedSettings = { ...settings, [key]: value }
      setSettings(updatedSettings)
      storage.saveSettings(updatedSettings)
      return true
    } catch (error) {
      console.error("Failed to update setting:", error)
      setError("Failed to update setting")
      return false
    }
  }

  // Reset to defaults
  const resetSettings = (): boolean => {
    try {
      setSettings(DEFAULT_SETTINGS)
      storage.saveSettings(DEFAULT_SETTINGS)
      return true
    } catch (error) {
      console.error("Failed to reset settings:", error)
      setError("Failed to reset settings")
      return false
    }
  }

  // Export settings as JSON string
  const exportSettings = (): boolean => {
    try {
      const settingsJson = JSON.stringify(settings, null, 2)
      const blob = new Blob([settingsJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "settings.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error("Failed to export settings:", error)
      setError("Failed to export settings")
      return false
    }
  }

  // Import settings from JSON file
  const importSettings = async (file: File): Promise<boolean> => {
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const settingsJson = e.target?.result as string
        const importedSettings = JSON.parse(settingsJson)

        // Validate imported settings
        if (typeof importedSettings !== "object" || importedSettings === null) {
          setError("Invalid settings format")
          return false
        }

        // Merge with defaults to ensure all required fields exist
        const validatedSettings = { ...DEFAULT_SETTINGS, ...importedSettings }

        setSettings(validatedSettings)
        storage.saveSettings(validatedSettings)
      }
      reader.readAsText(file)
      return true
    } catch (error) {
      console.error("Failed to import settings:", error)
      setError("Failed to import settings")
      return false
    }
  }

  const contextValue: SettingsContextType = {
    settings,
    isLoading,
    error,
    saveSettings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  }

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider")
  }
  return context
}

// Export for backward compatibility
export { useSettingsContext as useSettings }
