"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function CollectionsLoading() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* API Status Skeleton */}
          <Skeleton className="h-16 w-full" />

          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-40" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Search Bar Skeleton */}
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            {/* Collections Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Collection Preview */}
                      <div className="grid grid-cols-3 gap-2 h-24">
                        <Skeleton className="aspect-square rounded" />
                        <Skeleton className="aspect-square rounded" />
                        <Skeleton className="aspect-square rounded" />
                      </div>

                      {/* Collection Stats */}
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-14" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
