"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Settings {
  waifuImApiKey: string
  waifuPicsApiKey: string
  nekosBestApiKey: string
  wallhavenApiKey: string
  femboyFinderApiKey: string
  downloadPath: string
  maxConcurrentDownloads: number
  enableNotifications: boolean
  autoRetry: boolean
  retryAttempts: number
  defaultImageFormat: string
  compressionQuality: number
  enableMetadata: boolean
  darkMode: boolean
  language: string
  apiSource: string
  enableNSFW: boolean
  enableSFW: boolean
  defaultCategory: string
  imageSize: string
  sortBy: string
  sortOrder: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  isLoading: boolean
}

const defaultSettings: Settings = {
  waifuImApiKey: "",
  waifuPicsApiKey: "",
  nekosBestApiKey: "",
  wallhavenApiKey: process.env.WALLHAVEN_API_KEY || "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk",
  femboyFinderApiKey: "",
  downloadPath: "./downloads",
  maxConcurrentDownloads: 3,
  enableNotifications: true,
  autoRetry: true,
  retryAttempts: 3,
  defaultImageFormat: "jpg",
  compressionQuality: 90,
  enableMetadata: true,
  darkMode: false,
  language: "en",
  apiSource: "waifu-im",
  enableNSFW: false,
  enableSFW: true,
  defaultCategory: "waifu",
  imageSize: "large",
  sortBy: "random",
  sortOrder: "desc",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("waifu-downloader-settings")
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsed })
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
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
      localStorage.setItem("waifu-downloader-settings", JSON.stringify(updatedSettings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const resetSettings = () => {
    try {
      setSettings(defaultSettings)
      localStorage.setItem("waifu-downloader-settings", JSON.stringify(defaultSettings))
    } catch (error) {
      console.error("Failed to reset settings:", error)
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
