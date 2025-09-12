"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleDownloadTab } from "./simple-download-tab"
import { GalleryTab } from "./gallery-tab"
import { SettingsTab } from "./settings-tab"
import { Heart, Download, ImageIcon, Settings, Sparkles, Zap } from "lucide-react"

export function HomeDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight neon-text animate-fade-in">Waifu Downloader Dashboard ✨</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="sparkle-effect kawaii-element">
            <Heart className="w-4 h-4 mr-1 kawaii-heart" />
            Kawaii Mode
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="material-card sparkle-effect energy-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground kawaii-heart" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="material-card sparkle-effect bubble-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground kawaii-heart" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">567</div>
            <p className="text-xs text-muted-foreground">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card className="material-card sparkle-effect animate-heartbeat">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground kawaii-heart" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">89</div>
            <p className="text-xs text-muted-foreground">+5 new favorites</p>
          </CardContent>
        </Card>

        <Card className="material-card sparkle-effect scan-lines">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground kawaii-heart" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold neon-text">Online</div>
            <p className="text-xs text-muted-foreground">All services operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="download" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 glass-effect">
          <TabsTrigger value="download" className="kawaii-element">
            <Download className="w-4 h-4 mr-2 kawaii-heart" />
            Download
          </TabsTrigger>
          <TabsTrigger value="gallery" className="kawaii-element">
            <ImageIcon className="w-4 h-4 mr-2 kawaii-heart" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="settings" className="kawaii-element">
            <Settings className="w-4 h-4 mr-2 kawaii-heart" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="download" className="space-y-4 animate-fade-in">
          <Card className="material-card circuit-pattern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 neon-text">
                <Sparkles className="w-5 h-5 kawaii-heart animate-spin-slow" />
                Quick Download
              </CardTitle>
              <CardDescription>Download your favorite waifu images with advanced filtering options</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleDownloadTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4 animate-fade-in">
          <Card className="material-card holographic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 neon-text">
                <ImageIcon className="w-5 h-5 kawaii-heart animate-bounce-slow" />
                Image Gallery
              </CardTitle>
              <CardDescription>Browse and manage your downloaded images</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 animate-fade-in">
          <Card className="material-card gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 neon-text">
                <Settings className="w-5 h-5 kawaii-heart animate-wiggle" />
                Settings & Configuration
              </CardTitle>
              <CardDescription>Customize your download preferences and API settings</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="material-card sparkle-effect">
          <CardHeader>
            <CardTitle className="text-lg neon-text">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full cyber-button" variant="default">
              <Heart className="w-4 h-4 mr-2 kawaii-heart" />
              Random Waifu
            </Button>
            <Button className="w-full cyber-button bg-transparent" variant="outline">
              <Sparkles className="w-4 h-4 mr-2 kawaii-heart" />
              Batch Download
            </Button>
          </CardContent>
        </Card>

        <Card className="material-card bubble-effect">
          <CardHeader>
            <CardTitle className="text-lg neon-text">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Downloaded 5 images</span>
                <Badge variant="secondary" className="kawaii-element">
                  New
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Added to favorites</span>
                <Badge variant="outline" className="kawaii-element">
                  2m ago
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="material-card energy-pulse">
          <CardHeader>
            <CardTitle className="text-lg neon-text">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used</span>
                <span>2.4 GB / 10 GB</span>
              </div>
              <Progress value={24} className="holographic" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
