"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import type { DownloadItem, DownloadStatus, DownloadProgress } from "@/types/waifu"
import { useSettings } from "./settingsContext"
import { useStorage } from "./storageContext"
import { toast } from "sonner"

interface DownloadContextType {
  downloads: DownloadItem[]
  activeDownloads: DownloadItem[]
  completedDownloads: DownloadItem[]
  failedDownloads: DownloadItem[]
  totalProgress: DownloadProgress
  isDownloading: boolean

  addToQueue: (item: DownloadItem) => void
  startDownload: (url: string, options?: Partial<DownloadItem>) => Promise<string>
  pauseDownload: (downloadId: string) => Promise<boolean>
  resumeDownload: (downloadId: string) => Promise<boolean>
  cancelDownload: (downloadId: string) => Promise<boolean>
  retryDownload: (downloadId: string) => Promise<boolean>
  clearCompleted: () => void
  clearFailed: () => void
  clearAll: () => void

  startBatchDownload: (urls: string[], options?: Partial<DownloadItem>) => Promise<string[]>
  pauseAll: () => Promise<void>
  resumeAll: () => Promise<void>
  cancelAll: () => Promise<void>

  getQueuePosition: (downloadId: string) => number
  moveToTop: (downloadId: string) => void
  moveToBottom: (downloadId: string) => void
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export function DownloadProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const { addDownloadRecord } = useStorage()

  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadControllersRef = useRef<Map<string, AbortController>>(new Map())
  const processingRef = useRef<boolean>(false)

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

  const updateDownloadStatus = useCallback(
    (downloadId: string, status: DownloadStatus, updates: Partial<DownloadItem> = {}) => {
      setDownloads((prev) =>
        prev.map((d) => (d.id === downloadId ? { ...d, status, ...updates, timestamp: new Date() } : d)),
      )
    },
    [],
  )

