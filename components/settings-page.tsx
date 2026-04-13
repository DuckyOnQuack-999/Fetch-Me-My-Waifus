"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, Key, Download, Palette, Shield, Database, Save, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"

export function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setHasChanges(false)
    toast.success("Settings saved successfully!")
  }

  const handleReset = () => {
    setLocalSettings(settings)
    setHasChanges(false)
    toast.info("Changes discarded")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>Configure your preferences and API settings</CardDescription>
            </div>

            {hasChanges && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Discard
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="download" className="gap-2">
            <Download className="h-4 w-4" />
            Downloads
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Database className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure your API keys for different image sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallhaven-key">Wallhaven API Key</Label>
                    <Input
                      id="wallhaven-key"
                      type="password"
                      placeholder="Enter your Wallhaven API key"
                      value={localSettings.wallhavenApiKey || ""}
                      onChange={(e) => handleSettingChange("wallhavenApiKey", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{" "}
                      <a
                        href="https://wallhaven.cc/settings/account"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Wallhaven Settings
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waifu-api-key">Waifu API Key (Optional)</Label>
                    <Input
                      id="waifu-api-key"
                      type="password"
                      placeholder="Enter your Waifu API key"
                      value={localSettings.waifuApiKey || ""}
                      onChange={(e) => handleSettingChange("waifuApiKey", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Optional API key for enhanced Waifu.im features</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="default-source">Default API Source</Label>
                    <Select
                      value={localSettings.apiSource || "waifu.im"}
                      onValueChange={(value) => handleSettingChange("apiSource", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waifu.im">Waifu.im</SelectItem>
                        <SelectItem value="waifu.pics">Waifu.pics</SelectItem>
                        <SelectItem value="nekos.best">Nekos.best</SelectItem>
                        <SelectItem value="wallhaven">Wallhaven</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>API Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable rate limiting to prevent API quota exhaustion
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.enableRateLimit || true}
                      onCheckedChange={(checked) => handleSettingChange("enableRateLimit", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Download Settings</CardTitle>
                <CardDescription>Configure how images are downloaded and organized</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="download-path">Download Directory</Label>
                    <Input
                      id="download-path"
                      placeholder="/path/to/downloads"
                      value={localSettings.downloadPath || ""}
                      onChange={(e) => handleSettingChange("downloadPath", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concurrent-downloads">Concurrent Downloads</Label>
                    <Select
                      value={localSettings.concurrentDownloads?.toString() || "3"}
                      onValueChange={(value) => handleSettingChange("concurrentDownloads", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="naming-pattern">File Naming Pattern</Label>
                    <Select
                      value={localSettings.namingPattern || "original"}
                      onValueChange={(value) => handleSettingChange("namingPattern", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original filename</SelectItem>
                        <SelectItem value="timestamp">Timestamp</SelectItem>
                        <SelectItem value="category">Category + timestamp</SelectItem>
                        <SelectItem value="custom">Custom pattern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-organize by Category</Label>
                      <p className="text-sm text-muted-foreground">Create subfolders for each image category</p>
                    </div>
                    <Switch
                      checked={localSettings.organizeByCategory || false}
                      onCheckedChange={(checked) => handleSettingChange("organizeByCategory", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Skip Duplicates</Label>
                      <p className="text-sm text-muted-foreground">Avoid downloading duplicate images</p>
                    </div>
                    <Switch
                      checked={localSettings.skipDuplicates || true}
                      onCheckedChange={(checked) => handleSettingChange("skipDuplicates", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={localSettings.theme || "system"}
                      onValueChange={(value) => handleSettingChange("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gallery View</Label>
                    <Select
                      value={localSettings.defaultGalleryView || "grid"}
                      onValueChange={(value) => handleSettingChange("defaultGalleryView", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Images per Page</Label>
                    <Select
                      value={localSettings.imagesPerPage?.toString() || "20"}
                      onValueChange={(value) => handleSettingChange("imagesPerPage", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth animations and transitions</p>
                    </div>
                    <Switch
                      checked={localSettings.enableAnimations !== false}
                      onCheckedChange={(checked) => handleSettingChange("enableAnimations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                    </div>
                    <Switch
                      checked={localSettings.compactMode || false}
                      onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Content Settings</CardTitle>
                <CardDescription>Control content filtering and privacy options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>NSFW Content</Label>
                      <p className="text-sm text-muted-foreground">Allow not-safe-for-work content</p>
                    </div>
                    <Switch
                      checked={localSettings.allowNsfw || false}
                      onCheckedChange={(checked) => handleSettingChange("allowNsfw", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Content Warnings</Label>
                      <p className="text-sm text-muted-foreground">Show warnings for potentially sensitive content</p>
                    </div>
                    <Switch
                      checked={localSettings.showContentWarnings !== false}
                      onCheckedChange={(checked) => handleSettingChange("showContentWarnings", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the app by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch
                      checked={localSettings.enableAnalytics || false}
                      onCheckedChange={(checked) => handleSettingChange("enableAnalytics", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Crash Reports</Label>
                      <p className="text-sm text-muted-foreground">Automatically send crash reports to help fix bugs</p>
                    </div>
                    <Switch
                      checked={localSettings.enableCrashReports !== false}
                      onCheckedChange={(checked) => handleSettingChange("enableCrashReports", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Advanced configuration options for power users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cache-size">Cache Size (MB)</Label>
                    <Input
                      id="cache-size"
                      type="number"
                      min="100"
                      max="10000"
                      value={localSettings.cacheSize || 1000}
                      onChange={(e) => handleSettingChange("cacheSize", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="request-timeout">Request Timeout (seconds)</Label>
                    <Input
                      id="request-timeout"
                      type="number"
                      min="5"
                      max="300"
                      value={localSettings.requestTimeout || 30}
                      onChange={(e) => handleSettingChange("requestTimeout", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                    </div>
                    <Switch
                      checked={localSettings.debugMode || false}
                      onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Experimental Features</Label>
                      <p className="text-sm text-muted-foreground">Enable experimental features (may be unstable)</p>
                    </div>
                    <Switch
                      checked={localSettings.experimentalFeatures || false}
                      onCheckedChange={(checked) => handleSettingChange("experimentalFeatures", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Management</h4>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Database className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Database className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>

                    <Button variant="destructive" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Save Changes Banner */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">You have unsaved changes</p>
                  <p className="text-sm opacity-90">Don't forget to save your settings</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleReset}>
                    Discard
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
