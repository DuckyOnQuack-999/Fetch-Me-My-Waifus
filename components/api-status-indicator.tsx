"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"
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

  return null
}
