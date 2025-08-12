"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Home, Key } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSettings } from "@/context/settingsContext"

type ApiStatus = "online" | "offline" | "degraded" | "checking"

interface ApiSource {
  name: string
  status: ApiStatus
  endpoint: string
  keyName: keyof typeof settings
}

export function ApiStatusIndicator() {
  const router = useRouter()
  const { settings, updateSettings } = useSettings()
  const [apiSources, setApiSources] = useState<ApiSource[]>([
    { name: "Waifu.im", status: "checking", endpoint: "https://api.waifu.im/search", keyName: "waifuImApiKey" },
    {
      name: "Waifu Pics",
      status: "checking",
      endpoint: "https://api.waifu.pics/sfw/waifu",
      keyName: "waifuPicsApiKey",
    },
    { name: "Nekos.best", status: "checking", endpoint: "https://nekos.best/api/v2/neko", keyName: "nekosBestApiKey" },
  ])
  const [selectedApi, setSelectedApi] = useState<ApiSource | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const checkApiStatus = async (source: ApiSource): Promise<ApiStatus> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(source.endpoint, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return "online"
      } else if (response.status >= 500) {
        return "degraded"
      } else {
        return "offline"
      }
    } catch (error) {
      return "offline"
    }
  }

  const updateApiStatus = async () => {
    const updatedSources = await Promise.all(
      apiSources.map(async (source) => ({
        ...source,
        status: await checkApiStatus(source),
      })),
    )
    setApiSources(updatedSources)
  }

  useEffect(() => {
    updateApiStatus()
    const interval = setInterval(updateApiStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleApiClick = (source: ApiSource) => {
    setSelectedApi(source)
    setApiKey(settings[source.keyName] || "")
    setIsDialogOpen(true)
  }

  const handleSaveApiKey = () => {
    if (selectedApi) {
      updateSettings({
        [selectedApi.keyName]: apiKey,
      })
      setIsDialogOpen(false)
      // Recheck status after saving API key
      setTimeout(updateApiStatus, 1000)
    }
  }

  const getStatusColor = (status: ApiStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      case "checking":
        return "bg-gray-400 animate-pulse"
    }
  }

  const getStatusText = (status: ApiStatus) => {
    switch (status) {
      case "online":
        return "Online"
      case "degraded":
        return "Degraded"
      case "offline":
        return "Offline"
      case "checking":
        return "Checking..."
    }
  }

  return (
    <div className="flex items-center justify-between bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">API Sources:</span>
        <div className="flex items-center gap-2">
          {apiSources.map((source) => (
            <button
              key={source.name}
              onClick={() => handleApiClick(source)}
              className="group flex items-center gap-2 px-3 py-1 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(source.status)} ${source.status === "online" ? "animate-pulse" : ""}`}
              />
              <Badge variant="outline" className="text-xs">
                {source.name}
              </Badge>
              <Key className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure {selectedApi?.name} API Key</DialogTitle>
            <DialogDescription>
              Enter your API key for {selectedApi?.name}. This will be stored locally and used for API requests.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                placeholder="Enter your API key"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedApi?.status || "offline")}`} />
              Status: {getStatusText(selectedApi?.status || "offline")}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveApiKey}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
