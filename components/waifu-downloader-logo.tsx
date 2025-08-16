"use client"

import { motion } from "framer-motion"
import { Heart, Download, Sparkles } from "lucide-react"

interface WaifuDownloaderLogoProps {
  size?: number
  className?: string
}

export function WaifuDownloaderLogo({ size = 40, className }: WaifuDownloaderLogoProps) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Background circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
        animate={{
          boxShadow: [
            "0 0 20px rgba(236, 72, 153, 0.3)",
            "0 0 30px rgba(236, 72, 153, 0.5)",
            "0 0 20px rgba(236, 72, 153, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Main icon */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Heart className="w-5 h-5 text-white fill-white" />
      </motion.div>

      {/* Floating sparkles */}
      <motion.div
        className="absolute -top-1 -right-1"
        animate={{
          y: [-2, -6, -2],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
      >
        <Sparkles className="w-3 h-3 text-yellow-400" />
      </motion.div>

      <motion.div
        className="absolute -bottom-1 -left-1"
        animate={{
          y: [2, 6, 2],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
      >
        <Download className="w-3 h-3 text-blue-400" />
      </motion.div>
    </motion.div>
  )
}
