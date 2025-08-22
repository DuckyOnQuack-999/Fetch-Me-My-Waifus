import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientWrapper } from "@/components/client-wrapper"
import { ErrorBoundary } from "@/components/error-boundary"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader - AI-Powered Anime Image Collection",
  description:
    "Download, organize, and enhance your favorite anime images with AI upscaling and smart management features.",
  keywords: ["anime", "waifu", "images", "downloader", "AI", "upscaling"],
  authors: [{ name: "Waifu Downloader Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
            <SidebarProvider>
              <AppSidebar />
              <ClientWrapper>{children}</ClientWrapper>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
