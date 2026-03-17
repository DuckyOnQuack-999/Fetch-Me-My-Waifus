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
  Wifi,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: "excellent" | "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  icon: React.ElementType
  color: string
  bgColor: string
}

interface SystemHealth {
  overall: number
  cpu: number
  memory: number
  network: number
  storage: number
}

export function QuantumPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 95,
    cpu: 23,
    memory: 67,
    network: 89,
    storage: 45,
  })
  const [isMonitoring, setIsMonitoring] = useState(true)

  // Simulate real-time performance data
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics: PerformanceMetric[] = [
        {
          name: "CPU Usage",
          value: Math.random() * 100,
          unit: "%",
          status: Math.random() > 0.8 ? "warning" : "good",
          trend: Math.random() > 0.5 ? "up" : "down",
          icon: Cpu,
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
          name: "Memory Usage",
          value: 45 + Math.random() * 30,
          unit: "%",
          status: "good",
          trend: "stable",
          icon: Database,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
          name: "Network Speed",
          value: 80 + Math.random() * 20,
          unit: "Mbps",
          status: "excellent",
          trend: "up",
          icon: Wifi,
          color: "text-purple-600",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
          name: "Storage I/O",
          value: 30 + Math.random() * 40,
          unit: "MB/s",
          status: Math.random() > 0.7 ? "warning" : "good",
          trend: Math.random() > 0.6 ? "up" : "down",
          icon: HardDrive,
          color: "text-orange-600",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
        },
        {
          name: "API Response",
          value: 50 + Math.random() * 200,
          unit: "ms",
          status: Math.random() > 0.8 ? "critical" : "excellent",
          trend: Math.random() > 0.4 ? "down" : "up",
          icon: Zap,
          color: "text-pink-600",
          bgColor: "bg-pink-50 dark:bg-pink-900/20",
        },
        {
          name: "Download Rate",
          value: 5 + Math.random() * 15,
          unit: "MB/s",
          status: "excellent",
          trend: "up",
          icon: TrendingUp,
          color: "text-cyan-600",
          bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
        },
      ]

      setMetrics(newMetrics)

      // Update system health
      setSystemHealth({
        overall: 85 + Math.random() * 15,
        cpu: 20 + Math.random() * 30,
        memory: 60 + Math.random() * 20,
        network: 80 + Math.random() * 20,
        storage: 40 + Math.random() * 20,
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 2000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "border-green-500 bg-green-50 dark:bg-green-900/20"
      case "good":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      case "warning":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-900/20"
      default:
        return "border-gray-300 bg-gray-50 dark:bg-gray-900/20"
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
          <h2 className="text-2xl font-bold tracking-tight">Quantum Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time system performance and health metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isMonitoring ? "default" : "secondary"} className="gap-1">
            <div className={cn("w-2 h-2 rounded-full", isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            {isMonitoring ? "Live Monitoring" : "Paused"}
          </Badge>
        </div>
      </motion.div>

      {/* System Health Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Overview
            </CardTitle>
            <CardDescription>Overall system performance at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Health</span>
                <span className="text-2xl font-bold text-primary">{systemHealth.overall.toFixed(1)}%</span>
              </div>
              <Progress value={systemHealth.overall} className="h-3" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {[
                  { name: "CPU", value: systemHealth.cpu, icon: Cpu, color: "text-blue-600" },
                  { name: "Memory", value: systemHealth.memory, icon: Database, color: "text-green-600" },
                  { name: "Network", value: systemHealth.network, icon: Wifi, color: "text-purple-600" },
                  { name: "Storage", value: systemHealth.storage, icon: HardDrive, color: "text-orange-600" },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center space-y-2"
                  >
                    <div className={`mx-auto w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="text-xs text-muted-foreground">{item.name}</div>
                    <div className="text-sm font-bold">{item.value.toFixed(0)}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn("border-l-4", getStatusColor(metric.status))}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(metric.status)}
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-md ${metric.bgColor}`}>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {metric.value.toFixed(metric.name === "API Response" ? 0 : 1)}
                            </div>
                            <div className="text-xs text-muted-foreground">{metric.unit}</div>
                          </div>
                        </div>

                        {metric.name !== "API Response" && (
                          <div className="mt-3">
                            <Progress value={Math.min(metric.value, 100)} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="historical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Performance History
                </CardTitle>
                <CardDescription>System performance over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-green-600">99.2%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-blue-600">156ms</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-purple-600">12.4MB/s</div>
                      <div className="text-sm text-muted-foreground">Peak Download</div>
                    </div>
                  </div>

                  <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Performance chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  System Alerts
                </CardTitle>
                <CardDescription>Recent performance alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: "warning",
                      message: "High CPU usage detected",
                      time: "2 minutes ago",
                      resolved: false,
                    },
                    {
                      type: "info",
                      message: "Network optimization completed",
                      time: "15 minutes ago",
                      resolved: true,
                    },
                    {
                      type: "success",
                      message: "System health check passed",
                      time: "1 hour ago",
                      resolved: true,
                    },
                  ].map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          alert.type === "warning"
                            ? "bg-yellow-500"
                            : alert.type === "info"
                              ? "bg-blue-500"
                              : "bg-green-500",
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                      <Badge variant={alert.resolved ? "secondary" : "destructive"} className="text-xs">
                        {alert.resolved ? "Resolved" : "Active"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
