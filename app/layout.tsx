import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { ActivityProvider } from "@/context/activityContext"
import { ErrorBoundary } from "@/components/error-boundary"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Hub - Premium Anime Collection",
  description: "Download and manage your anime image collection with advanced features",
  keywords: ["anime", "waifu", "images", "gallery", "collection"],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <SettingsProvider>
              <StorageProvider>
                <DownloadProvider>
                  <ActivityProvider>
                    <SidebarProvider>
                      {children}
                      <Toaster
                        position="bottom-right"
                        toastOptions={{
                          style: {
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                          },
                        }}
                      />
                    </SidebarProvider>
                  </ActivityProvider>
                </DownloadProvider>
              </StorageProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
