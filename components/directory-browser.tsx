'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Folder, HardDrive, ChevronRight } from 'lucide-react'

interface DirectoryBrowserProps {
  onSelect: (path: string) => void
  currentPath: string
}

export function DirectoryBrowser({ onSelect, currentPath }: DirectoryBrowserProps) {
  // For iOS, we'll use a simplified directory structure
  const defaultDirectories = [
    {
      name: 'Downloads',
      path: '/downloads',
      icon: HardDrive
    },
    {
      name: 'Documents',
      path: '/documents',
      icon: Folder
    },
    {
      name: 'Pictures',
      path: '/pictures',
      icon: Folder
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Folder className="w-4 h-4 mr-2" />
          Browse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Download Location</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {defaultDirectories.map((dir) => (
              <Button
                key={dir.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSelect(dir.path)}
              >
                <dir.icon className="w-4 h-4 mr-2" />
                {dir.name}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
