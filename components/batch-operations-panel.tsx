"use client"

import { useState } from "react"
import { Download, Trash2, Heart, FolderPlus, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BatchItem {
  id: string
  url: string
  filename: string
  selected: boolean
  status: "pending" | "downloading" | "completed" | "failed"
  progress?: number
}

interface BatchOperationsPanelProps {
  items: BatchItem[]
  onUpdateItems: (items: BatchItem[]) => void
  onBatchDownload: (selectedItems: BatchItem[]) => void
  onBatchFavorite: (selectedItems: BatchItem[]) => void
  onBatchDelete: (selectedItems: BatchItem[]) => void
}

export function BatchOperationsPanel({
  items,
  onUpdateItems,
  onBatchDownload,
  onBatchFavorite,
  onBatchDelete,
}: BatchOperationsPanelProps) {
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false)
  const [collectionName, setCollectionName] = useState("")

  const selectedItems = items.filter((item) => item.selected)
  const selectedCount = selectedItems.length
  const totalCount = items.length

  const toggleSelectAll = () => {
    const allSelected = selectedCount === totalCount
    const updatedItems = items.map((item) => ({
      ...item,
      selected: !allSelected,
    }))
    onUpdateItems(updatedItems)
  }

  const toggleSelectItem = (id: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    onUpdateItems(updatedItems)
  }

  const handleBatchDownload = () => {
    if (selectedCount === 0) {
      toast.error("No items selected")
      return
    }
    onBatchDownload(selectedItems)
    toast.success(`Started downloading ${selectedCount} items`)
  }

  const handleBatchFavorite = () => {
    if (selectedCount === 0) {
      toast.error("No items selected")
      return
    }
    onBatchFavorite(selectedItems)
    toast.success(`Added ${selectedCount} items to favorites`)
  }

  const handleBatchDelete = () => {
    if (selectedCount === 0) {
      toast.error("No items selected")
      return
    }
    onBatchDelete(selectedItems)
    toast.success(`Removed ${selectedCount} items`)
  }

  const handleCreateCollection = () => {
    if (!collectionName.trim()) {
      toast.error("Please enter a collection name")
      return
    }
    if (selectedCount === 0) {
      toast.error("No items selected")
      return
    }

    // Here you would implement the collection creation logic
    toast.success(`Created collection "${collectionName}" with ${selectedCount} items`)
    setCollectionName("")
    setIsCreateCollectionOpen(false)
  }

  const getStatusColor = (status: BatchItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "downloading":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: BatchItem["status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "downloading":
        return "Downloading"
      case "failed":
        return "Failed"
      default:
        return "Pending"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Batch Operations</CardTitle>
          <Badge variant="outline">
            {selectedCount} of {totalCount} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectAll}
            className="flex items-center gap-2 bg-transparent"
          >
            {selectedCount === totalCount ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {selectedCount === totalCount ? "Deselect All" : "Select All"}
          </Button>

          <div className="text-sm text-muted-foreground">{selectedCount > 0 && `${selectedCount} items selected`}</div>
        </div>

        <Separator />

        {/* Batch Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchDownload}
            disabled={selectedCount === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <Download className="w-4 h-4" />
            Download Selected
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchFavorite}
            disabled={selectedCount === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <Heart className="w-4 h-4" />
            Add to Favorites
          </Button>

          <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedCount === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <FolderPlus className="w-4 h-4" />
                Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="collection-name">Collection Name</Label>
                  <Input
                    id="collection-name"
                    placeholder="Enter collection name..."
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  This will create a new collection with {selectedCount} selected items.
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateCollectionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCollection}>Create Collection</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDelete}
            disabled={selectedCount === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove Selected
          </Button>
        </div>

        <Separator />

        {/* Items List */}
        <div className="space-y-2 max-h-60 overflow-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Button variant="ghost" size="sm" className="h-auto p-1" onClick={() => toggleSelectItem(item.id)}>
                {item.selected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{item.filename}</span>
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </Badge>
                </div>

                {item.status === "downloading" && item.progress !== undefined && (
                  <div className="mt-1">
                    <Progress value={item.progress} className="h-1" />
                    <span className="text-xs text-muted-foreground">{item.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FolderPlus className="w-8 h-8 mx-auto mb-2" />
              <p>No items available for batch operations</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
