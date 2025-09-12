"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, Heart, ImageIcon, TrendingUp, Zap, Activity, Database, Cpu, Wifi, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function HomeDashboard() {
  const [stats, setStats] = useState({
    totalImages: 1337,
    favorites: 420,
    downloads: 2048,
    active: 7,
  })

  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 42,
    memoryUsage: 68,
    networkSpeed: 125,
    storageUsed: 85,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalImages: prev.totalImages + Math.floor(Math.random() * 3),
        downloads: prev.downloads + Math.floor(Math.random() * 2),
      }))

      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkSpeed: Math.max(50, Math.min(200, prev.networkSpeed + (Math.random() - 0.5) * 20)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: "TOTAL IMAGES",
      value: stats.totalImages.toLocaleString(),
      icon: ImageIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      progress: 78,
    },
    {
      title: "FAVORITES",
      value: stats.favorites.toLocaleString(),
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      progress: 92,
    },
    {
      title: "DOWNLOADS",
      value: stats.downloads.toLocaleString(),
      icon: Download,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      progress: 85,
    },
    {
      title: "ACTIVE",
      value: stats.active.toString(),
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      progress: 65,
    },
  ]

  const systemCards = [
    {
      title: "CPU USAGE",
      value: `${systemMetrics.cpuUsage}%`,
      icon: Cpu,
      color: "text-red-400",
      progress: systemMetrics.cpuUsage,
    },
    {
      title: "MEMORY",
      value: `${systemMetrics.memoryUsage}%`,
      icon: Database,
      color: "text-purple-400",
      progress: systemMetrics.memoryUsage,
    },
    {
      title: "NETWORK",
      value: `${systemMetrics.networkSpeed} MB/s`,
      icon: Wifi,
      color: "text-cyan-400",
      progress: (systemMetrics.networkSpeed / 200) * 100,
    },
    {
      title: "STORAGE",
      value: `${systemMetrics.storageUsed}%`,
      icon: Activity,
      color: "text-yellow-400",
      progress: systemMetrics.storageUsed,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gradient font-mono">NEURAL DASHBOARD</h2>
        <p className="text-lg text-neon font-mono">{"> QUANTUM WAIFU MANAGEMENT SYSTEM"}</p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-green-400 border-green-400 font-mono">
            <Zap className="w-3 h-3 mr-1" />
            NEURAL ACTIVE
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400 font-mono">
            <Star className="w-3 h-3 mr-1" />
            QUANTUM READY
          </Badge>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="material-card glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-mono text-neon">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gradient font-mono mb-2">{stat.value}</div>
                <Progress value={stat.progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground font-mono">QUANTUM EFFICIENCY: {stat.progress}%</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* System Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient flex items-center gap-2">
              <Activity className="w-5 h-5" />
              SYSTEM NEURAL METRICS
            </CardTitle>
            <CardDescription className="font-mono text-neon">Real-time quantum system monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemCards.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-effect p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-xs font-mono text-muted-foreground">{metric.title}</span>
                  </div>
                  <div className="text-lg font-bold text-gradient font-mono mb-2">{metric.value}</div>
                  <Progress value={metric.progress} className="h-1" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient">QUICK DOWNLOAD</CardTitle>
            <CardDescription className="font-mono text-neon">Instant neural acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full cyber-btn">
              <Download className="w-4 h-4 mr-2" />
              EXECUTE DOWNLOAD
            </Button>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient">FAVORITES</CardTitle>
            <CardDescription className="font-mono text-neon">Quantum curated collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full glass-effect bg-transparent border-2 border-pink-500/50">
              <Heart className="w-4 h-4 mr-2" />
              VIEW FAVORITES
            </Button>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient">GALLERY</CardTitle>
            <CardDescription className="font-mono text-neon">Neural image matrix</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full glass-effect bg-transparent border-2 border-blue-500/50">
              <ImageIcon className="w-4 h-4 mr-2" />
              OPEN GALLERY
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="font-mono text-gradient flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              RECENT NEURAL ACTIVITY
            </CardTitle>
            <CardDescription className="font-mono text-neon">Latest quantum operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Downloaded: cyberpunk_waifu_001.jpg</span>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>

              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                  <span>Added to favorites: neon_android_girl.png</span>
                </div>
                <span className="text-xs text-muted-foreground">5 min ago</span>
              </div>

              <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>Neural scan completed: 47 new images</span>
                </div>
                <span className="text-xs text-muted-foreground">12 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
