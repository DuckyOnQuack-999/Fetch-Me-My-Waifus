"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Heart, Trash2, FolderPlus, X, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface BatchOperationsPanelProps {
  selectedImages: string[]
  onClearSelection: () => void
}

export function BatchOperationsPanel({ selectedImages, onClearSelection }: BatchOperationsPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentOperation, setCurrentOperation] = useState<string>("")

  const handleBatchOperation = async (operation: string) => {
    setIsProcessing(true)
    setCurrentOperation(operation)
    setProgress(0)

    try {
      // Simulate batch operation progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setProgress(i)
      }

      switch (operation) {
        case "download":
          toast.success(`Downloaded ${selectedImages.length} images`)
          break
        case "favorite":
          toast.success(`Added ${selectedImages.length} images to favorites`)
          break
        case "unfavorite":
          toast.success(`Removed ${selectedImages.length} images from favorites`)
          break
        case "delete":
          toast.success(`Deleted ${selectedImages.length} images`)
          break
        case "collection":
          toast.success(`Added ${selectedImages.length} images to collection`)
          break
        default:
          toast.success(`Completed batch operation on ${selectedImages.length} images`)
      }

      onClearSelection()
    } catch (error) {
      toast.error("Batch operation failed")
    } finally {
      setIsProcessing(false)
      setCurrentOperation("")
      setProgress(0)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Batch Operations
                </CardTitle>
                <CardDescription>Perform actions on {selectedImages.length} selected images</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClearSelection} disabled={isProcessing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {currentOperation === "download" && "Downloading images..."}
                    {currentOperation === "favorite" && "Adding to favorites..."}
                    {currentOperation === "unfavorite" && "Removing from favorites..."}
                    {currentOperation === "delete" && "Deleting images..."}
                    {currentOperation === "collection" && "Adding to collection..."}
                  </span>
                  <Badge variant="secondary">{progress}%</Badge>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Processing {selectedImages.length} images...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchOperation("download")}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchOperation("favorite")}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Favorite
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchOperation("unfavorite")}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  Unfavorite
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchOperation("collection")}
                  className="flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Collection
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchOperation("delete")}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedImages.length} selected</Badge>
                {isProcessing && (
                  <Badge variant="outline" className="animate-pulse">
                    Processing...
                  </Badge>
                )}
              </div>

              {!isProcessing && (
                <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-muted-foreground">
                  Clear Selection
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
