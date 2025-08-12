import React from 'react'
import { DownloadItem } from '../types/waifu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DownloadHistoryProps {
  history: DownloadItem[]
}

export function DownloadHistory({ history }: DownloadHistoryProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Download History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {history.length === 0 ? (
            <p>No download history</p>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.image.image_id} className="text-sm">
                  <div className="font-medium">{item.image.tags[0]?.name || 'Unknown'}</div>
                  <div className="text-muted-foreground">{new Date(item.image.uploaded_at).toLocaleString()}</div>
                  <div className={`text-xs ${item.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
