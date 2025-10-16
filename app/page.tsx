"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
import { ActivityFeed } from "@/components/activity-feed"
import { authService } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const activeTab = searchParams.get("tab") || "dashboard"

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Waifu Hub</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {activeTab === "dashboard" ? "Dashboard" : activeTab}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Tabs value={activeTab} onValueChange={(value) => router.push(`/?tab=${value}`)} className="mt-4">
            <TabsList className="glass-card">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                  <HomeDashboard />
                </div>
                <div>
                  <ActivityFeed />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="download" className="mt-4">
              <SimpleDownloadTab />
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <ActivityFeed />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
