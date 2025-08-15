"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Search, Grid, List, Trash2, Zap, Leaf, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

// 🔮 Quantum-Enhanced Collection Types
interface WaifuImage {
  id: string
  url: string
  thumbnail?: string
  tags: string[]
  source: string
  rating: "safe" | "questionable" | "explicit"
  resolution: string
  fileSize: number
  addedDate: Date
  ethicsScore: number
  carbonFootprint: number
  quantumOptimized: boolean
}

interface Collection {
  id: string
  name: string
  description: string
  images: WaifuImage[]
  createdDate: Date
  lastModified: Date
  tags: string[]
  isPublic: boolean
  ethicsValidated: boolean
  sustainabilityScore: number
  quantumEnhanced: boolean
}

interface CollectionsPageProps {
  className?: string
  quantumMode?: boolean
  sustainabilityMode?: boolean
  ethicalMode?: boolean
}

// 🎯 Ethical Content Validation
const validateContentEthics = (image: WaifuImage): number => {
  let score = 100

  // Penalize explicit content
  if (image.rating === "explicit") score -= 30
  if (image.rating === "questionable") score -= 15

  // Bonus for safe content
  if (image.rating === "safe") score += 5

  // Check for problematic tags
  const problematicTags = ["violence", "inappropriate", "harmful"]
  const hasProblematicTags = image.tags.some((tag) =>
    problematicTags.some((problematic) => tag.toLowerCase().includes(problematic)),
  )
  if (hasProblematicTags) score -= 25

  return Math.max(0, Math.min(100, score))
}

// 🌱 Carbon Footprint Calculator
const calculateImageCarbonFootprint = (image: WaifuImage): number => {
  // Base carbon footprint calculation based on file size and processing
  const baseCO2 = (image.fileSize / 1024 / 1024) * 0.01 // 0.01g CO2 per MB
  const processingCO2 = 0.05 // Base processing cost
  const networkCO2 = 0.02 // Network transfer cost

  return baseCO2 + processingCO2 + networkCO2
}

// 🔮 Quantum Optimization Simulator
const simulateQuantumOptimization = (image: WaifuImage): boolean => {
  // Simulate quantum image compression and optimization
  return Math.random() > 0.4 // 60% chance of quantum optimization
}

