"use client"

import { useContext } from "react"
import { DownloadContext } from "@/context/downloadContext"

export function useDownload() {
  const context = useContext(DownloadContext)
  if (context === undefined) {
    throw new Error("useDownload must be used within a DownloadProvider")
  }
  return context
}
