"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Settings,
  Home,
  Key,
  Activity,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Copy,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"

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
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-3 h-3 text-yellow-500" />
      case "offline":
        return <XCircle className="w-3 h-3 text-red-500" />
      case "checking":
        return <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
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

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-md border border-primary/20 rounded-xl px-6 py-3 shadow-lg shadow-primary/5">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold text-gradient">API Sources</span>
        </div>

        <div className="flex items-center gap-3">
          <TooltipProvider delayDuration={300}>
            {apiStatuses.map((api, index) => (
              <Tooltip key={api.name}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleApiClick(api)}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-md ${getStatusColor(api.status)} animate-in slide-in-from-left-2`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {getStatusIcon(api.status)}
                    <span className="text-xs font-medium">{api.displayName}</span>
                    {api.keyRequired && (
                      <Key className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <strong>{api.displayName}</strong>
                      {getStatusIcon(api.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{api.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatLatency(api.latency)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {api.lastChecked.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={checkAllApis}
          disabled={isRefreshing}
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary transition-colors">
          <Link href="/">
            <Home className="w-4 h-4" />
          </Link>
        </Button>

        <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary transition-colors">
          <Link href="/settings">
            <Settings className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] animate-in zoom-in-95 duration-300">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              {selectedApi && getStatusIcon(selectedApi.status)}
              <DialogTitle className="text-xl font-bold text-gradient">{selectedApi?.displayName}</DialogTitle>
              <Badge variant="outline" className="ml-auto">
                {selectedApi?.status}
              </Badge>
            </div>
            <DialogDescription className="text-base">{selectedApi?.description}</DialogDescription>
          </DialogHeader>

          {selectedApi && (
            <div className="space-y-6 py-4">
              {/* API Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Endpoint</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    <code className="text-xs flex-1 truncate">{selectedApi.endpoint}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedApi.endpoint)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                    {getStatusIcon(selectedApi.status)}
                    <span className="text-sm capitalize">{selectedApi.status}</span>
                    {selectedApi.latency && (
                      <Badge variant="secondary" className="ml-auto">
                        {formatLatency(selectedApi.latency)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Features</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedApi.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="animate-in slide-in-from-left-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* API Key Configuration */}
              {selectedApi.keyRequired && (
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium">API Key Configuration</Label>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    This API requires authentication. Get your key from{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs"
                      onClick={() => window.open(selectedApi.url, "_blank")}
                    >
                      {selectedApi.url}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </p>
                </div>
              )}

              {/* Additional Settings */}
              <div className="space-y-3 p-4 border border-muted rounded-lg">
                <Label className="text-sm font-medium">Settings</Label>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">Enable Auto-retry</Label>
                    <p className="text-xs text-muted-foreground">Automatically retry failed requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm">Priority Source</Label>
                    <p className="text-xs text-muted-foreground">Use this as primary source when available</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {selectedApi?.keyRequired && (
              <Button onClick={handleSaveApiKey} className="glow-button">
                <Key className="w-4 h-4 mr-2" />
                Save API Key
              </Button>
            )}
            <Button variant="secondary" onClick={() => selectedApi && window.open(selectedApi.url, "_blank")}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
