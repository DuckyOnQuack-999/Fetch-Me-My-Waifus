"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Heart, Image, Zap, Activity, Database, Wifi, HardDrive, Cpu } from "lucide-react"
import { SimpleDownloadTab } from "./simple-download-tab"
import { GalleryTab } from "./gallery-tab"
import { SettingsTab } from "./settings-tab"

export function HomeDashboard() {
  const [stats, setStats] = useState({
    totalDownloads: 1337,
    favorites: 420,
    collections: 69,
    storageUsed: 75,
  })

  const [systemStatus, setSystemStatus] = useState({
    api: "online",
    storage: "optimal",
    network: "stable",
    cpu: "normal",
  })

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Cyberpunk Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient animate-float font-mono">WAIFU DOWNLOADER</h1>
        <p className="text-lg text-muted-foreground font-mono">{"> NEURAL NETWORK INTERFACE v2.0"}</p>
        <div className="flex justify-center">
          <Badge className="cyber-notification font-mono">SYSTEM ONLINE</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-primary">DOWNLOADS</CardTitle>
            <Download className="h-4 w-4 text-primary animate-pulse-neon" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient font-mono">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground font-mono">+20.1% from last session</p>
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-primary">FAVORITES</CardTitle>
            <Heart className="h-4 w-4 text-primary animate-pulse-neon" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient font-mono">{stats.favorites}</div>
            <p className="text-xs text-muted-foreground font-mono">+12.5% this week</p>
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-primary">COLLECTIONS</CardTitle>
            <Image className="h-4 w-4 text-primary animate-pulse-neon" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient font-mono">{stats.collections}</div>
            <p className="text-xs text-muted-foreground font-mono">+5 new collections</p>
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono text-primary">STORAGE</CardTitle>
            <HardDrive className="h-4 w-4 text-primary animate-pulse-neon" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient font-mono">{stats.storageUsed}%</div>
            <Progress value={stats.storageUsed} className="mt-2" />
            <p className="text-xs text-muted-foreground font-mono mt-1">2.1GB / 2.8GB used</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="font-mono text-gradient flex items-center gap-2">
            <Activity className="w-5 h-5" />
            SYSTEM STATUS
          </CardTitle>
          <CardDescription className="font-mono">Real-time monitoring of all subsystems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-effect p-3 rounded-lg text-center">
              <Wifi className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-sm font-mono text-green-400">API</div>
              <div className="text-xs font-mono text-muted-foreground">ONLINE</div>
            </div>

            <div className="glass-effect p-3 rounded-lg text-center">
              <Database className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-sm font-mono text-blue-400">STORAGE</div>
              <div className="text-xs font-mono text-muted-foreground">OPTIMAL</div>
            </div>

            <div className="glass-effect p-3 rounded-lg text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-sm font-mono text-yellow-400">NETWORK</div>
              <div className="text-xs font-mono text-muted-foreground">STABLE</div>
            </div>

            <div className="glass-effect p-3 rounded-lg text-center">
              <Cpu className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-mono text-primary">CPU</div>
              <div className="text-xs font-mono text-muted-foreground">NORMAL</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="font-mono text-gradient">NEURAL INTERFACE</CardTitle>
          <CardDescription className="font-mono">Access all waifu acquisition protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="download" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-effect">
              <TabsTrigger value="download" className="font-mono">
                DOWNLOAD
              </TabsTrigger>
              <TabsTrigger value="gallery" className="font-mono">
                GALLERY
              </TabsTrigger>
              <TabsTrigger value="settings" className="font-mono">
                SETTINGS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="mt-6">
              <SimpleDownloadTab />
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <GalleryTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
