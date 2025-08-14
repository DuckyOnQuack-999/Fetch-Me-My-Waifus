"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Settings } from "@/types/waifu"
import { storage } from "@/utils/localStorage"

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
}

const defaultSettings: Settings = {
  // API Settings
  concurrentDownloads: 3,
  retryAttempts: 3,
  autoStartDownloads: false,
  defaultSortOption: "RANDOM",
  apiSource: "all",
  waifuImApiKey: "",
  waifuPicsApiKey: "",
  nekosBestApiKey: "",
  wallhavenApiKey: process.env.WALLHAVEN_API_KEY || "",
  requestTimeout: 30000,
  rateLimitDelay: 1000,

  // Image Quality & Resolution
  minWidth: 1280,
  minHeight: 720,
  maxWidth: 7680,
  maxHeight: 4320,
  useCustomResolution: false,
  selectedPreset: "HD (720p)",
  minFileSize: 50,
  maxFileSize: 50,
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
  downloadLocation: "/downloads",
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

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    try {
      const savedSettings = storage.getSettings()
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...savedSettings })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      setSettings(defaultSettings)
    }
  }, [])

  const updateSettings = (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)
      storage.saveSettings(updatedSettings)
    } catch (error) {
      console.error("Error updating settings:", error)
    }
  }

  const resetSettings = () => {
    try {
      setSettings(defaultSettings)
      storage.saveSettings(defaultSettings)
    } catch (error) {
      console.error("Error resetting settings:", error)
    }
  }

  const exportSettings = () => {
    try {
      return JSON.stringify(settings, null, 2)
    } catch (error) {
      console.error("Error exporting settings:", error)
      return "{}"
    }
  }

  const importSettings = (settingsJson: string) => {
    try {
      const imported = JSON.parse(settingsJson)
      const mergedSettings = { ...defaultSettings, ...imported }
      setSettings(mergedSettings)
      storage.saveSettings(mergedSettings)
      return true
    } catch (error) {
      console.error("Failed to import settings:", error)
      return false
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
