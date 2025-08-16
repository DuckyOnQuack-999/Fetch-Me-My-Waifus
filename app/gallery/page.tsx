"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { EnhancedImageGallery } from "@/components/enhanced-image-gallery"
import { motion } from "framer-motion"
import { ImageIcon } from "lucide-react"

export default function GalleryPage() {
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
              <ImageIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gradient">Image Gallery</h1>
                <p className="text-muted-foreground">Browse and manage your downloaded images</p>
              </div>
            </div>

            <EnhancedImageGallery />
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
