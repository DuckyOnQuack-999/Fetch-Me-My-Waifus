"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Download, Settings, Heart, Star, Cpu } from "lucide-react"

export default function CyberpunkShowcase() {
  const [progress, setProgress] = useState(65)
  const [glitchText, setGlitchText] = useState(false)

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-6xl font-bold text-gradient animate-float">NEON ECLIPSE</h1>
        <p className="text-xl text-muted-foreground font-mono">{"> CYBERPUNK WAIFU DOWNLOADER INTERFACE"}</p>
        <div className="flex justify-center gap-4">
          <Button className="cyber-btn">
            <Zap className="w-4 h-4" />
            INITIALIZE
          </Button>
          <Button variant="outline" className="glass-effect bg-transparent">
            <Settings className="w-4 h-4" />
            CONFIGURE
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">DOWNLOADS</CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">1,337</div>
            <p className="text-xs text-muted-foreground font-mono">+20.1% from last session</p>
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">FAVORITES</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">420</div>
            <p className="text-xs text-muted-foreground font-mono">+12.5% this week</p>
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-mono">SYSTEM STATUS</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">ONLINE</div>
            <p className="text-xs text-muted-foreground font-mono">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient">DOWNLOAD INTERFACE</CardTitle>
            <CardDescription className="font-mono">Configure your waifu acquisition parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-primary">API ENDPOINT</label>
              <Input
                className="cyber-input font-mono"
                placeholder="waifu.pics/api/sfw/waifu"
                defaultValue="waifu.pics/api/sfw/waifu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-primary">BATCH SIZE</label>
              <Input className="cyber-input font-mono" type="number" placeholder="10" defaultValue="10" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-primary">PROGRESS</label>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>{progress}% COMPLETE</span>
                <span>ETA: 2:34</span>
              </div>
            </div>

            <Button className="w-full cyber-btn" onClick={() => setProgress(Math.min(100, progress + 10))}>
              <Download className="w-4 h-4" />
              EXECUTE DOWNLOAD
            </Button>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient">SYSTEM LOGS</CardTitle>
            <CardDescription className="font-mono">Real-time system monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  INFO
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:01] API connection established</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  DEBUG
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:02] Parsing image metadata...</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  WARN
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:03] Rate limit approaching</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                  SUCCESS
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:04] Download completed: waifu_001.jpg</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-red-400 border-red-400 ${glitchText ? "animate-glitch" : ""}`}
                >
                  ERROR
                </Badge>
                <span
                  className={`text-muted-foreground cursor-pointer ${glitchText ? "animate-glitch" : ""}`}
                  onClick={() => setGlitchText(!glitchText)}
                >
                  [2024-01-15 14:32:05] Network anomaly detected
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-black/50 rounded border border-primary/30">
              <div className="text-xs font-mono text-primary animate-pulse-neon">{"> NEURAL NETWORK ACTIVE"}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{"  Analyzing image patterns..."}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Showcase */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="font-mono text-gradient flex items-center gap-2">
            <Star className="w-5 h-5" />
            NEON ECLIPSE FEATURES
          </CardTitle>
          <CardDescription className="font-mono">Advanced cyberpunk interface capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🌟</div>
              <h3 className="font-mono text-sm text-primary">NEON GLOW</h3>
              <p className="text-xs text-muted-foreground font-mono">Dynamic lighting effects</p>
            </div>

            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-mono text-sm text-primary">CYBER BUTTONS</h3>
              <p className="text-xs text-muted-foreground font-mono">Futuristic interactions</p>
            </div>

            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🔮</div>
              <h3 className="font-mono text-sm text-primary">GLASS MORPHISM</h3>
              <p className="text-xs text-muted-foreground font-mono">Translucent surfaces</p>
            </div>

            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-mono text-sm text-primary">PARTICLE FX</h3>
              <p className="text-xs text-muted-foreground font-mono">Animated backgrounds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
