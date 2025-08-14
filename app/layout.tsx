import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader",
  description: "Download and manage your favorite anime images",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <StorageProvider>
              <DownloadProvider>
                <SidebarProvider>
                  <div className="flex min-h-screen">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <div className="sticky top-0 z-50 p-4">
                        <ApiStatusIndicator />
                      </div>
                      <main className="flex-1 p-4">{children}</main>
                    </div>
                  </div>
                  <Toaster />
                </SidebarProvider>
              </DownloadProvider>
            </StorageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
