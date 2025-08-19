"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const currentTheme = theme === "system" ? systemTheme : theme
      document.documentElement.setAttribute("data-theme", currentTheme || "light")
    }
  }, [mounted, theme, systemTheme])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
