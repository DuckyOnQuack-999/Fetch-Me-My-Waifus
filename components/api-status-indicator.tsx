"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useSettings } from "@/context/settingsContext"

interface ApiStatus {
  name: string
  displayName: string
  url: string
  endpoint: string
  status: "online" | "offline" | "checking" | "error" | "degraded"
  responseTime?: number
  lastChecked?: Date
  error?: string
  description: string
  features: string[]
  keyRequired: boolean
  keyName: keyof ReturnType<typeof useSettings>["settings"]
}

const API_ENDPOINTS: Omit<ApiStatus, "status" | "responseTime" | "lastChecked" | "error">[] = [
  {
    name: "waifu-im",
    displayName: "Waifu.im",
    url: "https://waifu.im",
    endpoint: "https://api.waifu.im/search",
    description: "High-quality anime images with advanced filtering and tagging system",
    features: ["SFW/NSFW Content", "Advanced Tags", "High Resolution", "Multiple Formats"],
    keyRequired: false,
    keyName: "waifuImApiKey",
  },
  {
    name: "waifu-pics",
    displayName: "Waifu Pics",
    url: "https://waifu.pics",
    endpoint: "https://api.waifu.pics/sfw/waifu",
    description: "Simple and fast anime image API with categorized content",
    features: ["SFW/NSFW Categories", "Fast Response", "No Rate Limits", "JSON API"],
    keyRequired: false,
    keyName: "waifuPicsApiKey",
  },
  {
    name: "nekos-best",
    displayName: "Nekos.best",
    url: "https://nekos.best",
    endpoint: "https://nekos.best/api/v2/neko",
    description: "Curated collection of high-quality anime images and GIFs",
    features: ["High Quality", "Multiple Categories", "GIF Support", "Artist Credits"],
    keyRequired: false,
    keyName: "nekosBestApiKey",
  },
  {
    name: "wallhaven",
    displayName: "Wallhaven",
    url: "https://wallhaven.cc",
    endpoint: "https://wallhaven.cc/api/v1/search",
    description: "Premium wallpaper collection with advanced search capabilities",
    features: ["4K+ Resolution", "Advanced Search", "Collections", "User Uploads"],
    keyRequired: true,
    keyName: "wallhavenApiKey",
  },
  {
    name: "femboy-finder",
    displayName: "Femboy Finder",
    url: "https://femboyfinder.firestreaker2.gq",
    endpoint: "https://femboyfinder.firestreaker2.gq/api",
    description: "Specialized API for femboy-themed anime content",
    features: ["Specialized Content", "Custom Categories", "Community Driven", "Regular Updates"],
    keyRequired: false,
    keyName: "femboyFinderApiKey",
  },
]

