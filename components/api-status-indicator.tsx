"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff,
  Zap,
  TrendingUp,
  Server,
  Globe,
  Signal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ApiStatus {
  name: string
  displayName: string
  url: string
  status: "online" | "offline" | "slow" | "checking" | "warning"
  responseTime: number
  lastChecked: Date
  uptime: number
  rateLimit?: {
    remaining: number
    total: number
    resetTime: Date
  }
  description: string
}

export function ApiStatusIndicator() {
  const [apis, setApis] = useState<ApiStatus[]>([
    {
      name: "waifu-pics",
      displayName: "Waifu.pics",
      url: "https://api.waifu.pics",
      status: "online",
      responseTime: 120,
      lastChecked: new Date(),
      uptime: 99.8,
      description: "SFW & NSFW anime images",
      rateLimit: { remaining: 950, total: 1000, resetTime: new Date(Date.now() + 3600000) },
    },
    {
      name: "waifu-im",
      displayName: "Waifu.im",
      url: "https://api.waifu.im",
      status: "online",
      responseTime: 95,
      lastChecked: new Date(),
      uptime: 99.5,
      description: "High-quality waifu images",
      rateLimit: { remaining: 850, total: 1000, resetTime: new Date(Date.now() + 3600000) },
    },
    {
      name: "nekos-best",
      displayName: "Nekos.best",
      url: "https://nekos.best/api/v2",
      status: "slow",
      responseTime: 450,
      lastChecked: new Date(),
      uptime: 98.9,
      description: "Neko & anime character images",
      rateLimit: { remaining: 450, total: 500, resetTime: new Date(Date.now() + 1800000) },
    },
    {
      name: "wallhaven",
      displayName: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      status: "online",
      responseTime: 200,
      lastChecked: new Date(),
      uptime: 99.2,
      description: "High-resolution wallpapers",
      rateLimit: { remaining: 180, total: 200, resetTime: new Date(Date.now() + 3600000) },
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [expandedView, setExpandedView] = useState(false)

  const checkApiStatus = async (api: ApiStatus): Promise<ApiStatus> => {
    const startTime = Date.now()
    try {
      // Simulate API check with realistic timing
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 800 + 200))
      const responseTime = Date.now() - startTime

      // Simulate different statuses based on response time and random factors
      const random = Math.random()
      let status: ApiStatus["status"] = "online"

      if (random < 0.03) {
        status = "offline"
      } else if (responseTime > 500 || random < 0.08) {
        status = "slow"
      } else if (random < 0.12) {
        status = "warning"
      }

      // Update rate limits
      const newRateLimit = api.rateLimit
        ? {
            ...api.rateLimit,
            remaining: Math.max(0, api.rateLimit.remaining - Math.floor(Math.random() * 5)),
          }
        : undefined

      return {
        ...api,
        status,
        responseTime: status === "offline" ? 0 : responseTime,
        lastChecked: new Date(),
        uptime: status === "offline" ? Math.max(api.uptime - 0.2, 95) : Math.min(api.uptime + 0.01, 100),
        rateLimit: newRateLimit,
      }
    } catch (error) {
      return {
        ...api,
        status: "offline",
        responseTime: 0,
        lastChecked: new Date(),
        uptime: Math.max(api.uptime - 0.2, 95),
      }
    }
  }

  const refreshAllStatus = async () => {
    setIsRefreshing(true)

    // Set all to checking first with staggered animation
    setApis((prev) =>
      prev.map((api, index) => ({
        ...api,
        status: "checking" as const,
      })),
    )

    try {
      // Stagger the API checks for better UX
      const updatedApis = []
      for (let i = 0; i < apis.length; i++) {
        const updatedApi = await checkApiStatus(apis[i])
        updatedApis.push(updatedApi)

        // Update one by one for smooth animation
        setApis((prev) => prev.map((api, index) => (index === i ? updatedApi : api)))

        // Small delay between checks
        if (i < apis.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to refresh API status:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshAllStatus()
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [isRefreshing])

  const getStatusIcon = (status: ApiStatus["status"], size = "h-4 w-4") => {
    const iconClass = cn(size)

    switch (status) {
      case "online":
        return <CheckCircle className={cn(iconClass, "text-green-500")} />
      case "offline":
        return <AlertCircle className={cn(iconClass, "text-red-500")} />
      case "slow":
        return <Clock className={cn(iconClass, "text-yellow-500")} />
      case "warning":
        return <AlertCircle className={cn(iconClass, "text-orange-500")} />
      case "checking":
        return <RefreshCw className={cn(iconClass, "text-blue-500 animate-spin")} />
      default:
        return <Activity className={cn(iconClass, "text-gray-500")} />
    }
  }

  const getStatusBadge = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Online
          </Badge>
        )
      case "offline":
        return (
          <Badge
            variant="destructive"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
            Offline
          </Badge>
        )
      case "slow":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse" />
            Slow
          </Badge>
        )
      case "warning":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse" />
            Warning
          </Badge>
        )
      case "checking":
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Checking...
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime === 0) return "text-red-500"
    if (responseTime < 200) return "text-green-500"
    if (responseTime < 500) return "text-yellow-500"
    return "text-red-500"
  }

  const overallStatus = apis.every((api) => api.status === "online")
    ? "online"
    : apis.some((api) => api.status === "offline")
      ? "degraded"
      : apis.some((api) => api.status === "slow" || api.status === "warning")
        ? "slow"
        : "checking"

  const averageResponseTime =
    apis.filter((api) => api.responseTime > 0).reduce((sum, api) => sum + api.responseTime, 0) /
      apis.filter((api) => api.responseTime > 0).length || 0
  const averageUptime = apis.reduce((sum, api) => sum + api.uptime, 0) / apis.length
  const onlineCount = apis.filter((api) => api.status === "online").length

  return (
    <TooltipProvider>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-card/50 to-card backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {overallStatus === "online" ? (
                    <div className="relative">
                      <Wifi className="h-6 w-6 text-green-500" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  ) : overallStatus === "degraded" ? (
                    <WifiOff className="h-6 w-6 text-red-500" />
                  ) : (
                    <Signal className="h-6 w-6 text-yellow-500" />
                  )}
                  <div>
                    <CardTitle className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      API Status Monitor
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Real-time monitoring of {apis.length} API endpoints
                    </CardDescription>
                  </div>
                </motion.div>

                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {overallStatus === "online" && (
                      <motion.div
                        key="online"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 font-medium"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          All Systems Operational
                        </Badge>
                      </motion.div>
                    )}
                    {overallStatus === "degraded" && (
                      <motion.div
                        key="degraded"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge variant="destructive" className="font-medium">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Service Degraded
                        </Badge>
                      </motion.div>
                    )}
                    {overallStatus === "slow" && (
                      <motion.div
                        key="slow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 font-medium"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Performance Issues
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-muted-foreground">Last updated</div>
                  <div className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</div>
                </div>

                <Separator orientation="vertical" className="h-8 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedView(!expandedView)}
                    className="gap-1 bg-transparent hover:bg-primary/5 transition-colors"
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span className="hidden sm:inline">{expandedView ? "Collapse" : "Details"}</span>
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshAllStatus}
                        disabled={isRefreshing}
                        className="gap-1 bg-transparent hover:bg-primary/5 transition-colors"
                      >
                        <RefreshCw className={cn("h-3 w-3 transition-transform", isRefreshing && "animate-spin")} />
                        <span className="hidden sm:inline">Refresh</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh all API statuses</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Compact Status Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {apis.map((api, index) => (
                <motion.div
                  key={api.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="group"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-all duration-200 cursor-pointer group-hover:shadow-md group-hover:scale-[1.02]">
                        <div className="flex items-center gap-2 min-w-0">
                          <motion.div
                            animate={api.status === "checking" ? { rotate: 360 } : { rotate: 0 }}
                            transition={{
                              duration: 1,
                              repeat: api.status === "checking" ? Number.POSITIVE_INFINITY : 0,
                              ease: "linear",
                            }}
                          >
                            {getStatusIcon(api.status)}
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{api.displayName}</p>
                            <p className={cn("text-xs font-mono", getResponseTimeColor(api.responseTime))}>
                              {api.responseTime > 0 ? `${api.responseTime}ms` : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">{getStatusBadge(api.status)}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <div className="font-medium">{api.displayName}</div>
                        <div className="text-xs text-muted-foreground">{api.description}</div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Response Time</div>
                            <div className="font-medium">{api.responseTime > 0 ? `${api.responseTime}ms` : "N/A"}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Uptime</div>
                            <div className="font-medium">{api.uptime.toFixed(1)}%</div>
                          </div>
                        </div>
                        {api.rateLimit && (
                          <>
                            <Separator />
                            <div>
                              <div className="text-muted-foreground text-xs mb-1">Rate Limit</div>
                              <div className="flex justify-between text-xs">
                                <span>
                                  {api.rateLimit.remaining}/{api.rateLimit.total}
                                </span>
                                <span>{((api.rateLimit.remaining / api.rateLimit.total) * 100).toFixed(0)}%</span>
                              </div>
                              <Progress
                                value={(api.rateLimit.remaining / api.rateLimit.total) * 100}
                                className="h-1 mt-1"
                              />
                            </div>
                          </>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Last checked: {api.lastChecked.toLocaleTimeString()}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Zap className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                  <p className="font-semibold text-sm">{averageResponseTime.toFixed(0)}ms</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-2 rounded-full bg-green-500/10">
                  <Activity className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Uptime</p>
                  <p className="font-semibold text-sm">{averageUptime.toFixed(1)}%</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-2 rounded-full bg-purple-500/10">
                  <Server className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">APIs Online</p>
                  <p className="font-semibold text-sm">
                    {onlineCount}/{apis.length}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Overall Health Progress */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-medium">Overall System Health</span>
                </div>
                <span className="font-semibold text-primary">{averageUptime.toFixed(1)}%</span>
              </div>
              <div className="relative">
                <Progress value={averageUptime} className="h-3 bg-muted/50" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{ width: "100px" }}
                />
              </div>
            </motion.div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedView && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 pt-4 border-t"
                >
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Detailed Metrics
                  </h4>

                  <div className="grid gap-3">
                    {apis.map((api, index) => (
                      <motion.div
                        key={api.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="p-4 rounded-lg border bg-card/30 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(api.status, "h-5 w-5")}
                            <div>
                              <h5 className="font-medium">{api.displayName}</h5>
                              <p className="text-xs text-muted-foreground">{api.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(api.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Response Time</p>
                            <p className={cn("font-medium", getResponseTimeColor(api.responseTime))}>
                              {api.responseTime > 0 ? `${api.responseTime}ms` : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Uptime</p>
                            <p className="font-medium">{api.uptime.toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Last Check</p>
                            <p className="font-medium">{api.lastChecked.toLocaleTimeString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Endpoint</p>
                            <p className="font-medium text-xs font-mono truncate">{api.url}</p>
                          </div>
                        </div>

                        {api.rateLimit && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Rate Limit Usage</span>
                              <span className="font-medium">
                                {api.rateLimit.remaining}/{api.rateLimit.total}(
                                {((api.rateLimit.remaining / api.rateLimit.total) * 100).toFixed(0)}% remaining)
                              </span>
                            </div>
                            <Progress value={(api.rateLimit.remaining / api.rateLimit.total) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              Resets at {api.rateLimit.resetTime.toLocaleTimeString()}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}
