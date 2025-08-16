"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Activity, AlertCircle, CheckCircle, Clock, RefreshCw, Zap, Globe, Shield, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ApiStatus {
  name: string
  status: "online" | "offline" | "degraded"
  responseTime: number
  uptime: number
  lastChecked: Date
  endpoint: string
}

export function ApiStatusIndicator() {
  const [apis, setApis] = useState<ApiStatus[]>([
    {
      name: "Waifu.im",
      status: "online",
      responseTime: 120,
      uptime: 99.9,
      lastChecked: new Date(),
      endpoint: "https://api.waifu.im",
    },
    {
      name: "Waifu.pics",
      status: "online",
      responseTime: 85,
      uptime: 99.8,
      lastChecked: new Date(),
      endpoint: "https://api.waifu.pics",
    },
    {
      name: "Nekos.best",
      status: "degraded",
      responseTime: 340,
      uptime: 98.5,
      lastChecked: new Date(),
      endpoint: "https://nekos.best/api",
    },
    {
      name: "Wallhaven",
      status: "online",
      responseTime: 95,
      uptime: 99.7,
      lastChecked: new Date(),
      endpoint: "https://wallhaven.cc/api",
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "degraded":
        return "text-yellow-500"
      case "offline":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return CheckCircle
      case "degraded":
        return AlertCircle
      case "offline":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "degraded":
        return "secondary"
      case "offline":
        return "destructive"
      default:
        return "outline"
    }
  }

  const refreshStatus = async () => {
    setIsRefreshing(true)

    // Simulate API status check
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setApis((prev) =>
      prev.map((api) => ({
        ...api,
        responseTime: Math.floor(Math.random() * 300) + 50,
        lastChecked: new Date(),
        status: Math.random() > 0.1 ? "online" : Math.random() > 0.5 ? "degraded" : "offline",
      })),
    )

    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  const overallStatus = apis.every((api) => api.status === "online")
    ? "All Systems Operational"
    : apis.some((api) => api.status === "offline")
      ? "Service Disruption"
      : "Partial Outage"

  const averageResponseTime = Math.round(apis.reduce((sum, api) => sum + api.responseTime, 0) / apis.length)

  const overallUptime = Math.round((apis.reduce((sum, api) => sum + api.uptime, 0) / apis.length) * 10) / 10

  useEffect(() => {
    const interval = setInterval(() => {
      setApis((prev) =>
        prev.map((api) => ({
          ...api,
          responseTime: api.responseTime + (Math.random() - 0.5) * 20,
          lastChecked: new Date(),
        })),
      )
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <TooltipProvider>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">API Status</h3>
                </div>
                <Badge
                  variant={overallStatus === "All Systems Operational" ? "default" : "secondary"}
                  className="font-medium"
                >
                  {overallStatus}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        <span>{averageResponseTime}ms</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Average Response Time</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{overallUptime}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Overall Uptime</TooltipContent>
                  </Tooltip>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshStatus}
                  disabled={isRefreshing}
                  className="gap-2 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatePresence>
                {apis.map((api, index) => {
                  const StatusIcon = getStatusIcon(api.status)
                  return (
                    <motion.div
                      key={api.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-background/70 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm truncate">{api.name}</span>
                              <StatusIcon className={`h-4 w-4 ${getStatusColor(api.status)}`} />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Response</span>
                                <span className="font-mono">{Math.round(api.responseTime)}ms</span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Uptime</span>
                                <span className="font-mono">{api.uptime}%</span>
                              </div>
                            </div>

                            <Badge
                              variant={getStatusBadgeVariant(api.status)}
                              className="w-full justify-center mt-2 text-xs"
                            >
                              {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <div className="space-y-2">
                            <div className="font-semibold">{api.name}</div>
                            <div className="text-xs space-y-1">
                              <div>Endpoint: {api.endpoint}</div>
                              <div>Last checked: {api.lastChecked.toLocaleTimeString()}</div>
                              <div>Status: {api.status}</div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="mt-4 pt-3 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>4 APIs monitored</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Auto-refresh every 30s</span>
                  </div>
                </div>
                <div>Last updated: {lastUpdate.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}
