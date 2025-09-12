"use client"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { SettingsPage } from "@/components/settings-page"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function SettingsComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>
          <SettingsPage />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
