"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/context/settingsContext"
import { ApiStatusIndicator } from "./api-status-indicator"
import { toast } from "sonner"
import {
  Key,
  Download,
  Folder,
  Settings,
  Palette,
  Bell,
  Shield,
  Cloud,
  Zap,
  Cpu,
  Eye,
  Upload,
  RotateCcw,
  Import,
  Wifi,
  ImageIcon,
  AlertTriangle,
} from "lucide-react"

const RESOLUTION_PRESETS = [
  { name: "HD (720p)", width: 1280, height: 720 },
  { name: "Full HD (1080p)", width: 1920, height: 1080 },
  { name: "2K", width: 2560, height: 1440 },
  { name: "4K", width: 3840, height: 2160 },
  { name: "8K", width: 7680, height: 4320 },
  { name: "Mobile HD", width: 720, height: 1280 },
  { name: "Mobile Full HD", width: 1080, height: 1920 },
]

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
]

export function SettingsPage() {
  const router = useRouter()
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useSettings()
  const [importText, setImportText] = useState("")

  const handleExportSettings = () => {
    const exported = exportSettings()
    navigator.clipboard.writeText(exported)
    toast.success("Settings exported to clipboard!")
  }

  const handleImportSettings = () => {
    if (importSettings(importText)) {
      toast.success("Settings imported successfully!")
      setImportText("")
    } else {
      toast.error("Failed to import settings. Please check the format.")
    }
  }

  const handleResetSettings = () => {
    resetSettings()
    toast.success("Settings reset to defaults!")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Settings</h1>
          <p className="text-muted-foreground">Configure your Waifu Downloader preferences</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportSettings} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleResetSettings} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>

      <ApiStatusIndicator />

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="api-keys" className="flex items-center gap-1">
            <Key className="w-3 h-3" />
            API
          </TabsTrigger>
          <TabsTrigger value="download" className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            Download
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1">
            <Palette className="w-3 h-3" />
            UI
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="w-3 h-3" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Enter your API keys for each source to enable downloading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="waifu-im-key">Waifu.im API Key</Label>
                <Input
                  id="waifu-im-key"
                  type="password"
                  value={settings.waifuImApiKey}
                  onChange={(e) => updateSettings({ waifuImApiKey: e.target.value })}
                  placeholder="Enter Waifu.im API Key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallhaven-key">Wallhaven API Key</Label>
                <Input
                  id="wallhaven-key"
                  type="password"
                  value={settings.wallhavenApiKey}
                  onChange={(e) => updateSettings({ wallhavenApiKey: e.target.value })}
                  placeholder="Enter Wallhaven API Key"
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="request-timeout">Request Timeout (ms)</Label>
                  <Input
                    id="request-timeout"
                    type="number"
                    value={settings.requestTimeout}
                    onChange={(e) => updateSettings({ requestTimeout: Number(e.target.value) })}
                    min={5000}
                    max={120000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit Delay (ms)</Label>
                  <Input
                    id="rate-limit"
                    type="number"
                    value={settings.rateLimitDelay}
                    onChange={(e) => updateSettings({ rateLimitDelay: Number(e.target.value) })}
                    min={100}
                    max={10000}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Download Settings Tab */}
        <TabsContent value="download" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concurrent">Concurrent Downloads</Label>
                  <Input
                    id="concurrent"
                    type="number"
                    value={settings.concurrentDownloads}
                    onChange={(e) => updateSettings({ concurrentDownloads: Number(e.target.value) })}
                    min={1}
                    max={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry">Retry Attempts</Label>
                  <Input
                    id="retry"
                    type="number"
                    value={settings.retryAttempts}
                    onChange={(e) => updateSettings({ retryAttempts: Number(e.target.value) })}
                    min={0}
                    max={10}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.autoStartDownloads}
                    onCheckedChange={(checked) => updateSettings({ autoStartDownloads: checked })}
                  />
                  <Label>Auto-start Downloads</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.skipDuplicates}
                    onCheckedChange={(checked) => updateSettings({ skipDuplicates: checked })}
                  />
                  <Label>Skip Duplicates</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  File Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="download-location">Download Location</Label>
                  <Input
                    id="download-location"
                    value={settings.downloadLocation}
                    onChange={(e) => updateSettings({ downloadLocation: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.createSubfolders}
                    onCheckedChange={(checked) => updateSettings({ createSubfolders: checked })}
                  />
                  <Label>Create Subfolders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.organizeBySource}
                    onCheckedChange={(checked) => updateSettings({ organizeBySource: checked })}
                  />
                  <Label>Organize by Source</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.organizeByDate}
                    onCheckedChange={(checked) => updateSettings({ organizeByDate: checked })}
                  />
                  <Label>Organize by Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.organizeByCategory}
                    onCheckedChange={(checked) => updateSettings({ organizeByCategory: checked })}
                  />
                  <Label>Organize by Category</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Image Quality & Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-file-size">Min File Size (KB)</Label>
                  <Input
                    id="min-file-size"
                    type="number"
                    value={settings.minFileSize}
                    onChange={(e) => updateSettings({ minFileSize: Number(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSettings({ maxFileSize: Number(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred-format">Preferred Format</Label>
                <Select
                  value={settings.preferredFormat}
                  onValueChange={(value: any) => updateSettings({ preferredFormat: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="jpg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="compression">Compression Level</Label>
                <Select
                  value={settings.compressionLevel}
                  onValueChange={(value: any) => updateSettings({ compressionLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Language
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <Select
                    value={settings.themeMode}
                    onValueChange={(value: any) => updateSettings({ themeMode: value })}
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
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value: any) => updateSettings({ language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grid-columns">Grid Columns: {settings.gridColumns}</Label>
                  <Slider
                    value={[settings.gridColumns]}
                    onValueChange={([value]) => updateSettings({ gridColumns: value })}
                    min={2}
                    max={8}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preview-size">Preview Size</Label>
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
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.showPreviewImages}
                    onCheckedChange={(checked) => updateSettings({ showPreviewImages: checked })}
                  />
                  <Label>Show Preview Images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.showImageDetails}
                    onCheckedChange={(checked) => updateSettings({ showImageDetails: checked })}
                  />
                  <Label>Show Image Details</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                  />
                  <Label>Compact Mode</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
                />
                <Label>Enable Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.notifyOnDownloadComplete}
                  onCheckedChange={(checked) => updateSettings({ notifyOnDownloadComplete: checked })}
                />
                <Label>Notify on Download Complete</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.notifyOnError}
                  onCheckedChange={(checked) => updateSettings({ notifyOnError: checked })}
                />
                <Label>Notify on Errors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.notifyOnNewImages}
                  onCheckedChange={(checked) => updateSettings({ notifyOnNewImages: checked })}
                />
                <Label>Notify on New Images</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-sound">Notification Sound</Label>
                <Select
                  value={settings.notificationSound}
                  onValueChange={(value: any) => updateSettings({ notificationSound: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="beep">Beep</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {settings.notificationSound === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-sound">Custom Sound Path</Label>
                  <Input
                    id="custom-sound"
                    value={settings.customSoundPath}
                    onChange={(e) => updateSettings({ customSoundPath: e.target.value })}
                    placeholder="Path to custom sound file"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Memory & Cache
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max-memory">Max Memory Usage (MB): {settings.maxMemoryUsage}</Label>
                  <Slider
                    value={[settings.maxMemoryUsage]}
                    onValueChange={([value]) => updateSettings({ maxMemoryUsage: value })}
                    min={512}
                    max={8192}
                    step={256}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-size">Max Cache Size (MB): {settings.maxCacheSize}</Label>
                  <Slider
                    value={[settings.maxCacheSize]}
                    onValueChange={([value]) => updateSettings({ maxCacheSize: value })}
                    min={100}
                    max={10240}
                    step={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-expiry">Cache Expiry (days)</Label>
                  <Input
                    id="cache-expiry"
                    type="number"
                    value={settings.cacheExpiryDays}
                    onChange={(e) => updateSettings({ cacheExpiryDays: Number(e.target.value) })}
                    min={1}
                    max={365}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableImageCache}
                    onCheckedChange={(checked) => updateSettings({ enableImageCache: checked })}
                  />
                  <Label>Enable Image Cache</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableHardwareAcceleration}
                    onCheckedChange={(checked) => updateSettings({ enableHardwareAcceleration: checked })}
                  />
                  <Label>Hardware Acceleration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.preloadImages}
                    onCheckedChange={(checked) => updateSettings({ preloadImages: checked })}
                  />
                  <Label>Preload Images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableLazyLoading}
                    onCheckedChange={(checked) => updateSettings({ enableLazyLoading: checked })}
                  />
                  <Label>Lazy Loading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.createThumbnails}
                    onCheckedChange={(checked) => updateSettings({ createThumbnails: checked })}
                  />
                  <Label>Create Thumbnails</Label>
                </div>
                {settings.createThumbnails && (
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-size">Thumbnail Size: {settings.thumbnailSize}px</Label>
                    <Slider
                      value={[settings.thumbnailSize]}
                      onValueChange={([value]) => updateSettings({ thumbnailSize: value })}
                      min={100}
                      max={500}
                      step={50}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => updateSettings({ enableAnalytics: checked })}
                  />
                  <Label>Enable Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.shareUsageData}
                    onCheckedChange={(checked) => updateSettings({ shareUsageData: checked })}
                  />
                  <Label>Share Usage Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableContentFiltering}
                    onCheckedChange={(checked) => updateSettings({ enableContentFiltering: checked })}
                  />
                  <Label>Enable Content Filtering</Label>
                </div>
                {settings.enableContentFiltering && (
                  <div className="space-y-2">
                    <Label htmlFor="blocked-tags">Blocked Tags (comma-separated)</Label>
                    <Textarea
                      id="blocked-tags"
                      value={settings.blockedTags.join(", ")}
                      onChange={(e) =>
                        updateSettings({
                          blockedTags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Network & Proxy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableProxySupport}
                    onCheckedChange={(checked) => updateSettings({ enableProxySupport: checked })}
                  />
                  <Label>Enable Proxy Support</Label>
                </div>
                {settings.enableProxySupport && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="proxy-url">Proxy URL</Label>
                      <Input
                        id="proxy-url"
                        value={settings.proxyUrl}
                        onChange={(e) => updateSettings({ proxyUrl: e.target.value })}
                        placeholder="http://proxy.example.com:8080"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proxy-username">Proxy Username</Label>
                      <Input
                        id="proxy-username"
                        value={settings.proxyUsername}
                        onChange={(e) => updateSettings({ proxyUsername: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proxy-password">Proxy Password</Label>
                      <Input
                        id="proxy-password"
                        type="password"
                        value={settings.proxyPassword}
                        onChange={(e) => updateSettings({ proxyPassword: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Backup & Sync Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.enableAutoBackup}
                  onCheckedChange={(checked) => updateSettings({ enableAutoBackup: checked })}
                />
                <Label>Enable Auto Backup</Label>
              </div>
              {settings.enableAutoBackup && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value: any) => updateSettings({ backupFrequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-location">Backup Location</Label>
                    <Input
                      id="backup-location"
                      value={settings.backupLocation}
                      onChange={(e) => updateSettings({ backupLocation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-backups">Max Backup Files</Label>
                    <Input
                      id="max-backups"
                      type="number"
                      value={settings.maxBackupFiles}
                      onChange={(e) => updateSettings({ maxBackupFiles: Number(e.target.value) })}
                      min={1}
                      max={50}
                    />
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.enableCloudSync}
                  onCheckedChange={(checked) => updateSettings({ enableCloudSync: checked })}
                />
                <Label>Enable Cloud Sync</Label>
              </div>
              {settings.enableCloudSync && (
                <div className="space-y-2">
                  <Label htmlFor="cloud-provider">Cloud Provider</Label>
                  <Select
                    value={settings.cloudSyncProvider}
                    onValueChange={(value: any) => updateSettings({ cloudSyncProvider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="google">Google Drive</SelectItem>
                      <SelectItem value="dropbox">Dropbox</SelectItem>
                      <SelectItem value="onedrive">OneDrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Advanced Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableBatchDownload}
                    onCheckedChange={(checked) => updateSettings({ enableBatchDownload: checked })}
                  />
                  <Label>Enable Batch Download</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableScheduledDownloads}
                    onCheckedChange={(checked) => updateSettings({ enableScheduledDownloads: checked })}
                  />
                  <Label>Enable Scheduled Downloads</Label>
                </div>
                {settings.enableScheduledDownloads && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-time">Scheduled Time</Label>
                    <Input
                      id="scheduled-time"
                      type="time"
                      value={settings.scheduledDownloadTime}
                      onChange={(e) => updateSettings({ scheduledDownloadTime: e.target.value })}
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableAutoUpdate}
                    onCheckedChange={(checked) => updateSettings({ enableAutoUpdate: checked })}
                  />
                  <Label>Enable Auto Update</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableDebugMode}
                    onCheckedChange={(checked) => updateSettings({ enableDebugMode: checked })}
                  />
                  <Label>Enable Debug Mode</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Experimental Features
                </CardTitle>
                <CardDescription>
                  <Badge variant="secondary">Beta</Badge> These features are experimental and may not work as expected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableExperimentalFeatures}
                    onCheckedChange={(checked) => updateSettings({ enableExperimentalFeatures: checked })}
                  />
                  <Label>Enable Experimental Features</Label>
                </div>
                {settings.enableExperimentalFeatures && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.enableAITagging}
                        onCheckedChange={(checked) => updateSettings({ enableAITagging: checked })}
                      />
                      <Label>AI-Powered Tagging</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.enableImageUpscaling}
                        onCheckedChange={(checked) => updateSettings({ enableImageUpscaling: checked })}
                      />
                      <Label>Image Upscaling</Label>
                    </div>
                    {settings.enableImageUpscaling && (
                      <div className="space-y-2">
                        <Label htmlFor="upscaling-factor">Upscaling Factor: {settings.upscalingFactor}x</Label>
                        <Slider
                          value={[settings.upscalingFactor]}
                          onValueChange={([value]) => updateSettings({ upscalingFactor: value })}
                          min={1}
                          max={4}
                          step={1}
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.enableDuplicateDetection}
                        onCheckedChange={(checked) => updateSettings({ enableDuplicateDetection: checked })}
                      />
                      <Label>Duplicate Detection</Label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Import className="w-5 h-5" />
                Import/Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-settings">Import Settings JSON</Label>
                <Textarea
                  id="import-settings"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste settings JSON here..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleImportSettings} disabled={!importText.trim()}>
                  <Import className="w-4 h-4 mr-2" />
                  Import Settings
                </Button>
                <Button onClick={handleExportSettings} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
