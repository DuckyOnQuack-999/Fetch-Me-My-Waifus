"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { apiService, CircuitState } from "@/services/api-circuit-breaker"

const API_SOURCES = [
  { name: "waifu.im", url: "https://api.waifu.im" },
  { name: "waifu.pics", url: "https://api.waifu.pics" },
  { name: "nekos.best", url: "https://nekos.best/api" },
  { name: "wallhaven", url: "https://wallhaven.cc/api" },
]

export function ApiStatusIndicator() {
  const [apiStatuses, setApiStatuses] = useState<Record<string, CircuitState>>({})

  useEffect(() => {
    const checkApiStatuses = () => {
      const statuses: Record<string, CircuitState> = {}
      API_SOURCES.forEach((api) => {
        statuses[api.name] = apiService.getApiStatus(api.name)
      })
      setApiStatuses(statuses)
    }

    // Check initially
    checkApiStatuses()

    // Check every 30 seconds
    const interval = setInterval(checkApiStatuses, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: CircuitState) => {
    switch (status) {
      case CircuitState.CLOSED:
        return <Wifi className="h-3 w-3 text-green-500" />
      case CircuitState.OPEN:
        return <WifiOff className="h-3 w-3 text-red-500" />
      case CircuitState.HALF_OPEN:
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />
      default:
        return <Wifi className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: CircuitState) => {
    switch (status) {
      case CircuitState.CLOSED:
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case CircuitState.OPEN:
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case CircuitState.HALF_OPEN:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="text-xs font-medium mb-2 neon-text">API Status</div>
        <div className="space-y-1">
          {API_SOURCES.map((api) => {
            const status = apiStatuses[api.name] || CircuitState.CLOSED
            return (
              <div key={api.name} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{api.name}</span>
                <Badge variant="outline" className={`text-xs px-1 py-0 ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  <span className="ml-1 capitalize">{status.toLowerCase()}</span>
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
