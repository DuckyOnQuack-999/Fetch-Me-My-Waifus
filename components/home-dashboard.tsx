"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Download, Sparkles, Zap } from "lucide-react"
import { SimpleDownloadTab } from "./simple-download-tab"
import { GalleryTab } from "./gallery-tab"
import { SettingsTab } from "./settings-tab"
import { EnhancedCard, CardContent, CardDescription, CardHeader, CardTitle } from "./enhanced-card"
import { NeonButton } from "./neon-button"

export function HomeDashboard() {
  const [activeTab, setActiveTab] = useState("download")
  const [stats, setStats] = useState({
    totalDownloads: 0,
    favoriteImages: 0,
    collectionsCount: 0,
  })

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("waifuDownloaderStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Hero Section with Neon Effects */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient neon-text animate-float" data-text="Waifu Fetcher">
          Waifu Fetcher ✨
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up kawaii-heart">
          Your magical anime image companion! 💖
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Badge variant="secondary" className="px-4 py-2 text-lg glass-effect glow-pulse">
            <Heart className="w-5 h-5 mr-2 kawaii-heart" />
            {stats.favoriteImages} Favorites
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-lg glass-effect glow-pulse">
            <Download className="w-5 h-5 mr-2" />
            {stats.totalDownloads} Downloads
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-lg glass-effect glow-pulse">
            <Sparkles className="w-5 h-5 mr-2" />
            {stats.collectionsCount} Collections
          </Badge>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EnhancedCard variant="glass" className="group cursor-pointer" onClick={() => setActiveTab("download")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Download className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-gradient">Quick Download</CardTitle>
            <CardDescription>Start downloading your favorite waifus instantly!</CardDescription>
          </CardHeader>
        </EnhancedCard>

        <EnhancedCard variant="holographic" className="group cursor-pointer" onClick={() => setActiveTab("gallery")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white kawaii-heart" />
            </div>
            <CardTitle className="text-gradient">Gallery</CardTitle>
            <CardDescription>Browse and manage your kawaii collection!</CardDescription>
          </CardHeader>
        </EnhancedCard>

        <EnhancedCard variant="cyber" className="group cursor-pointer" onClick={() => setActiveTab("settings")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-gradient">Settings</CardTitle>
            <CardDescription>Customize your waifu experience!</CardDescription>
          </CardHeader>
        </EnhancedCard>
      </div>

      {/* Main Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-8 glass-effect border border-pink-500/30">
          <TabsTrigger
            value="download"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 energy-wave"
          >
            <Download className="w-4 h-4 mr-2" />
            Download ✨
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 energy-wave"
          >
            <Heart className="w-4 h-4 mr-2 kawaii-heart" />
            Gallery 💖
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300 energy-wave"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Settings ⚡
          </TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="animate-fade-in">
          <EnhancedCard variant="glass" animated glowOnHover>
            <CardHeader>
              <CardTitle className="text-2xl neon-text flex items-center gap-2">
                <Download className="w-6 h-6" />
                Download Magical Waifus ✨
              </CardTitle>
              <CardDescription>Choose your API source and start collecting adorable anime images!</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleDownloadTab />
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="gallery" className="animate-fade-in">
          <EnhancedCard variant="holographic" animated glowOnHover>
            <CardHeader>
              <CardTitle className="text-2xl neon-text flex items-center gap-2">
                <Heart className="w-6 h-6 kawaii-heart" />
                Your Kawaii Gallery 💖
              </CardTitle>
              <CardDescription>Browse, organize, and manage your adorable waifu collection!</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryTab />
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="settings" className="animate-fade-in">
          <EnhancedCard variant="cyber" animated glowOnHover>
            <CardHeader>
              <CardTitle className="text-2xl neon-text flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Cyber Settings ⚡
              </CardTitle>
              <CardDescription>Customize your waifu downloading experience with advanced options!</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTab />
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 space-y-4 z-50">
        <NeonButton
          variant="kawaii"
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl animate-bounce-slow"
          onClick={() => setActiveTab("download")}
        >
          <Download className="w-6 h-6" />
        </NeonButton>
        <NeonButton
          variant="holographic"
          size="lg"
          className="rounded-full w-16 h-16 shadow-2xl animate-pulse-slow"
          onClick={() => setActiveTab("gallery")}
        >
          <Heart className="w-6 h-6 kawaii-heart" />
        </NeonButton>
      </div>
    </div>
  )
}
