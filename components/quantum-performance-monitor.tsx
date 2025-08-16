"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Settings,
  BarChart3,
  Monitor,
} from "lucide-react"
import { motion } from "framer-motion"

interface PerformanceMetrics {
  cpu: number
  memory: number
  network: number
  diskIO: number
  quantumEfficiency: number
  apiResponseTime: number
  downloadSpeed: number
  errorRate: number
}

interface SystemHealth {
  overall: number
  status: "excellent" | "good" | "warning" | "critical"
  recommendations: string[]
}

export function QuantumPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 45,
    memory: 62,
    network: 78,
    diskIO: 34,
    quantumEfficiency: 94,
    apiResponseTime: 245,
    downloadSpeed: 15.6,
    errorRate: 0.2,
  })

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 92,
    status: "excellent",
    recommendations: [
      "System performance is optimal",
      "All quantum processors running efficiently",
      "Network connectivity is stable",
    ],
  })

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [historicalData, setHistoricalData] = useState<PerformanceMetrics[]>([])

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate real-time performance data
        const newMetrics: PerformanceMetrics = {
          cpu: Math.max(0, Math.min(100, metrics.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, metrics.memory + (Math.random() - 0.5) * 8)),
          network: Math.max(0, Math.min(100, metrics.network + (Math.random() - 0.5) * 12)),
          diskIO: Math.max(0, Math.min(100, metrics.diskIO + (Math.random() - 0.5) * 15)),
          quantumEfficiency: Math.max(80, Math.min(100, metrics.quantumEfficiency + (Math.random() - 0.5) * 3)),
          apiResponseTime: Math.max(100, Math.min(1000, metrics.apiResponseTime + (Math.random() - 0.5) * 50)),
          downloadSpeed: Math.max(1, Math.min(50, metrics.downloadSpeed + (Math.random() - 0.5) * 2)),
          errorRate: Math.max(0, Math.min(5, metrics.errorRate + (Math.random() - 0.5) * 0.1)),
        }

        setMetrics(newMetrics)
        setHistoricalData((prev) => [...prev.slice(-19), newMetrics])

        // Update system health
        const avgPerformance =
          (newMetrics.cpu + newMetrics.memory + newMetrics.network + newMetrics.quantumEfficiency) / 4
        let status: SystemHealth["status"] = "excellent"
        let recommendations: string[] = []

        if (avgPerformance >= 90) {
          status = "excellent"
          recommendations = ["System performance is optimal", "All quantum processors running efficiently"]
        } else if (avgPerformance >= 75) {
          status = "good"
          recommendations = ["Performance is good", "Consider optimizing background processes"]
        } else if (avgPerformance >= 60) {
          status = "warning"
          recommendations = [
            "Performance degradation detected",
            "Check system resources",
            "Consider restarting services",
          ]
        } else {
          status = "critical"
          recommendations = [
            "Critical performance issues",
            "Immediate attention required",
            "Contact system administrator",
          ]
        }

        setSystemHealth({
          overall: Math.round(avgPerformance),
          status,
          recommendations,
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring, metrics])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "good":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-green-500"
    if (value >= 75) return "bg-blue-500"
    if (value >= 60) return "bg-yellow-500"
    return "bg-red-500"
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Quantum Performance Monitor
          </h2>
          <p className="text-muted-foreground">Real-time system performance and health monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${getStatusColor(systemHealth.status)}`}>{systemHealth.overall}%</div>
            <div className="text-sm text-muted-foreground capitalize">{systemHealth.status}</div>
          </div>
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
          >
            {isMonitoring ? (
              <>
                <Activity className="w-4 h-4 animate-pulse" />
                Monitoring
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Start Monitor
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* System Health Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card
          className={`border-2 ${
            systemHealth.status === "excellent"
              ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50"
              : systemHealth.status === "good"
                ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50"
                : systemHealth.status === "warning"
                  ? "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50"
                  : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(systemHealth.status)}
              System Health Status
            </CardTitle>
            <CardDescription>Overall system performance and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Health Score</span>
                <span className="text-sm text-muted-foreground">{systemHealth.overall}%</span>
              </div>
              <Progress value={systemHealth.overall} className="h-3" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations:</h4>
                <ul className="space-y-1">
                  {systemHealth.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="realtime">Real-time Metrics</TabsTrigger>
            <TabsTrigger value="quantum">Quantum Analytics</TabsTrigger>
            <TabsTrigger value="network">Network & API</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.cpu)}%</div>
                  <Progress value={metrics.cpu} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.cpu < 70 ? "Normal" : metrics.cpu < 85 ? "High" : "Critical"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.memory)}%</div>
                  <Progress value={metrics.memory} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.memory < 70 ? "Normal" : metrics.memory < 85 ? "High" : "Critical"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.network)}%</div>
                  <Progress value={metrics.network} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{metrics.downloadSpeed.toFixed(1)} MB/s</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disk I/O</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.diskIO)}%</div>
                  <Progress value={metrics.diskIO} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.diskIO < 50 ? "Low" : metrics.diskIO < 75 ? "Moderate" : "High"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quantum" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Quantum Efficiency
                  </CardTitle>
                  <CardDescription>AI-powered performance optimization metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {Math.round(metrics.quantumEfficiency)}%
                      </div>
                      <Badge variant={metrics.quantumEfficiency >= 90 ? "default" : "secondary"}>
                        {metrics.quantumEfficiency >= 95
                          ? "Optimal"
                          : metrics.quantumEfficiency >= 90
                            ? "Excellent"
                            : metrics.quantumEfficiency >= 85
                              ? "Good"
                              : "Needs Optimization"}
                      </Badge>
                    </div>
                    <Progress value={metrics.quantumEfficiency} className="h-4" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Quantum Cores</div>
                        <div className="font-medium">8/8 Active</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Processing Power</div>
                        <div className="font-medium">2.4 THz</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Historical performance analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">↗ 12%</div>
                        <div className="text-sm text-muted-foreground">Performance Gain</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">98.7%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Optimization</span>
                        <span className="text-green-500">+15%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Memory Efficiency</span>
                        <span className="text-green-500">+8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Network Throughput</span>
                        <span className="text-green-500">+22%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(metrics.apiResponseTime)}ms</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.apiResponseTime < 300
                      ? "Excellent"
                      : metrics.apiResponseTime < 500
                        ? "Good"
                        : metrics.apiResponseTime < 800
                          ? "Slow"
                          : "Critical"}
                  </p>
                  <div className="mt-2">
                    <Progress value={Math.max(0, 100 - metrics.apiResponseTime / 10)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Download Speed</CardTitle>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.downloadSpeed.toFixed(1)} MB/s</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.downloadSpeed > 20
                      ? "Excellent"
                      : metrics.downloadSpeed > 10
                        ? "Good"
                        : metrics.downloadSpeed > 5
                          ? "Moderate"
                          : "Slow"}
                  </p>
                  <div className="mt-2">
                    <Progress value={(metrics.downloadSpeed / 50) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.errorRate < 1
                      ? "Excellent"
                      : metrics.errorRate < 2
                        ? "Good"
                        : metrics.errorRate < 5
                          ? "Warning"
                          : "Critical"}
                  </p>
                  <div className="mt-2">
                    <Progress value={Math.max(0, 100 - metrics.errorRate * 20)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Network Performance Details</CardTitle>
                <CardDescription>Detailed network and API performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Connection Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Waifu.im API</span>
                        <Badge variant="default">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Waifu.pics API</span>
                        <Badge variant="default">Online</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Nekos.best API</span>
                        <Badge variant="secondary">Slow</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wallhaven API</span>
                        <Badge variant="default">Online</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Response Time:</span>
                        <span>{Math.round(metrics.apiResponseTime)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Throughput:</span>
                        <span>{metrics.downloadSpeed.toFixed(1)} MB/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Rate:</span>
                        <span>{(100 - metrics.errorRate).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Connections:</span>
                        <span>4/4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Control Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Performance Control Panel
            </CardTitle>
            <CardDescription>Optimize and configure system performance settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Zap className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Quantum Boost</div>
                  <div className="text-xs text-muted-foreground">Optimize performance</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <RefreshCw className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">System Refresh</div>
                  <div className="text-xs text-muted-foreground">Clear cache & restart</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <BarChart3 className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Generate Report</div>
                  <div className="text-xs text-muted-foreground">Export performance data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
