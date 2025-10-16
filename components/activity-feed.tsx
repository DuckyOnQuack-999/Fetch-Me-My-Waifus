"use client"

import { useActivity } from "@/context/activityContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Download, Heart, FolderOpen, Settings2, UserPlus, LogIn } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const activityIcons = {
  download: Download,
  favorite: Heart,
  collection: FolderOpen,
  settings: Settings2,
  login: LogIn,
  register: UserPlus,
}

const activityColors = {
  download: "text-green-500",
  favorite: "text-red-500",
  collection: "text-blue-500",
  settings: "text-purple-500",
  login: "text-yellow-500",
  register: "text-pink-500",
}

export function ActivityFeed() {
  const { activities, isConnected } = useActivity()

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse-glow" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"} className="animate-pulse">
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </div>
        <CardDescription>Real-time updates from all users</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-4">
          <div className="space-y-3 py-4">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Activity will appear here in real-time</p>
              </div>
            ) : (
              activities.map((activity, index) => {
                const Icon = activityIcons[activity.type] || Activity
                const colorClass = activityColors[activity.type] || "text-gray-500"

                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
                      "hover:bg-muted/50 animate-slide-in",
                      index === 0 && "bg-accent/10 border border-accent/20",
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.username}`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                        {activity.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", colorClass)} />
                        <span className="text-sm font-medium truncate">{activity.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{activity.action}</p>
                      {activity.details && <p className="text-xs text-muted-foreground truncate">{activity.details}</p>}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
