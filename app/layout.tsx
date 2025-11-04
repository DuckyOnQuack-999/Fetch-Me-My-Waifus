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
import WaifuParticles from "@/components/waifu-particles"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fetch Me My Waifus - Ultimate Anime Collection Manager",
  description: "Your personal anime image collection manager with AI-powered features",
  keywords: ["anime", "waifu", "image", "downloader", "collection", "manager"],
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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ActivityProvider>
              <SettingsProvider>
                <StorageProvider>
                  <DownloadProvider>
                    <WaifuParticles />
                    {children}
                    <Toaster position="top-right" />
                  </DownloadProvider>
                </StorageProvider>
              </SettingsProvider>
            </ActivityProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
