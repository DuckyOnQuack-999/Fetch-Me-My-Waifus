import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader - AI-Enhanced Anime Image Collection",
  description: "Advanced anime image downloader with AI upscaling, smart collections, and powerful management tools",
  keywords: ["anime", "waifu", "downloader", "AI", "upscaling", "collection", "management"],
  authors: [{ name: "Waifu Downloader Team" }],
  creator: "Waifu Downloader",
  publisher: "Waifu Downloader",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    title: "Waifu Downloader",
    description: "AI-Enhanced Anime Image Collection",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waifu Downloader",
    description: "AI-Enhanced Anime Image Collection",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SettingsProvider>
              <StorageProvider>
                <DownloadProvider>
                  <SidebarProvider>
                    <div className="min-h-screen bg-background font-sans">{children}</div>
                    <Toaster
                      position="bottom-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: "hsl(var(--background))",
                          color: "hsl(var(--foreground))",
                          border: "1px solid hsl(var(--border))",
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
