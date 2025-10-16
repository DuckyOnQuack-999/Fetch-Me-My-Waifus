type ActivityMessage = {
  id: string
  userId: string
  username: string
  action: string
  details: string
  timestamp: Date
  type: "download" | "favorite" | "collection" | "settings" | "login" | "register"
}

type WebSocketCallback = (message: ActivityMessage) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private callbacks: Set<WebSocketCallback> = new Set()
  private pingInterval: NodeJS.Timeout | null = null
  private url: string

  constructor() {
    // Use environment variable or fallback to local WebSocket server
    this.url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected")
      return
    }

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
        this.startPing()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: ActivityMessage = JSON.parse(event.data)
          this.callbacks.forEach((callback) => callback(message))
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.stopPing()
        this.attemptReconnect()
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.attemptReconnect()
    }
  }

  disconnect() {
    this.stopPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

    setTimeout(() => {
      this.connect()
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }))
      }
    }, 30000) // Ping every 30 seconds
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  subscribe(callback: WebSocketCallback) {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  sendActivity(activity: Omit<ActivityMessage, "id" | "timestamp">) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: ActivityMessage = {
        ...activity,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      }
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn("WebSocket not connected, activity not sent")
    }
  }
}

export const wsService = new WebSocketService()
export type { ActivityMessage }
