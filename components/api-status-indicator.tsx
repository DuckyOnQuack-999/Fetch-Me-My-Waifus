"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from "lucide-react"
import { enhancedWaifuApi } from "@/services/enhanced-waifu-api"
import type { ApiSource } from "@/types/waifu"

interface ApiStatus {
  source: ApiSource
  status: "online" | "offline" | "degraded"
  responseTime: number
  lastChecked: Date
}

interface ApiStatusIndicatorProps {
  detailed?: boolean
}

export function ApiStatusIndicator({ detailed = false }: ApiStatusIndicatorProps) {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const checkApiStatuses = async () => {
    const sources: ApiSource[] = ["waifu.pics", "waifu.im", "nekos.best", "wallhaven"]
    const statuses: ApiStatus[] = []

    for (const source of sources) {
      try {
        const status = await enhancedWaifuApi.getApiStatus(source)
        statuses.push({
          source,
          ...status,
          lastChecked: new Date(),
        })
      } catch (error) {
        statuses.push({
          source,
          status: "offline",
          responseTime: -1,
          lastChecked: new Date(),
        })
      }
    }

    setApiStatuses(statuses)
    setIsLoading(false)
  }

  useEffect(() => {
    checkApiStatuses()
    const interval = setInterval(checkApiStatuses, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const overallStatus =
    apiStatuses.length > 0
      ? apiStatuses.every((api) => api.status === "online")
        ? "online"
        : apiStatuses.some((api) => api.status === "online")
          ? "degraded"
          : "offline"
      : "unknown"

  if (!detailed) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(overallStatus)} animate-pulse`} />
        <Badge variant={overallStatus === "online" ? "default" : "destructive"} className="cyberpunk-btn">
          {isLoading ? "Checking..." : `APIs ${overallStatus.toUpperCase()}`}
        </Badge>
      </div>
    )
  }

  return (
    <Card className="material-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 neon-text">
          <Wifi className="h-5 w-5" />
          API Status Monitor
        </CardTitle>
        <CardDescription>Real-time status of all connected APIs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="loading-shimmer h-4 w-24 rounded" />
                <div className="loading-shimmer h-6 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {apiStatuses.map((api) => (
              <div
                key={api.source}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(api.status)}
                  <div>
                    <p className="font-medium">{api.source}</p>
                    <p className="text-xs text-muted-foreground">
                      Last checked: {api.lastChecked.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={api.status === "online" ? "default" : "destructive"} className="cyberpunk-btn">
                    {api.status.toUpperCase()}
                  </Badge>
                  {api.responseTime > 0 && <p className="text-xs text-muted-foreground mt-1">{api.responseTime}ms</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Health</span>
            <Badge variant={overallStatus === "online" ? "default" : "destructive"} className="cyberpunk-btn">
              {overallStatus.toUpperCase()}
            </Badge>
          </div>
          <Progress
            value={
              apiStatuses.length > 0
                ? (apiStatuses.filter((api) => api.status === "online").length / apiStatuses.length) * 100
                : 0
            }
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {apiStatuses.filter((api) => api.status === "online").length} of {apiStatuses.length} APIs operational
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
