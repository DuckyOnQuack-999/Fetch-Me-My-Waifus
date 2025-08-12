"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Heart, ImageIcon, Settings, Folder, Zap } from "lucide-react"
import { useDownload } from "@/context/downloadContext"
import { useStorage } from "@/context/storageContext"
import { FeatureCard } from "./feature-card"
import { AnimatedStats } from "./animated-stats"
import { WaifuDownloaderLogo } from "./waifu-downloader-logo"
import Link from "next/link"

export function HomeDashboard() {
  const { totalDownloads, downloadQueue } = useDownload()
  const { favorites, collections } = useStorage()

  const stats = [
    { label: "Total Downloads", value: totalDownloads, icon: Download },
    { label: "Favorites", value: favorites.length, icon: Heart },
    { label: "Collections", value: Object.keys(collections).length, icon: Folder },
    { label: "Active Downloads", value: downloadQueue.length, icon: Zap },
  ]

  const features = [
    {
      icon: Download,
      title: "Multi-Source Downloads",
      description: "Download from multiple anime image APIs with advanced filtering and sorting options.",
    },
    {
      icon: Heart,
      title: "Favorites & Collections",
      description: "Organize your favorite images into custom collections with drag-and-drop functionality.",
    },
    {
      icon: ImageIcon,
      title: "Gallery Management",
      description: "Browse, preview, and manage your downloaded images with an intuitive gallery interface.",
    },
    {
      icon: Settings,
      title: "Advanced Settings",
      description: "Customize download paths, API keys, concurrent downloads, and more.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <WaifuDownloaderLogo size={80} className="text-primary" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Waifu Downloader
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate tool for downloading and managing your favorite anime images from multiple sources
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/gallery">
                <Download className="w-5 h-5 mr-2" />
                Start Downloading
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/settings">
                <Settings className="w-5 h-5 mr-2" />
                Configure Settings
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Your Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedStats
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Quick Actions</CardTitle>
              <CardDescription className="text-center">Jump right into your favorite features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-16 bg-transparent">
                  <Link href="/gallery" className="flex flex-col gap-2">
                    <ImageIcon className="w-6 h-6" />
                    Browse Gallery
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 bg-transparent">
                  <Link href="/favorites" className="flex flex-col gap-2">
                    <Heart className="w-6 h-6" />
                    View Favorites
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 bg-transparent">
                  <Link href="/collections" className="flex flex-col gap-2">
                    <Folder className="w-6 h-6" />
                    Manage Collections
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
