"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WaifuDownloaderLogo } from "@/components/waifu-downloader-logo"
import { Eye, EyeOff, Key, Shield, User, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ApiKey {
  name: string
  key: string
  status: "valid" | "invalid" | "checking"
  description: string
  required: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      name: "Wallhaven",
      key: "",
      status: "checking",
      description: "High-quality wallpapers and anime images",
      required: true,
    },
    {
      name: "Waifu.im",
      key: "",
      status: "checking",
      description: "Curated anime character images",
      required: false,
    },
    {
      name: "Waifu.pics",
      key: "",
      status: "checking",
      description: "SFW and NSFW anime images",
      required: false,
    },
    {
      name: "Nekos.best",
      key: "",
      status: "checking",
      description: "Neko and anime character images",
      required: false,
    },
  ])

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem("waifu-downloader-api-keys")
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys)
        setApiKeys((prev) =>
          prev.map((api) => ({
            ...api,
            key: parsed[api.name.toLowerCase()] || "",
            status: parsed[api.name.toLowerCase()] ? "valid" : "checking",
          })),
        )
      } catch (error) {
        console.error("Failed to load saved API keys:", error)
      }
    }

    // Set Wallhaven key from environment if available
    if (process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY) {
      setApiKeys((prev) =>
        prev.map((api) =>
          api.name === "Wallhaven" ? { ...api, key: process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY!, status: "valid" } : api,
        ),
      )
    }
  }, [])

  const togglePasswordVisibility = (apiName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [apiName]: !prev[apiName],
    }))
  }

  const updateApiKey = (apiName: string, key: string) => {
    setApiKeys((prev) =>
      prev.map((api) => (api.name === apiName ? { ...api, key, status: key ? "valid" : "checking" } : api)),
    )
  }

  const validateApiKey = async (api: ApiKey): Promise<boolean> => {
    if (!api.key) return !api.required

    // Simulate API validation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple validation - just check if key is not empty
        resolve(api.key.length > 10)
      }, 1000)
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate all API keys
      const validationPromises = apiKeys.map(async (api) => {
        const isValid = await validateApiKey(api)
        return { ...api, status: isValid ? "valid" : ("invalid" as const) }
      })

      const validatedKeys = await Promise.all(validationPromises)
      setApiKeys(validatedKeys)

      // Check if required keys are valid
      const requiredKeysValid = validatedKeys.filter((api) => api.required).every((api) => api.status === "valid")

      if (!requiredKeysValid) {
        toast.error("Please provide valid required API keys")
        return
      }

      // Save API keys to localStorage
      const keysToSave = validatedKeys.reduce(
        (acc, api) => {
          if (api.key) {
            acc[api.name.toLowerCase()] = api.key
          }
          return acc
        },
        {} as Record<string, string>,
      )

      localStorage.setItem("waifu-downloader-api-keys", JSON.stringify(keysToSave))
      localStorage.setItem("waifu-downloader-authenticated", "true")

      toast.success("Authentication successful!")

      // Redirect to main app
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("waifu-downloader-authenticated", "true")
    toast.info("Skipped authentication - some features may be limited")
    router.push("/")
  }

  const getStatusIcon = (status: ApiKey["status"]) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "invalid":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Key className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: ApiKey["status"]) => {
    switch (status) {
      case "valid":
        return "border-green-500"
      case "invalid":
        return "border-red-500"
      default:
        return "border-muted"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <WaifuDownloaderLogo className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-lg">Sign in to your Waifu Downloader account</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your API keys are stored locally and never transmitted to our servers. They are only used to
                authenticate with the respective image APIs.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="space-y-4">
              {apiKeys.map((api, index) => (
                <motion.div
                  key={api.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-colors ${getStatusColor(api.status)}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">{api.name}</Label>
                        {api.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {getStatusIcon(api.status)}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{api.description}</p>

                    <div className="relative">
                      <Input
                        type={showPasswords[api.name] ? "text" : "password"}
                        placeholder={`Enter ${api.name} API key...`}
                        value={api.key}
                        onChange={(e) => updateApiKey(api.name, e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility(api.name)}
                      >
                        {showPasswords[api.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleLogin} disabled={isLoading} className="flex-1 h-12 text-base font-medium">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Continue with API Keys
                  </div>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isLoading}
                className="flex-1 h-12 text-base font-medium bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Skip for Now
                </div>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Don't have API keys?{" "}
                <a
                  href="https://wallhaven.cc/settings/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Get Wallhaven API key
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
