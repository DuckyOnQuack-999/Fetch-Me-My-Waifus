import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader - DuckyCoder v7 Enhanced",
  description: "Advanced anime image downloader with AI-powered code analysis",
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
                  <AppSidebar />
                  <SidebarInset>
                    <main className="flex-1">{children}</main>
                  </SidebarInset>
                </SidebarProvider>
                <Toaster />
              </DownloadProvider>
            </StorageProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
