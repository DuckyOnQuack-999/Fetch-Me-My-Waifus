"use client"

import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Settings, Home } from "lucide-react"
import Link from "next/link"

interface ApiStatus {
  name: string
  url: string
  status: "online" | "offline" | "degraded"
  latency?: number
  lastChecked: Date
}

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { name: "Waifu.im", url: "https://api.waifu.im", status: "offline", lastChecked: new Date() },
    { name: "Waifu Pics", url: "https://api.waifu.pics", status: "offline", lastChecked: new Date() },
    { name: "Nekos.best", url: "https://nekos.best/api/v2", status: "offline", lastChecked: new Date() },
    { name: "Wallhaven", url: "https://wallhaven.cc/api/v1", status: "offline", lastChecked: new Date() },
    { name: "Femboy Finder", url: "https://femboyfinder.firestreaker2.gq", status: "offline", lastChecked: new Date() },
  ])

  const checkApiStatus = async (api: ApiStatus): Promise<ApiStatus> => {
    const startTime = Date.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(api.url, {
        method: "HEAD",
        signal: controller.signal,
        mode: "no-cors", // Handle CORS issues
      })

      clearTimeout(timeoutId)
      const latency = Date.now() - startTime

      return {
        ...api,
        status: latency > 2000 ? "degraded" : "online",
        latency,
        lastChecked: new Date(),
      }
    } catch (error) {
      return {
        ...api,
        status: "offline",
        lastChecked: new Date(),
      }
    }
  }

  const checkAllApis = async () => {
    const promises = apiStatuses.map(checkApiStatus)
    const results = await Promise.all(promises)
    setApiStatuses(results)
  }

  useEffect(() => {
    checkAllApis()
    const interval = setInterval(checkAllApis, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ApiStatus["status"]) => {
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

  const getStatusText = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return "Online"
      case "degraded":
        return "Slow"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex items-center justify-between bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">API Sources:</span>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {apiStatuses.map((api) => (
              <Tooltip key={api.name}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(api.status)}`} />
                    <span className="text-xs text-muted-foreground">{api.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>
                      <strong>{api.name}</strong>
                    </p>
                    <p>Status: {getStatusText(api.status)}</p>
                    {api.latency && <p>Latency: {api.latency}ms</p>}
                    <p>Last checked: {api.lastChecked.toLocaleTimeString()}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
