"use client"

import type React from "react"

import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <SettingsProvider>
      <StorageProvider>
        <DownloadProvider>{children}</DownloadProvider>
      </StorageProvider>
    </SettingsProvider>
  )
}
