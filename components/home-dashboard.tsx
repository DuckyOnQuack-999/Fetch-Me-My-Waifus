"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, ImageIcon, Folder, TrendingUp, Clock, Star } from "lucide-react"
import { AnimatedStats } from "./animated-stats"
import { SumptuousHeart } from "./sumptuous-heart"

export function HomeDashboard() {
  const stats = [
    { label: "Total Downloads", value: 1247, icon: Download, color: "text-blue-500" },
    { label: "Favorites", value: 89, icon: Heart, color: "text-pink-500" },
    { label: "Collections", value: 12, icon: Folder, color: "text-green-500" },
    { label: "This Week", value: 34, icon: TrendingUp, color: "text-purple-500" },
  ]

  const recentDownloads = [
    { name: "cute_neko_001.jpg", time: "2 minutes ago", source: "waifu.pics" },
    { name: "anime_girl_042.png", time: "15 minutes ago", source: "nekos.best" },
    { name: "kawaii_waifu_123.jpg", time: "1 hour ago", source: "waifu.im" },
  ]

  const quickActions = [
    { label: "Quick Download", icon: Download, description: "Start downloading immediately" },
    { label: "Browse Gallery", icon: ImageIcon, description: "View your collection" },
    { label: "Manage Collections", icon: Folder, description: "Organize your images" },
    { label: "View Favorites", icon: Heart, description: "See your liked images" },
  ]

  return (
    <div className="space-y-6 hero-gradient min-h-screen p-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex justify-center mb-6">
          <SumptuousHeart size={80} className="animate-float" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gradient glow-text">Waifu Fetcher</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your ultimate destination for downloading and organizing beautiful anime artwork
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="glow">
            <Download className="mr-2 h-5 w-5" />
            Start Downloading
          </Button>
          <Button size="lg" variant="outline" className="backdrop-blur-glass bg-transparent">
            <ImageIcon className="mr-2 h-5 w-5" />
            Browse Gallery
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="material-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <AnimatedStats value={stat.value} className="text-2xl font-bold" />
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <Star className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform bg-transparent"
              >
                <action.icon className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gradient">
              <Clock className="h-5 w-5" />
              Recent Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDownloads.map((download, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{download.name}</p>
                      <p className="text-xs text-muted-foreground">{download.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{download.source}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gradient">
              <TrendingUp className="h-5 w-5" />
              Popular Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "waifu.pics", count: 456, percentage: 85 },
                { name: "nekos.best", count: 234, percentage: 65 },
                { name: "waifu.im", count: 123, percentage: 45 },
                { name: "wallhaven", count: 89, percentage: 30 },
              ].map((source) => (
                <div key={source.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{source.name}</span>
                    <span className="text-muted-foreground">{source.count} downloads</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
