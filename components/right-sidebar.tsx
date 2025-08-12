'use client'

import { Download, Heart, Clock } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useDownload } from "@/context/downloadContext"
import { useStorage } from "@/context/storageContext"

export function RightSidebar() {
  const { downloadQueue, totalDownloads, lastDownload } = useDownload()
  const storage = useStorage()
  const favorites = storage.getFavorites()

  return (
    <div className="w-[280px] border-l border-border/10 bg-black/90 backdrop-blur-sm p-6 space-y-8">
      {/* Download Queue Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white/90">Download Queue</h2>
        {downloadQueue.length === 0 ? (
          <p className="text-white/60">No active downloads</p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {downloadQueue.map((item) => (
                <div key={item.image.image_id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="truncate text-white/90">
                      {item.image.tags[0]?.name || "Unknown"}
                    </span>
                    <span className="text-primary">{item.status}</span>
                  </div>
                  <Progress value={item.progress} className="h-1 bg-white/10" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Stats Section */}
      <div className="space-y-6">
        {/* Total Downloads */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/60">Total Downloads</p>
            <p className="text-2xl font-bold text-white/90">{totalDownloads}</p>
          </div>
          <Download className="h-6 w-6 text-primary opacity-80" />
        </div>

        {/* Favorites */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/60">Favorites</p>
            <p className="text-2xl font-bold text-white/90">{favorites.length}</p>
          </div>
          <Heart className="h-6 w-6 text-primary opacity-80" />
        </div>

        {/* Last Download */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-white/60">Last Download</p>
            <p className="text-lg font-medium text-primary">
              {lastDownload ? lastDownload.toLocaleString() : "Never"}
            </p>
          </div>
          <Clock className="h-6 w-6 text-primary opacity-80" />
        </div>
      </div>
    </div>
  )
}
