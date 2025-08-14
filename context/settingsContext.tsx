"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Settings } from "@/types/waifu"
import { storage } from "@/utils/localStorage"

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
  isLoading: boolean
  error: string | null
}

const defaultSettings: Settings = {
  // API Configuration
  concurrentDownloads: 3,
  retryAttempts: 3,
  autoStartDownloads: false,
  defaultSortOption: "RANDOM",
  apiSource: "waifu.im",
  waifuImApiKey: "",
  waifuPicsApiKey: "",
  nekosBestApiKey: "",
  wallhavenApiKey: process.env.WALLHAVEN_API_KEY || "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk",
  femboyFinderApiKey: "",
  requestTimeout: 30000,
  rateLimitDelay: 1000,

  // Image Quality & Resolution
  minWidth: 800,
  minHeight: 600,
  maxWidth: 7680,
  maxHeight: 4320,
  useCustomResolution: false,
  selectedPreset: "HD (720p)",
  minFileSize: 50,
  maxFileSize: 50000,
  allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
  preferredFormat: "original",
  compressionLevel: "medium",

  // Download Behavior
  imagesPerPage: 30,
  enableNsfw: false,
  skipDuplicates: true,
  createSubfolders: true,
  organizeByDate: false,
  organizeBySource: true,
  organizeByCategory: false,
  downloadLocation: "./downloads",
  tempDownloadLocation: "./temp",
  maxConcurrentDownloads: 3,
  defaultCategory: "waifu",
  autoDownload: false,

  // File Management
  fileNamingPattern: "original",
  customNamingTemplate: "{source}_{id}_{timestamp}",
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
  theme: "system",

  // Notifications & Sounds
  enableNotifications: true,
  notifyOnDownloadComplete: true,
  notifyOnError: true,
  notifyOnNewImages: false,
  notificationSound: "default",
  customSoundPath: "",
  showSystemTrayIcon: true,
  minimizeToTray: false,

  // Performance & Caching
  enableImageCache: true,
  maxCacheSize: 1024,
  cacheExpiryDays: 30,
  preloadImages: true,
  enableLazyLoading: true,
  maxMemoryUsage: 2048,
  enableHardwareAcceleration: true,

  // Privacy & Security
  enableAnalytics: false,
  shareUsageData: false,
  enableContentFiltering: false,
  blockedTags: [],
  allowedDomains: [],
  enableProxySupport: false,
  proxyUrl: "",
  proxyUsername: "",
  proxyPassword: "",

  // Backup & Sync
  enableAutoBackup: false,
  backupFrequency: "weekly",
  backupLocation: "./backups",
  maxBackupFiles: 5,
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
  maxLogFileSize: 10,

  // Experimental Features
  enableExperimentalFeatures: false,
  enableAITagging: false,
  enableImageUpscaling: false,
  upscalingFactor: 2,
  enableDuplicateDetection: true,
  duplicateThreshold: 0.95,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to migrate from old version first
        storage.migrateFromOldVersion()

        // Load current settings
        const savedSettings = storage.getSettings()

        if (savedSettings && Object.keys(savedSettings).length > 0) {
          const mergedSettings = { ...defaultSettings, ...savedSettings }
          setSettings(mergedSettings)
        } else {
          // First time setup - save defaults
          storage.saveSettings(defaultSettings)
          setSettings(defaultSettings)
        }
      } catch (err) {
        console.error("Failed to load settings:", err)
        setError(err instanceof Error ? err.message : "Failed to load settings")
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSettings = (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)

      if (!storage.saveSettings(updatedSettings)) {
        throw new Error("Failed to save settings to localStorage")
      }

      setError(null)
    } catch (err) {
      console.error("Failed to update settings:", err)
      setError(err instanceof Error ? err.message : "Failed to update settings")
    }
  }

  const resetSettings = () => {
    try {
      setSettings(defaultSettings)

      if (!storage.saveSettings(defaultSettings)) {
        throw new Error("Failed to reset settings in localStorage")
      }

      setError(null)
    } catch (err) {
      console.error("Failed to reset settings:", err)
      setError(err instanceof Error ? err.message : "Failed to reset settings")
    }
  }

  const exportSettings = (): string => {
    try {
      return JSON.stringify(settings, null, 2)
    } catch (err) {
      console.error("Failed to export settings:", err)
      return "{}"
    }
  }

  const importSettings = (settingsJson: string): boolean => {
    try {
      const importedSettings = JSON.parse(settingsJson)

      if (typeof importedSettings !== "object" || importedSettings === null) {
        throw new Error("Invalid settings format")
      }

      // Validate and merge with defaults
      const validatedSettings = { ...defaultSettings, ...importedSettings }

      setSettings(validatedSettings)

      if (!storage.saveSettings(validatedSettings)) {
        throw new Error("Failed to save imported settings")
      }

      setError(null)
      return true
    } catch (err) {
      console.error("Failed to import settings:", err)
      setError(err instanceof Error ? err.message : "Failed to import settings")
      return false
    }
  }

  const contextValue: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    isLoading,
    error,
  }

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
