import React from 'react'
import { DownloadItem } from '../types/waifu'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DownloadQueueProps {
  queue: DownloadItem[]
}

export function DownloadQueue({ queue }: DownloadQueueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <p>No active downloads</p>
        ) : (
          <ul className="space-y-2">
            {queue.map((item) => (
              <li key={item.image.image_id} className="flex items-center space-x-2">
                <span className="w-1/4 truncate">{item.image.tags[0]?.name || 'Unknown'}</span>
                <Progress value={item.progress} className="w-1/2" />
                <span className="w-1/4 text-right">{item.status}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
