"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WaifuDownloaderLogo } from "@/components/waifu-downloader-logo"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 min-h-screen bg-background">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mt-auto"
      >
        <Card className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <WaifuDownloaderLogo className="h-16 w-16" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Loading Waifu Downloader</h2>
            <p className="text-muted-foreground">Preparing your anime collection...</p>
          </div>

          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
