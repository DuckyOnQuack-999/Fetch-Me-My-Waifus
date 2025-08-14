"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Waifu Downloader...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
