import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"

export default function FavoritesLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Search Bar Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="flex-1 h-10" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="group">
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full rounded-t-lg" />
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-2/3" />
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
