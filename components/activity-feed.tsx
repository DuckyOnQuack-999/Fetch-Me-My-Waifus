"use client"

import { useActivity } from "@/context/activityContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Heart, FolderOpen, Settings, LogIn, UserPlus, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ActivityMessage } from "@/lib/websocket"

const activityIcons = {
  download: Download,
  favorite: Heart,
  collection: FolderOpen,
  settings: Settings,
  login: LogIn,
  register: UserPlus,
}

const activityColors = {
  download: "text-blue-500",
  favorite: "text-pink-500",
  collection: "text-purple-500",
  settings: "text-gray-500",
  login: "text-green-500",
  register: "text-emerald-500",
}

export function ActivityFeed() {
  const { activities, isConnected } = useActivity()

  const getActivityIcon = (type: ActivityMessage["type"]) => {
    const Icon = activityIcons[type]
    return Icon ? <Icon className={`h-4 w-4 ${activityColors[type]}`} /> : null
  }

  const formatTimestamp = (timestamp: Date) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return "just now"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Live feed of user actions</CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"} className="gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3" />
                Live
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Offline
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isConnected ? "Actions will appear here" : "Running in offline mode"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.username}`} />
                    <AvatarFallback>{activity.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{activity.username}</span>
                      {getActivityIcon(activity.type)}
                      <span className="text-sm text-muted-foreground">{activity.action}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
