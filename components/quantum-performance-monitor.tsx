"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Monitor,
  Database,
} from "lucide-react"
import { motion } from "framer-motion"

interface PerformanceMetric {
  timestamp: string
  cpu: number
  memory: number
  network: number
  downloads: number
  apiLatency: number
  cacheHitRate: number
}

interface SystemHealth {
  overall: number
  cpu: number
  memory: number
  network: number
  storage: number
  apis: number
}

export function QuantumPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 95,
    cpu: 45,
    memory: 68,
    network: 92,
    storage: 34,
    apis: 98,
  })
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [quantumMode, setQuantumMode] = useState(false)

  useEffect(() => {
    // Generate initial metrics
    const initialMetrics = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      network: Math.random() * 100,
      downloads: Math.floor(Math.random() * 50),
      apiLatency: Math.random() * 1000,
      cacheHitRate: 80 + Math.random() * 20,
    }))
    setMetrics(initialMetrics)

    if (isMonitoring) {
      const interval = setInterval(() => {
        setMetrics((prev) => {
          const newMetric: PerformanceMetric = {
            timestamp: new Date().toLocaleTimeString(),
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 100,
            downloads: Math.floor(Math.random() * 50),
            apiLatency: Math.random() * 1000,
            cacheHitRate: 80 + Math.random() * 20,
          }
          return [...prev.slice(1), newMetric]
        })

        // Update system health
        setSystemHealth({
          overall: 90 + Math.random() * 10,
          cpu: 30 + Math.random() * 40,
          memory: 50 + Math.random() * 30,
          network: 85 + Math.random() * 15,
          storage: 20 + Math.random() * 40,
          apis: 95 + Math.random() * 5,
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const getHealthColor = (value: number) => {
    if (value >= 90) return "text-green-500"
    if (value >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthIcon = (value: number) => {
    if (value >= 90) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (value >= 70) return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    return <AlertTriangle className="w-4 h-4 text-red-500" />
  }

  const pieData = [
    { name: "CPU", value: systemHealth.cpu, color: "#8884d8" },
    { name: "Memory", value: systemHealth.memory, color: "#82ca9d" },
    { name: "Network", value: systemHealth.network, color: "#ffc658" },
    { name: "Storage", value: systemHealth.storage, color: "#ff7300" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Quantum Performance Monitor
            {quantumMode && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">QUANTUM</Badge>}
          </h2>
          <p className="text-muted-foreground">Real-time system performance and health monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantumMode(!quantumMode)}
            className={`${quantumMode ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-transparent"}`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quantum Mode
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsMonitoring(!isMonitoring)} className="bg-transparent">
            <RefreshCw className={`w-4 h-4 mr-2 ${isMonitoring ? "animate-spin" : ""}`} />
            {isMonitoring ? "Monitoring" : "Paused"}
          </Button>
        </div>
      </motion.div>

      {/* System Health Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card
          className={
            quantumMode ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950" : ""
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              System Health Overview
            </CardTitle>
            <CardDescription>Real-time performance metrics and system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getHealthIcon(systemHealth.overall)}
                    <span className="font-medium">Overall Health</span>
                  </div>
                  <span className={`text-2xl font-bold ${getHealthColor(systemHealth.overall)}`}>
                    {Math.round(systemHealth.overall)}%
                  </span>
                </div>
                <Progress value={systemHealth.overall} className="h-3" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">CPU Usage</span>
                  </div>
                  <span className="text-sm font-medium">{Math.round(systemHealth.cpu)}%</span>
                </div>
                <Progress value={systemHealth.cpu} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Memory</span>
                  </div>
                  <span className="text-sm font-medium">{Math.round(systemHealth.memory)}%</span>
                </div>
                <Progress value={systemHealth.memory} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Network</span>
                  </div>
                  <span className="text-sm font-medium">{Math.round(systemHealth.network)}%</span>
                </div>
                <Progress value={systemHealth.network} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {metrics.length > 0 ? metrics[metrics.length - 1].downloads : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    {metrics.length > 0 ? Math.round(metrics[metrics.length - 1].cacheHitRate) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Charts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Resources</CardTitle>
                  <CardDescription>CPU, Memory, and Network usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} name="CPU %" />
                      <Line type="monotone" dataKey="memory" stroke="#82ca9d" strokeWidth={2} name="Memory %" />
                      <Line type="monotone" dataKey="network" stroke="#ffc658" strokeWidth={2} name="Network %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Distribution</CardTitle>
                  <CardDescription>Current system resource allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Performance</CardTitle>
                <CardDescription>API latency and network throughput metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="apiLatency"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="API Latency (ms)"
                    />
                    <Area
                      type="monotone"
                      dataKey="network"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Network Usage %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Download Activity</CardTitle>
                <CardDescription>Active downloads and throughput over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="downloads" fill="#8884d8" name="Active Downloads" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold">
                        {metrics.length > 0 ? Math.round(metrics[metrics.length - 1].apiLatency) : 0}ms
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cache Efficiency</p>
                      <p className="text-2xl font-bold">
                        {metrics.length > 0 ? Math.round(metrics[metrics.length - 1].cacheHitRate) : 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold">0.2%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className="text-2xl font-bold">99.9%</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
                <CardDescription>AI-powered recommendations for optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Excellent Performance</p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Your system is running optimally with high cache hit rates and low latency.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Database className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Cache Optimization</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Consider increasing cache size to improve performance for frequently accessed images.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <Settings className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Memory Usage</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-300">
                        Memory usage is moderate. Consider enabling memory compression for better efficiency.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quantum Enhancement Panel */}
      {quantumMode && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quantum Enhancement Active
              </CardTitle>
              <CardDescription className="text-purple-100">
                Advanced AI-powered performance optimization is now active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">+47%</div>
                  <div className="text-sm text-purple-100">Performance Boost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">-23%</div>
                  <div className="text-sm text-purple-100">Latency Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">+89%</div>
                  <div className="text-sm text-purple-100">Cache Efficiency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
