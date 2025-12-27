"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Heart, Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {/* Floating hearts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20"
          initial={{ y: "100vh", x: `${10 + i * 15}vw`, opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.5, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 6 + i,
            delay: i * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Heart className="h-6 w-6" fill="currentColor" />
        </motion.div>
      ))}

      <div className="flex relative z-10">
        {/* Sidebar Skeleton */}
        <motion.div
          className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm p-4 space-y-4 hidden md:block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(220, 38, 38, 0.3)",
                  "0 0 20px rgba(220, 38, 38, 0.5)",
                  "0 0 10px rgba(220, 38, 38, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Sparkles className="h-5 w-5 text-white/70" />
            </motion.div>
            <Skeleton className="h-6 w-24 shimmer" />
          </div>

          <div className="space-y-2 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i }}
              >
                <Skeleton className="h-10 w-full shimmer" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-4 md:p-8 space-y-6">
          {/* Header */}
          <motion.div
            className="space-y-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary/50" />
              </motion.div>
              <Skeleton className="h-8 w-48 shimmer" />
            </div>
            <Skeleton className="h-4 w-72 shimmer" />
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * i, type: "spring" }}
              >
                <Card className="glass-card border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-16 shimmer" />
                        <Skeleton className="h-6 w-12 shimmer" />
                      </div>
                      <motion.div
                        className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Heart className="h-5 w-5 text-primary/30" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Image Grid */}
          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-48 shimmer" />
              <Skeleton className="h-10 w-32 shimmer" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Card className="overflow-hidden glass-card border-primary/10 group">
                    <CardContent className="p-0">
                      <motion.div
                        className="aspect-square w-full bg-gradient-to-br from-primary/5 to-accent/5"
                        animate={{
                          background: [
                            "linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(236, 72, 153, 0.05))",
                            "linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(220, 38, 38, 0.05))",
                            "linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(236, 72, 153, 0.05))",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Heart className="h-8 w-8 text-primary/20" />
                          </motion.div>
                        </div>
                      </motion.div>
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-full shimmer" />
                        <Skeleton className="h-3 w-2/3 shimmer" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="text-sm">Loading your collection...</span>
              <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
