"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ImageIcon, Settings, BarChart3, Heart, FolderOpen } from "lucide-react"
import { HomeDashboard } from "@/components/home-dashboard"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { SettingsTab } from "@/components/settings-tab"
import { FavoritesPage } from "@/components/favorites-page"
import { CollectionsPage } from "@/components/collections-page"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      component: HomeDashboard,
      description: "Overview and statistics",
    },
    {
      id: "download",
      label: "Download Center",
      icon: Download,
      component: SimpleDownloadTab,
      description: "Download anime images",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImageIcon,
      component: EnhancedImageGallery,
      description: "Browse downloaded images",
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      component: FavoritesPage,
      description: "Your favorite images",
    },
    {
      id: "collections",
      label: "Collections",
      icon: FolderOpen,
      component: CollectionsPage,
      description: "Organized image collections",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      component: SettingsTab,
      description: "Application settings",
    },
  ]

  const currentTab = tabs.find((tab) => tab.id === activeTab)
  const ActiveComponent = currentTab?.component || HomeDashboard

  return (
    <div className="flex min-h-screen bg-gradient cyberpunk">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-card/50 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="neon-text">{currentTab?.label || "Waifu Downloader"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="pulse-animation">
              v2.0.0
            </Badge>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6 bg-card/50 backdrop-blur-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 cyber-button">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 neon-text">
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </CardTitle>
                    <CardDescription>{tab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <tab.component />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SidebarInset>
    </div>
  )
}
