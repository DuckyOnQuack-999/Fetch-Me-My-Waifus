"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { wsService, type ActivityMessage } from "@/lib/websocket"
import { authService } from "@/lib/auth"

interface ActivityContextType {
  activities: ActivityMessage[]
  addActivity: (activity: Omit<ActivityMessage, "id" | "timestamp" | "userId" | "username">) => void
  clearActivities: () => void
  isConnected: boolean
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Only connect in browser environment
    if (typeof window === "undefined") return

    // Connect to WebSocket (will fail gracefully if server not available)
    wsService.connect()

    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnected(wsService.isConnected())
    }, 1000)

    // Subscribe to activity updates
    const unsubscribe = wsService.subscribe((message) => {
      setActivities((prev) => [message, ...prev].slice(0, 50)) // Keep last 50 activities
    })

    // Load initial activities from localStorage
    try {
      const stored = localStorage.getItem("recent-activities")
      if (stored) {
        const parsed = JSON.parse(stored)
        setActivities(parsed.slice(0, 50))
      }
    } catch (error) {
      console.error("Failed to load activities from storage:", error)
    }

    // Cleanup
    return () => {
      clearInterval(checkConnection)
      unsubscribe()
      wsService.disconnect()
      setIsConnected(false)
    }
  }, [])

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      try {
        localStorage.setItem("recent-activities", JSON.stringify(activities))
      } catch (error) {
        console.error("Failed to save activities to storage:", error)
      }
    }
  }, [activities])

  const addActivity = useCallback((activity: Omit<ActivityMessage, "id" | "timestamp" | "userId" | "username">) => {
    const user = authService.getCurrentUser()
    if (!user) return

    const fullActivity = {
      ...activity,
      userId: user.id,
      username: user.username,
    }

    // Try to send via WebSocket
    const sent = wsService.sendActivity(fullActivity)

    // Always add locally for immediate feedback
    const message: ActivityMessage = {
      ...fullActivity,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setActivities((prev) => [message, ...prev].slice(0, 50))

    if (!sent) {
      console.log("Activity saved locally (WebSocket not connected)")
    }
  }, [])

  const clearActivities = useCallback(() => {
    setActivities([])
    try {
      localStorage.removeItem("recent-activities")
    } catch (error) {
      console.error("Failed to clear activities from storage:", error)
    }
  }, [])

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities, isConnected }}>
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider")
  }
  return context
}
