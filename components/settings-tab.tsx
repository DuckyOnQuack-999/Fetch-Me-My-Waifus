"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Download, Upload, RefreshCw, Key, Folder, Palette, Bell, Database, Settings2 } from "lucide-react"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import type { ApiSource, ThemeMode, Language } from "@/types/waifu"

export function SettingsTab() {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings()
  const [importData, setImportData] = useState("")

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
      toast.success("Settings imported successfully")
      setImportData("")
    } else {
      toast.error("Failed to import settings - invalid format")
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      resetSettings()
      toast.success("Settings reset to defaults")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Configure your Waifu Downloader preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
          <TabsTrigger value="appearance">UI</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Configure API keys and sources for downloading images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-source">Primary API Source</Label>
                <Select
                  value={settings.apiSource}
                  onValueChange={(value: ApiSource) => updateSettings({ apiSource: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="waifu-im-key">Waifu.im API Key</Label>
                  <Input
                    id="waifu-im-key"
                    type="password"
                    value={settings.waifuImApiKey}
                    onChange={(e) => updateSettings({ waifuImApiKey: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallhaven-key">Wallhaven API Key</Label>
                  <Input
                    id="wallhaven-key"
                    type="password"
                    value={settings.wallhavenApiKey}
                    onChange={(e) => updateSettings({ wallhavenApiKey: e.target.value })}
                    placeholder="Enter API key"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Request Timeout (ms)</Label>
                  <Input
                    type="number"
                    value={settings.requestTimeout}
                    onChange={(e) => updateSettings({ requestTimeout: Number(e.target.value) })}
                    min={5000}
                    max={60000}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Limit Delay (ms)</Label>
                  <Input
                    type="number"
                    value={settings.rateLimitDelay}
                    onChange={(e) => updateSettings({ rateLimitDelay: Number(e.target.value) })}
                    min={100}
                    max={5000}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Download Settings */}
        <TabsContent value="download" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Behavior
              </CardTitle>
              <CardDescription>Configure how images are downloaded and organized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Concurrent Downloads</Label>
                  <Slider
                    value={[settings.concurrentDownloads]}
                    onValueChange={([value]) => updateSettings({ concurrentDownloads: value })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">Current: {settings.concurrentDownloads}</div>
                </div>

                <div className="space-y-2">
                  <Label>Retry Attempts</Label>
                  <Slider
                    value={[settings.retryAttempts]}
                    onValueChange={([value]) => updateSettings({ retryAttempts: value })}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">Current: {settings.retryAttempts}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow NSFW Content</Label>
                    <div className="text-sm text-muted-foreground">Enable downloading of mature content</div>
                  </div>
                  <Switch
                    checked={settings.allowNsfw}
                    onCheckedChange={(checked) => updateSettings({ allowNsfw: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Skip Duplicates</Label>
                    <div className="text-sm text-muted-foreground">Avoid downloading the same image twice</div>
                  </div>
                  <Switch
                    checked={settings.skipDuplicates}
                    onCheckedChange={(checked) => updateSettings({ skipDuplicates: checked })}
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
                    checked={settings.autoStartDownloads}
                    onCheckedChange={(checked) => updateSettings({ autoStartDownloads: checked })}
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
                    checked={settings.createSubfolders}
                    onCheckedChange={(checked) => updateSettings({ createSubfolders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Organize by Source</Label>
                    <div className="text-sm text-muted-foreground">Group files by API source</div>
                  </div>
                  <Switch
                    checked={settings.organizeBySource}
                    onCheckedChange={(checked) => updateSettings({ organizeBySource: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Organize by Category</Label>
                    <div className="text-sm text-muted-foreground">Group files by image category</div>
                  </div>
                  <Switch
                    checked={settings.organizeByCategory}
                    onCheckedChange={(checked) => updateSettings({ organizeByCategory: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="download-location">Download Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="download-location"
                    value={settings.downloadLocation}
                    onChange={(e) => updateSettings({ downloadLocation: e.target.value })}
                    placeholder="/path/to/downloads"
                  />
                  <Button variant="outline" size="icon">
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Quality & Format</CardTitle>
              <CardDescription>Set preferences for image quality and file formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Minimum Width (px)</Label>
                  <Input
                    type="number"
                    value={settings.minWidth}
                    onChange={(e) => updateSettings({ minWidth: Number(e.target.value) })}
                    min={100}
                    max={10000}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Height (px)</Label>
                  <Input
                    type="number"
                    value={settings.minHeight}
                    onChange={(e) => updateSettings({ minHeight: Number(e.target.value) })}
                    min={100}
                    max={10000}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Min File Size (KB)</Label>
                  <Input
                    type="number"
                    value={settings.minFileSize}
                    onChange={(e) => updateSettings({ minFileSize: Number(e.target.value) })}
                    min={1}
                    max={10000}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max File Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSettings({ maxFileSize: Number(e.target.value) })}
                    min={1}
                    max={1000}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Format</Label>
                <Select
                  value={settings.preferredFormat}
                  onValueChange={(value: any) => updateSettings({ preferredFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Keep Original</SelectItem>
                    <SelectItem value="jpg">Convert to JPG</SelectItem>
                    <SelectItem value="png">Convert to PNG</SelectItem>
                    <SelectItem value="webp">Convert to WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Layout
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.themeMode}
                    onValueChange={(value: ThemeMode) => updateSettings({ themeMode: value })}
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
                    value={settings.language}
                    onValueChange={(value: Language) => updateSettings({ language: value })}
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
                  value={[settings.gridColumns]}
                  onValueChange={([value]) => updateSettings({ gridColumns: value })}
                  min={2}
                  max={8}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">Current: {settings.gridColumns} columns</div>
              </div>

              <div className="space-y-2">
                <Label>Preview Image Size</Label>
                <Select
                  value={settings.previewImageSize}
                  onValueChange={(value: any) => updateSettings({ previewImageSize: value })}
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
                    checked={settings.showPreviewImages}
                    onCheckedChange={(checked) => updateSettings({ showPreviewImages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Image Details</Label>
                    <div className="text-sm text-muted-foreground">Display metadata and tags</div>
                  </div>
                  <Switch
                    checked={settings.showImageDetails}
                    onCheckedChange={(checked) => updateSettings({ showImageDetails: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <div className="text-sm text-muted-foreground">Use smaller UI elements</div>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications & Alerts
              </CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <div className="text-sm text-muted-foreground">Allow the app to show notifications</div>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Download Complete</Label>
                    <div className="text-sm text-muted-foreground">Notify when downloads finish</div>
                  </div>
                  <Switch
                    checked={settings.notifyOnDownloadComplete}
                    onCheckedChange={(checked) => updateSettings({ notifyOnDownloadComplete: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Error Notifications</Label>
                    <div className="text-sm text-muted-foreground">Notify when errors occur</div>
                  </div>
                  <Switch
                    checked={settings.notifyOnError}
                    onCheckedChange={(checked) => updateSettings({ notifyOnError: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Images Available</Label>
                    <div className="text-sm text-muted-foreground">Notify when new images are found</div>
                  </div>
                  <Switch
                    checked={settings.notifyOnNewImages}
                    onCheckedChange={(checked) => updateSettings({ notifyOnNewImages: checked })}
                    disabled={!settings.enableNotifications}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Sound</Label>
                <Select
                  value={settings.notificationSound}
                  onValueChange={(value: any) => updateSettings({ notificationSound: value })}
                  disabled={!settings.enableNotifications}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="beep">Beep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Advanced Options
              </CardTitle>
              <CardDescription>Advanced settings for power users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Max Memory Usage (MB)</Label>
                <Slider
                  value={[settings.maxMemoryUsage]}
                  onValueChange={([value]) => updateSettings({ maxMemoryUsage: value })}
                  min={512}
                  max={8192}
                  step={256}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">Current: {settings.maxMemoryUsage} MB</div>
              </div>

              <div className="space-y-2">
                <Label>Cache Size (MB)</Label>
                <Slider
                  value={[settings.maxCacheSize]}
                  onValueChange={([value]) => updateSettings({ maxCacheSize: value })}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">Current: {settings.maxCacheSize} MB</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Image Cache</Label>
                    <div className="text-sm text-muted-foreground">Cache images for faster loading</div>
                  </div>
                  <Switch
                    checked={settings.enableImageCache}
                    onCheckedChange={(checked) => updateSettings({ enableImageCache: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hardware Acceleration</Label>
                    <div className="text-sm text-muted-foreground">Use GPU for image processing</div>
                  </div>
                  <Switch
                    checked={settings.enableHardwareAcceleration}
                    onCheckedChange={(checked) => updateSettings({ enableHardwareAcceleration: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <div className="text-sm text-muted-foreground">Enable detailed logging</div>
                  </div>
                  <Switch
                    checked={settings.enableDebugMode}
                    onCheckedChange={(checked) => updateSettings({ enableDebugMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Experimental Features</Label>
                    <div className="text-sm text-muted-foreground">Enable beta features (may be unstable)</div>
                  </div>
                  <Switch
                    checked={settings.enableExperimentalFeatures}
                    onCheckedChange={(checked) => updateSettings({ enableExperimentalFeatures: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Import */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Import
              </CardTitle>
              <CardDescription>Backup your settings and import configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Export Settings</h4>
                  <p className="text-sm text-muted-foreground mb-4">Download your current settings as a JSON file</p>
                  <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Settings
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Import Settings</h4>
                  <p className="text-sm text-muted-foreground mb-4">Paste your settings JSON data below to import</p>
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
                  <p className="text-sm text-muted-foreground mb-4">Reset all settings to their default values</p>
                  <Button variant="destructive" onClick={handleReset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Backup</Label>
                    <div className="text-sm text-muted-foreground">Automatically backup settings</div>
                  </div>
                  <Switch
                    checked={settings.enableAutoBackup}
                    onCheckedChange={(checked) => updateSettings({ enableAutoBackup: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value: any) => updateSettings({ backupFrequency: value })}
                    disabled={!settings.enableAutoBackup}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
