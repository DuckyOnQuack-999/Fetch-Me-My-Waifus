"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { DownloadItem, DownloadStatus } from "../types/waifu"

interface DownloadContextType {
  downloadQueue: DownloadItem[]
  totalDownloads: number
  lastDownload: Date | null
  addToQueue: (item: DownloadItem) => void
  removeFromQueue: (imageId: number) => void
  updateProgress: (imageId: number, progress: number) => void
  updateStatus: (imageId: number, status: DownloadStatus) => void
  clearQueue: () => void
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [downloadQueue, setDownloadQueue] = useState<DownloadItem[]>([])
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [lastDownload, setLastDownload] = useState<Date | null>(null)

  const addToQueue = (item: DownloadItem) => {
    setDownloadQueue((prev) => [...prev, item])
  }

  const removeFromQueue = (imageId: number) => {
    setDownloadQueue((prev) => prev.filter((item) => item.image.image_id !== imageId))
    setTotalDownloads((prev) => prev + 1)
    setLastDownload(new Date())
  }

  const updateProgress = (imageId: number, progress: number) => {
    setDownloadQueue((prev) => prev.map((item) => (item.image.image_id === imageId ? { ...item, progress } : item)))
  }

  const updateStatus = (imageId: number, status: DownloadStatus) => {
    setDownloadQueue((prev) => prev.map((item) => (item.image.image_id === imageId ? { ...item, status } : item)))
  }

  const clearQueue = () => {
    setDownloadQueue([])
  }

  return (
    <DownloadContext.Provider
      value={{
        downloadQueue,
        totalDownloads,
        lastDownload,
        addToQueue,
        removeFromQueue,
        updateProgress,
        updateStatus,
        clearQueue,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}

export function useDownload() {
  const context = useContext(DownloadContext)
  if (context === undefined) {
    throw new Error("useDownload must be used within a DownloadProvider")
  }
  return context
}
