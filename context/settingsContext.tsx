"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSettings, saveSettings } from "@/utils/localStorage"

export interface Settings {
  apiSource: "waifu.im" | "waifu.pics" | "nekos.best" | "wallhaven" | "femboy-finder"
  downloadPath: string
  maxConcurrentDownloads: number
  autoDownload: boolean
  imageQuality: "low" | "medium" | "high"
  enableNotifications: boolean
  darkMode: boolean
  apiKeys: {
    wallhaven: string
    waifuIm: string
    waifuPics: string
    nekosBest: string
    femboyFinder: string
  }
}

const defaultSettings: Settings = {
  apiSource: "waifu.im",
  downloadPath: "./downloads",
  maxConcurrentDownloads: 3,
  autoDownload: false,
  imageQuality: "high",
  enableNotifications: true,
  darkMode: false,
  apiKeys: {
    wallhaven: "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk",
    waifuIm: "",
    waifuPics: "",
    nekosBest: "",
    femboyFinder: "",
  },
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await getSettings()
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...savedSettings })
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      setSettings(updatedSettings)
      await saveSettings(updatedSettings)
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings)
      await saveSettings(defaultSettings)
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
