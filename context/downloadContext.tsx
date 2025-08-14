"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { DownloadItem, DownloadStatus, DownloadProgress } from "@/types/waifu"
import { useSettings } from "./settingsContext"
import { useStorage } from "./storageContext"
import { toast } from "sonner"

interface DownloadContextType {
  // State
  downloads: DownloadItem[]
  activeDownloads: DownloadItem[]
  completedDownloads: DownloadItem[]
  failedDownloads: DownloadItem[]
  totalProgress: DownloadProgress
  isDownloading: boolean

  // Actions
  startDownload: (url: string, options?: Partial<DownloadItem>) => Promise<string>
  pauseDownload: (downloadId: string) => Promise<boolean>
  resumeDownload: (downloadId: string) => Promise<boolean>
  cancelDownload: (downloadId: string) => Promise<boolean>
  retryDownload: (downloadId: string) => Promise<boolean>
  clearCompleted: () => void
  clearFailed: () => void
  clearAll: () => void

  // Batch operations
  startBatchDownload: (urls: string[], options?: Partial<DownloadItem>) => Promise<string[]>
  pauseAll: () => Promise<void>
  resumeAll: () => Promise<void>
  cancelAll: () => Promise<void>

  // Queue management
  getQueuePosition: (downloadId: string) => number
  moveToTop: (downloadId: string) => void
  moveToBottom: (downloadId: string) => void
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export function DownloadProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const { addToDownloadHistory } = useStorage()

  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  // Computed values
  const activeDownloads = downloads.filter((d) => d.status === "downloading")
  const completedDownloads = downloads.filter((d) => d.status === "completed")
  const failedDownloads = downloads.filter((d) => d.status === "failed")

  const totalProgress: DownloadProgress = {
    downloaded: downloads.reduce((sum, d) => sum + (d.status === "completed" ? 1 : 0), 0),
    total: downloads.length,
    speed: activeDownloads.reduce((sum, d) => sum + (d.speed || 0), 0),
    eta: activeDownloads.length > 0 ? Math.max(...activeDownloads.map((d) => d.eta || 0)) : 0,
    currentFile: activeDownloads[0]?.filename,
    errors: failedDownloads.map((d) => d.error).filter(Boolean) as string[],
  }

  // Auto-start downloads when queue changes
  useEffect(() => {
    processDownloadQueue()
  }, [downloads, settings?.maxConcurrentDownloads])

  // Process download queue
  const processDownloadQueue = async () => {
    const maxConcurrent = settings?.maxConcurrentDownloads || 3
    const currentActive = activeDownloads.length
    const pendingDownloads = downloads.filter((d) => d.status === "pending")

    if (currentActive < maxConcurrent && pendingDownloads.length > 0) {
      const toStart = pendingDownloads.slice(0, maxConcurrent - currentActive)

      for (const download of toStart) {
        executeDownload(download.id)
      }
    }

    setIsDownloading(activeDownloads.length > 0)
  }

  // Execute individual download
  const executeDownload = async (downloadId: string) => {
    const download = downloads.find((d) => d.id === downloadId)
    if (!download) return

    try {
      // Update status to downloading
      updateDownloadStatus(downloadId, "downloading", { progress: 0 })

      // Simulate download with progress updates
      const startTime = Date.now()
      let progress = 0

      const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5 // Random progress between 5-20%
        progress = Math.min(progress, 100)

        const elapsed = (Date.now() - startTime) / 1000
        const speed = ((progress / 100) * 1024 * 1024) / elapsed // Simulated speed
        const eta = progress < 100 ? ((100 - progress) / progress) * elapsed : 0

        updateDownloadStatus(downloadId, "downloading", {
          progress: Math.floor(progress),
          speed,
          eta,
        })

        if (progress >= 100) {
          clearInterval(progressInterval)

          // Simulate network delay
          setTimeout(() => {
            updateDownloadStatus(downloadId, "completed", {
              progress: 100,
              speed: 0,
              eta: 0,
            })

            // Add to download history
            addToDownloadHistory({
              id: downloadId,
              url: download.url,
              filename: download.filename,
              source: download.source,
              timestamp: new Date().toISOString(),
              status: "completed",
            })

            toast.success(`Downloaded: ${download.filename}`)
          }, 500)
        }
      }, 200)

