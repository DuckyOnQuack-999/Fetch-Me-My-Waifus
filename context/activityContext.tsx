"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { wsService, type ActivityMessage } from "@/lib/websocket"
import { authService } from "@/lib/auth"

interface ActivityContextType {
  activities: ActivityMessage[]
  addActivity: (activity: Omit<ActivityMessage, "id" | "timestamp">) => void
  clearActivities: () => void
  isConnected: boolean
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect()
    setIsConnected(true)

    // Subscribe to activity updates
    const unsubscribe = wsService.subscribe((message) => {
      setActivities((prev) => [message, ...prev].slice(0, 50)) // Keep last 50 activities
    })

    // Cleanup
    return () => {
      unsubscribe()
      wsService.disconnect()
      setIsConnected(false)
    }
  }, [])

  const addActivity = useCallback((activity: Omit<ActivityMessage, "id" | "timestamp">) => {
    const user = authService.getCurrentUser()
    if (!user) return

    const fullActivity = {
      ...activity,
      userId: user.id,
      username: user.username,
    }

    wsService.sendActivity(fullActivity)

    // Also add locally for immediate feedback
    const message: ActivityMessage = {
      ...fullActivity,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setActivities((prev) => [message, ...prev].slice(0, 50))
  }, [])

  const clearActivities = useCallback(() => {
    setActivities([])
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
