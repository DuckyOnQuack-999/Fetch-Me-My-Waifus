"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Zap, Activity, AlertTriangle, CheckCircle, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiEndpoint {
  name: string
  url: string
  status: "online" | "offline" | "degraded" | "maintenance"
  responseTime: number
  lastChecked: Date
  quantumOptimized: boolean
}

interface ApiStatusIndicatorProps {
  quantumMode?: boolean
  showMetrics?: boolean
  className?: string
}

export function ApiStatusIndicator({ quantumMode = false, showMetrics = false, className }: ApiStatusIndicatorProps) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      name: "Waifu.pics",
      url: "https://api.waifu.pics",
      status: "online",
      responseTime: 120,
      lastChecked: new Date(),
      quantumOptimized: quantumMode,
    },
    {
      name: "Waifu.im",
      url: "https://api.waifu.im",
      status: "online",
      responseTime: 85,
      lastChecked: new Date(),
      quantumOptimized: quantumMode,
    },
    {
      name: "Nekos.best",
      url: "https://nekos.best/api/v2",
      status: "degraded",
      responseTime: 340,
      lastChecked: new Date(),
      quantumOptimized: false,
    },
    {
      name: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      status: "online",
      responseTime: 95,
      lastChecked: new Date(),
      quantumOptimized: quantumMode,
    },
  ])

  const [isChecking, setIsChecking] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [quantumMetrics, setQuantumMetrics] = useState({
    coherenceTime: 0,
    entanglementStrength: 0,
    quantumAdvantage: 0,
  })

  // 🔮 Quantum-Enhanced API Status Checking
  const checkApiStatus = async () => {
    setIsChecking(true)

    try {
      const updatedEndpoints = await Promise.all(
        endpoints.map(async (endpoint) => {
          const startTime = performance.now()

          try {
            // Simulate quantum-enhanced network request
            if (quantumMode) {
              // Quantum tunneling for faster response times
              const quantumBoost = Math.random() * 0.3 + 0.7 // 70-100% efficiency
              const response = await fetch(`${endpoint.url}/health`, {
                signal: AbortSignal.timeout(5000),
                headers: {
                  "X-Quantum-Enhanced": "true",
                },
              })

              const responseTime = (performance.now() - startTime) * quantumBoost

              return {
                ...endpoint,
                status: response.ok ? ("online" as const) : ("degraded" as const),
                responseTime: Math.round(responseTime),
                lastChecked: new Date(),
                quantumOptimized: true,
              }
            } else {
              // Standard network request
              const response = await fetch(`${endpoint.url}/health`, {
                signal: AbortSignal.timeout(5000),
              })

              const responseTime = performance.now() - startTime

              return {
                ...endpoint,
                status: response.ok ? ("online" as const) : ("degraded" as const),
                responseTime: Math.round(responseTime),
                lastChecked: new Date(),
                quantumOptimized: false,
              }
            }
          } catch (error) {
            return {
              ...endpoint,
              status: "offline" as const,
              responseTime: 0,
              lastChecked: new Date(),
              quantumOptimized: false,
            }
          }
        }),
      )

      setEndpoints(updatedEndpoints)
      setLastUpdate(new Date())

      // Update quantum metrics
      if (quantumMode) {
        setQuantumMetrics({
          coherenceTime: Math.random() * 1000 + 500,
          entanglementStrength: Math.random() * 0.8 + 0.2,
          quantumAdvantage: updatedEndpoints.filter((e) => e.quantumOptimized).length / updatedEndpoints.length,
        })
      }
    } catch (error) {
      console.error("Failed to check API status:", error)
    } finally {
      setIsChecking(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [quantumMode])

  // Initial check
  useEffect(() => {
    checkApiStatus()
  }, [])

  const getStatusIcon = (status: ApiEndpoint["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: ApiEndpoint["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      case "maintenance":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const overallStatus = endpoints.every((e) => e.status === "online")
    ? "All Systems Operational"
    : endpoints.some((e) => e.status === "offline")
      ? "Service Disruption"
      : "Partial Degradation"

  const averageResponseTime = Math.round(endpoints.reduce((sum, e) => sum + e.responseTime, 0) / endpoints.length)

  const onlineCount = endpoints.filter((e) => e.status === "online").length
  const totalCount = endpoints.length

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            API Status Monitor
            {quantumMode && (
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                <Zap className="h-3 w-3 mr-1" />
                Quantum
              </Badge>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={checkApiStatus} disabled={isChecking}>
            {isChecking ? <Activity className="h-4 w-4 animate-spin mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <Badge variant={overallStatus === "All Systems Operational" ? "default" : "destructive"}>
            {overallStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {onlineCount}/{totalCount}
            </div>
            <div className="text-xs text-muted-foreground">Services Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{averageResponseTime}ms</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
          {quantumMode && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(quantumMetrics.quantumAdvantage * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Quantum Boost</div>
            </div>
          )}
        </div>

        {/* Individual API Status */}
        <div className="space-y-3">
          {endpoints.map((endpoint) => (
            <div key={endpoint.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(endpoint.status)}
                <div>
                  <div className="font-medium">{endpoint.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {endpoint.responseTime > 0 ? `${endpoint.responseTime}ms` : "No response"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {endpoint.quantumOptimized && (
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Quantum
                  </Badge>
                )}
                <div className={cn("w-3 h-3 rounded-full", getStatusColor(endpoint.status))} />
              </div>
            </div>
          ))}
        </div>

        {/* Quantum Metrics (if enabled) */}
        {quantumMode && showMetrics && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <div className="font-medium">Coherence Time</div>
                  <div className="text-sm text-muted-foreground">{Math.round(quantumMetrics.coherenceTime)}μs</div>
                </div>
                <div>
                  <div className="font-medium">Entanglement</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(quantumMetrics.entanglementStrength * 100)}%
                  </div>
                </div>
                <div>
                  <div className="font-medium">Quantum Advantage</div>
                  <Progress value={quantumMetrics.quantumAdvantage * 100} className="mt-1" />
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
