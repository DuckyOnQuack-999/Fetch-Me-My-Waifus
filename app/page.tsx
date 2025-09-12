"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HomeDashboard } from "@/components/home-dashboard"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SettingsTab } from "@/components/settings-tab"
import { QuantumPerformanceMonitor } from "@/components/quantum-performance-monitor"
import { AnimatedStats } from "@/components/animated-stats"
import { DownloadQueue } from "@/components/download-queue"
import { DownloadHistory } from "@/components/download-history"
import { BatchOperationsPanel } from "@/components/batch-operations-panel"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { AppSidebar } from "@/components/app-sidebar"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const url = new URL(window.location.href)
    if (value === "dashboard") {
      url.searchParams.delete("tab")
    } else {
      url.searchParams.set("tab", value)
    }
    window.history.replaceState({}, "", url.toString())
  }

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard"
      case "download":
        return "Simple Download"
      case "batch":
        return "Batch Operations"
      case "queue":
        return "Download Queue"
      case "history":
        return "Download History"
      case "gallery":
        return "Image Gallery"
      case "performance":
        return "Performance Monitor"
      case "storage":
        return "Storage Usage"
      case "api-status":
        return "API Status"
      case "stats":
        return "Statistics"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gradient">
          <SidebarTrigger className="-ml-1 cyberpunk-btn" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="neon-text">
                  Waifu Downloader
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="neon-text">{getBreadcrumbTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ApiStatusIndicator />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 bg-gradient min-h-screen">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 material-card">
              <TabsTrigger value="dashboard" className="cyberpunk-btn">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="download" className="cyberpunk-btn">
                Download
              </TabsTrigger>
              <TabsTrigger value="batch" className="cyberpunk-btn">
                Batch
              </TabsTrigger>
              <TabsTrigger value="queue" className="cyberpunk-btn">
                Queue
              </TabsTrigger>
              <TabsTrigger value="history" className="cyberpunk-btn">
                History
              </TabsTrigger>
              <TabsTrigger value="gallery" className="cyberpunk-btn">
                Gallery
              </TabsTrigger>
              <TabsTrigger value="performance" className="cyberpunk-btn">
                Performance
              </TabsTrigger>
              <TabsTrigger value="storage" className="cyberpunk-btn">
                Storage
              </TabsTrigger>
              <TabsTrigger value="api-status" className="cyberpunk-btn">
                API Status
              </TabsTrigger>
              <TabsTrigger value="stats" className="cyberpunk-btn">
                Stats
              </TabsTrigger>
              <TabsTrigger value="settings" className="cyberpunk-btn">
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="dashboard" className="animate-fade-in">
                <HomeDashboard />
              </TabsContent>

              <TabsContent value="download" className="animate-fade-in">
                <SimpleDownloadTab />
              </TabsContent>

              <TabsContent value="batch" className="animate-fade-in">
                <BatchOperationsPanel />
              </TabsContent>

              <TabsContent value="queue" className="animate-fade-in">
                <DownloadQueue />
              </TabsContent>

              <TabsContent value="history" className="animate-fade-in">
                <DownloadHistory />
              </TabsContent>

              <TabsContent value="gallery" className="animate-fade-in">
                <EnhancedImageGallery />
              </TabsContent>

              <TabsContent value="performance" className="animate-fade-in">
                <QuantumPerformanceMonitor />
              </TabsContent>

              <TabsContent value="storage" className="animate-fade-in">
                <div className="grid gap-6">
                  <AnimatedStats />
                </div>
              </TabsContent>

              <TabsContent value="api-status" className="animate-fade-in">
                <div className="grid gap-6">
                  <ApiStatusIndicator detailed />
                </div>
              </TabsContent>

              <TabsContent value="stats" className="animate-fade-in">
                <AnimatedStats />
              </TabsContent>

              <TabsContent value="settings" className="animate-fade-in">
                <SettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </>
  )
}
