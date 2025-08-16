"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  Settings,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  history: number[]
}

interface SystemStats {
  cpu: PerformanceMetric
  memory: PerformanceMetric
  network: PerformanceMetric
  downloads: PerformanceMetric
  apiCalls: PerformanceMetric
  errorRate: PerformanceMetric
}

export function QuantumPerformanceMonitor() {
  const [isQuantumMode, setIsQuantumMode] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [stats, setStats] = useState<SystemStats>({
    cpu: {
      name: "CPU Usage",
      value: 45,
      unit: "%",
      status: "good",
      trend: "stable",
      history: [],
    },
    memory: {
      name: "Memory Usage",
      value: 68,
      unit: "%",
      status: "warning",
      trend: "up",
      history: [],
    },
    network: {
      name: "Network I/O",
      value: 1.2,
      unit: "MB/s",
      status: "good",
      trend: "down",
      history: [],
    },
    downloads: {
      name: "Active Downloads",
      value: 3,
      unit: "files",
      status: "good",
      trend: "stable",
      history: [],
    },
    apiCalls: {
      name: "API Calls/min",
      value: 24,
      unit: "calls",
      status: "good",
      trend: "up",
      history: [],
    },
    errorRate: {
      name: "Error Rate",
      value: 0.5,
      unit: "%",
      status: "good",
      trend: "down",
      history: [],
    },
  })

  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate real-time data updates
  useEffect(() => {
    if (!isMonitoring) return

    const updateStats = () => {
      setStats((prev) => {
        const newStats = { ...prev }

        Object.keys(newStats).forEach((key) => {
          const metric = newStats[key as keyof SystemStats]

          // Simulate data fluctuation
          let change = (Math.random() - 0.5) * 10
          if (isQuantumMode) {
            // More dramatic changes in quantum mode
            change *= 2
          }

          let newValue = Math.max(0, metric.value + change)

          // Apply realistic constraints
          if (key === "cpu" || key === "memory") {
            newValue = Math.min(100, newValue)
          } else if (key === "errorRate") {
            newValue = Math.min(5, newValue)
          } else if (key === "downloads") {
            newValue = Math.max(0, Math.floor(newValue))
          }

          // Update history
          const newHistory = [...metric.history, newValue].slice(-20)

          // Determine status
          let status: "good" | "warning" | "critical" = "good"
          if (key === "cpu" || key === "memory") {
            if (newValue > 80) status = "critical"
            else if (newValue > 60) status = "warning"
          } else if (key === "errorRate") {
            if (newValue > 2) status = "critical"
            else if (newValue > 1) status = "warning"
          }

          // Determine trend
          let trend: "up" | "down" | "stable" = "stable"
          if (newHistory.length >= 2) {
            const recent = newHistory.slice(-3).reduce((a, b) => a + b, 0) / 3
            const older = newHistory.slice(-6, -3).reduce((a, b) => a + b, 0) / 3
            if (recent > older + 2) trend = "up"
            else if (recent < older - 2) trend = "down"
          }

          newStats[key as keyof SystemStats] = {
            ...metric,
            value: newValue,
            status,
            trend,
            history: newHistory,
          }
        })

        return newStats
      })

      // Update chart data
      setChartData((prev) => {
        const now = new Date().toLocaleTimeString()
        const newData = [...prev, { time: now, value: Math.random() * 100 }].slice(-10)
        return newData
      })
    }

    intervalRef.current = setInterval(updateStats, isQuantumMode ? 500 : 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMonitoring, isQuantumMode])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500"
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const resetStats = () => {
    setStats((prev) => {
      const newStats = { ...prev }
      Object.keys(newStats).forEach((key) => {
        newStats[key as keyof SystemStats].history = []
      })
      return newStats
    })
    setChartData([])
  }

  const overallHealth = Object.values(stats).reduce((acc, metric) => {
    if (metric.status === "critical") return acc - 20
    if (metric.status === "warning") return acc - 10
    return acc + 5
  }, 50)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className={cn("h-6 w-6", isQuantumMode && "text-purple-500 animate-pulse")} />
            Quantum Performance Monitor
            {isQuantumMode && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Quantum Mode
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Real-time system performance and analytics</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="quantum-mode" checked={isQuantumMode} onCheckedChange={setIsQuantumMode} />
            <Label htmlFor="quantum-mode">Quantum Mode</Label>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isMonitoring ? "Pause" : "Resume"}
          </Button>

          <Button variant="outline" size="sm" onClick={resetStats}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <Card
        className={cn(
          "border-l-4",
          overallHealth > 70 ? "border-l-green-500" : overallHealth > 40 ? "border-l-yellow-500" : "border-l-red-500",
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  overallHealth > 70 ? "bg-green-500" : overallHealth > 40 ? "bg-yellow-500" : "bg-red-500",
                )}
              />
              <span className="font-medium">
                {overallHealth > 70 ? "Excellent" : overallHealth > 40 ? "Good" : "Needs Attention"}
              </span>
            </div>
            <Badge variant="outline">Health Score: {Math.max(0, Math.min(100, overallHealth)).toFixed(0)}%</Badge>
          </div>
          <Progress value={Math.max(0, Math.min(100, overallHealth))} className="h-2" />
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(stats).map(([key, metric]) => (
          <Card key={key} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className="flex items-center gap-1">
                {getStatusIcon(metric.status)}
                {getTrendIcon(metric.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof metric.value === "number" ? metric.value.toFixed(key === "downloads" ? 0 : 1) : metric.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
              </div>

              {/* Mini chart */}
              {metric.history.length > 1 && (
                <div className="mt-3 h-8 flex items-end gap-1">
                  {metric.history.slice(-10).map((value, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 rounded-sm",
                        metric.status === "good"
                          ? "bg-green-200"
                          : metric.status === "warning"
                            ? "bg-yellow-200"
                            : "bg-red-200",
                      )}
                      style={{
                        height: `${Math.max(2, (value / Math.max(...metric.history)) * 100)}%`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Progress bar for percentage metrics */}
              {(key === "cpu" || key === "memory") && (
                <div className="mt-3">
                  <Progress
                    value={metric.value}
                    className={cn(
                      "h-1",
                      metric.status === "critical" && "bg-red-100",
                      metric.status === "warning" && "bg-yellow-100",
                    )}
                  />
                </div>
              )}
            </CardContent>

            {/* Quantum effect overlay */}
            {isQuantumMode && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
            )}
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Real-time Performance Chart
              </CardTitle>
              <CardDescription>Live performance data visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center gap-2 border rounded-lg p-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-8 rounded-t-sm transition-all duration-300",
                        isQuantumMode ? "bg-gradient-to-t from-purple-500 to-blue-500" : "bg-blue-500",
                      )}
                      style={{ height: `${Math.max(10, data.value * 2)}px` }}
                    />
                    <span className="text-xs text-muted-foreground rotate-45 origin-left">{data.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance</CardTitle>
              <CardDescription>Performance trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Historical data visualization would be implemented here</p>
                <p className="text-sm">Connect to your analytics backend for detailed insights</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Alerts</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats)
                  .filter(([_, metric]) => metric.status !== "good")
                  .map(([key, metric]) => (
                    <div key={key} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                      {getStatusIcon(metric.status)}
                      <div className="flex-1">
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current value: {metric.value.toFixed(1)}
                          {metric.unit}
                        </p>
                      </div>
                      <Badge variant={metric.status === "critical" ? "destructive" : "secondary"}>
                        {metric.status}
                      </Badge>
                    </div>
                  ))}

                {Object.values(stats).every((metric) => metric.status === "good") && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>All systems operating normally</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Monitor Settings
              </CardTitle>
              <CardDescription>Configure performance monitoring preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">Automatically update performance data</p>
                </div>
                <Switch id="auto-refresh" checked={isMonitoring} onCheckedChange={setIsMonitoring} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="quantum-mode-setting">Quantum Mode</Label>
                  <p className="text-sm text-muted-foreground">Enhanced monitoring with faster updates</p>
                </div>
                <Switch id="quantum-mode-setting" checked={isQuantumMode} onCheckedChange={setIsQuantumMode} />
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" onClick={resetStats} className="w-full bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
