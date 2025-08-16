"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, Settings, RefreshCw, Zap, Activity } from "lucide-react"
import { motion } from "framer-motion"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "warning"
  responseTime: number
  lastChecked: Date
  uptime: number
  rateLimit: {
    remaining: number
    total: number
    resetTime: Date
  }
}

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "Waifu.im",
      url: "https://api.waifu.im",
      status: "online",
      responseTime: 245,
      lastChecked: new Date(),
      uptime: 99.8,
      rateLimit: { remaining: 850, total: 1000, resetTime: new Date(Date.now() + 3600000) },
    },
    {
      name: "Waifu.pics",
      url: "https://api.waifu.pics",
      status: "online",
      responseTime: 180,
      lastChecked: new Date(),
      uptime: 99.9,
      rateLimit: { remaining: 950, total: 1000, resetTime: new Date(Date.now() + 3600000) },
    },
    {
      name: "Nekos.best",
      url: "https://nekos.best/api/v2",
      status: "warning",
      responseTime: 890,
      lastChecked: new Date(),
      uptime: 98.5,
      rateLimit: { remaining: 450, total: 500, resetTime: new Date(Date.now() + 1800000) },
    },
    {
      name: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      status: "online",
      responseTime: 320,
      lastChecked: new Date(),
      uptime: 99.7,
      rateLimit: { remaining: 180, total: 200, resetTime: new Date(Date.now() + 3600000) },
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshStatuses()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const refreshStatuses = async () => {
    setIsRefreshing(true)

    // Simulate API status checks
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setApiStatuses((prev) =>
      prev.map((api) => ({
        ...api,
        responseTime: Math.floor(Math.random() * 500) + 100,
        lastChecked: new Date(),
        status: Math.random() > 0.1 ? "online" : Math.random() > 0.5 ? "warning" : "offline",
        rateLimit: {
          ...api.rateLimit,
          remaining: Math.max(0, api.rateLimit.remaining - Math.floor(Math.random() * 10)),
        },
      })),
    )

    setIsRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "offline":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "offline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const overallHealth =
    (apiStatuses.reduce((acc, api) => {
      if (api.status === "online") return acc + 1
      if (api.status === "warning") return acc + 0.5
      return acc
    }, 0) /
      apiStatuses.length) *
    100

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            API Status Dashboard
          </h2>
          <p className="text-muted-foreground">Real-time monitoring of all API endpoints</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-500">{Math.round(overallHealth)}%</div>
            <div className="text-sm text-muted-foreground">System Health</div>
          </div>
          <Button
            onClick={refreshStatuses}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Health Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              System Health Overview
            </CardTitle>
            <CardDescription>Overall performance metrics across all APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Health</span>
                <span className="text-sm text-muted-foreground">{Math.round(overallHealth)}%</span>
              </div>
              <Progress value={overallHealth} className="h-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {apiStatuses.filter((api) => api.status === "online").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    {apiStatuses.filter((api) => api.status === "warning").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {apiStatuses.filter((api) => api.status === "offline").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Offline</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {apiStatuses.map((api, index) => (
          <Card key={api.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(api.status)}
                  {api.name}
                </CardTitle>
                <Badge className={getStatusColor(api.status)}>{api.status.toUpperCase()}</Badge>
              </div>
              <CardDescription className="text-xs">{api.url}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Response Time</div>
                  <div className="font-medium">{api.responseTime}ms</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Uptime</div>
                  <div className="font-medium">{api.uptime}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate Limit</span>
                  <span className="font-medium">
                    {api.rateLimit.remaining}/{api.rateLimit.total}
                  </span>
                </div>
                <Progress value={(api.rateLimit.remaining / api.rateLimit.total) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Resets: {api.rateLimit.resetTime.toLocaleTimeString()}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">Last checked: {api.lastChecked.toLocaleTimeString()}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Configuration Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Monitoring Configuration
            </CardTitle>
            <CardDescription>Configure API monitoring settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <div className="text-sm text-muted-foreground">Automatically refresh API status every 30 seconds</div>
                </div>
                <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      Configure Endpoints
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>API Endpoint Configuration</DialogTitle>
                      <DialogDescription>Manage your API endpoints and authentication settings</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="endpoints" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                        <TabsTrigger value="auth">Authentication</TabsTrigger>
                      </TabsList>
                      <TabsContent value="endpoints" className="space-y-4">
                        {apiStatuses.map((api) => (
                          <div key={api.name} className="space-y-2">
                            <Label htmlFor={`url-${api.name}`}>{api.name} URL</Label>
                            <Input id={`url-${api.name}`} defaultValue={api.url} placeholder="API endpoint URL" />
                          </div>
                        ))}
                      </TabsContent>
                      <TabsContent value="auth" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wallhaven-key">Wallhaven API Key</Label>
                          <Input id="wallhaven-key" type="password" placeholder="Enter your Wallhaven API key" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="waifu-key">Waifu API Key (Optional)</Label>
                          <Input id="waifu-key" type="password" placeholder="Enter your Waifu API key" />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full bg-transparent">
                  Export Status Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