export function ApiStatusIndicator() {
  const { settings, updateSettings } = useSettings()
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>(
    API_ENDPOINTS.map((endpoint) => ({
      ...endpoint,
      status: "checking" as const,
      lastChecked: new Date(),
    })),
  )
  const [selectedApi, setSelectedApi] = useState<ApiStatus | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkApiStatus = async (
    api: Omit<ApiStatus, "status" | "responseTime" | "lastChecked" | "error">,
  ): Promise<ApiStatus> => {
    const startTime = Date.now()

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const headers: Record<string, string> = {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/7.0.0",
      }

      // Add API key if required and available
      if (api.keyRequired && settings?.[api.keyName]) {
        if (api.name === "wallhaven") {
          headers["X-API-Key"] = settings[api.keyName] as string
        } else {
          headers["Authorization"] = `Bearer ${settings[api.keyName]}`
        }
      }

      const response = await fetch(api.endpoint, {
        method: "HEAD",
        signal: controller.signal,
        headers,
        mode: "cors",
        cache: "no-cache",
      })

      clearTimeout(timeoutId)
      const responseTime = Date.now() - startTime

      let status: ApiStatus["status"] = "offline"
      if (response.ok) {
        status = responseTime > 3000 ? "degraded" : "online"
      } else if (response.status >= 500) {
        status = "degraded"
      } else if (response.status === 401 || response.status === 403) {
        status = "error"
      }

      return {
        ...api,
        status,
        responseTime,
        lastChecked: new Date(),
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        ...api,
        status: "offline",
        responseTime,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Connection failed",
      }
    }
  }

  const checkAllApis = async () => {
    setIsRefreshing(true)

    try {
      const statusPromises = API_ENDPOINTS.map(checkApiStatus)
      const results = await Promise.all(statusPromises)
      setApiStatuses(results)

      const onlineCount = results.filter((r) => r.status === "online").length
      const totalCount = results.length

      if (onlineCount === totalCount) {
        toast.success("All APIs are online and operational")
      } else if (onlineCount > 0) {
        toast.warning(`${onlineCount}/${totalCount} APIs are online`)
      } else {
        toast.error("All APIs are currently offline")
      }
    } catch (error) {
      toast.error("Failed to check API status")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkAllApis()
    const interval = setInterval(checkAllApis, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [settings])

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "checking":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return "border-green-500/50 bg-green-500/10 hover:bg-green-500/20"
      case "degraded":
        return "border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20"
      case "offline":
        return "border-red-500/50 bg-red-500/10 hover:bg-red-500/20"
      case "error":
        return "border-red-500/50 bg-red-500/10 hover:bg-red-500/20"
      case "checking":
        return "border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20"
    }
  }

  const getStatusText = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return "Online"
      case "degraded":
        return "Degraded"
      case "offline":
        return "Offline"
      case "error":
        return "Error"
      case "checking":
        return "Checking..."
    }
  }

  const handleApiClick = (api: ApiStatus) => {
    setSelectedApi(api)
    setApiKey((settings?.[api.keyName] as string) || "")
    setIsDialogOpen(true)
  }

  const handleSaveApiKey = () => {
    if (selectedApi && apiKey.trim()) {
      updateSettings({
        [selectedApi.keyName]: apiKey.trim(),
      })
      toast.success(`${selectedApi.displayName} API key saved successfully`)
      setIsDialogOpen(false)
      // Recheck status after saving
      setTimeout(() => {
        checkApiStatus(selectedApi).then((updated) => {
          setApiStatuses((prev) => prev.map((api) => (api.name === updated.name ? updated : api)))
        })
      }, 1000)
    }
  }

  const formatLatency = (latency?: number) => {
    if (!latency) return "N/A"
    if (latency < 1000) return `${latency}ms`
    return `${(latency / 1000).toFixed(1)}s`
  }

  const onlineCount = apiStatuses.filter((api) => api.status === "online").length
  const totalCount = apiStatuses.length

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              API Status Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant={onlineCount === totalCount ? "default" : onlineCount > 0 ? "secondary" : "destructive"}
                className="text-xs"
              >
                {onlineCount}/{totalCount} Online
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkAllApis}
                    disabled={isRefreshing}
                    className="h-8 w-8 p-0 bg-transparent"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh API Status</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiStatuses.map((api) => (
            <div
              key={api.name}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${getStatusColor(api.status)}`}
              onClick={() => handleApiClick(api)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(api.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{api.displayName}</span>
                      {api.keyRequired && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          Key Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{api.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium">{getStatusText(api.status)}</div>
                  <div className="text-xs text-muted-foreground">{formatLatency(api.responseTime)}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedApi && getStatusIcon(selectedApi.status)}
              {selectedApi?.displayName} Configuration
            </DialogTitle>
          </DialogHeader>
          {selectedApi && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span>
                  <div className="flex items-center gap-1 mt-1">
                    {getStatusIcon(selectedApi.status)}
                    <span>{getStatusText(selectedApi.status)}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Latency:</span>
                  <div className="mt-1">{formatLatency(selectedApi.responseTime)}</div>
                </div>
                <div>
                  <span className="font-medium">Last Checked:</span>
                  <div className="mt-1">{selectedApi.lastChecked?.toLocaleTimeString()}</div>
                </div>
                <div>
                  <span className="font-medium">Website:</span>
                  <div className="mt-1">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => window.open(selectedApi.url, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Site
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedApi.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedApi.error && (
                <>
                  <Separator />
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      Error Details
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{selectedApi.error}</p>
                  </div>
                </>
              )}

              {selectedApi.keyRequired && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Your API key is stored locally and never shared.</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
                      Save Key
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
