"use client"

import { motion } from "framer-motion"
import { Heart, Download } from "lucide-react"

interface WaifuDownloaderLogoProps {
  size?: number
  className?: string
}

export function WaifuDownloaderLogo({ size = 32, className = "" }: WaifuDownloaderLogoProps) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-lg"
        animate={{
          boxShadow: [
            "0 0 20px rgba(236, 72, 153, 0.3)",
            "0 0 30px rgba(147, 51, 234, 0.4)",
            "0 0 20px rgba(236, 72, 153, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Heart className="w-4 h-4 text-white fill-current" />
        </motion.div>

        <motion.div
          className="absolute -bottom-1 -right-1"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Download className="w-3 h-3 text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}
