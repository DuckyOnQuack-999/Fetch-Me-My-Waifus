"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wand2, Download, Zap, Sparkles, GripVertical } from "lucide-react"
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
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState("")
  // Slider state: 0 = all original, 100 = all upscaled
  const [sliderPos, setSliderPos] = useState(50)
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const upscaleModels = [
    { value: "real-esrgan", label: "Real-ESRGAN", description: "Best for anime/artwork" },
    { value: "esrgan", label: "ESRGAN", description: "General purpose" },
    { value: "waifu2x", label: "Waifu2x", description: "Optimised for anime" },
    { value: "srcnn", label: "SRCNN", description: "Fast, lower quality" },
  ]

  const scaleOptions = [
    { value: "2x", label: "2x", multiplier: 2 },
    { value: "4x", label: "4x", multiplier: 4 },
    { value: "8x", label: "8x", multiplier: 8 },
  ]

  const denoiseOptions = [
    { value: "none", label: "None" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  const formatOptions = [
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPEG" },
    { value: "webp", label: "WebP" },
  ]

  // ── Slider drag handlers ────────────────────────────────────────────────────
  const updateSlider = useCallback((clientX: number) => {
    const el = sliderContainerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setSliderPos(pct)
  }, [])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isDragging.current = true
      updateSlider(e.clientX)
    },
    [updateSlider],
  )

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      updateSlider(clientX)
    }
    const onUp = () => {
      isDragging.current = false
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("touchmove", onMove)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchend", onUp)
    }
  }, [updateSlider])

  // ── Upscaling simulation ────────────────────────────────────────────────────
  const handleUpscale = async () => {
    setIsUpscaling(true)
    setUpscaleProgress(0)
    setUpscaledImageUrl(null)
    setSliderPos(50)

    const stages = [
      { name: "Initialising AI model…", duration: 900 },
      { name: "Analysing image structure…", duration: 1800 },
      { name: "Enhancing fine details…", duration: 2800 },
      { name: "Applying noise reduction…", duration: 1800 },
      { name: "Finalising upscaled image…", duration: 1200 },
    ]

    try {
      let total = 0
      const perStage = 100 / stages.length
      for (const stage of stages) {
        setProcessingStage(stage.name)
        const steps = 10
        for (let s = 0; s < steps; s++) {
          await new Promise((r) => setTimeout(r, stage.duration / steps))
          total += perStage / steps
          setUpscaleProgress(Math.min(total, 100))
        }
      }

      // Produce the upscaled result via canvas so download actually works.
      const multiplier = scaleOptions.find((o) => o.value === upscaleSettings.scale)?.multiplier ?? 2
      const blobUrl = await upscaleViaCanvas(image.url, multiplier)
      setUpscaledImageUrl(blobUrl)
      toast.success(`Upscaled to ${upscaleSettings.scale} successfully!`)
    } catch (err) {
      console.error("[v0] Upscale error:", err)
      toast.error("Upscaling failed. Please try again.")
    } finally {
      setIsUpscaling(false)
      setProcessingStage("")
    }
  }

  // Draw original onto a larger canvas (simulates upscale, real impl would use an ML API)
  const upscaleViaCanvas = (src: string, multiplier: number): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth * multiplier
        canvas.height = img.naturalHeight * multiplier
        const ctx = canvas.getContext("2d")!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas toBlob failed"))
            resolve(URL.createObjectURL(blob))
          },
          upscaleSettings.format === "jpg" ? "image/jpeg" : upscaleSettings.format === "webp" ? "image/webp" : "image/png",
          0.95,
        )
      }
      img.onerror = () => reject(new Error("Failed to load source image"))
      img.src = src
    })

  // ── Download ────────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!upscaledImageUrl) return
    const a = document.createElement("a")
    a.href = upscaledImageUrl
    const baseName = (image.filename || `image-${image.image_id || "upscaled"}`).replace(/\.[^/.]+$/, "")
    a.download = `${baseName}_${upscaleSettings.scale}.${upscaleSettings.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success("Download started!")
  }

  const multiplier = scaleOptions.find((o) => o.value === upscaleSettings.scale)?.multiplier ?? 2
  const estW = (image.width || 1920) * multiplier
  const estH = (image.height || 1080) * multiplier

  return (
    <div className="space-y-6">
      {/* ── Before / After Slider ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Before / After Preview
          </CardTitle>
          <CardDescription>Drag the handle to compare original and upscaled</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={sliderContainerRef}
            className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted select-none cursor-col-resize"
            onMouseDown={onMouseDown}
            onTouchStart={(e) => {
              isDragging.current = true
              updateSlider(e.touches[0].clientX)
            }}
          >
            {/* Original (full width, clipped on right) */}
            <img
              src={image.url || "/placeholder.svg?height=400&width=700"}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              crossOrigin="anonymous"
            />

            {/* Upscaled (clipped on left) – shown only after upscaling */}
            {upscaledImageUrl && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <img
                  src={upscaledImageUrl}
                  alt="Upscaled"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}

            {/* Clip the original to the left side */}
            {upscaledImageUrl && (
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={image.url}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}

            {/* Divider line + handle */}
            {upscaledImageUrl && (
              <div
                className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0.5 h-full bg-white shadow-lg" />
                <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200">
                  <GripVertical className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            )}

            {/* Labels */}
            {upscaledImageUrl && (
              <>
                <Badge className="absolute top-3 left-3 bg-black/60 text-white border-0">Original</Badge>
                <Badge className="absolute top-3 right-3 bg-primary/90 text-white border-0">
                  {upscaleSettings.scale} Upscaled
                </Badge>
              </>
            )}

            {/* Not yet upscaled overlay */}
            {!upscaledImageUrl && !isUpscaling && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="text-center space-y-2 bg-black/50 rounded-xl p-6">
                  <Wand2 className="h-10 w-10 text-white mx-auto" />
                  <p className="text-white font-medium">Click Start Upscaling to see the before/after comparison</p>
                </div>
              </div>
            )}

            {/* Processing overlay */}
            {isUpscaling && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center space-y-4 bg-black/60 rounded-xl p-6 min-w-[240px]">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-white font-medium text-sm">{processingStage}</p>
                  <Progress value={upscaleProgress} className="w-full" />
                  <p className="text-white/70 text-xs">{Math.round(upscaleProgress)}% complete</p>
                </div>
              </div>
            )}
          </div>

          {/* Size info */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Original:</span>
              <span className="ml-2 font-mono">
                {image.width || 1920} × {image.height || 1080}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Upscaled:</span>
              <span className="ml-2 font-mono">
                {estW} × {estH}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Settings ───────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Upscaling Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Scale</Label>
              <Select
                value={upscaleSettings.scale}
                onValueChange={(v) => setUpscaleSettings((p) => ({ ...p, scale: v }))}
                disabled={isUpscaling}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {scaleOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select
                value={upscaleSettings.model}
                onValueChange={(v) => setUpscaleSettings((p) => ({ ...p, model: v }))}
                disabled={isUpscaling}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {upscaleModels.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div>
                        <div className="font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.description}</div>
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
                onValueChange={(v) => setUpscaleSettings((p) => ({ ...p, denoise: v }))}
                disabled={isUpscaling}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {denoiseOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Output Format</Label>
              <Select
                value={upscaleSettings.format}
                onValueChange={(v) => setUpscaleSettings((p) => ({ ...p, format: v }))}
                disabled={isUpscaling}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {formatOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          {upscaledImageUrl && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Upscale complete
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isUpscaling}>
            Close
          </Button>

          {upscaledImageUrl && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download {upscaleSettings.scale}
            </Button>
          )}

          <Button onClick={handleUpscale} disabled={isUpscaling}>
            {isUpscaling ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Upscaling…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                {upscaledImageUrl ? "Re-Upscale" : "Start Upscaling"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Processing card */}
      <AnimatePresence>
        {isUpscaling && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary">{processingStage}</p>
                  <p className="text-sm text-muted-foreground">
                    Processing time varies by image size and chosen model.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
