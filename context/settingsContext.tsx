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
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = storage.getSettings()
        const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings }
        setSettings(mergedSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Update settings
  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)

    // Save to localStorage
    try {
      storage.saveSettings(newSettings)
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  // Reset to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    try {
      storage.saveSettings(DEFAULT_SETTINGS)
    } catch (error) {
      console.error("Failed to reset settings:", error)
    }
  }

  // Export settings as JSON string
  const exportSettings = (): string => {
    try {
      return JSON.stringify(settings, null, 2)
    } catch (error) {
      console.error("Failed to export settings:", error)
      return "{}"
    }
  }

  // Import settings from JSON string
  const importSettings = (settingsJson: string): boolean => {
    try {
      const importedSettings = JSON.parse(settingsJson)

      // Validate imported settings
      if (typeof importedSettings !== "object" || importedSettings === null) {
        return false
      }

      // Merge with defaults to ensure all required fields exist
      const validatedSettings = { ...DEFAULT_SETTINGS, ...importedSettings }

      setSettings(validatedSettings)
      storage.saveSettings(validatedSettings)

      return true
    } catch (error) {
      console.error("Failed to import settings:", error)
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
