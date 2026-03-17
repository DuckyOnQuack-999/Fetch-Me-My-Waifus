"use client"

import type { ReactNode } from "react"

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  // No authentication required - just pass through children
  return <>{children}</>
}
