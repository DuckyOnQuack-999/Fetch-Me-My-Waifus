import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { ErrorBoundaryWrapper } from "@/components/error-boundary"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader v7 - Quantum-Enhanced Image Fetcher",
  description:
    "Revolutionary AI-powered image downloading with quantum computing, ethical AI, and sustainable technology",
  keywords: ["waifu", "anime", "images", "downloader", "quantum", "AI", "sustainable", "ethical"],
  authors: [{ name: "DuckyCoder v7" }],
  creator: "DuckyCoder v7",
  publisher: "Waifu Downloader",
  robots: "index, follow",
  openGraph: {
    title: "Waifu Downloader v7 - Quantum-Enhanced",
    description: "Revolutionary AI-powered image downloading with quantum computing",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waifu Downloader v7",
    description: "Quantum-enhanced image downloading",
  },
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
      <head>
        <meta name="quantum-enhanced" content="true" />
        <meta name="carbon-neutral" content="true" />
        <meta name="ethical-ai" content="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ErrorBoundaryWrapper quantumMode={true} sustainabilityMode={true} ethicalMode={true}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SettingsProvider>
              <StorageProvider>
                <DownloadProvider>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <main className="flex-1">{children}</main>
                    </div>
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
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
}