export function CollectionsPage({
  className,
  quantumMode = false,
  sustainabilityMode = true,
  ethicalMode = true,
}: CollectionsPageProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "ethics" | "carbon">("date")
  const [filterBy, setFilterBy] = useState<"all" | "safe" | "questionable" | "explicit">("all")
  const [isLoading, setIsLoading] = useState(true)

  // 🔮 Load Collections with Quantum Enhancement
  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true)

      try {
        // Simulate loading collections from storage
        const savedCollections = localStorage.getItem("waifu-collections")
        let collectionsData: Collection[] = []

        if (savedCollections) {
          const parsed = JSON.parse(savedCollections)
          // Ensure collections is always an array
          collectionsData = Array.isArray(parsed) ? parsed : []
        }

        // 🎯 Apply ethical validation and sustainability analysis
        const enhancedCollections = await Promise.all(
          collectionsData.map(async (collection) => {
            // Ensure images is always an array
            const images = Array.isArray(collection.images) ? collection.images : []

            const enhancedImages = images.map((image: WaifuImage) => ({
              ...image,
              ethicsScore: ethicalMode ? validateContentEthics(image) : 100,
              carbonFootprint: sustainabilityMode ? calculateImageCarbonFootprint(image) : 0,
              quantumOptimized: quantumMode ? simulateQuantumOptimization(image) : false,
            }))

            const avgEthicsScore =
              enhancedImages.length > 0
                ? enhancedImages.reduce((sum, img) => sum + img.ethicsScore, 0) / enhancedImages.length
                : 100

            const totalCarbonFootprint = enhancedImages.reduce((sum, img) => sum + img.carbonFootprint, 0)
            const quantumOptimizedCount = enhancedImages.filter((img) => img.quantumOptimized).length

            return {
              ...collection,
              images: enhancedImages,
              ethicsValidated: avgEthicsScore >= 80,
              sustainabilityScore: Math.max(0, 100 - totalCarbonFootprint * 10),
              quantumEnhanced: quantumOptimizedCount > enhancedImages.length * 0.5,
            }
          }),
        )

        setCollections(enhancedCollections)
      } catch (error) {
        console.error("Failed to load collections:", error)
        setCollections([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCollections()
  }, [quantumMode, sustainabilityMode, ethicalMode])

  // 🔍 Enhanced Search and Filter
  const filteredCollections = useMemo(() => {
    if (!Array.isArray(collections)) return []

    return collections.filter((collection) => {
      const matchesSearch =
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      if (!matchesSearch) return false

      if (filterBy === "all") return true

      // Filter by content rating
      const hasMatchingRating =
        Array.isArray(collection.images) && collection.images.some((image) => image.rating === filterBy)

      return hasMatchingRating
    })
  }, [collections, searchTerm, filterBy])

  // 🎯 Smart Sorting with Multiple Criteria
  const sortedCollections = useMemo(() => {
    if (!Array.isArray(filteredCollections)) return []

    return [...filteredCollections].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        case "size":
          return (b.images?.length || 0) - (a.images?.length || 0)
        case "ethics":
          const aEthics =
            Array.isArray(a.images) && a.images.length > 0
              ? a.images.reduce((sum, img) => sum + img.ethicsScore, 0) / a.images.length
              : 0
          const bEthics =
            Array.isArray(b.images) && b.images.length > 0
              ? b.images.reduce((sum, img) => sum + img.ethicsScore, 0) / b.images.length
              : 0
          return bEthics - aEthics
        case "carbon":
          return a.sustainabilityScore - b.sustainabilityScore
        default:
          return 0
      }
    })
  }, [filteredCollections, sortBy])

  // 🗑️ Delete Collection with Confirmation
  const deleteCollection = useCallback(
    async (collectionId: string) => {
      if (!confirm("Are you sure you want to delete this collection? This action cannot be undone.")) {
        return
      }

      try {
        const updatedCollections = collections.filter((c) => c.id !== collectionId)
        setCollections(updatedCollections)
        localStorage.setItem("waifu-collections", JSON.stringify(updatedCollections))

        if (selectedCollection === collectionId) {
          setSelectedCollection(null)
        }
      } catch (error) {
        console.error("Failed to delete collection:", error)
      }
    },
    [collections, selectedCollection],
  )

  // 🎨 Collection Card Component
  const CollectionCard = ({ collection }: { collection: Collection }) => {
    const imageCount = Array.isArray(collection.images) ? collection.images.length : 0
    const avgEthicsScore =
      imageCount > 0 ? collection.images.reduce((sum, img) => sum + img.ethicsScore, 0) / imageCount : 0
    const totalCarbonFootprint =
      imageCount > 0 ? collection.images.reduce((sum, img) => sum + img.carbonFootprint, 0) : 0
    const quantumOptimizedCount = imageCount > 0 ? collection.images.filter((img) => img.quantumOptimized).length : 0

    return (
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-200 cursor-pointer",
          selectedCollection === collection.id && "ring-2 ring-primary",
          !collection.ethicsValidated && ethicalMode && "border-yellow-300",
          collection.sustainabilityScore < 50 && sustainabilityMode && "border-orange-300",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {collection.name}
                {collection.quantumEnhanced && quantumMode && (
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    <Zap className="h-3 w-3 mr-1" />
                    Quantum
                  </Badge>
                )}
                {collection.ethicsValidated && ethicalMode && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <Shield className="h-3 w-3 mr-1" />
                    Ethical
                  </Badge>
                )}
                {collection.sustainabilityScore >= 80 && sustainabilityMode && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <Leaf className="h-3 w-3 mr-1" />
                    Eco
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {collection.description || "No description available"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCollection(collection.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Collection</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Collection Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{imageCount} images</span>
              <span>{new Date(collection.lastModified).toLocaleDateString()}</span>
            </div>

            {/* Enhanced Metrics */}
            {(ethicalMode || sustainabilityMode || quantumMode) && (
              <div className="grid grid-cols-3 gap-2 text-xs">
                {ethicalMode && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center p-2 rounded bg-muted/50">
                          <div
                            className={cn("font-medium", {
                              "text-green-600": avgEthicsScore >= 90,
                              "text-yellow-600": avgEthicsScore >= 70,
                              "text-red-600": avgEthicsScore < 70,
                            })}
                          >
                            🎯 {avgEthicsScore.toFixed(0)}
                          </div>
                          <div className="text-muted-foreground">Ethics</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ethics Score: {avgEthicsScore.toFixed(1)}/100</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {sustainabilityMode && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center p-2 rounded bg-muted/50">
                          <div
                            className={cn("font-medium", {
                              "text-green-600": totalCarbonFootprint <= 0.5,
                              "text-yellow-600": totalCarbonFootprint <= 1.0,
                              "text-red-600": totalCarbonFootprint > 1.0,
                            })}
                          >
                            🌱 {totalCarbonFootprint.toFixed(2)}
                          </div>
                          <div className="text-muted-foreground">Carbon</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Carbon Footprint: {totalCarbonFootprint.toFixed(2)}g CO₂</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {quantumMode && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center p-2 rounded bg-muted/50">
                          <div className="font-medium text-purple-600">🔮 {quantumOptimizedCount}</div>
                          <div className="text-muted-foreground">Quantum</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Quantum Optimized: {quantumOptimizedCount}/{imageCount}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}

            {/* Tags */}
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {collection.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {collection.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{collection.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">🔮 Quantum-loading collections...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">
            Manage your waifu image collections with quantum-enhanced organization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {quantumMode && (
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Zap className="h-3 w-3 mr-1" />
              Quantum Mode
            </Badge>
          )}
          {sustainabilityMode && (
            <Badge variant="outline" className="text-green-600 border-green-300">
              <Leaf className="h-3 w-3 mr-1" />
              Eco Mode
            </Badge>
          )}
          {ethicalMode && (
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Shield className="h-3 w-3 mr-1" />
              Ethical Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              {ethicalMode && <SelectItem value="ethics">Ethics</SelectItem>}
              {sustainabilityMode && <SelectItem value="carbon">Carbon</SelectItem>}
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="questionable">Questionable</SelectItem>
              <SelectItem value="explicit">Explicit</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Collections Grid/List */}
      {sortedCollections.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No collections found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Create your first collection to get started"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4")}>
          {sortedCollections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(selectedCollection === collection.id ? null : collection.id)}
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
        </div>
      )}

      {/* Collection Stats */}
      {sortedCollections.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{sortedCollections.length}</div>
                <div className="text-sm text-muted-foreground">Collections</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {sortedCollections.reduce((sum, c) => sum + (Array.isArray(c.images) ? c.images.length : 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Images</div>
              </div>
              {ethicalMode && (
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {sortedCollections.filter((c) => c.ethicsValidated).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Ethics Validated</div>
                </div>
              )}
              {quantumMode && (
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {sortedCollections.filter((c) => c.quantumEnhanced).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Quantum Enhanced</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CollectionsPage
