"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Download, Heart, ImageIcon, TrendingUp, Clock, HardDrive, Wifi, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDownload } from "@/context/downloadContext"
import { useStorage } from "@/context/storageContext"
import { useSettings } from "@/context/settingsContext"

export function RightSidebar() {
  const { downloads, totalProgress, isDownloading } = useDownload()
  const { images, favorites, getTotalSize } = useStorage()
  const { settings } = useSettings()

  const recentDownloads = downloads.slice(0, 5)
  const completedDownloads = downloads.filter((d) => d.status === "completed").length
  const failedDownloads = downloads.filter((d) => d.status === "failed").length

  const stats = [
    {
      label: "Total Images",
      value: images.length,
      icon: ImageIcon,
      color: "text-blue-500",
    },
    {
      label: "Favorites",
      value: favorites.length,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Downloads",
      value: completedDownloads,
      icon: Download,
      color: "text-green-500",
    },
    {
      label: "Storage Used",
      value: `${(getTotalSize() / 1024 / 1024).toFixed(1)}MB`,
      icon: HardDrive,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="w-80 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Monitor your downloads and stats</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <Badge variant="secondary">{stat.value}</Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Download Progress */}
            <AnimatePresence>
              {isDownloading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Download className="h-4 w-4 text-primary" />
                        Active Downloads
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {totalProgress.downloaded}/{totalProgress.total}
                          </span>
                        </div>
                        <Progress value={(totalProgress.downloaded / totalProgress.total) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-muted-foreground">Speed</span>
                          <div className="font-mono">{(totalProgress.speed / 1024 / 1024).toFixed(1)} MB/s</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">ETA</span>
                          <div className="font-mono">
                            {Math.floor(totalProgress.eta / 60)}m {Math.floor(totalProgress.eta % 60)}s
                          </div>
                        </div>
                      </div>

                      {totalProgress.currentFile && (
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Current File</span>
                          <div className="text-xs font-mono truncate bg-muted p-1 rounded">
                            {totalProgress.currentFile}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Downloads */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Downloads
                </CardTitle>
                <CardDescription>
                  {recentDownloads.length} of {downloads.length} downloads
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentDownloads.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">No downloads yet</div>
                ) : (
                  <div className="space-y-2">
                    {recentDownloads.map((download, index) => (
                      <motion.div
                        key={download.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex-shrink-0">
                          {download.status === "completed" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : download.status === "failed" ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : download.status === "downloading" ? (
                            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{download.filename}</div>
                          <div className="text-xs text-muted-foreground">
                            {download.status === "downloading" && `${download.progress}%`}
                            {download.status === "completed" && "Complete"}
                            {download.status === "failed" && "Failed"}
                            {download.status === "pending" && "Pending"}
                          </div>
                        </div>

                        <Badge
                          variant={
                            download.status === "completed"
                              ? "default"
                              : download.status === "failed"
                                ? "destructive"
                                : download.status === "downloading"
                                  ? "secondary"
                                  : "outline"
                          }
                          className="text-xs"
                        >
                          {download.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Connection</span>
                  </div>
                  <Badge variant="default" className="text-xs">
                    Online
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Storage</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {((getTotalSize() / (1024 * 1024 * 1024)) * 100).toFixed(1)}% Used
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Queue</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {downloads.filter((d) => d.status === "pending").length} Pending
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-mono">
                      {downloads.length > 0 ? Math.round((completedDownloads / downloads.length) * 100) : 0}%
                    </span>
                  </div>
                  <Progress
                    value={downloads.length > 0 ? (completedDownloads / downloads.length) * 100 : 0}
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Start Download
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  View Favorites
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Browse Gallery
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
