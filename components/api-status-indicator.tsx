"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettings } from "@/context/settingsContext"

type ApiStatus = "online" | "offline" | "degraded" | "unknown"

interface ApiStatusData {
  name: string
  status: ApiStatus
  latency: number
  lastChecked: Date
}

export function ApiStatusIndicator() {
  const { settings } = useSettings()
  const [apiStatuses, setApiStatuses] = useState<ApiStatusData[]>([
    { name: "Waifu.im", status: "unknown", latency: 0, lastChecked: new Date() },
    { name: "Waifu Pics", status: "unknown", latency: 0, lastChecked: new Date() },
    { name: "Nekos.best", status: "unknown", latency: 0, lastChecked: new Date() },
    { name: "Wallhaven", status: "unknown", latency: 0, lastChecked: new Date() },
    { name: "Femboy Finder", status: "unknown", latency: 0, lastChecked: new Date() },
  ])

  // Function to check API status
  const checkApiStatus = async () => {
    const updatedStatuses = [...apiStatuses]

    // Check Waifu.im
    try {
      const startTime = performance.now()
      const response = await fetch("https://api.waifu.im/health", {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
        headers: settings?.waifuImApiKey ? { Authorization: settings.waifuImApiKey } : {},
      })
      const endTime = performance.now()
      updatedStatuses[0] = {
        name: "Waifu.im",
        status: response.ok ? "online" : "degraded",
        latency: Math.round(endTime - startTime),
        lastChecked: new Date(),
      }
    } catch (error) {
      updatedStatuses[0] = {
        ...updatedStatuses[0],
        status: "offline",
        lastChecked: new Date(),
      }
    }

    // Check Waifu Pics
    try {
      const startTime = performance.now()
      const response = await fetch("https://api.waifu.pics/endpoints", {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      })
      const endTime = performance.now()
      updatedStatuses[1] = {
        name: "Waifu Pics",
        status: response.ok ? "online" : "degraded",
        latency: Math.round(endTime - startTime),
        lastChecked: new Date(),
      }
    } catch (error) {
      updatedStatuses[1] = {
        ...updatedStatuses[1],
        status: "offline",
        lastChecked: new Date(),
      }
    }

    // Check Nekos.best
    try {
      const startTime = performance.now()
      const response = await fetch("https://nekos.best/api/v2/endpoints", {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      })
      const endTime = performance.now()
      updatedStatuses[2] = {
        name: "Nekos.best",
        status: response.ok ? "online" : "degraded",
        latency: Math.round(endTime - startTime),
        lastChecked: new Date(),
      }
    } catch (error) {
      updatedStatuses[2] = {
        ...updatedStatuses[2],
        status: "offline",
        lastChecked: new Date(),
      }
    }

    // Check Wallhaven
    try {
      const startTime = performance.now()
      const apiKey = settings?.wallhavenApiKey || process.env.WALLHAVEN_API_KEY || ""
      const response = await fetch(`https://wallhaven.cc/api/v1/search?apikey=${apiKey}`, {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      })
      const endTime = performance.now()
      updatedStatuses[3] = {
        name: "Wallhaven",
        status: response.ok ? "online" : "degraded",
        latency: Math.round(endTime - startTime),
        lastChecked: new Date(),
      }
    } catch (error) {
      updatedStatuses[3] = {
        ...updatedStatuses[3],
        status: "offline",
        lastChecked: new Date(),
      }
    }

    // Check Femboy Finder
    try {
      const startTime = performance.now()
      const response = await fetch("https://femboyfinder.firestreaker2.gq/api", {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      })
      const endTime = performance.now()
      updatedStatuses[4] = {
        name: "Femboy Finder",
        status: response.ok ? "online" : "degraded",
        latency: Math.round(endTime - startTime),
        lastChecked: new Date(),
      }
    } catch (error) {
      updatedStatuses[4] = {
        ...updatedStatuses[4],
        status: "offline",
        lastChecked: new Date(),
      }
    }

    setApiStatuses(updatedStatuses)
  }

  // Check API status on component mount and every 30 seconds
  useEffect(() => {
    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [settings])

  const getStatusColor = (status: ApiStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "degraded":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatLatency = (latency: number) => {
    if (latency === 0) return "N/A"
    return `${latency}ms`
  }

  return (
    <div className="flex items-center justify-between bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2 sticky top-0 z-10 mb-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">API Sources:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <TooltipProvider>
            {apiStatuses.map((api) => (
              <Tooltip key={api.name}>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(api.status)}`} />
                    {api.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>Status: {api.status}</p>
                    <p>Latency: {formatLatency(api.latency)}</p>
                    <p>Last checked: {api.lastChecked.toLocaleTimeString()}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}