      // Handle potential errors
      if (Math.random() < 0.1) {
        // 10% chance of failure for demo
        setTimeout(
          () => {
            clearInterval(progressInterval)
            updateDownloadStatus(downloadId, "failed", {
              error: "Network error: Connection timeout",
            })
            toast.error(`Failed to download: ${download.filename}`)
          },
          Math.random() * 3000 + 1000,
        )
      }
    } catch (error) {
      updateDownloadStatus(downloadId, "failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error(`Download failed: ${download.filename}`)
    }
  }

  // Update download status
  const updateDownloadStatus = (downloadId: string, status: DownloadStatus, updates: Partial<DownloadItem> = {}) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === downloadId ? { ...d, status, ...updates, timestamp: new Date() } : d)),
    )
  }

  // Start download
  const startDownload = async (url: string, options: Partial<DownloadItem> = {}): Promise<string> => {
    const downloadId = `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newDownload: DownloadItem = {
      id: downloadId,
      url,
      filename: options.filename || `image-${Date.now()}.jpg`,
      status: "pending",
      progress: 0,
      timestamp: new Date(),
      source: options.source || settings?.apiSource || "waifu.im",
      category: options.category,
      metadata: options.metadata,
      ...options,
    }

    setDownloads((prev) => [...prev, newDownload])
    toast.success(`Added to download queue: ${newDownload.filename}`)

    return downloadId
  }

  // Pause download
  const pauseDownload = async (downloadId: string): Promise<boolean> => {
    const download = downloads.find((d) => d.id === downloadId)
    if (!download || download.status !== "downloading") return false

    updateDownloadStatus(downloadId, "paused")
    toast.info(`Paused: ${download.filename}`)
    return true
  }

  // Resume download
  const resumeDownload = async (downloadId: string): Promise<boolean> => {
    const download = downloads.find((d) => d.id === downloadId)
    if (!download || download.status !== "paused") return false

    updateDownloadStatus(downloadId, "pending")
    toast.info(`Resumed: ${download.filename}`)
    return true
  }

  // Cancel download
  const cancelDownload = async (downloadId: string): Promise<boolean> => {
    const download = downloads.find((d) => d.id === downloadId)
    if (!download) return false

    setDownloads((prev) => prev.filter((d) => d.id !== downloadId))
    toast.info(`Cancelled: ${download.filename}`)
    return true
  }

  // Retry download
  const retryDownload = async (downloadId: string): Promise<boolean> => {
    const download = downloads.find((d) => d.id === downloadId)
    if (!download || download.status !== "failed") return false

    updateDownloadStatus(downloadId, "pending", {
      progress: 0,
      error: undefined,
      speed: undefined,
      eta: undefined,
    })

    toast.info(`Retrying: ${download.filename}`)
    return true
  }

  // Clear completed downloads
  const clearCompleted = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== "completed"))
    toast.success("Cleared completed downloads")
  }

  // Clear failed downloads
  const clearFailed = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== "failed"))
    toast.success("Cleared failed downloads")
  }

  // Clear all downloads
  const clearAll = () => {
    setDownloads([])
    toast.success("Cleared all downloads")
  }

  // Start batch download
  const startBatchDownload = async (urls: string[], options: Partial<DownloadItem> = {}): Promise<string[]> => {
    const downloadIds: string[] = []

    for (const url of urls) {
      const id = await startDownload(url, {
        ...options,
        filename: options.filename || `batch-${Date.now()}-${downloadIds.length + 1}.jpg`,
      })
      downloadIds.push(id)
    }

    toast.success(`Added ${urls.length} items to download queue`)
    return downloadIds
  }

  // Pause all downloads
  const pauseAll = async () => {
    const activeIds = activeDownloads.map((d) => d.id)
    await Promise.all(activeIds.map((id) => pauseDownload(id)))
    toast.info("Paused all downloads")
  }

  // Resume all downloads
  const resumeAll = async () => {
    const pausedDownloads = downloads.filter((d) => d.status === "paused")
    await Promise.all(pausedDownloads.map((d) => resumeDownload(d.id)))
    toast.info("Resumed all downloads")
  }

  // Cancel all downloads
  const cancelAll = async () => {
    const activeIds = [
      ...activeDownloads.map((d) => d.id),
      ...downloads.filter((d) => d.status === "pending").map((d) => d.id),
    ]
    await Promise.all(activeIds.map((id) => cancelDownload(id)))
    toast.info("Cancelled all downloads")
  }

  // Get queue position
  const getQueuePosition = (downloadId: string): number => {
    const pendingDownloads = downloads.filter((d) => d.status === "pending")
    return pendingDownloads.findIndex((d) => d.id === downloadId) + 1
  }

  // Move to top of queue
  const moveToTop = (downloadId: string) => {
    setDownloads((prev) => {
      const download = prev.find((d) => d.id === downloadId)
      if (!download || download.status !== "pending") return prev

      const others = prev.filter((d) => d.id !== downloadId)
      return [download, ...others]
    })
  }

  // Move to bottom of queue
  const moveToBottom = (downloadId: string) => {
    setDownloads((prev) => {
      const download = prev.find((d) => d.id === downloadId)
      if (!download || download.status !== "pending") return prev

      const others = prev.filter((d) => d.id !== downloadId)
      return [...others, download]
    })
  }

  const contextValue: DownloadContextType = {
    // State
    downloads,
    activeDownloads,
    completedDownloads,
    failedDownloads,
    totalProgress,
    isDownloading,

    // Actions
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    clearCompleted,
    clearFailed,
    clearAll,

    // Batch operations
    startBatchDownload,
    pauseAll,
    resumeAll,
    cancelAll,

    // Queue management
    getQueuePosition,
    moveToTop,
    moveToBottom,
  }

  return <DownloadContext.Provider value={contextValue}>{children}</DownloadContext.Provider>
}

export function useDownload() {
  const context = useContext(DownloadContext)
  if (context === undefined) {
    throw new Error("useDownload must be used within a DownloadProvider")
  }
  return context
}
