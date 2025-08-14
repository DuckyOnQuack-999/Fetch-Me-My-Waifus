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
  title: "Waifu Downloader - Premium Anime Image Collection",
  description:
    "Download and manage your favorite anime images from multiple premium sources with advanced filtering and organization tools",
  keywords: ["anime", "waifu", "images", "downloader", "collection", "gallery"],
  authors: [{ name: "DuckyCoder v6" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ec4899",
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
                  <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <div className="sticky top-0 z-50 p-4 backdrop-blur-md bg-background/80 border-b border-primary/10 shadow-lg shadow-primary/5">
                        <div className="animate-in slide-in-from-top-2 duration-500">
                          <ApiStatusIndicator />
                        </div>
                      </div>
                      <main className="flex-1 p-4 overflow-auto">
                        <div className="animate-in fade-in-0 duration-700">{children}</div>
                      </main>
                    </div>
                  </div>
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--primary) / 0.2)",
                        color: "hsl(var(--foreground))",
                      },
                    }}
                  />
                </SidebarProvider>
              </DownloadProvider>
            </StorageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
