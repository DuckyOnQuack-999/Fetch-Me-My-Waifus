"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wand2, Download, Zap, Sparkles, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface AIUpscalerProps {
  image: any
  onClose: () => void
}

export function AIUpscaler({ image, onClose }: AIUpscalerProps) {
  const [upscaleSettings, setUpscaleSettings] = useState({
    scale: "2x",
    model: "real-esrgan",
    format: "png",
    denoise: "medium",
  })
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [upscaleProgress, setUpscaleProgress] = useState(0)
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState("")

  const upscaleModels = [
    { value: "real-esrgan", label: "Real-ESRGAN", description: "Best for anime/artwork" },
    { value: "esrgan", label: "ESRGAN", description: "General purpose upscaling" },
    { value: "waifu2x", label: "Waifu2x", description: "Optimized for anime images" },
    { value: "srcnn", label: "SRCNN", description: "Fast but lower quality" },
  ]

  const scaleOptions = [
    { value: "2x", label: "2x (Double)", multiplier: 2 },
    { value: "4x", label: "4x (Quadruple)", multiplier: 4 },
    { value: "8x", label: "8x (Octuple)", multiplier: 8 },
  ]

  const denoiseOptions = [
    { value: "none", label: "None", description: "No noise reduction" },
    { value: "low", label: "Low", description: "Minimal noise reduction" },
    { value: "medium", label: "Medium", description: "Balanced noise reduction" },
    { value: "high", label: "High", description: "Aggressive noise reduction" },
  ]

  const formatOptions = [
    { value: "png", label: "PNG", description: "Lossless, larger file size" },
    { value: "jpg", label: "JPEG", description: "Lossy, smaller file size" },
    { value: "webp", label: "WebP", description: "Modern format, good compression" },
  ]

  const handleUpscale = async () => {
    setIsUpscaling(true)
    setUpscaleProgress(0)
    setUpscaledImage(null)

    try {
      // Simulate AI upscaling process with realistic stages
      const stages = [
        { name: "Initializing AI model...", duration: 1000 },
        { name: "Analyzing image structure...", duration: 2000 },
        { name: "Enhancing details...", duration: 3000 },
        { name: "Applying noise reduction...", duration: 2000 },
        { name: "Finalizing upscaled image...", duration: 1500 },
      ]

      let totalProgress = 0
      const progressPerStage = 100 / stages.length

      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i]
        setProcessingStage(stage.name)

        // Simulate gradual progress within each stage
        const stageSteps = 10
        const progressPerStep = progressPerStage / stageSteps

        for (let step = 0; step < stageSteps; step++) {
          await new Promise((resolve) => setTimeout(resolve, stage.duration / stageSteps))
          totalProgress += progressPerStep
          setUpscaleProgress(Math.min(totalProgress, 100))
        }
      }

      // Simulate the upscaled result
      const selectedScale = scaleOptions.find((s) => s.value === upscaleSettings.scale)
      const multiplier = selectedScale?.multiplier || 2

      // Create a mock upscaled image URL (in real implementation, this would be the actual upscaled image)
      const upscaledUrl = `${image.url}?upscaled=${multiplier}x&model=${upscaleSettings.model}&format=${upscaleSettings.format}`
      setUpscaledImage(upscaledUrl)

      toast.success(`Image upscaled successfully to ${upscaleSettings.scale}!`)
    } catch (error) {
      toast.error("Failed to upscale image. Please try again.")
    } finally {
      setIsUpscaling(false)
      setProcessingStage("")
    }
  }

  const handleDownloadUpscaled = () => {
    if (upscaledImage) {
      const link = document.createElement("a")
      link.href = upscaledImage
      link.download = `${image.filename?.replace(/\.[^/.]+$/, "") || "upscaled"}_${upscaleSettings.scale}.${upscaleSettings.format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Upscaled image downloaded!")
    }
  }

  const getEstimatedSize = () => {
    const originalWidth = image.width || 1920
    const originalHeight = image.height || 1080
    const multiplier = scaleOptions.find((s) => s.value === upscaleSettings.scale)?.multiplier || 2

    return {
      width: originalWidth * multiplier,
      height: originalHeight * multiplier,
    }
  }

  const estimatedSize = getEstimatedSize()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Original Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.url || "/placeholder.svg?height=300&width=400"}
                  alt={image.filename || "Original"}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <div className="font-mono">
                    {image.width || 1920} × {image.height || 1080}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <div className="font-mono">{image.format || "JPEG"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upscaled Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upscaled Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {upscaledImage ? (
                  <img
                    src={upscaledImage || "/placeholder.svg"}
                    alt="Upscaled"
                    className="w-full h-full object-contain"
                  />
                ) : isUpscaling ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{processingStage}</p>
                      <Progress value={upscaleProgress} className="w-48" />
                      <p className="text-xs text-muted-foreground">{Math.round(upscaleProgress)}% complete</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Wand2 className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Upscaled image will appear here</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Estimated Size:</span>
                  <div className="font-mono">
                    {estimatedSize.width} × {estimatedSize.height}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Output Format:</span>
                  <div className="font-mono">{upscaleSettings.format.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upscaling Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Upscaling Settings
          </CardTitle>
          <CardDescription>Configure the AI upscaling parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Scale Factor</Label>
              <Select
                value={upscaleSettings.scale}
                onValueChange={(value) => setUpscaleSettings((prev) => ({ ...prev, scale: value }))}
                disabled={isUpscaling}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scaleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="outline" className="ml-2">
                          {option.multiplier}x
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select
                value={upscaleSettings.model}
                onValueChange={(value) => setUpscaleSettings((prev) => ({ ...prev, model: value }))}
                disabled={isUpscaling}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {upscaleModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{model.label}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Noise Reduction</Label>
              <Select
                value={upscaleSettings.denoise}
                onValueChange={(value) => setUpscaleSettings((prev) => ({ ...prev, denoise: value }))}
                disabled={isUpscaling}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {denoiseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select
                value={upscaleSettings.format}
                onValueChange={(value) => setUpscaleSettings((prev) => ({ ...prev, format: value }))}
                disabled={isUpscaling}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {upscaledImage && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Upscaling Complete
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isUpscaling}>
            Close
          </Button>

          {upscaledImage && (
            <Button variant="outline" onClick={handleDownloadUpscaled}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}

          <Button onClick={handleUpscale} disabled={isUpscaling}>
            {isUpscaling ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Upscaling...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Start Upscaling
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Processing Info */}
      <AnimatePresence>
        {isUpscaling && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-primary">{processingStage}</p>
                    <p className="text-sm text-muted-foreground">
                      This may take a few minutes depending on the image size and selected model.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
