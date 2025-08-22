"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { DownloadProgress, DownloadBatch } from "@/types/waifu"
import { generateId } from "@/lib/utils"
import { toast } from "sonner"

interface UseDownloadReturn {
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
  startDownload: (url: string, options?: DownloadOptions) => Promise<string>
  startBatchDownload: (urls: string[], options?: BatchDownloadOptions) => Promise<string>
  pauseDownload: (id: string) => void
  resumeDownload: (id: string) => void
  cancelDownload: (id: string) => void
  retryDownload: (id: string) => void
  clearCompleted: () => void
  clearFailed: () => void
  clearAll: () => void
}

interface DownloadOptions {
  filename?: string
  quality?: "original" | "high" | "medium" | "low"
  maxRetries?: number
  timeout?: number
}

interface BatchDownloadOptions extends DownloadOptions {
  source?: string
  category?: string
  tags?: string[]
  maxConcurrent?: number
}

export function useDownload(): UseDownloadReturn {
  const [downloads, setDownloads] = useState<DownloadProgress[]>([])
  const [batches, setBatches] = useState<DownloadBatch[]>([])
  const downloadQueue = useRef<string[]>([])
  const activeDownloadsRef = useRef<Set<string>>(new Set())
  const abortControllers = useRef<Map<string, AbortController>>(new Map())

  // Computed values
  const activeDownloads = downloads.filter((d) => d.status === "downloading")
  const completedDownloads = downloads.filter((d) => d.status === "completed")
  const failedDownloads = downloads.filter((d) => d.status === "failed")
  const isDownloading = activeDownloads.length > 0

  // Calculate total progress
  const totalProgress = {
    downloaded: downloads.filter((d) => d.status === "completed").length,
    total: downloads.length,
    speed: activeDownloads.reduce((sum, d) => sum + d.speed, 0),
    eta: activeDownloads.length > 0 ? Math.max(...activeDownloads.map((d) => d.eta)) : 0,
    currentFile: activeDownloads[0]?.filename || null,
    errors: failedDownloads.map((d) => d.error || "Unknown error"),
  }

  // Download a single file
  const downloadFile = useCallback(async (url: string, options: DownloadOptions = {}): Promise<DownloadProgress> => {
    const id = generateId("download")
    const filename = options.filename || `image_${Date.now()}.jpg`
    const abortController = new AbortController()

    abortControllers.current.set(id, abortController)

    const downloadProgress: DownloadProgress = {
      id,
      url,
      filename,
      status: "downloading",
      progress: 0,
      speed: 0,
      eta: 0,
      startTime: new Date().toISOString(),
    }

    setDownloads((prev) => [...prev, downloadProgress])

    try {
      const response = await fetch(url, {
        signal: abortController.signal,
        headers: {
          "User-Agent": "WaifuDownloader/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentLength = response.headers.get("content-length")
      const totalSize = contentLength ? Number.parseInt(contentLength, 10) : 0

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Failed to get response reader")
      }

      const chunks: Uint8Array[] = []
      let downloadedBytes = 0
      let lastUpdate = Date.now()
      let lastBytes = 0

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        downloadedBytes += value.length

        const now = Date.now()
        const timeDiff = (now - lastUpdate) / 1000

        if (timeDiff >= 1) {
          // Update every second
          const bytesDiff = downloadedBytes - lastBytes
          const speed = bytesDiff / timeDiff
          const progress = totalSize > 0 ? (downloadedBytes / totalSize) * 100 : 0
          const eta = speed > 0 ? (totalSize - downloadedBytes) / speed : 0

          setDownloads((prev) =>
            prev.map((d) =>
              d.id === id
                ? {
                    ...d,
                    progress,
                    speed,
                    eta,
                    downloadedBytes,
                    fileSize: totalSize,
                  }
                : d,
            ),
          )

          lastUpdate = now
          lastBytes = downloadedBytes
        }
      }

      // Create blob and trigger download
      const blob = new Blob(chunks)
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(blobUrl)

      const completedDownload: DownloadProgress = {
        ...downloadProgress,
        status: "completed",
        progress: 100,
        endTime: new Date().toISOString(),
        fileSize: totalSize,
        downloadedBytes,
      }

      setDownloads((prev) => prev.map((d) => (d.id === id ? completedDownload : d)))
      abortControllers.current.delete(id)

      return completedDownload
    } catch (error: any) {
      const failedDownload: DownloadProgress = {
        ...downloadProgress,
        status: "failed",
        error: error.message,
        endTime: new Date().toISOString(),
      }

      setDownloads((prev) => prev.map((d) => (d.id === id ? failedDownload : d)))
      abortControllers.current.delete(id)

      throw error
    }
  }, [])

  // Start a single download
  const startDownload = useCallback(
    async (url: string, options: DownloadOptions = {}): Promise<string> => {
      try {
        const download = await downloadFile(url, options)
        toast.success(`Download started: ${download.filename}`)
        return download.id
      } catch (error: any) {
        toast.error(`Download failed: ${error.message}`)
        throw error
      }
    },
    [downloadFile],
  )

  // Start batch download
  const startBatchDownload = useCallback(
    async (urls: string[], options: BatchDownloadOptions = {}): Promise<string> => {
      const batchId = generateId("batch")
      const maxConcurrent = options.maxConcurrent || 3

      const batch: DownloadBatch = {
        id: batchId,
        name: `Batch Download ${new Date().toLocaleString()}`,
        urls,
        progress: [],
        status: "downloading",
        created_at: new Date().toISOString(),
        totalFiles: urls.length,
        completedFiles: 0,
        failedFiles: 0,
      }

      setBatches((prev) => [...prev, batch])

      // Process downloads with concurrency limit
      const processQueue = async () => {
        const activePromises = new Set<Promise<void>>()

        for (const url of urls) {
          // Wait if we've reached the concurrency limit
          while (activePromises.size >= maxConcurrent) {
            await Promise.race(activePromises)
          }

          const downloadPromise = downloadFile(url, options)
            .then((download) => {
              setBatches((prev) =>
                prev.map((b) =>
                  b.id === batchId
                    ? {
                        ...b,
                        completedFiles: b.completedFiles + 1,
                        progress: [...b.progress, download],
                      }
                    : b,
                ),
              )
            })
            .catch((error) => {
              setBatches((prev) =>
                prev.map((b) =>
                  b.id === batchId
                    ? {
                        ...b,
                        failedFiles: b.failedFiles + 1,
                      }
                    : b,
                ),
              )
            })
            .finally(() => {
              activePromises.delete(downloadPromise)
            })

          activePromises.add(downloadPromise)
        }

        // Wait for all downloads to complete
        await Promise.allSettled(activePromises)

        // Update batch status
        setBatches((prev) =>
          prev.map((b) =>
            b.id === batchId
              ? {
                  ...b,
                  status: "completed",
                  completed_at: new Date().toISOString(),
                }
              : b,
          ),
        )
      }

      processQueue()
      toast.success(`Batch download started: ${urls.length} files`)

      return batchId
    },
    [downloadFile],
  )

  // Pause download
  const pauseDownload = useCallback((id: string) => {
    const controller = abortControllers.current.get(id)
    if (controller) {
      controller.abort()
      setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, status: "paused" } : d)))
    }
  }, [])

  // Resume download
  const resumeDownload = useCallback(
    (id: string) => {
      const download = downloads.find((d) => d.id === id)
      if (download && download.status === "paused") {
        startDownload(download.url, { filename: download.filename })
      }
    },
    [downloads, startDownload],
  )

  // Cancel download
  const cancelDownload = useCallback((id: string) => {
    const controller = abortControllers.current.get(id)
    if (controller) {
      controller.abort()
    }

    setDownloads((prev) => prev.filter((d) => d.id !== id))
    abortControllers.current.delete(id)
  }, [])

  // Retry download
  const retryDownload = useCallback(
    (id: string) => {
      const download = downloads.find((d) => d.id === id)
      if (download && download.status === "failed") {
        setDownloads((prev) => prev.filter((d) => d.id !== id))
        startDownload(download.url, { filename: download.filename })
      }
    },
    [downloads, startDownload],
  )

  // Clear completed downloads
  const clearCompleted = useCallback(() => {
    setDownloads((prev) => prev.filter((d) => d.status !== "completed"))
  }, [])

  // Clear failed downloads
  const clearFailed = useCallback(() => {
    setDownloads((prev) => prev.filter((d) => d.status !== "failed"))
  }, [])

  // Clear all downloads
  const clearAll = useCallback(() => {
    // Cancel active downloads
    downloads.forEach((d) => {
      if (d.status === "downloading") {
        cancelDownload(d.id)
      }
    })

    setDownloads([])
    setBatches([])
  }, [downloads, cancelDownload])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllers.current.forEach((controller) => {
        controller.abort()
      })
      abortControllers.current.clear()
    }
  }, [])

  return {
    downloads,
    batches,
    activeDownloads,
    completedDownloads,
    failedDownloads,
    isDownloading,
    totalProgress,
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
}
