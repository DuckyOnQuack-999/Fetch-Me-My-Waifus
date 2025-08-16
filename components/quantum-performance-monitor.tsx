"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { motion } from "framer-motion"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  icon: React.ComponentType<any>
}

export function QuantumPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: "CPU Usage",
      value: 45,
      unit: "%",
      status: "good",
      trend: "stable",
      icon: Cpu,
    },
    {
      name: "Memory Usage",
      value: 68,
      unit: "%",
      status: "warning",
      trend: "up",
      icon: MemoryStick,
    },
    {
      name: "Disk Usage",
      value: 32,
      unit: "%",
      status: "good",
      trend: "down",
      icon: HardDrive,
    },
    {
      name: "Network I/O",
      value: 156,
      unit: "MB/s",
      status: "good",
      trend: "up",
      icon: Network,
    },
  ])

  const [systemHealth, setSystemHealth] = useState(92)
  const [quantumEfficiency, setQuantumEfficiency] = useState(87)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
          status: metric.value > 80 ? "critical" : metric.value > 60 ? "warning" : "good",
          trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable",
        })),
      )

      setSystemHealth((prev) => Math.max(80, Math.min(100, prev + (Math.random() - 0.5) * 5)))
      setQuantumEfficiency((prev) => Math.max(70, Math.min(100, prev + (Math.random() - 0.5) * 8)))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Quantum Performance Monitor
          </h2>
          <p className="text-muted-foreground">Real-time system performance and optimization metrics</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3 w-3" />
          Live Monitoring
        </Badge>
      </motion.div>

      {/* System Health Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Overview
            </CardTitle>
            <CardDescription>Overall system performance and quantum efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">System Health</span>
                  <span className="text-2xl font-bold text-primary">{systemHealth.toFixed(1)}%</span>
                </div>
                <Progress value={systemHealth} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {systemHealth > 90 ? "Excellent" : systemHealth > 70 ? "Good" : "Needs Attention"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Quantum Efficiency</span>
                  <span className="text-2xl font-bold text-purple-600">{quantumEfficiency.toFixed(1)}%</span>
                </div>
                <Progress value={quantumEfficiency} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {quantumEfficiency > 85 ? "Optimal" : quantumEfficiency > 70 ? "Stable" : "Suboptimal"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">{metric.name}</CardTitle>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  </div>

                  <Progress
                    value={metric.name === "Network I/O" ? (metric.value / 200) * 100 : metric.value}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className="text-xs text-muted-foreground capitalize">{metric.trend}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Analytics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Performance Data</CardTitle>
                <CardDescription>Live system metrics and quantum processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-blue-600">1.2k</div>
                      <div className="text-sm text-muted-foreground">API Requests/min</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-purple-600">45ms</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Quantum Processing Threads</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-sm font-mono w-16">Thread {i + 1}</span>
                          <Progress value={Math.random() * 100} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-12">
                            {(Math.random() * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
                <CardDescription>Performance trends over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Historical data visualization would appear here</p>
                    <p className="text-sm">Charts showing performance trends over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to improve system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-400">Memory Optimization</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Consider clearing unused cache to free up 15% memory
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Network Optimization</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Enable connection pooling to reduce API response times by ~20ms
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-400">Quantum Enhancement</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Quantum processing efficiency can be improved by 12% with thread rebalancing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
