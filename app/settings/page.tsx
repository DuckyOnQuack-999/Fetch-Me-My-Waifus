"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { SettingsPage as SettingsContent } from "@/components/settings-page"
import { motion } from "framer-motion"
import { Settings } from "lucide-react"

export default function SettingsRoute() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gradient">Settings</h1>
                <p className="text-muted-foreground">Configure your preferences and API keys</p>
              </div>
            </div>

            <SettingsContent />
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
