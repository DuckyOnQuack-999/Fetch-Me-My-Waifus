"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { DownloadStatus, DownloadProgress, DownloadBatch } from "@/types/waifu"
import { useSettings } from "./settingsContext"
import { useStorage } from "./storageContext"
import { toast } from "sonner"

interface DownloadContextType {
  // State
  downloads: DownloadProgress[]
  batches: DownloadBatch[]
  activeDownloads: DownloadProgress[]
  completedDownloads: DownloadProgress[]
  failedDownloads: DownloadProgress[]
  isDownloading: boolean
  totalProgress: {
    downloaded: number
    total: number
    speed: number
    eta: number
    currentFile: string | null
    errors: string[]
  }

  // Actions
  startDownload: (url: string, options?: any) => Promise<string>
  startBatchDownload: (urls: string[], options?: any) => Promise<string>
  pauseDownload: (id: string) => void
  resumeDownload: (id: string) => void
  cancelDownload: (id: string) => void
  retryDownload: (id: string) => void
  clearCompleted: () => void
  clearFailed: () => void
  clearAll: () => void
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export function DownloadProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const { addDownloadRecord } = useStorage()

  const [downloads, setDownloads] = useState<DownloadProgress[]>([])
  const [batches, setBatches] = useState<DownloadBatch[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  // Computed values
  const activeDownloads = downloads.filter((d) => d.status === "downloading")
  const completedDownloads = downloads.filter((d) => d.status === "completed")
  const failedDownloads = downloads.filter((d) => d.status === "failed")

  const totalProgress: DownloadContextType["totalProgress"] = {
    downloaded: downloads.reduce((sum, d) => sum + (d.status === "completed" ? 1 : 0), 0),
    total: downloads.length,
    speed: activeDownloads.reduce((sum, d) => sum + (d.speed || 0), 0),
    eta: activeDownloads.length > 0 ? Math.max(...activeDownloads.map((d) => d.eta || 0)) : 0,
    currentFile: activeDownloads[0]?.filename || null,
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
            addDownloadRecord({
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
  const updateDownloadStatus = (
    downloadId: string,
    status: DownloadStatus,
    updates: Partial<DownloadProgress> = {},
  ) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === downloadId ? { ...d, status, ...updates, timestamp: new Date() } : d)),
    )
  }

  // Start download
  const startDownload = async (url: string, options: any = {}): Promise<string> => {
    const downloadId = `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newDownload: DownloadProgress = {
      id: downloadId,
      url,
      filename: options.filename || `image-${Date.now()}.jpg`,
      status: "pending",
      progress: 0,
      timestamp: new Date(),
      addedAt: new Date(),
      source: options.source || settings?.apiSource || "waifu.im",
      category: options.category,
      tags: options.tags || [],
      metadata: options.metadata,
      ...options,
    }

    setDownloads((prev) => [...prev, newDownload])
    toast.success(`Added to download queue: ${newDownload.filename}`)

    return downloadId
  }

  // Start batch download
  const startBatchDownload = async (urls: string[], options: any = {}): Promise<string> => {
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const batch: DownloadBatch = {
      id: batchId,
      urls,
      status: "pending",
      downloads: [],
      timestamp: new Date(),
      addedAt: new Date(),
      source: options.source || settings?.apiSource || "waifu.im",
      category: options.category,
      tags: options.tags || [],
      metadata: options.metadata,
      ...options,
    }

    setBatches((prev) => [...prev, batch])

    const downloadIds: string[] = []

    for (const url of urls) {
      const id = await startDownload(url, {
        ...options,
        filename: options.filename || `batch-${Date.now()}-${downloadIds.length + 1}.jpg`,
        batchId,
      })
      downloadIds.push(id)
    }

    toast.success(`Added ${urls.length} items to download queue`)
    return batchId
  }

  // Pause download
  const pauseDownload = (id: string) => {
    const download = downloads.find((d) => d.id === id)
    if (!download || download.status !== "downloading") return

    updateDownloadStatus(id, "paused")
    toast.info(`Paused: ${download.filename}`)
  }

  // Resume download
  const resumeDownload = (id: string) => {
    const download = downloads.find((d) => d.id === id)
    if (!download || download.status !== "paused") return

    updateDownloadStatus(id, "pending")
    toast.info(`Resumed: ${download.filename}`)
  }

  // Cancel download
  const cancelDownload = (id: string) => {
    const download = downloads.find((d) => d.id === id)
    if (!download) return

    setDownloads((prev) => prev.filter((d) => d.id !== id))
    toast.info(`Cancelled: ${download.filename}`)
  }

  // Retry download
  const retryDownload = (id: string) => {
    const download = downloads.find((d) => d.id === id)
    if (!download || download.status !== "failed") return

    updateDownloadStatus(id, "pending", {
      progress: 0,
      error: undefined,
      speed: undefined,
      eta: undefined,
    })

    toast.info(`Retrying: ${download.filename}`)
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
    setBatches([])
    toast.success("Cleared all downloads")
  }

  const contextValue: DownloadContextType = {
    // State
    downloads,
    batches,
    activeDownloads,
    completedDownloads,
    failedDownloads,
    isDownloading,
    totalProgress,

    // Actions
    startDownload,
    startBatchDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    clearCompleted,
    clearFailed,
    clearAll,
  }

  return <DownloadContext.Provider value={contextValue}>{children}</DownloadContext.Provider>
}

export function useDownloadContext() {
  const context = useContext(DownloadContext)
  if (context === undefined) {
    throw new Error("useDownloadContext must be used within a DownloadProvider")
  }
  return context
}

// Export for backward compatibility
export { useDownloadContext as useDownload }
