"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "slow" | "unknown"
  responseTime?: number
  lastChecked: Date
}

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "Waifu.im",
      url: "https://api.waifu.im",
      status: "unknown",
      lastChecked: new Date(),
    },
    {
      name: "Waifu.pics",
      url: "https://api.waifu.pics",
      status: "unknown",
      lastChecked: new Date(),
    },
    {
      name: "Nekos.best",
      url: "https://nekos.best/api/v2",
      status: "unknown",
      lastChecked: new Date(),
    },
    {
      name: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      status: "unknown",
      lastChecked: new Date(),
    },
  ])

  const [isChecking, setIsChecking] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const checkApiStatus = async (api: ApiStatus): Promise<ApiStatus> => {
    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`/api/proxy/status?url=${encodeURIComponent(api.url)}`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      let status: "online" | "offline" | "slow" = "online"
      if (responseTime > 3000) {
        status = "slow"
      } else if (!response.ok) {
        status = "offline"
      }

      return {
        ...api,
        status,
        responseTime,
        lastChecked: new Date(),
      }
    } catch (error) {
      return {
        ...api,
        status: "offline",
        responseTime: undefined,
        lastChecked: new Date(),
      }
    }
  }

  const checkAllApis = async () => {
    setIsChecking(true)

    try {
      const promises = apiStatuses.map((api) => checkApiStatus(api))
      const results = await Promise.all(promises)
      setApiStatuses(results)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to check API statuses:", error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkAllApis()

    // Check every 5 minutes
    const interval = setInterval(checkAllApis, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "slow":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Online
          </Badge>
        )
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "slow":
        return (
          <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Slow
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const overallStatus = apiStatuses.every((api) => api.status === "online")
    ? "online"
    : apiStatuses.some((api) => api.status === "online")
      ? "partial"
      : "offline"

  const getOverallIcon = () => {
    switch (overallStatus) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "partial":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <WifiOff className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <Card className="material-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getOverallIcon()}
              <span className="font-medium">API Status</span>
            </div>

            <div className="flex items-center gap-2">
              {apiStatuses.map((api) => (
                <motion.div
                  key={api.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(api.status)}
                  <span className="text-sm text-muted-foreground hidden sm:inline">{api.name}</span>
                  {api.responseTime && (
                    <span className="text-xs text-muted-foreground hidden md:inline">({api.responseTime}ms)</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground hidden sm:block">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={checkAllApis}
              disabled={isChecking}
              className="h-8 bg-transparent"
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline ml-1">Refresh</span>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {overallStatus !== "online" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {apiStatuses.map((api) => (
                  <div key={api.name} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      <span className="text-sm font-medium">{api.name}</span>
                    </div>
                    {getStatusBadge(api.status)}
                  </div>
                ))}
              </div>

              {overallStatus === "offline" && (
                <div className="mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      All APIs are currently offline. Some features may not work properly.
                    </span>
                  </div>
                </div>
              )}

              {overallStatus === "partial" && (
                <div className="mt-2 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Some APIs are experiencing issues. Functionality may be limited.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
