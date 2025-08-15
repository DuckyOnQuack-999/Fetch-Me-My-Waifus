"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "checking" | "error"
  responseTime?: number
  lastChecked?: Date
  error?: string
}

const API_ENDPOINTS = [
  { name: "Waifu.im", url: "https://api.waifu.im/search" },
  { name: "Waifu Pics", url: "https://api.waifu.pics/sfw/waifu" },
  { name: "Nekos.best", url: "https://nekos.best/api/v2/neko" },
  { name: "Wallhaven", url: "https://wallhaven.cc/api/v1/search" },
]

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>(
    API_ENDPOINTS.map((endpoint) => ({
      ...endpoint,
      status: "checking" as const,
    })),
  )
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkApiStatus = async (api: { name: string; url: string }): Promise<ApiStatus> => {
    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(api.url, {
        method: "HEAD",
        signal: controller.signal,
        mode: "no-cors", // Handle CORS issues
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      return {
        ...api,
        status: "online",
        responseTime,
        lastChecked: new Date(),
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        ...api,
        status: "offline",
        responseTime,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const checkAllApis = async () => {
    setIsRefreshing(true)

    try {
      const statusPromises = API_ENDPOINTS.map(checkApiStatus)
      const results = await Promise.all(statusPromises)
      setApiStatuses(results)

      const onlineCount = results.filter((r) => r.status === "online").length
      toast.success(`API Status Updated: ${onlineCount}/${results.length} services online`)
    } catch (error) {
      toast.error("Failed to check API status")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkAllApis()
    const interval = setInterval(checkAllApis, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "checking":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ApiStatus["status"]) => {
    const variants = {
      online: "default",
      offline: "destructive",
      error: "secondary",
      checking: "outline",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  const overallStatus = apiStatuses.every((api) => api.status === "online")
    ? "All Systems Operational"
    : apiStatuses.some((api) => api.status === "online")
      ? "Partial Outage"
      : "Major Outage"

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          API Status Dashboard
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={checkAllApis}
          disabled={isRefreshing}
          className="h-8 w-8 p-0 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Status:</span>
            <Badge variant={overallStatus === "All Systems Operational" ? "default" : "destructive"}>
              {overallStatus}
            </Badge>
          </div>

          <div className="space-y-2">
            {apiStatuses.map((api) => (
              <TooltipProvider key={api.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(api.status)}
                        <span className="text-sm font-medium">{api.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {api.responseTime && (
                          <span className="text-xs text-muted-foreground">{api.responseTime}ms</span>
                        )}
                        {getStatusBadge(api.status)}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{api.name}</p>
                      <p className="text-xs">URL: {api.url}</p>
                      {api.lastChecked && (
                        <p className="text-xs">Last checked: {api.lastChecked.toLocaleTimeString()}</p>
                      )}
                      {api.error && <p className="text-xs text-red-400">Error: {api.error}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
