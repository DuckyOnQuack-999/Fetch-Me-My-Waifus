"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Settings {
  downloadPath: string
  maxConcurrentDownloads: number
  imageQuality: "original" | "compressed"
  autoOrganize: boolean
  createSubfolders: boolean
  waifuImApiKey: string
  waifuPicsApiKey: string
  nekosBestApiKey: string
  wallhavenApiKey: string
  femboyFinderApiKey: string
  theme: "light" | "dark" | "system"
  notifications: boolean
}

const defaultSettings: Settings = {
  downloadPath: "./downloads",
  maxConcurrentDownloads: 3,
  imageQuality: "original",
  autoOrganize: true,
  createSubfolders: true,
  waifuImApiKey: "",
  waifuPicsApiKey: "",
  nekosBestApiKey: "",
  wallhavenApiKey: "RhVlota4CWLtHGJ0yX5vQMHqmJ3SZQFk", // Pre-filled from workspace
  femboyFinderApiKey: "",
  theme: "system",
  notifications: true,
}

const SettingsContext = createContext<Settings>(defaultSettings)

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }))
  }

  return <SettingsContext.Provider value={{ ...settings, updateSettings }}>{children}</SettingsContext.Provider>
}
