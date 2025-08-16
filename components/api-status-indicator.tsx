"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertCircle, CheckCircle, Clock, RefreshCw, Wifi, WifiOff, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "slow" | "checking"
  responseTime: number
  lastChecked: Date
  uptime: number
}

export function ApiStatusIndicator() {
  const [apis, setApis] = useState<ApiStatus[]>([
    {
      name: "Waifu.pics",
      url: "https://api.waifu.pics",
      status: "online",
      responseTime: 120,
      lastChecked: new Date(),
      uptime: 99.8,
    },
    {
      name: "Waifu.im",
      url: "https://api.waifu.im",
      status: "online",
      responseTime: 95,
      lastChecked: new Date(),
      uptime: 99.5,
    },
    {
      name: "Nekos.best",
      url: "https://nekos.best/api/v2",
      status: "online",
      responseTime: 150,
      lastChecked: new Date(),
      uptime: 98.9,
    },
    {
      name: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      status: "online",
      responseTime: 200,
      lastChecked: new Date(),
      uptime: 99.2,
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const checkApiStatus = async (api: ApiStatus): Promise<ApiStatus> => {
    const startTime = Date.now()
    try {
      // Simulate API check (in real app, you'd make actual requests)
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))
      const responseTime = Date.now() - startTime

      // Simulate different statuses
      const random = Math.random()
      let status: ApiStatus["status"] = "online"
      if (random < 0.05) status = "offline"
      else if (random < 0.15) status = "slow"

      return {
        ...api,
        status,
        responseTime,
        lastChecked: new Date(),
        uptime: status === "offline" ? Math.max(api.uptime - 0.1, 95) : Math.min(api.uptime + 0.01, 100),
      }
    } catch (error) {
      return {
        ...api,
        status: "offline",
        responseTime: 0,
        lastChecked: new Date(),
        uptime: Math.max(api.uptime - 0.1, 95),
      }
    }
  }

  const refreshAllStatus = async () => {
    setIsRefreshing(true)

    // Set all to checking first
    setApis((prev) => prev.map((api) => ({ ...api, status: "checking" as const })))

    try {
      const updatedApis = await Promise.all(apis.map(checkApiStatus))
      setApis(updatedApis)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to refresh API status:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshAllStatus()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isRefreshing])

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "slow":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "checking":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            Online
          </Badge>
        )
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "slow":
        return (
          <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Slow
          </Badge>
        )
      case "checking":
        return <Badge variant="outline">Checking...</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const overallStatus = apis.every((api) => api.status === "online")
    ? "online"
    : apis.some((api) => api.status === "offline")
      ? "degraded"
      : "slow"

  const averageResponseTime = apis.reduce((sum, api) => sum + api.responseTime, 0) / apis.length
  const averageUptime = apis.reduce((sum, api) => sum + api.uptime, 0) / apis.length

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {overallStatus === "online" ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <h3 className="font-semibold">API Status</h3>
            </div>
            <div className="flex items-center gap-2">
              {overallStatus === "online" && (
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  All Systems Operational
                </Badge>
              )}
              {overallStatus === "degraded" && <Badge variant="destructive">Service Degraded</Badge>}
              {overallStatus === "slow" && (
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Performance Issues
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAllStatus}
              disabled={isRefreshing}
              className="gap-1 bg-transparent"
            >
              <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {apis.map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                {getStatusIcon(api.status)}
                <div>
                  <p className="font-medium text-sm">{api.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {api.responseTime > 0 ? `${api.responseTime}ms` : "N/A"}
                  </p>
                </div>
              </div>
              {getStatusBadge(api.status)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">Avg Response:</span>
            <span className="font-medium">{averageResponseTime.toFixed(0)}ms</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Avg Uptime:</span>
            <span className="font-medium">{averageUptime.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-purple-500" />
            <span className="text-muted-foreground">APIs Online:</span>
            <span className="font-medium">
              {apis.filter((api) => api.status === "online").length}/{apis.length}
            </span>
          </div>
        </div>

        {/* Uptime Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall System Health</span>
            <span>{averageUptime.toFixed(1)}%</span>
          </div>
          <Progress value={averageUptime} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
