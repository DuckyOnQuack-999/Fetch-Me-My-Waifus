import React, { useState, useEffect, useCallback } from 'react'
import { WaifuImage } from '../types/waifu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, X } from 'lucide-react'

interface ImagePreviewProps {
  image: WaifuImage
  onClose: () => void
}

export function ImagePreview({ image, onClose }: ImagePreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5))
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === '+' || e.key === '=') {
      handleZoomIn()
    } else if (e.key === '-') {
      handleZoomOut()
    }
  }, [onClose, handleZoomIn, handleZoomOut])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader>
          <DialogTitle>{image.tags[0]?.name || 'Image Preview'}</DialogTitle>
        </DialogHeader>
        <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 2rem)' }}>
          <Image
            src={image.url}
            alt={image.tags[0]?.name || 'Waifu image'}
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-200 ease-in-out"
            style={{ transform: `scale(${zoomLevel})` }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="secondary" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 bg-background">
          <p>Resolution: {image.width}x{image.height}</p>
          <p>Source: {image.source || 'Unknown'}</p>
          <p>Tags: {image.tags.map(tag => tag.name).join(', ')}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
