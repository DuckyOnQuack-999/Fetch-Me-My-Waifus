"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStorage } from "@/context/storageContext"
import { Heart, Folder, Plus, Search, Grid, List, Sparkles, Zap, Leaf } from "lucide-react"

interface CollectionsTabProps {
  quantumMode?: boolean
  sustainabilityMode?: boolean
  ethicalMode?: boolean
}

export function CollectionsTab({
  quantumMode = false,
  sustainabilityMode = false,
  ethicalMode = false,
}: CollectionsTabProps) {
  const { collections, createCollection } = useStorage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  // Convert collections object to array safely
  const collectionsArray = useMemo(() => {
    if (!collections || typeof collections !== "object") {
      return []
    }

    return Object.entries(collections).map(([id, collection]) => ({
      id,
      name: collection?.name || "Unnamed Collection",
      count: collection?.imageIds?.length || 0,
      color: `bg-${["pink", "purple", "blue", "green", "yellow", "red"][Math.floor(Math.random() * 6)]}-500`,
      created_at: collection?.created_at || new Date().toISOString(),
      description: collection?.description || "",
      tags: collection?.tags || [],
      quantumOptimized: quantumMode,
      carbonNeutral: sustainabilityMode,
      ethicsScore: ethicalMode ? Math.floor(Math.random() * 20) + 80 : 0,
    }))
  }, [collections, quantumMode, sustainabilityMode, ethicalMode])

  // Filter collections based on search
  const filteredCollections = useMemo(() => {
    if (!searchTerm.trim()) return collectionsArray

    return collectionsArray.filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [collectionsArray, searchTerm])

  const handleCreateCollection = () => {
    const name = prompt("Enter collection name:")
    if (name?.trim()) {
      const description = prompt("Enter collection description (optional):")
      createCollection(name.trim(), description?.trim())
    }
  }

  return (
    <div className="space-y-6">
      <Card className="material-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <Folder className="h-5 w-5" />
            Collections
            {quantumMode && (
              <Badge variant="outline" className="text-purple-600 border-purple-300">
                <Zap className="h-3 w-3 mr-1" />
                Quantum
              </Badge>
            )}
            {sustainabilityMode && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                <Leaf className="h-3 w-3 mr-1" />
                Eco
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button size="sm" className="glow" onClick={handleCreateCollection}>
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </div>
          </div>

          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No collections found" : "No collections yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create your first collection to organize your images"}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateCollection} className="glow">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              )}
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
              {filteredCollections.map((collection) => (
                <Card key={collection.id} className="material-card hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${collection.color} flex items-center justify-center relative`}
                      >
                        <Heart className="h-5 w-5 text-white" />
                        {collection.quantumOptimized && (
                          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{collection.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{collection.count} images</Badge>
                          {collection.quantumOptimized && (
                            <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
                              <Zap className="h-2 w-2 mr-1" />Q
                            </Badge>
                          )}
                          {collection.carbonNeutral && (
                            <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                              <Leaf className="h-2 w-2 mr-1" />
                              Eco
                            </Badge>
                          )}
                          {collection.ethicsScore > 0 && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
                              {collection.ethicsScore}%
                            </Badge>
                          )}
                        </div>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">{collection.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
