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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertCircle, Clock, Settings, RefreshCw, Shield, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { useSettings } from "@/context/settingsContext"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "slow" | "checking"
  responseTime: number
  lastChecked: Date
  uptime: number
  rateLimit?: {
    remaining: number
    total: number
    resetTime: Date
  }
}

export function ApiStatusIndicator() {
  const { settings, updateSettings } = useSettings()
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "Waifu.im",
      url: "https://api.waifu.im",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      uptime: 99.5,
      rateLimit: { remaining: 95, total: 100, resetTime: new Date(Date.now() + 3600000) },
    },
    {
      name: "Waifu.pics",
      url: "https://api.waifu.pics",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      uptime: 98.2,
      rateLimit: { remaining: 48, total: 50, resetTime: new Date(Date.now() + 1800000) },
    },
    {
      name: "Nekos.best",
      url: "https://nekos.best/api/v2",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      uptime: 97.8,
    },
    {
      name: "Wallhaven",
      url: "https://wallhaven.cc/api/v1",
      status: "checking",
      responseTime: 0,
      lastChecked: new Date(),
      uptime: 99.9,
      rateLimit: { remaining: 180, total: 200, resetTime: new Date(Date.now() + 3600000) },
    },
  ])

  const [isChecking, setIsChecking] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    checkAllApis()

    if (autoRefresh) {
      const interval = setInterval(checkAllApis, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const checkAllApis = async () => {
    setIsChecking(true)

    const updatedStatuses = await Promise.all(
      apiStatuses.map(async (api) => {
        try {
          const startTime = Date.now()

          // Simulate API check with random response times and statuses
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

          const responseTime = Date.now() - startTime
          const randomStatus = Math.random()

          let status: ApiStatus["status"]
          if (randomStatus > 0.9) status = "offline"
          else if (randomStatus > 0.8) status = "slow"
          else status = "online"

          return {
            ...api,
            status,
            responseTime,
            lastChecked: new Date(),
            uptime: Math.max(95, Math.min(100, api.uptime + (Math.random() - 0.5) * 0.5)),
          }
        } catch (error) {
          return {
            ...api,
            status: "offline" as const,
            responseTime: 0,
            lastChecked: new Date(),
          }
        }
      }),
    )

    setApiStatuses(updatedStatuses)
    setIsChecking(false)
  }

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "slow":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "checking":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "slow":
        return "bg-yellow-500"
      case "checking":
        return "bg-blue-500"
    }
  }

  const getStatusText = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return "Online"
      case "offline":
        return "Offline"
      case "slow":
        return "Slow"
      case "checking":
        return "Checking..."
    }
  }

  const overallHealth = apiStatuses.reduce((acc, api) => {
    if (api.status === "online") return acc + 25
    if (api.status === "slow") return acc + 15
    return acc
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Overall Status Header */}
      <Card className="material-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Activity className="h-8 w-8 text-primary" />
                <div
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(
                    overallHealth > 75 ? "online" : overallHealth > 50 ? "slow" : "offline",
                  )}`}
                />
              </div>
              <div>
                <CardTitle className="text-xl">API Status Dashboard</CardTitle>
                <CardDescription>Real-time monitoring of all image sources</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={overallHealth > 75 ? "default" : "destructive"}>{overallHealth}% Healthy</Badge>
              <Button variant="outline" size="sm" onClick={checkAllApis} disabled={isChecking}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall System Health</span>
              <span>{overallHealth}%</span>
            </div>
            <Progress value={overallHealth} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* API Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiStatuses.map((api, index) => (
          <motion.div
            key={api.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="material-card hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(api.status)}
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      api.status === "online"
                        ? "border-green-500 text-green-500"
                        : api.status === "slow"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-red-500 text-red-500"
                    }`}
                  >
                    {getStatusText(api.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Response Time</p>
                    <p className="font-medium">{api.responseTime}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-medium">{api.uptime.toFixed(1)}%</p>
                  </div>
                </div>

                {api.rateLimit && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate Limit</span>
                      <span>
                        {api.rateLimit.remaining}/{api.rateLimit.total}
                      </span>
                    </div>
                    <Progress value={(api.rateLimit.remaining / api.rateLimit.total) * 100} className="h-1" />
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Last checked: {api.lastChecked.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Configuration Panel */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Monitoring Configuration
          </CardTitle>
          <CardDescription>Configure API monitoring and alert settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">Automatically check API status every 30 seconds</p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check Interval (seconds)</Label>
                <Input type="number" placeholder="30" min="10" max="300" />
              </div>
              <div className="space-y-2">
                <Label>Timeout (ms)</Label>
                <Input type="number" placeholder="5000" min="1000" max="30000" />
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Configure API Keys
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>API Configuration</DialogTitle>
                  <DialogDescription>Configure API keys and endpoints for each service</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="waifu-im" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="waifu-im">Waifu.im</TabsTrigger>
                    <TabsTrigger value="waifu-pics">Waifu.pics</TabsTrigger>
                    <TabsTrigger value="nekos">Nekos.best</TabsTrigger>
                    <TabsTrigger value="wallhaven">Wallhaven</TabsTrigger>
                  </TabsList>

                  <TabsContent value="waifu-im" className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <Input value="https://api.waifu.im" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key (Optional)</Label>
                      <Input placeholder="Enter API key for higher rate limits" />
                    </div>
                  </TabsContent>

                  <TabsContent value="wallhaven" className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <Input value="https://wallhaven.cc/api/v1" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input
                        placeholder="Enter your Wallhaven API key"
                        value={settings?.wallhavenApiKey || ""}
                        onChange={(e) => updateSettings({ wallhavenApiKey: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="waifu-pics" className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <Input value="https://api.waifu.pics" readOnly />
                    </div>
                    <p className="text-sm text-muted-foreground">No API key required for this service</p>
                  </TabsContent>

                  <TabsContent value="nekos" className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <Input value="https://nekos.best/api/v2" readOnly />
                    </div>
                    <p className="text-sm text-muted-foreground">No API key required for this service</p>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
