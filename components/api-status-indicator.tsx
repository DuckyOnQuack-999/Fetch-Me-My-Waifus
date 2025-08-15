"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, XCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ApiStatus {
  name: string
  displayName: string
  url: string
  endpoint: string
  status: "online" | "offline" | "degraded" | "checking"
  latency?: number
  lastChecked: Date
  description: string
  features: string[]
  keyRequired: boolean
  keyName: keyof ReturnType<typeof useSettings>["settings"]
}

export function ApiStatusIndicator() {
  const { settings, updateSettings } = useSettings()
  const [selectedApi, setSelectedApi] = useState<ApiStatus | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    {
      name: "waifu-im",
      displayName: "Waifu.im",
      url: "https://waifu.im",
      endpoint: "https://api.waifu.im/search",
      status: "checking",
      lastChecked: new Date(),
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
      status: "checking",
      lastChecked: new Date(),
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
      status: "checking",
      lastChecked: new Date(),
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
      status: "checking",
      lastChecked: new Date(),
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
      status: "checking",
      lastChecked: new Date(),
      description: "Specialized API for femboy-themed anime content",
      features: ["Specialized Content", "Custom Categories", "Community Driven", "Regular Updates"],
      keyRequired: false,
      keyName: "femboyFinderApiKey",
    },
  ])

  const checkApiStatus = async (api: ApiStatus): Promise<ApiStatus> => {
    const startTime = Date.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const headers: Record<string, string> = {
        Accept: "application/json",
        "User-Agent": "WaifuDownloader/1.0",
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
      const latency = Date.now() - startTime

      let status: ApiStatus["status"] = "offline"
      if (response.ok) {
        status = latency > 3000 ? "degraded" : "online"
      } else if (response.status >= 500) {
        status = "degraded"
      }

      return {
        ...api,
        status,
        latency,
        lastChecked: new Date(),
      }
    } catch (error) {
      return {
        ...api,
        status: "offline",
        latency: Date.now() - startTime,
        lastChecked: new Date(),
      }
    }
  }

  const checkAllApis = async () => {
    setIsRefreshing(true)
    try {
      const promises = apiStatuses.map((api) => checkApiStatus(api))
      const results = await Promise.all(promises)
      setApiStatuses(results)
      toast.success("API status updated successfully")
    } catch (error) {
      toast.error("Failed to update API status")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkAllApis()
    const interval = setInterval(checkAllApis, 45000) // Check every 45 seconds
    return () => clearInterval(interval)
  }, [settings])

  const getStatusIcon = (status: ApiStatus["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "offline":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "checking":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
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
      setTimeout(
        () =>
          checkApiStatus(selectedApi).then((updated) => {
            setApiStatuses((prev) => prev.map((api) => (api.name === updated.name ? updated : api)))
          }),
        1000,
      )
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
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
            <CardTitle className="text-lg font-semibold">API Status Dashboard</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
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
                  <div className="text-xs text-muted-foreground">{formatLatency(api.latency)}</div>
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
                  <div className="mt-1">{formatLatency(selectedApi.latency)}</div>
                </div>
                <div>
                  <span className="font-medium">Last Checked:</span>
                  <div className="mt-1">{selectedApi.lastChecked.toLocaleTimeString()}</div>
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
