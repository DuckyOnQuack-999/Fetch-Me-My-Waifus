"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Cpu, HardDrive, Wifi, Zap, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface PerformanceMetrics {
  cpu: number
  memory: number
  network: number
  downloadSpeed: number
  activeDownloads: number
  queueSize: number
  errorRate: number
  uptime: number
}

interface SystemHealth {
  status: "excellent" | "good" | "warning" | "critical"
  score: number
  recommendations: string[]
}

export function QuantumPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 0,
    memory: 0,
    network: 0,
    downloadSpeed: 0,
    activeDownloads: 0,
    queueSize: 0,
    errorRate: 0,
    uptime: 0,
  })

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: "good",
    score: 85,
    recommendations: [],
  })

  const [isMonitoring, setIsMonitoring] = useState(true)

  // Simulate performance monitoring
  const updateMetrics = useCallback(() => {
    setMetrics((prev) => ({
      cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
      memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
      network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
      downloadSpeed: Math.max(0, prev.downloadSpeed + (Math.random() - 0.5) * 2),
      activeDownloads: Math.max(0, Math.floor(prev.activeDownloads + (Math.random() - 0.5) * 2)),
      queueSize: Math.max(0, Math.floor(prev.queueSize + (Math.random() - 0.5) * 3)),
      errorRate: Math.max(0, Math.min(10, prev.errorRate + (Math.random() - 0.5) * 0.5)),
      uptime: prev.uptime + 1,
    }))
  }, [])

  // Calculate system health
  useEffect(() => {
    const calculateHealth = () => {
      let score = 100
      const recommendations: string[] = []

      if (metrics.cpu > 80) {
        score -= 20
        recommendations.push("High CPU usage detected. Consider reducing concurrent downloads.")
      }

      if (metrics.memory > 85) {
        score -= 15
        recommendations.push("Memory usage is high. Clear image cache or restart the application.")
      }

      if (metrics.errorRate > 5) {
        score -= 25
        recommendations.push("High error rate detected. Check API connectivity.")
      }

      if (metrics.network < 30) {
        score -= 10
        recommendations.push("Network performance is low. Check internet connection.")
      }

      let status: SystemHealth["status"] = "excellent"
      if (score < 60) status = "critical"
      else if (score < 75) status = "warning"
      else if (score < 90) status = "good"

      setSystemHealth({ status, score, recommendations })
    }

    calculateHealth()
  }, [metrics])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(updateMetrics, 2000)
    return () => clearInterval(interval)
  }, [isMonitoring, updateMetrics])

  const getStatusColor = (status: SystemHealth["status"]) => {
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

  const getStatusIcon = (status: SystemHealth["status"]) => {
    switch (status) {
      case "excellent":
      case "good":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Quantum Performance Monitor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant={systemHealth.status === "excellent" || systemHealth.status === "good" ? "default" : "destructive"}
            className={`${getStatusColor(systemHealth.status)} flex items-center gap-1`}
          >
            {getStatusIcon(systemHealth.status)}
            {systemHealth.status.toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsMonitoring(!isMonitoring)} className="h-8 w-8 p-0">
            <RefreshCw className={`h-4 w-4 ${isMonitoring ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <Progress value={metrics.cpu} className="h-2" />
                <p className="text-xs text-muted-foreground">{metrics.cpu.toFixed(1)}%</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <Progress value={metrics.memory} className="h-2" />
                <p className="text-xs text-muted-foreground">{metrics.memory.toFixed(1)}%</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <Progress value={metrics.network} className="h-2" />
                <p className="text-xs text-muted-foreground">{metrics.network.toFixed(1)}%</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Speed</span>
                </div>
                <Progress value={Math.min(100, metrics.downloadSpeed * 10)} className="h-2" />
                <p className="text-xs text-muted-foreground">{metrics.downloadSpeed.toFixed(1)} MB/s</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Active Downloads</p>
                      <p className="text-2xl font-bold">{metrics.activeDownloads}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Queue Size</p>
                      <p className="text-2xl font-bold">{metrics.queueSize}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Error Rate</p>
                      <p className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Uptime</p>
                      <p className="text-2xl font-bold">{formatUptime(metrics.uptime)}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">System Health Score</h3>
                  <Badge variant={systemHealth.score >= 80 ? "default" : "destructive"} className="text-lg px-3 py-1">
                    {systemHealth.score}/100
                  </Badge>
                </div>
                <Progress value={systemHealth.score} className="h-3 mb-4" />

                {systemHealth.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recommendations:</h4>
                    <ul className="space-y-1">
                      {systemHealth.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
