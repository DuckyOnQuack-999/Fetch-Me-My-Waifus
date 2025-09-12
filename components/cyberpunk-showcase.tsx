"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Zap,
  Download,
  Settings,
  Heart,
  Star,
  Cpu,
  Terminal,
  Shield,
  Eye,
  Filter,
  Activity,
  AlertTriangle,
} from "lucide-react"

export default function CyberpunkShowcase() {
  const [progress, setProgress] = useState(65)
  const [glitchText, setGlitchText] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [customTags, setCustomTags] = useState("")
  const [downloadCount, setDownloadCount] = useState(1337)
  const [systemLoad, setSystemLoad] = useState(42)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadCount((prev) => prev + Math.floor(Math.random() * 3))
      setSystemLoad((prev) => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 10)))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-6 space-y-8 scrollbar-cyber">
      {/* Particles.js Integration */}
      <div id="particles-js" className="fixed inset-0 pointer-events-none z-[-1]" />

      {/* Hero Section with Enhanced Styling */}
      <div className="text-center space-y-6 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent blur-3xl" />
        <h1 className="text-8xl font-bold text-gradient animate-float relative z-10">NEON ECLIPSE v2</h1>
        <p className="text-2xl text-neon font-mono relative z-10">{"> ENHANCED CYBERPUNK WAIFU ACQUISITION SYSTEM"}</p>
        <div className="text-sm font-mono text-muted-foreground relative z-10">
          {"[NEURAL NETWORK ACTIVE] [QUANTUM PROCESSING ENABLED] [Y2K FUSION PROTOCOL]"}
        </div>

        <div className="flex justify-center gap-6 relative z-10">
          <Button className="cyber-btn px-8 py-4 text-lg">
            <Zap className="w-5 h-5 mr-2" />
            INITIALIZE MATRIX
          </Button>
          <Button
            variant="outline"
            className="glass-effect bg-transparent px-8 py-4 text-lg border-2 border-red-500/50 hover:border-red-500"
          >
            <Settings className="w-5 h-5 mr-2" />
            CONFIGURE NEURAL NET
          </Button>
        </div>
      </div>

      {/* System Status Bar */}
      <Card className="material-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
                <span className="font-mono text-sm">{isOnline ? "NEURAL LINK ACTIVE" : "CONNECTION LOST"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="font-mono text-sm">CPU: {systemLoad}%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400 font-mono">
                QUANTUM READY
              </Badge>
              <Badge variant="outline" className="text-pink-400 border-pink-400 font-mono">
                Y2K FUSION
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono text-neon">DOWNLOADS</CardTitle>
            <Download className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gradient font-mono">{downloadCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground font-mono">+∞ NEURAL EFFICIENCY</p>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono text-neon">FAVORITES</CardTitle>
            <Heart className="h-5 w-5 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gradient font-mono">420</div>
            <p className="text-xs text-muted-foreground font-mono">QUANTUM CURATED</p>
            <Progress value={92} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono text-neon">NEURAL STATUS</CardTitle>
            <Cpu className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 font-mono">ONLINE</div>
            <p className="text-xs text-muted-foreground font-mono">ALL SYSTEMS OPTIMAL</p>
            <Progress value={100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="material-card glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono text-neon">SECURITY</CardTitle>
            <Shield className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gradient font-mono">SECURE</div>
            <p className="text-xs text-muted-foreground font-mono">QUANTUM ENCRYPTED</p>
            <Progress value={100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Interactive Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Download Configuration Panel */}
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              NEURAL ACQUISITION INTERFACE
            </CardTitle>
            <CardDescription className="font-mono text-neon">Configure quantum waifu parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Endpoint */}
            <div className="space-y-2">
              <Label className="text-sm font-mono text-red-400">API NEURAL ENDPOINT</Label>
              <Input
                className="cyber-input font-mono"
                placeholder="waifu.pics/api/sfw/waifu"
                defaultValue="waifu.pics/api/sfw/waifu"
              />
            </div>

            {/* Custom Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-mono text-pink-400">CUSTOM NEURAL TAGS</Label>
              <Textarea
                className="cyber-input font-mono min-h-[100px]"
                placeholder="Enter custom tags separated by commas..."
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground font-mono">
                Example: cyberpunk, neon, futuristic, android, hologram
              </p>
            </div>

            {/* Batch Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-mono text-blue-400">BATCH SIZE</Label>
                <Input className="cyber-input font-mono" type="number" placeholder="10" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-mono text-purple-400">QUALITY</Label>
                <Input className="cyber-input font-mono" placeholder="4K" defaultValue="4K" />
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-mono text-green-400">NEURAL ENHANCEMENT</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-mono text-orange-400">QUANTUM FILTERING</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-mono text-cyan-400">Y2K FUSION MODE</Label>
                <Switch defaultChecked />
              </div>
            </div>

            {/* Progress Display */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-mono text-red-400">NEURAL PROGRESS</Label>
                <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>QUANTUM PROCESSING...</span>
                <span>ETA: 2:34</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="cyber-btn" onClick={() => setProgress(Math.min(100, progress + 15))}>
                <Download className="w-4 h-4 mr-2" />
                EXECUTE
              </Button>
              <Button variant="outline" className="glass-effect bg-transparent border-2 border-pink-500/50">
                <Filter className="w-4 h-4 mr-2" />
                FILTER
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Monitoring Panel */}
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient flex items-center gap-2">
              <Eye className="w-5 h-5" />
              NEURAL SYSTEM LOGS
            </CardTitle>
            <CardDescription className="font-mono text-neon">Real-time quantum monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Log Entries */}
            <div className="space-y-3 font-mono text-sm max-h-64 overflow-y-auto scrollbar-cyber">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                  INFO
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:01] Neural link established</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                  DEBUG
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:02] Quantum parsing initiated...</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
                  WARN
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:03] Neural load approaching threshold</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-pink-400 border-pink-400 text-xs">
                  SUCCESS
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:04] Quantum download: waifu_001.jpg</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`text-red-400 border-red-400 text-xs ${glitchText ? "animate-glitch" : ""}`}
                >
                  ERROR
                </Badge>
                <span
                  className={`text-muted-foreground cursor-pointer ${glitchText ? "text-destructive" : ""}`}
                  onClick={() => setGlitchText(!glitchText)}
                  data-text="[2024-01-15 14:32:05] Neural anomaly detected"
                >
                  [2024-01-15 14:32:05] Neural anomaly detected
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                  QUANTUM
                </Badge>
                <span className="text-muted-foreground">[2024-01-15 14:32:06] Y2K fusion protocol active</span>
              </div>
            </div>

            {/* Neural Network Status */}
            <div className="cyber-notification p-4 rounded-lg">
              <div className="text-sm font-mono text-red-400 animate-pulse">{"> NEURAL NETWORK ACTIVE"}</div>
              <div className="text-xs font-mono text-muted-foreground mt-2">{"  Analyzing quantum patterns..."}</div>
              <div className="text-xs font-mono text-pink-400 mt-1">{"  Y2K fusion protocols engaged"}</div>
            </div>

            {/* System Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-effect p-3 rounded-lg">
                <div className="text-xs font-mono text-blue-400">CPU LOAD</div>
                <div className="text-lg font-mono text-gradient">{systemLoad}%</div>
              </div>
              <div className="glass-effect p-3 rounded-lg">
                <div className="text-xs font-mono text-green-400">MEMORY</div>
                <div className="text-lg font-mono text-gradient">2.1GB</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Showcase Grid */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="font-mono text-gradient flex items-center gap-2">
            <Star className="w-6 h-6" />
            NEON ECLIPSE v2 QUANTUM FEATURES
          </CardTitle>
          <CardDescription className="font-mono text-neon">
            Advanced cyberpunk neural interface capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-effect p-6 rounded-lg text-center group hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:animate-pulse">🌟</div>
              <h3 className="font-mono text-sm text-red-400 mb-2">NEON GLOW</h3>
              <p className="text-xs text-muted-foreground font-mono">Dynamic quantum lighting</p>
            </div>

            <div className="glass-effect p-6 rounded-lg text-center group hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:animate-pulse">⚡</div>
              <h3 className="font-mono text-sm text-pink-400 mb-2">CYBER BUTTONS</h3>
              <p className="text-xs text-muted-foreground font-mono">Neural interactions</p>
            </div>

            <div className="glass-effect p-6 rounded-lg text-center group hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:animate-pulse">🔮</div>
              <h3 className="font-mono text-sm text-blue-400 mb-2">GLASS MORPHISM</h3>
              <p className="text-xs text-muted-foreground font-mono">Quantum surfaces</p>
            </div>

            <div className="glass-effect p-6 rounded-lg text-center group hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:animate-pulse">🎯</div>
              <h3 className="font-mono text-sm text-purple-400 mb-2">Y2K FUSION</h3>
              <p className="text-xs text-muted-foreground font-mono">Chrome particle FX</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Demonstration */}
      {glitchText && (
        <Card className="material-card border-red-500">
          <CardHeader>
            <CardTitle className="font-mono text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              NEURAL ANOMALY DETECTED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive font-mono text-lg" data-text="QUANTUM INTERFERENCE DETECTED">
              QUANTUM INTERFERENCE DETECTED
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-2">Attempting neural recalibration...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
