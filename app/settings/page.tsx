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
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Key, Download, Palette, Shield, Database, Save, RotateCcw, Upload, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useSettings } from "@/context/settingsContext"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"
import { toast } from "sonner"

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)
  const [importData, setImportData] = useState("")

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

  const handleExport = () => {
    const data = exportSettings()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "waifu-downloader-settings.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Settings exported successfully")
  }

  const handleImport = () => {
    if (!importData.trim()) {
      toast.error("Please paste settings data first")
      return
    }

    if (importSettings(importData)) {
      setLocalSettings(settings)
      setHasChanges(false)
      toast.success("Settings imported successfully")
      setImportData("")
    } else {
      toast.error("Failed to import settings - invalid format")
    }
  }

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      resetSettings()
      setLocalSettings(settings)
      setHasChanges(false)
      toast.success("Settings reset to defaults")
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>

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
              <TabsList className="grid w-full grid-cols-6">
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
                <TabsTrigger value="backup" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Backup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="api" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
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
                          <Label htmlFor="waifu-im-key">Waifu.im API Key (Optional)</Label>
                          <Input
                            id="waifu-im-key"
                            type="password"
                            placeholder="Enter your Waifu.im API key"
                            value={localSettings.waifuImApiKey || ""}
                            onChange={(e) => handleSettingChange("waifuImApiKey", e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Optional API key for enhanced Waifu.im features
                          </p>
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
                              <SelectItem value="all">All Sources</SelectItem>
                              <SelectItem value="waifu.im">Waifu.im</SelectItem>
                              <SelectItem value="waifu.pics">Waifu.pics</SelectItem>
                              <SelectItem value="nekos.best">Nekos.best</SelectItem>
                              <SelectItem value="wallhaven">Wallhaven</SelectItem>
                              <SelectItem value="femboyfinder">FemboyFinder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Request Timeout (seconds)</Label>
                            <Input
                              type="number"
                              value={localSettings.requestTimeout || 30}
                              onChange={(e) => handleSettingChange("requestTimeout", Number(e.target.value))}
                              min={5}
                              max={300}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Rate Limit Delay (ms)</Label>
                            <Input
                              type="number"
                              value={localSettings.rateLimitDelay || 1000}
                              onChange={(e) => handleSettingChange("rateLimitDelay", Number(e.target.value))}
                              min={100}
                              max={5000}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="download" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
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
                            value={localSettings.downloadLocation || ""}
                            onChange={(e) => handleSettingChange("downloadLocation", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Concurrent Downloads</Label>
                            <Slider
                              value={[localSettings.concurrentDownloads || 3]}
                              onValueChange={([value]) => handleSettingChange("concurrentDownloads", value)}
                              min={1}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-sm text-muted-foreground">
                              Current: {localSettings.concurrentDownloads || 3}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Retry Attempts</Label>
                            <Slider
                              value={[localSettings.retryAttempts || 3]}
                              onValueChange={([value]) => handleSettingChange("retryAttempts", value)}
                              min={0}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-sm text-muted-foreground">
                              Current: {localSettings.retryAttempts || 3}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Allow NSFW Content</Label>
                              <div className="text-sm text-muted-foreground">Enable downloading of mature content</div>
                            </div>
                            <Switch
                              checked={localSettings.enableNsfw || false}
                              onCheckedChange={(checked) => handleSettingChange("enableNsfw", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Skip Duplicates</Label>
                              <div className="text-sm text-muted-foreground">
                                Avoid downloading the same image twice
                              </div>
                            </div>
                            <Switch
                              checked={localSettings.skipDuplicates !== false}
                              onCheckedChange={(checked) => handleSettingChange("skipDuplicates", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Auto-start Downloads</Label>
                              <div className="text-sm text-muted-foreground">
                                Start downloads automatically when added to queue
                              </div>
                            </div>
                            <Switch
                              checked={localSettings.autoStartDownloads !== false}
                              onCheckedChange={(checked) => handleSettingChange("autoStartDownloads", checked)}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h4 className="font-medium">File Organization</h4>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Create Subfolders</Label>
                              <div className="text-sm text-muted-foreground">Organize files into subfolders</div>
                            </div>
                            <Switch
                              checked={localSettings.createSubfolders || false}
                              onCheckedChange={(checked) => handleSettingChange("createSubfolders", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Organize by Source</Label>
                              <div className="text-sm text-muted-foreground">Group files by API source</div>
                            </div>
                            <Switch
                              checked={localSettings.organizeBySource || false}
                              onCheckedChange={(checked) => handleSettingChange("organizeBySource", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Organize by Category</Label>
                              <div className="text-sm text-muted-foreground">Group files by image category</div>
                            </div>
                            <Switch
                              checked={localSettings.organizeByCategory || false}
                              onCheckedChange={(checked) => handleSettingChange("organizeByCategory", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>Customize the look and feel of the application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Theme</Label>
                            <Select
                              value={localSettings.themeMode || "system"}
                              onValueChange={(value) => handleSettingChange("themeMode", value)}
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
                            <Label>Language</Label>
                            <Select
                              value={localSettings.language || "en"}
                              onValueChange={(value) => handleSettingChange("language", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ja">Japanese</SelectItem>
                                <SelectItem value="ko">Korean</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Grid Columns</Label>
                          <Slider
                            value={[localSettings.gridColumns || 4]}
                            onValueChange={([value]) => handleSettingChange("gridColumns", value)}
                            min={2}
                            max={8}
                            step={1}
                            className="w-full"
                          />
                          <div className="text-sm text-muted-foreground">
                            Current: {localSettings.gridColumns || 4} columns
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Preview Image Size</Label>
                          <Select
                            value={localSettings.previewImageSize || "medium"}
                            onValueChange={(value) => handleSettingChange("previewImageSize", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Show Preview Images</Label>
                              <div className="text-sm text-muted-foreground">Display image thumbnails in lists</div>
                            </div>
                            <Switch
                              checked={localSettings.showPreviewImages !== false}
                              onCheckedChange={(checked) => handleSettingChange("showPreviewImages", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Show Image Details</Label>
                              <div className="text-sm text-muted-foreground">Display metadata and tags</div>
                            </div>
                            <Switch
                              checked={localSettings.showImageDetails !== false}
                              onCheckedChange={(checked) => handleSettingChange("showImageDetails", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Compact Mode</Label>
                              <div className="text-sm text-muted-foreground">Use smaller UI elements</div>
                            </div>
                            <Switch
                              checked={localSettings.compactMode || false}
                              onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Content Settings</CardTitle>
                      <CardDescription>Control content filtering and privacy options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>NSFW Content</Label>
                            <div className="text-sm text-muted-foreground">Allow not-safe-for-work content</div>
                          </div>
                          <Switch
                            checked={localSettings.enableNsfw || false}
                            onCheckedChange={(checked) => handleSettingChange("enableNsfw", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Content Warnings</Label>
                            <div className="text-sm text-muted-foreground">
                              Show warnings for potentially sensitive content
                            </div>
                          </div>
                          <Switch
                            checked={localSettings.showContentWarnings !== false}
                            onCheckedChange={(checked) => handleSettingChange("showContentWarnings", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Analytics</Label>
                            <div className="text-sm text-muted-foreground">
                              Help improve the app by sharing anonymous usage data
                            </div>
                          </div>
                          <Switch
                            checked={localSettings.enableAnalytics || false}
                            onCheckedChange={(checked) => handleSettingChange("enableAnalytics", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Crash Reports</Label>
                            <div className="text-sm text-muted-foreground">
                              Automatically send crash reports to help fix bugs
                            </div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                      <CardDescription>Advanced configuration options for power users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Cache Size (MB)</Label>
                            <Slider
                              value={[localSettings.maxCacheSize || 1000]}
                              onValueChange={([value]) => handleSettingChange("maxCacheSize", value)}
                              min={100}
                              max={5000}
                              step={100}
                              className="w-full"
                            />
                            <div className="text-sm text-muted-foreground">
                              Current: {localSettings.maxCacheSize || 1000} MB
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Max Memory Usage (MB)</Label>
                            <Slider
                              value={[localSettings.maxMemoryUsage || 2048]}
                              onValueChange={([value]) => handleSettingChange("maxMemoryUsage", value)}
                              min={512}
                              max={8192}
                              step={256}
                              className="w-full"
                            />
                            <div className="text-sm text-muted-foreground">
                              Current: {localSettings.maxMemoryUsage || 2048} MB
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Enable Image Cache</Label>
                              <div className="text-sm text-muted-foreground">Cache images for faster loading</div>
                            </div>
                            <Switch
                              checked={localSettings.enableImageCache !== false}
                              onCheckedChange={(checked) => handleSettingChange("enableImageCache", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Hardware Acceleration</Label>
                              <div className="text-sm text-muted-foreground">Use GPU for image processing</div>
                            </div>
                            <Switch
                              checked={localSettings.enableHardwareAcceleration || false}
                              onCheckedChange={(checked) => handleSettingChange("enableHardwareAcceleration", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Debug Mode</Label>
                              <div className="text-sm text-muted-foreground">Enable detailed logging</div>
                            </div>
                            <Switch
                              checked={localSettings.enableDebugMode || false}
                              onCheckedChange={(checked) => handleSettingChange("enableDebugMode", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Experimental Features</Label>
                              <div className="text-sm text-muted-foreground">
                                Enable beta features (may be unstable)
                              </div>
                            </div>
                            <Switch
                              checked={localSettings.enableExperimentalFeatures || false}
                              onCheckedChange={(checked) => handleSettingChange("enableExperimentalFeatures", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="backup" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Backup & Import</CardTitle>
                      <CardDescription>Backup your settings and import configurations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Export Settings</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Download your current settings as a JSON file
                          </p>
                          <Button onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Settings
                          </Button>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-2">Import Settings</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Paste your settings JSON data below to import
                          </p>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Paste your settings JSON here..."
                              value={importData}
                              onChange={(e) => setImportData(e.target.value)}
                              rows={6}
                            />
                            <div className="flex gap-2">
                              <Button onClick={handleImport} disabled={!importData.trim()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import Settings
                              </Button>
                              <Button variant="outline" onClick={() => setImportData("")}>
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-2">Reset Settings</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Reset all settings to their default values
                          </p>
                          <Button variant="destructive" onClick={handleResetToDefaults}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset to Defaults
                          </Button>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Auto Backup</Label>
                              <div className="text-sm text-muted-foreground">Automatically backup settings</div>
                            </div>
                            <Switch
                              checked={localSettings.enableAutoBackup || false}
                              onCheckedChange={(checked) => handleSettingChange("enableAutoBackup", checked)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Backup Frequency</Label>
                            <Select
                              value={localSettings.backupFrequency || "weekly"}
                              onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                              disabled={!localSettings.enableAutoBackup}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

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
      </SidebarInset>
    </SidebarProvider>
  )
}
