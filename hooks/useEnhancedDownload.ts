"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { WaifuImage, DownloadItem, DownloadStatus, Settings } from "../types/waifu"
import { downloadImage } from "../services/enhanced-waifu-api"

interface UseEnhancedDownloadReturn {
  downloadQueue: DownloadItem[]
  downloadStatus: DownloadStatus
  totalProgress: number
  addToQueue: (images: WaifuImage[]) => void
  removeFromQueue: (imageId: string) => void
  pauseDownloads: () => void
  resumeDownloads: () => void
  cancelDownloads: () => void
  retryFailed: () => void
  clearCompleted: () => void
}

export function useEnhancedDownload(settings: Settings): UseEnhancedDownloadReturn {
  const [downloadQueue, setDownloadQueue] = useState<DownloadItem[]>([])
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle")
  const [activeDownloads, setActiveDownloads] = useState(0)
  const abortController = useRef<AbortController | null>(null)

  // Calculate total progress
  const totalProgress =
    downloadQueue.length > 0 ? downloadQueue.reduce((sum, item) => sum + item.progress, 0) / downloadQueue.length : 0

  // Enhanced download processing with concurrency control
  const processDownloadQueue = useCallback(async () => {
    if (downloadStatus === "paused" || activeDownloads >= settings.concurrentDownloads) {
      return
    }

    const pendingItems = downloadQueue.filter((item) => item.status === "pending")
    if (pendingItems.length === 0) {
      setDownloadStatus("completed")
      return
    }

    setDownloadStatus("downloading")
    const item = pendingItems[0]

    try {
      setActiveDownloads((prev) => prev + 1)

      // Update item status to downloading
      setDownloadQueue((prev) =>
        prev.map((queueItem) =>
          queueItem.image.image_id === item.image.image_id
            ? { ...queueItem, status: "downloading", startTime: new Date() }
            : queueItem,
        ),
      )

      // Download the image with progress tracking
      const blob = await downloadImage(item.image.url)

      // Save the file
      const fileName = `${item.image.image_id}_${item.image.tags[0]?.name || "waifu"}.${item.image.extension}`
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Update item status to completed
      setDownloadQueue((prev) =>
        prev.map((queueItem) =>
          queueItem.image.image_id === item.image.image_id
            ? {
                ...queueItem,
                status: "completed",
                progress: 100,
                endTime: new Date(),
                filePath: fileName,
              }
            : queueItem,
        ),
      )
    } catch (error) {
      console.error(`Download failed for ${item.image.image_id}:`, error)

      // Update item with error status
      setDownloadQueue((prev) =>
        prev.map((queueItem) =>
          queueItem.image.image_id === item.image.image_id
            ? {
                ...queueItem,
                status: "error",
                retries: queueItem.retries + 1,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
              }
            : queueItem,
        ),
      )

      // Retry if attempts remaining
      if (item.retries < settings.retryAttempts) {
        setTimeout(() => {
          setDownloadQueue((prev) =>
            prev.map((queueItem) =>
              queueItem.image.image_id === item.image.image_id ? { ...queueItem, status: "pending" } : queueItem,
            ),
          )
        }, 2000) // Wait 2 seconds before retry
      }
    } finally {
      setActiveDownloads((prev) => prev - 1)
    }
  }, [downloadQueue, downloadStatus, activeDownloads, settings])

  // Process queue when items are added or status changes
  useEffect(() => {
    if (downloadStatus !== "paused" && downloadStatus !== "cancelled") {
      processDownloadQueue()
    }
  }, [downloadQueue, downloadStatus, processDownloadQueue])

  const addToQueue = useCallback((images: WaifuImage[]) => {
    const newItems: DownloadItem[] = images.map((image) => ({
      image,
      status: "pending",
      progress: 0,
      retries: 0,
      startTime: undefined,
      endTime: undefined,
    }))

    setDownloadQueue((prev) => [...prev, ...newItems])
  }, [])

  const removeFromQueue = useCallback((imageId: string) => {
    setDownloadQueue((prev) => prev.filter((item) => item.image.image_id !== imageId))
  }, [])

  const pauseDownloads = useCallback(() => {
    setDownloadStatus("paused")
    if (abortController.current) {
      abortController.current.abort()
    }
  }, [])

  const resumeDownloads = useCallback(() => {
    setDownloadStatus("downloading")
    abortController.current = new AbortController()
  }, [])

  const cancelDownloads = useCallback(() => {
    setDownloadStatus("cancelled")
    if (abortController.current) {
      abortController.current.abort()
    }
    setDownloadQueue([])
  }, [])

  const retryFailed = useCallback(() => {
    setDownloadQueue((prev) =>
      prev.map((item) =>
        item.status === "error" ? { ...item, status: "pending", retries: 0, errorMessage: undefined } : item,
      ),
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setDownloadQueue((prev) => prev.filter((item) => item.status !== "completed"))
  }, [])

  return {
    downloadQueue,
    downloadStatus,
    totalProgress,
    addToQueue,
    removeFromQueue,
    pauseDownloads,
    resumeDownloads,
    cancelDownloads,
    retryFailed,
    clearCompleted,
  }
}
