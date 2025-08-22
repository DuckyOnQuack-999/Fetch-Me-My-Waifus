"use client"

import { useState, useEffect, Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeDashboard } from "@/components/home-dashboard"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { GalleryTab } from "@/components/gallery-tab"
import { SettingsTab } from "@/components/settings-tab"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { useSearchParams } from "next/navigation"
import { ErrorBoundary } from "@/components/error-boundary"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, ImageIcon, Settings, TrendingUp } from "lucide-react"

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function HomePageContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["dashboard", "download", "gallery", "settings"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set("tab", value)
    window.history.replaceState({}, "", url.toString())
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Waifu Downloader</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {activeTab === "dashboard" ? "Home" : activeTab}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ApiStatusIndicator />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">DL</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Gallery</span>
                <span className="sm:hidden">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <ErrorBoundary>
                <TabsContent value="dashboard" className="space-y-4">
                  <Suspense fallback={<LoadingSkeleton />}>
                    <HomeDashboard />
                  </Suspense>
                </TabsContent>

                <TabsContent value="download" className="space-y-4">
                  <Suspense fallback={<LoadingSkeleton />}>
                    <SimpleDownloadTab />
                  </Suspense>
                </TabsContent>

                <TabsContent value="gallery" className="space-y-4">
                  <Suspense fallback={<LoadingSkeleton />}>
                    <GalleryTab />
                  </Suspense>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Suspense fallback={<LoadingSkeleton />}>
                    <SettingsTab />
                  </Suspense>
                </TabsContent>
              </ErrorBoundary>
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </>
  )
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton />}>
        <HomePageContent />
      </Suspense>
    </ErrorBoundary>
  )
}
