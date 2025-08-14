import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader - Premium Anime Image Collection Tool",
  description:
    "Download and manage your favorite anime images from multiple sources with our beautiful, feature-rich application. Supports Waifu.im, Waifu.pics, Nekos.best, Wallhaven, and more.",
  keywords: ["anime", "waifu", "images", "downloader", "collection", "gallery", "otaku"],
  authors: [{ name: "Waifu Downloader Team" }],
  creator: "Waifu Downloader",
  publisher: "Waifu Downloader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://waifu-downloader.vercel.app"),
  openGraph: {
    title: "Waifu Downloader - Premium Anime Image Collection Tool",
    description:
      "Download and manage your favorite anime images from multiple sources with our beautiful, feature-rich application.",
    url: "https://waifu-downloader.vercel.app",
    siteName: "Waifu Downloader",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Waifu Downloader - Premium Anime Image Collection Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waifu Downloader - Premium Anime Image Collection Tool",
    description:
      "Download and manage your favorite anime images from multiple sources with our beautiful, feature-rich application.",
    images: ["/og-image.png"],
    creator: "@waifudownloader",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <StorageProvider>
              <DownloadProvider>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <main className="flex-1 overflow-hidden">{children}</main>
                  </div>
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--card-foreground))",
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
