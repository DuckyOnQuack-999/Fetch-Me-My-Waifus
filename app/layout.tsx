import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { ErrorBoundary } from "@/components/error-boundary"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader - Advanced Anime Image Fetcher",
  description: "Download high-quality anime images from multiple APIs with advanced filtering and management features",
  keywords: ["anime", "waifu", "images", "downloader", "gallery", "collection"],
  authors: [{ name: "Waifu Downloader Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ec4899" },
    { media: "(prefers-color-scheme: dark)", color: "#ec4899" },
  ],
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
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SettingsProvider>
              <StorageProvider>
                <DownloadProvider>
                  <SidebarProvider>
                    <div className="min-h-screen bg-background">{children}</div>
                    <Toaster
                      position="bottom-right"
                      toastOptions={{
                        style: {
                          background: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          color: "hsl(var(--foreground))",
                        },
                      }}
                    />
                  </SidebarProvider>
                </DownloadProvider>
              </StorageProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
