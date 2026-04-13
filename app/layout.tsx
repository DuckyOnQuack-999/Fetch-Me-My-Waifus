import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { FluentThemeProvider } from "@/components/fluent-theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import { ActivityProvider } from "@/context/activityContext"
import WaifuParticles from "@/components/waifu-particles"
import { ErrorBoundary } from "@/components/error-boundary"

import { GeistSans as Geist } from "geist/font/sans"
import { GeistMono as Geist_Mono } from "geist/font/mono"

import { Inter, Source_Serif_4, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--v0-font-geist' })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--v0-font-geist-mono' })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"], variable: '--v0-font-source-serif-4' })
const _v0_fontVariables = `${_geist.variable} ${_geistMono.variable} ${_sourceSerif_4.variable}`

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
})

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
      <body className={`${inter.variable} ${sourceSerif.variable} ${Geist.variable} ${Geist_Mono.variable} font-sans antialiased ${_v0_fontVariables}`}>
        <ErrorBoundary>
          <FluentThemeProvider>
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
          </FluentThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
