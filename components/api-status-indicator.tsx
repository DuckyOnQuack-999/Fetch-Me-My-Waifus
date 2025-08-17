"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { ApiStatusData } from "@/types/waifu"

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatusData[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const mockApiStatuses: ApiStatusData[] = [
    {
      name: "waifu.im",
      displayName: "Waifu.im",
      url: "https://api.waifu.im",
      endpoint: "/search",
      status: "online",
      latency: 156,
      lastChecked: new Date(),
      description: "High-quality anime images with advanced filtering",
      features: ["NSFW Filter", "Tag Search", "Quality Filter"],
      keyRequired: false,
      keyName: "waifuImApiKey",
      rateLimit: {
        requests: 100,
        window: 3600,
        remaining: 87,
        resetTime: new Date(Date.now() + 3600000),
      },
      statistics: {
        totalRequests: 1247,
        successfulRequests: 1198,
        failedRequests: 49,
        averageLatency: 164,
      },
    },
    {
      name: "waifu.pics",
      displayName: "Waifu.pics",
      url: "https://api.waifu.pics",
      endpoint: "/sfw/waifu",
      status: "online",
      latency: 89,
      lastChecked: new Date(),
      description: "Simple and fast anime image API",
      features: ["SFW/NSFW", "Multiple Categories", "Single Image"],
      keyRequired: false,
      keyName: "waifuPicsApiKey",
      statistics: {
        totalRequests: 892,
        successfulRequests: 889,
        failedRequests: 3,
        averageLatency: 92,
      },
    },
    {
      name: "nekos.best",
      displayName: "Nekos.best",
      url: "https://nekos.best/api/v2",
      endpoint: "/neko",
      status: "degraded",
      latency: 342,
      lastChecked: new Date(),
      description: "Neko and anime character images",
      features: ["Multiple Characters", "Batch Requests", "Metadata"],
      keyRequired: false,
      keyName: "nekosBestApiKey",
      statistics: {
        totalRequests: 567,
        successfulRequests: 523,
        failedRequests: 44,
        averageLatency: 298,
      },
    },
    {
      name: "wallhaven",
      displayName: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      endpoint: "/search",
      status: "online",
      latency: 203,
      lastChecked: new Date(),
      description: "High-resolution wallpapers and artwork",
      features: ["High Resolution", "Categories", "User Collections"],
      keyRequired: true,
      keyName: "wallhavenApiKey",
      rateLimit: {
        requests: 45,
        window: 60,
        remaining: 32,
        resetTime: new Date(Date.now() + 60000),
      },
      statistics: {
        totalRequests: 234,
        successfulRequests: 231,
        failedRequests: 3,
        averageLatency: 187,
      },
    },
    {
      name: "femboyfinder",
      displayName: "FemboyFinder",
      url: "https://femboyfinder.firestreaker2.gq/api",
      endpoint: "/femboy",
      status: "offline",
      lastChecked: new Date(),
      description: "Specialized character image collection",
      features: ["Character Focus", "Quality Curated"],
      keyRequired: false,
      keyName: "femboyFinderApiKey",
      statistics: {
        totalRequests: 45,
        successfulRequests: 12,
        failedRequests: 33,
        averageLatency: 0,
      },
    },
  ]

  useEffect(() => {
    setApiStatuses(mockApiStatuses)

    // Simulate periodic status updates
    const interval = setInterval(() => {
      setApiStatuses((prev) =>
        prev.map((api) => ({
          ...api,
          latency: api.status === "online" ? Math.floor(Math.random() * 300) + 50 : undefined,
          lastChecked: new Date(),
          statistics: {
            ...api.statistics,
            totalRequests: api.statistics.totalRequests + Math.floor(Math.random() * 5),
            successfulRequests: api.statistics.successfulRequests + Math.floor(Math.random() * 4),
          },
        })),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)

    // Simulate API status check
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setApiStatuses((prev) =>
      prev.map((api) => ({
        ...api,
        lastChecked: new Date(),
        latency: api.status === "online" ? Math.floor(Math.random() * 300) + 50 : undefined,
      })),
    )

    setIsRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "checking":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
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
      case "checking":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const overallStatus = apiStatuses.every((api) => api.status === "online")
    ? "online"
    : apiStatuses.some((api) => api.status === "offline")
      ? "degraded"
      : "degraded"

  const onlineCount = apiStatuses.filter((api) => api.status === "online").length
  const totalCount = apiStatuses.length

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(overallStatus)} animate-pulse`} />
              <span className="font-medium">API Status</span>
            </div>

            <Badge variant={overallStatus === "online" ? "default" : "secondary"}>
              {onlineCount}/{totalCount} Online
            </Badge>

            <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-3"
            >
              {apiStatuses.map((api) => (
                <div key={api.name} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(api.status)}
                    <div>
                      <div className="font-medium">{api.displayName}</div>
                      <div className="text-sm text-muted-foreground">{api.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    {api.latency && (
                      <div className="text-center">
                        <div className="font-medium">{api.latency}ms</div>
                        <div className="text-xs text-muted-foreground">Latency</div>
                      </div>
                    )}

                    {api.statistics && (
                      <div className="text-center">
                        <div className="font-medium">
                          {((api.statistics.successfulRequests / api.statistics.totalRequests) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Success</div>
                      </div>
                    )}

                    {api.rateLimit && (
                      <div className="text-center">
                        <div className="font-medium">{api.rateLimit.remaining}</div>
                        <div className="text-xs text-muted-foreground">Remaining</div>
                      </div>
                    )}

                    <Badge
                      variant={
                        api.status === "online" ? "default" : api.status === "degraded" ? "secondary" : "destructive"
                      }
                    >
                      {api.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
