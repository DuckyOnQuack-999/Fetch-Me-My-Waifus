"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Key, Download, ImageIcon, Bell, Zap, Save, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import { useSettings } from "@/context/settingsContext"
import { toast } from "sonner"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

function SettingsContent() {
  const { settings, updateSettings, resetSettings } = useSettings()

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!")
  }

  const handleResetSettings = () => {
    resetSettings()
    toast.success("Settings reset to defaults")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Configure your download preferences and API settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Quality
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>Configure your API keys for different image sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="wallhaven-key">Wallhaven API Key</Label>
                    <Input
                      id="wallhaven-key"
                      type="password"
                      value={settings?.wallhavenApiKey || ""}
                      onChange={(e) => updateSettings({ wallhavenApiKey: e.target.value })}
                      placeholder="Enter your Wallhaven API key"
                    />
                    <p className="text-xs text-muted-foreground">Get your key from wallhaven.cc/settings/account</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waifu-im-key">Waifu.im API Key</Label>
                    <Input
                      id="waifu-im-key"
                      type="password"
                      value={settings?.waifuImApiKey || ""}
                      onChange={(e) => updateSettings({ waifuImApiKey: e.target.value })}
                      placeholder="Enter your Waifu.im API key"
                    />
                    <p className="text-xs text-muted-foreground">Optional - increases rate limits</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waifu-pics-key">Waifu.pics API Key</Label>
                    <Input
                      id="waifu-pics-key"
                      type="password"
                      value={settings?.waifuPicsApiKey || ""}
                      onChange={(e) => updateSettings({ waifuPicsApiKey: e.target.value })}
                      placeholder="Enter your Waifu.pics API key"
                    />
                    <p className="text-xs text-muted-foreground">Optional - for premium features</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nekos-best-key">Nekos.best API Key</Label>
                    <Input
                      id="nekos-best-key"
                      type="password"
                      value={settings?.nekosBestApiKey || ""}
                      onChange={(e) => updateSettings({ nekosBestApiKey: e.target.value })}
                      placeholder="Enter your Nekos.best API key"
                    />
                    <p className="text-xs text-muted-foreground">Optional - for higher rate limits</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default API Source</Label>
                    <Select
                      value={settings?.apiSource || "waifu.im"}
                      onValueChange={(value) => updateSettings({ apiSource: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default API source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waifu.im">Waifu.im</SelectItem>
                        <SelectItem value="waifu.pics">Waifu.pics</SelectItem>
                        <SelectItem value="nekos.best">Nekos.best</SelectItem>
                        <SelectItem value="wallhaven">Wallhaven</SelectItem>
                        <SelectItem value="all">All Sources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Request Timeout (seconds): {settings?.requestTimeout || 30}</Label>
                      <Slider
                        value={[settings?.requestTimeout || 30]}
                        onValueChange={([value]) => updateSettings({ requestTimeout: value })}
                        max={120}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rate Limit Delay (ms): {settings?.rateLimitDelay || 1000}</Label>
                      <Slider
                        value={[settings?.rateLimitDelay || 1000]}
                        onValueChange={([value]) => updateSettings({ rateLimitDelay: value })}
                        max={5000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Download Settings Tab */}
          <TabsContent value="download" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Behavior
                </CardTitle>
                <CardDescription>Configure how downloads are handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Concurrent Downloads: {settings?.maxConcurrentDownloads || 3}</Label>
                    <Slider
                      value={[settings?.maxConcurrentDownloads || 3]}
                      onValueChange={([value]) => updateSettings({ maxConcurrentDownloads: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Retry Attempts: {settings?.retryAttempts || 3}</Label>
                    <Slider
                      value={[settings?.retryAttempts || 3]}
                      onValueChange={([value]) => updateSettings({ retryAttempts: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Images Per Page: {settings?.imagesPerPage || 20}</Label>
                    <Slider
                      value={[settings?.imagesPerPage || 20]}
                      onValueChange={([value]) => updateSettings({ imagesPerPage: value })}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-start Downloads</Label>
                      <p className="text-sm text-muted-foreground">Automatically start downloads when added to queue</p>
                    </div>
                    <Switch
                      checked={settings?.autoStartDownloads || false}
                      onCheckedChange={(checked) => updateSettings({ autoStartDownloads: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Skip Duplicates</Label>
                      <p className="text-sm text-muted-foreground">Avoid downloading duplicate images</p>
                    </div>
                    <Switch
                      checked={settings?.skipDuplicates || true}
                      onCheckedChange={(checked) => updateSettings({ skipDuplicates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Create Subfolders</Label>
                      <p className="text-sm text-muted-foreground">Organize downloads into category folders</p>
                    </div>
                    <Switch
                      checked={settings?.createSubfolders || true}
                      onCheckedChange={(checked) => updateSettings({ createSubfolders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Organize by Date</Label>
                      <p className="text-sm text-muted-foreground">Create date-based folder structure</p>
                    </div>
                    <Switch
                      checked={settings?.organizeByDate || false}
                      onCheckedChange={(checked) => updateSettings({ organizeByDate: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="download-location">Download Location</Label>
                  <Input
                    id="download-location"
                    value={settings?.downloadLocation || "./downloads"}
                    onChange={(e) => updateSettings({ downloadLocation: e.target.value })}
                    placeholder="Enter download directory path"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-naming">File Naming Pattern</Label>
                  <Input
                    id="file-naming"
                    value={settings?.fileNamingPattern || "{category}_{timestamp}_{id}"}
                    onChange={(e) => updateSettings({ fileNamingPattern: e.target.value })}
                    placeholder="e.g., {category}_{timestamp}_{id}"
                  />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {"{category}, {timestamp}, {id}, {character}, {series}"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Settings Tab */}
          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Quality & Resolution
                </CardTitle>
                <CardDescription>Set minimum quality requirements for downloads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Minimum Width: {settings?.minWidth || 1920}px</Label>
                    <Slider
                      value={[settings?.minWidth || 1920]}
                      onValueChange={([value]) => updateSettings({ minWidth: value })}
                      max={4000}
                      min={800}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Height: {settings?.minHeight || 1080}px</Label>
                    <Slider
                      value={[settings?.minHeight || 1080]}
                      onValueChange={([value]) => updateSettings({ minHeight: value })}
                      max={4000}
                      min={600}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Width: {settings?.maxWidth || 4000}px</Label>
                    <Slider
                      value={[settings?.maxWidth || 4000]}
                      onValueChange={([value]) => updateSettings({ maxWidth: value })}
                      max={8000}
                      min={1920}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Height: {settings?.maxHeight || 4000}px</Label>
                    <Slider
                      value={[settings?.maxHeight || 4000]}
                      onValueChange={([value]) => updateSettings({ maxHeight: value })}
                      max={8000}
                      min={1080}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Format</Label>
                    <Select
                      value={settings?.preferredFormat || "jpg"}
                      onValueChange={(value) => updateSettings({ preferredFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="any">Any Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Compression Level</Label>
                    <Select
                      value={settings?.compressionLevel || "medium"}
                      onValueChange={(value) => updateSettings({ compressionLevel: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select compression level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Original)</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Create Thumbnails</Label>
                      <p className="text-sm text-muted-foreground">Generate thumbnail previews for faster browsing</p>
                    </div>
                    <Switch
                      checked={settings?.createThumbnails || true}
                      onCheckedChange={(checked) => updateSettings({ createThumbnails: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Thumbnail Size: {settings?.thumbnailSize || 256}px</Label>
                    <Slider
                      value={[settings?.thumbnailSize || 256]}
                      onValueChange={([value]) => updateSettings({ thumbnailSize: value })}
                      max={512}
                      min={128}
                      step={32}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  UI & Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Theme Mode</Label>
                    <Select
                      value={settings?.themeMode || "system"}
                      onValueChange={(value) => updateSettings({ themeMode: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
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
                      value={settings?.language || "en"}
                      onValueChange={(value) => updateSettings({ language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preview Image Size</Label>
                    <Select
                      value={settings?.previewImageSize || "medium"}
                      onValueChange={(value) => updateSettings({ previewImageSize: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preview size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Grid Columns: {settings?.gridColumns || 4}</Label>
                    <Slider
                      value={[settings?.gridColumns || 4]}
                      onValueChange={([value]) => updateSettings({ gridColumns: value })}
                      max={8}
                      min={2}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Preview Images</Label>
                      <p className="text-sm text-muted-foreground">Display image previews in lists</p>
                    </div>
                    <Switch
                      checked={settings?.showPreviewImages || true}
                      onCheckedChange={(checked) => updateSettings({ showPreviewImages: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Image Details</Label>
                      <p className="text-sm text-muted-foreground">Display metadata and technical information</p>
                    </div>
                    <Switch
                      checked={settings?.showImageDetails || true}
                      onCheckedChange={(checked) => updateSettings({ showImageDetails: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
                    </div>
                    <Switch
                      checked={settings?.compactMode || false}
                      onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Download Progress</Label>
                      <p className="text-sm text-muted-foreground">Display progress bars for active downloads</p>
                    </div>
                    <Switch
                      checked={settings?.showDownloadProgress || true}
                      onCheckedChange={(checked) => updateSettings({ showDownloadProgress: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
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
                      <p className="text-sm text-muted-foreground">Allow the app to send notifications</p>
                    </div>
                    <Switch
                      checked={settings?.enableNotifications || true}
                      onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Download Complete</Label>
                      <p className="text-sm text-muted-foreground">Notify when downloads finish</p>
                    </div>
                    <Switch
                      checked={settings?.notifyOnDownloadComplete || true}
                      onCheckedChange={(checked) => updateSettings({ notifyOnDownloadComplete: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Error Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify when errors occur</p>
                    </div>
                    <Switch
                      checked={settings?.notifyOnError || true}
                      onCheckedChange={(checked) => updateSettings({ notifyOnError: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Images Available</Label>
                      <p className="text-sm text-muted-foreground">Notify when new images are found</p>
                    </div>
                    <Switch
                      checked={settings?.notifyOnNewImages || false}
                      onCheckedChange={(checked) => updateSettings({ notifyOnNewImages: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notification Sound</Label>
                  <Select
                    value={settings?.notificationSound || "default"}
                    onValueChange={(value) => updateSettings({ notificationSound: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="chime">Chime</SelectItem>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings?.notificationSound === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-sound">Custom Sound Path</Label>
                    <Input
                      id="custom-sound"
                      value={settings?.customSoundPath || ""}
                      onChange={(e) => updateSettings({ customSoundPath: e.target.value })}
                      placeholder="Path to custom sound file"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>Advanced configuration options for power users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Max Cache Size: {settings?.maxCacheSize || 1024}MB</Label>
                    <Slider
                      value={[settings?.maxCacheSize || 1024]}
                      onValueChange={([value]) => updateSettings({ maxCacheSize: value })}
                      max={4096}
                      min={256}
                      step={256}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cache Expiry: {settings?.cacheExpiryDays || 7} days</Label>
                    <Slider
                      value={[settings?.cacheExpiryDays || 7]}
                      onValueChange={([value]) => updateSettings({ cacheExpiryDays: value })}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Memory Usage: {settings?.maxMemoryUsage || 512}MB</Label>
                    <Slider
                      value={[settings?.maxMemoryUsage || 512]}
                      onValueChange={([value]) => updateSettings({ maxMemoryUsage: value })}
                      max={2048}
                      min={256}
                      step={128}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Log Level</Label>
                    <Select
                      value={settings?.logLevel || "info"}
                      onValueChange={(value) => updateSettings({ logLevel: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Image Cache</Label>
                      <p className="text-sm text-muted-foreground">Cache images for faster loading</p>
                    </div>
                    <Switch
                      checked={settings?.enableImageCache || true}
                      onCheckedChange={(checked) => updateSettings({ enableImageCache: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Preload Images</Label>
                      <p className="text-sm text-muted-foreground">Load images before they're visible</p>
                    </div>
                    <Switch
                      checked={settings?.preloadImages || false}
                      onCheckedChange={(checked) => updateSettings({ preloadImages: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Lazy Loading</Label>
                      <p className="text-sm text-muted-foreground">Load images only when needed</p>
                    </div>
                    <Switch
                      checked={settings?.enableLazyLoading || true}
                      onCheckedChange={(checked) => updateSettings({ enableLazyLoading: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hardware Acceleration</Label>
                      <p className="text-sm text-muted-foreground">Use GPU for image processing</p>
                    </div>
                    <Switch
                      checked={settings?.enableHardwareAcceleration || false}
                      onCheckedChange={(checked) => updateSettings({ enableHardwareAcceleration: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging and debugging</p>
                    </div>
                    <Switch
                      checked={settings?.enableDebugMode || false}
                      onCheckedChange={(checked) => updateSettings({ enableDebugMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Experimental Features</Label>
                      <p className="text-sm text-muted-foreground">Enable beta features and improvements</p>
                    </div>
                    <Switch
                      checked={settings?.enableExperimentalFeatures || false}
                      onCheckedChange={(checked) => updateSettings({ enableExperimentalFeatures: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blocked-tags">Blocked Tags (comma-separated)</Label>
                  <Textarea
                    id="blocked-tags"
                    value={settings?.blockedTags?.join(", ") || ""}
                    onChange={(e) =>
                      updateSettings({
                        blockedTags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter tags to block from downloads"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="w-full">
            <ApiStatusIndicator />
          </div>
          <SettingsContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
