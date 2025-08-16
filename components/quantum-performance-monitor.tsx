"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Clock,
  Database,
  Globe,
} from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface PerformanceMetric {
  timestamp: number
  cpu: number
  memory: number
  network: number
  downloads: number
}

interface SystemHealth {
  overall: number
  cpu: number
  memory: number
  network: number
  storage: number
  api: number
}

export function QuantumPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 95,
    cpu: 23,
    memory: 67,
    network: 89,
    storage: 45,
    api: 98,
  })
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Initialize with some sample data
    const initialData: PerformanceMetric[] = []
    const now = Date.now()

    for (let i = 29; i >= 0; i--) {
      initialData.push({
        timestamp: now - i * 2000, // 2 second intervals
        cpu: Math.random() * 40 + 10,
        memory: Math.random() * 30 + 40,
        network: Math.random() * 50 + 30,
        downloads: Math.floor(Math.random() * 10),
      })
    }

    setMetrics(initialData)

    if (isMonitoring) {
      const interval = setInterval(() => {
        setMetrics((prev) => {
          const newMetric: PerformanceMetric = {
            timestamp: Date.now(),
            cpu: Math.random() * 40 + 10,
            memory: Math.random() * 30 + 40,
            network: Math.random() * 50 + 30,
            downloads: Math.floor(Math.random() * 10),
          }

          return [...prev.slice(1), newMetric] // Keep last 30 points
        })

        // Update system health
        setSystemHealth((prev) => ({
          overall: Math.max(85, Math.min(100, prev.overall + (Math.random() - 0.5) * 5)),
          cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
          network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 6)),
          storage: Math.max(20, Math.min(80, prev.storage + (Math.random() - 0.5) * 4)),
          api: Math.max(90, Math.min(100, prev.api + (Math.random() - 0.5) * 3)),
        }))

        setLastUpdate(new Date())
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const getHealthColor = (value: number) => {
    if (value >= 90) return "text-green-500"
    if (value >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthBadge = (value: number) => {
    if (value >= 90) return { variant: "default" as const, text: "Excellent" }
    if (value >= 70) return { variant: "secondary" as const, text: "Good" }
    return { variant: "destructive" as const, text: "Poor" }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="material-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Zap className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl">Quantum Performance Monitor</CardTitle>
                <CardDescription>Real-time system performance and health monitoring</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge {...getHealthBadge(systemHealth.overall)}>{systemHealth.overall.toFixed(0)}% Health</Badge>
              <Button variant="outline" size="sm" onClick={() => setIsMonitoring(!isMonitoring)}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isMonitoring ? "animate-spin" : ""}`} />
                {isMonitoring ? "Monitoring" : "Paused"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getHealthColor(systemHealth.overall)}`}>
                {systemHealth.overall.toFixed(0)}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Health</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {metrics.length > 0 ? metrics[metrics.length - 1].downloads : 0}
              </div>
              <p className="text-sm text-muted-foreground">Active Downloads</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {((systemHealth.network / 100) * 150).toFixed(0)} Mbps
              </div>
              <p className="text-sm text-muted-foreground">Network Speed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <p className="text-sm text-muted-foreground">Last Update</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="material-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-sm">CPU Usage</CardTitle>
                </div>
                <Badge variant="outline" className={getHealthColor(systemHealth.cpu)}>
                  {systemHealth.cpu.toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={systemHealth.cpu} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Idle</span>
                  <span>Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="material-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-sm">Memory Usage</CardTitle>
                </div>
                <Badge variant="outline" className={getHealthColor(100 - systemHealth.memory)}>
                  {systemHealth.memory.toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={systemHealth.memory} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Free</span>
                  <span>Used</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="material-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-sm">Network</CardTitle>
                </div>
                <Badge variant="outline" className={getHealthColor(systemHealth.network)}>
                  {systemHealth.network.toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={systemHealth.network} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Offline</span>
                  <span>Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="material-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-sm">Storage</CardTitle>
                </div>
                <Badge variant="outline" className={getHealthColor(100 - systemHealth.storage)}>
                  {systemHealth.storage.toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={systemHealth.storage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Free</span>
                  <span>Used</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="material-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan-500" />
                  <CardTitle className="text-sm">API Health</CardTitle>
                </div>
                <Badge variant="outline" className={getHealthColor(systemHealth.api)}>
                  {systemHealth.api.toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={systemHealth.api} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Offline</span>
                  <span>Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="material-card hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-sm">System Load</CardTitle>
                </div>
                <Badge variant="outline" className={getHealthColor(100 - (systemHealth.cpu + systemHealth.memory) / 2)}>
                  {((systemHealth.cpu + systemHealth.memory) / 2).toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={(systemHealth.cpu + systemHealth.memory) / 2} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Light</span>
                  <span>Heavy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="realtime">Real-time Metrics</TabsTrigger>
            <TabsTrigger value="downloads">Download Activity</TabsTrigger>
            <TabsTrigger value="health">Health Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Real-time Performance
                </CardTitle>
                <CardDescription>Live system metrics over the last 60 seconds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="timestamp" tickFormatter={formatTime} className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        labelFormatter={(value) => formatTime(value as number)}
                        formatter={(value: number, name: string) => [
                          `${value.toFixed(1)}${name === "downloads" ? "" : "%"}`,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                      />
                      <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={false} name="CPU" />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        name="Memory"
                      />
                      <Line
                        type="monotone"
                        dataKey="network"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                        name="Network"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Download Activity
                </CardTitle>
                <CardDescription>Active downloads and throughput over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="timestamp" tickFormatter={formatTime} className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        labelFormatter={(value) => formatTime(value as number)}
                        formatter={(value: number) => [`${value}`, "Active Downloads"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="downloads"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="material-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  System Health Overview
                </CardTitle>
                <CardDescription>Comprehensive health metrics and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Health Scores</h3>
                      <div className="space-y-3">
                        {[
                          { name: "CPU Performance", value: 100 - systemHealth.cpu, icon: Cpu },
                          { name: "Memory Efficiency", value: 100 - systemHealth.memory, icon: Database },
                          { name: "Network Stability", value: systemHealth.network, icon: Wifi },
                          { name: "Storage Health", value: 100 - systemHealth.storage, icon: HardDrive },
                          { name: "API Reliability", value: systemHealth.api, icon: Globe },
                        ].map((metric) => (
                          <div key={metric.name} className="flex items-center gap-3">
                            <metric.icon className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{metric.name}</span>
                                <span className={getHealthColor(metric.value)}>{metric.value.toFixed(0)}%</span>
                              </div>
                              <Progress value={metric.value} className="h-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Recommendations</h3>
                      <div className="space-y-3">
                        {systemHealth.cpu > 80 && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">High CPU Usage</p>
                              <p className="text-muted-foreground">Consider reducing concurrent downloads</p>
                            </div>
                          </div>
                        )}

                        {systemHealth.memory > 85 && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">High Memory Usage</p>
                              <p className="text-muted-foreground">Clear cache or restart application</p>
                            </div>
                          </div>
                        )}

                        {systemHealth.network < 70 && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">Network Issues</p>
                              <p className="text-muted-foreground">Check internet connection</p>
                            </div>
                          </div>
                        )}

                        {systemHealth.overall > 90 && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">System Running Optimally</p>
                              <p className="text-muted-foreground">All systems are performing well</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Last updated: {lastUpdate.toLocaleString()}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
