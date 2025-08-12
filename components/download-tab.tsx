import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { ImageCategory, DownloadStatus, DownloadProgress } from '../types/waifu'
import { formatBytes, formatTime } from '../utils/waifuUtils'
import { Play, Pause, CircleStopIcon as Stop, Folder } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type DownloadTabProps = {
  onStartDownload: (category: ImageCategory, limit: number, isNsfw: boolean, downloadPath: string) => void
  onPauseDownload: () => void
  onStopDownload: () => void
  downloadStatus: DownloadStatus
  downloadProgress: DownloadProgress
}

export const DownloadTab: React.FC<DownloadTabProps> = ({
  onStartDownload,
  onPauseDownload,
  onStopDownload,
  downloadStatus,
  downloadProgress
}) => {
  const [downloadDir, setDownloadDir] = useState<string>('/downloads')
  const [category, setCategory] = useState<ImageCategory>('waifu')
  const [limit, setLimit] = useState<number>(10)
  const [isNsfw, setIsNsfw] = useState<boolean>(false)

  const handleStartDownload = () => {
    onStartDownload(category, limit, isNsfw, downloadDir)
  }

  const folders = [
    { name: 'Downloads', path: '/downloads' },
    { name: 'Pictures', path: '/pictures' },
    { name: 'Documents', path: '/documents' },
    { name: 'Desktop', path: '/desktop' },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="download-dir">Download Folder</Label>
        <div className="flex gap-2">
          <Input
            id="download-dir"
            value={downloadDir}
            onChange={(e) => setDownloadDir(e.target.value)}
            placeholder="Select download folder"
            className="flex-grow"
            readOnly
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Folder className="w-4 h-4 mr-2" />
                Browse
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Download Folder</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  {folders.map((folder) => (
                    <Button
                      key={folder.path}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setDownloadDir(folder.path)
                      }}
                    >
                      <Folder className="w-4 h-4 mr-2" />
                      {folder.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Image Category</Label>
        <Select value={category} onValueChange={(value: ImageCategory) => setCategory(value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waifu">Waifu</SelectItem>
            <SelectItem value="maid">Maid</SelectItem>
            <SelectItem value="marin-kitagawa">Marin Kitagawa</SelectItem>
            <SelectItem value="mori-calliope">Mori Calliope</SelectItem>
            <SelectItem value="raiden-shogun">Raiden Shogun</SelectItem>
            <SelectItem value="oppai">Oppai</SelectItem>
            <SelectItem value="selfies">Selfies</SelectItem>
            <SelectItem value="uniform">Uniform</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit">Download Limit</Label>
        <Input
          id="limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
          min={1}
          max={100}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="nsfw" checked={isNsfw} onCheckedChange={setIsNsfw} />
        <Label htmlFor="nsfw">Allow NSFW Content</Label>
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <Button 
          onClick={handleStartDownload} 
          disabled={downloadStatus === 'downloading'}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          Start
        </Button>
        <Button 
          onClick={onPauseDownload} 
          disabled={downloadStatus !== 'downloading'}
          className="flex-1"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
        <Button 
          onClick={onStopDownload} 
          disabled={downloadStatus === 'idle' || downloadStatus === 'completed'}
          className="flex-1"
        >
          <Stop className="w-4 h-4 mr-2" />
          Stop
        </Button>
      </div>

      {downloadStatus !== 'idle' && (
        <div className="space-y-2">
          <Progress value={(downloadProgress.downloaded / downloadProgress.total) * 100} className="bg-primary/20" />
          <div className="text-sm text-muted-foreground">
            {formatBytes(downloadProgress.downloaded)} / {formatBytes(downloadProgress.total)} |
            Speed: {formatBytes(downloadProgress.speed)}/s |
            ETA: {formatTime(downloadProgress.eta)}
          </div>
        </div>
      )}
    </div>
  )
}
