"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return <SidebarProvider>{children}</SidebarProvider>
}
