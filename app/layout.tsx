import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { ClientWrapper } from "@/components/client-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader - AI-Powered Anime Image Downloader",
  description: "Download and manage anime images from multiple sources with AI upscaling capabilities",
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
                <ClientWrapper>{children}</ClientWrapper>
                <Toaster />
              </DownloadProvider>
            </StorageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