  const executeDownload = useCallback(
    async (downloadId: string) => {
      const download = downloads.find((d) => d.id === downloadId)
      if (!download) return

      const controller = new AbortController()
      downloadControllersRef.current.set(downloadId, controller)

      const maxRetries = settings?.retryAttempts || 3
      const currentRetry = download.retries || 0

      try {
        updateDownloadStatus(downloadId, "downloading", { progress: 0, startTime: new Date() })

        const response = await fetch(download.url, {
          signal: controller.signal,
          mode: "cors",
          credentials: "omit",
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentLength = response.headers.get("content-length")
        const totalBytes = contentLength ? Number.parseInt(contentLength, 10) : 0

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error("Failed to get response reader")
        }

        const chunks: Uint8Array[] = []
        let receivedBytes = 0
        const startTime = Date.now()

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          chunks.push(value)
          receivedBytes += value.length

          const elapsed = (Date.now() - startTime) / 1000
          const speed = receivedBytes / elapsed
          const progress = totalBytes > 0 ? (receivedBytes / totalBytes) * 100 : 0
          const eta = totalBytes > 0 && speed > 0 ? (totalBytes - receivedBytes) / speed : 0

          updateDownloadStatus(downloadId, "downloading", {
            progress: Math.min(progress, 99),
            speed,
            eta,
          })
        }

        const blob = new Blob(chunks)
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = download.filename
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        updateDownloadStatus(downloadId, "completed", {
          progress: 100,
          speed: 0,
          eta: 0,
          endTime: new Date(),
        })

        addDownloadRecord({
          id: downloadId,
          url: download.url,
          filename: download.filename,
          source: download.source,
          timestamp: new Date().toISOString(),
          status: "completed",
          fileSize: receivedBytes,
        })

        toast.success(`Downloaded: ${download.filename}`)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          updateDownloadStatus(downloadId, "cancelled")
          return
        }

        if (currentRetry < maxRetries) {
          const nextRetry = currentRetry + 1
          updateDownloadStatus(downloadId, "pending", {
            retries: nextRetry,
            error: `Retrying (${nextRetry}/${maxRetries})...`,
          })
          toast.info(`Retrying download: ${download.filename} (${nextRetry}/${maxRetries})`)
          return
        }

        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        updateDownloadStatus(downloadId, "failed", {
          error: errorMessage,
          endTime: new Date(),
        })
        toast.error(`Failed: ${download.filename} - ${errorMessage}`)
      } finally {
        downloadControllersRef.current.delete(downloadId)
      }
    },
    [downloads, updateDownloadStatus, addDownloadRecord, settings?.retryAttempts],
  )

  const processQueue = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true

    try {
      const maxConcurrent = settings?.maxConcurrentDownloads || 3
      const currentActive = downloads.filter((d) => d.status === "downloading").length
      const pendingDownloads = downloads.filter((d) => d.status === "pending")

      if (currentActive < maxConcurrent && pendingDownloads.length > 0) {
        const toStart = pendingDownloads.slice(0, maxConcurrent - currentActive)
        await Promise.all(toStart.map((download) => executeDownload(download.id)))
      }
    } finally {
      processingRef.current = false
    }
  }, [downloads, settings?.maxConcurrentDownloads, executeDownload])

  useEffect(() => {
    const hasPending = downloads.some((d) => d.status === "pending")
    const hasActive = downloads.some((d) => d.status === "downloading")

    setIsDownloading(hasActive)

    if (hasPending && !processingRef.current) {
      processQueue()
    }
  }, [downloads, processQueue])

  const addToQueue = useCallback((item: DownloadItem) => {
    setDownloads((prev) => [...prev, item])
  }, [])

  const startDownload = useCallback(
    async (url: string, options: Partial<DownloadItem> = {}): Promise<string> => {
      const downloadId = `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const urlFilename = url.split("/").pop()?.split("?")[0] || `image-${Date.now()}.jpg`

      const newDownload: DownloadItem = {
        id: downloadId,
        url,
        filename: options.filename || urlFilename,
        status: "pending",
        progress: 0,
        timestamp: new Date(),
        addedAt: new Date(),
        source: options.source || settings?.apiSource || "waifu.im",
        category: options.category,
        tags: options.tags || [],
        metadata: options.metadata,
        retries: 0,
        ...options,
      }

      setDownloads((prev) => [...prev, newDownload])
      toast.success(`Added to queue: ${newDownload.filename}`)

      return downloadId
    },
    [settings?.apiSource],
  )

  const pauseDownload = useCallback(
    async (downloadId: string): Promise<boolean> => {
      const controller = downloadControllersRef.current.get(downloadId)
      if (controller) {
        controller.abort()
        downloadControllersRef.current.delete(downloadId)
      }

      updateDownloadStatus(downloadId, "paused")
      toast.info("Download paused")
      return true
    },
    [updateDownloadStatus],
  )

  const resumeDownload = useCallback(
    async (downloadId: string): Promise<boolean> => {
      updateDownloadStatus(downloadId, "pending", { progress: 0 })
      toast.info("Download resumed")
      return true
    },
    [updateDownloadStatus],
  )

  const cancelDownload = useCallback(async (downloadId: string): Promise<boolean> => {
    const controller = downloadControllersRef.current.get(downloadId)
    if (controller) {
      controller.abort()
      downloadControllersRef.current.delete(downloadId)
    }

    setDownloads((prev) => prev.filter((d) => d.id !== downloadId))
    toast.info("Download cancelled")
    return true
  }, [])

  const retryDownload = useCallback(
    async (downloadId: string): Promise<boolean> => {
      const download = downloads.find((d) => d.id === downloadId)
      if (!download) return false

      const retries = (download.retries || 0) + 1
      if (retries > 3) {
        toast.error("Max retries exceeded")
        return false
      }

      updateDownloadStatus(downloadId, "pending", {
        progress: 0,
        error: undefined,
        retries,
      })

      toast.info(`Retrying download (${retries}/3)`)
      return true
    },
    [downloads, updateDownloadStatus],
  )

  const clearCompleted = useCallback(() => {
    setDownloads((prev) => prev.filter((d) => d.status !== "completed"))
    toast.success("Cleared completed downloads")
  }, [])

  const clearFailed = useCallback(() => {
    setDownloads((prev) => prev.filter((d) => d.status !== "failed"))
    toast.success("Cleared failed downloads")
  }, [])

  const clearAll = useCallback(() => {
    downloadControllersRef.current.forEach((controller) => controller.abort())
    downloadControllersRef.current.clear()

    setDownloads([])
    toast.success("Cleared all downloads")
  }, [])

  const startBatchDownload = useCallback(
    async (urls: string[], options: Partial<DownloadItem> = {}): Promise<string[]> => {
      const downloadIds: string[] = []

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]
        const urlFilename = url.split("/").pop()?.split("?")[0] || `batch-${i + 1}.jpg`

        const id = await startDownload(url, {
          ...options,
          filename: options.filename ? `${options.filename}-${i + 1}` : urlFilename,
        })
        downloadIds.push(id)
      }

      toast.success(`Added ${urls.length} items to queue`)
      return downloadIds
    },
    [startDownload],
  )

  const pauseAll = useCallback(async () => {
    const activeIds = activeDownloads.map((d) => d.id)
    await Promise.all(activeIds.map((id) => pauseDownload(id)))
    toast.info("Paused all downloads")
  }, [activeDownloads, pauseDownload])

  const resumeAll = useCallback(async () => {
    const pausedDownloads = downloads.filter((d) => d.status === "paused")
    await Promise.all(pausedDownloads.map((d) => resumeDownload(d.id)))
    toast.info("Resumed all downloads")
  }, [downloads, resumeDownload])

  const cancelAll = useCallback(async () => {
    const toCancel = downloads.filter((d) => d.status === "pending" || d.status === "downloading")
    await Promise.all(toCancel.map((d) => cancelDownload(d.id)))
    toast.info("Cancelled all downloads")
  }, [downloads, cancelDownload])

  const getQueuePosition = useCallback(
    (downloadId: string): number => {
      const pendingDownloads = downloads.filter((d) => d.status === "pending")
      return pendingDownloads.findIndex((d) => d.id === downloadId) + 1
    },
    [downloads],
  )

  const moveToTop = useCallback((downloadId: string) => {
    setDownloads((prev) => {
      const download = prev.find((d) => d.id === downloadId)
      if (!download || download.status !== "pending") return prev

      const others = prev.filter((d) => d.id !== downloadId)
      const insertIndex = others.findIndex((d) => d.status === "pending")

      if (insertIndex === -1) return [...others, download]
      return [...others.slice(0, insertIndex), download, ...others.slice(insertIndex)]
    })
  }, [])

  const moveToBottom = useCallback((downloadId: string) => {
    setDownloads((prev) => {
      const download = prev.find((d) => d.id === downloadId)
      if (!download || download.status !== "pending") return prev

      const others = prev.filter((d) => d.id !== downloadId)
      return [...others, download]
    })
  }, [])

  const contextValue: DownloadContextType = {
    downloads,
    activeDownloads,
    completedDownloads,
    failedDownloads,
    totalProgress,
    isDownloading,

    addToQueue,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    retryDownload,
    clearCompleted,
    clearFailed,
    clearAll,

    startBatchDownload,
    pauseAll,
    resumeAll,
    cancelAll,

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
