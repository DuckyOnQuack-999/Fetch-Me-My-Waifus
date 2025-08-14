import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/settingsContext"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Waifu Downloader",
  description: "Download and manage waifu images from various sources",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <div className="min-h-screen bg-background">
              <div className="container mx-auto p-4">
                <ApiStatusIndicator />
                {children}
              </div>
            </div>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
