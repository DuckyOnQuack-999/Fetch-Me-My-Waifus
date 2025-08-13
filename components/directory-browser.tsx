"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, FolderOpen } from "lucide-react"

interface DirectoryBrowserProps {
  onDirectorySelect: (path: string) => void
  selectedDirectory?: string
}

export function DirectoryBrowser({ onDirectorySelect, selectedDirectory }: DirectoryBrowserProps) {
  const [currentPath, setCurrentPath] = useState("/")
  const [customPath, setCustomPath] = useState("")

  const handlePathChange = (newPath: string) => {
    setCurrentPath(newPath)
    onDirectorySelect(newPath)
  }

  const handleCustomPathSubmit = () => {
    if (customPath.trim()) {
      handlePathChange(customPath.trim())
      setCustomPath("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Directory Browser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom path..."
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCustomPathSubmit()}
          />
          <Button onClick={handleCustomPathSubmit}>Set Path</Button>
        </div>

        <div className="text-sm text-muted-foreground">Current: {selectedDirectory || currentPath}</div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => handlePathChange("/Downloads")}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Downloads
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => handlePathChange("/Pictures")}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Pictures
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => handlePathChange("/Desktop")}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => handlePathChange("/Documents")}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
