"use client"

import { useState } from "react"
import { useSettings } from "@/context/settingsContext"
import { useDownload } from "@/context/downloadContext"
import { SimpleDownloadTab } from "./simple-download-tab"
import type { DownloadStatus, DownloadProgress, ImageCategory } from "../types/waifu"

export function WaifuDownloader() {
  const { settings } = useSettings()
  const { addToQueue } = useDownload()
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle")
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    downloaded: 0,
    total: 0,
    speed: 0,
    eta: 0,
  })

  const handleStartDownload = async (category: ImageCategory, limit: number, isNsfw: boolean, downloadPath: string) => {
    setDownloadStatus("downloading")
    setDownloadProgress({
      downloaded: 0,
      total: limit,
      speed: 0,
      eta: 0,
    })

    // Simulate download process
    for (let i = 0; i < limit; i++) {
      if (downloadStatus === "paused") break

      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDownloadProgress((prev) => ({
        ...prev,
        downloaded: i + 1,
        speed: Math.random() * 1000000, // Random speed for demo
        eta: (limit - i - 1) * 1000, // Rough ETA calculation
      }))

      // Add to download queue (mock)
      addToQueue({
        id: `download-${i}`,
        url: `https://example.com/image-${i}.jpg`,
        filename: `waifu-${category}-${i}.jpg`,
        status: "completed",
        progress: 100,
        category,
        tags: [category],
        addedAt: new Date(),
      })
    }

    setDownloadStatus("completed")
  }

  const handlePauseDownload = () => {
    setDownloadStatus("paused")
  }

  const handleStopDownload = () => {
    setDownloadStatus("idle")
    setDownloadProgress({
      downloaded: 0,
      total: 0,
      speed: 0,
      eta: 0,
    })
  }

  return (
    <SimpleDownloadTab
      onStartDownload={handleStartDownload}
      onPauseDownload={handlePauseDownload}
      onStopDownload={handleStopDownload}
      downloadStatus={downloadStatus}
      downloadProgress={downloadProgress}
      settings={settings}
    />
  )
}
