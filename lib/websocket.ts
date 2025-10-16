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
  private maxReconnectAttempts = 3
  private reconnectDelay = 2000
  private callbacks: Set<WebSocketCallback> = new Set()
  private pingInterval: NodeJS.Timeout | null = null
  private url: string
  private isEnabled = true
  private connectionFailed = false

  constructor() {
    // Use environment variable or fallback to local WebSocket server
    this.url =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_WS_URL || `ws://${window.location.hostname}:3001`
        : "ws://localhost:3001"
  }

  connect() {
    // Don't attempt connection if it's already disabled due to repeated failures
    if (this.connectionFailed || !this.isEnabled) {
      console.log("WebSocket connection disabled")
      return
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected")
      return
    }

    // Check if we're in browser environment
    if (typeof window === "undefined") {
      console.log("WebSocket not available in server environment")
      return
    }

    try {
      console.log(`Attempting WebSocket connection to ${this.url}...`)
      this.ws = new WebSocket(this.url)

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          console.log("WebSocket connection timeout")
          this.ws?.close()
          this.handleConnectionFailure()
        }
      }, 5000)

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout)
        console.log("✅ WebSocket connected successfully")
        this.reconnectAttempts = 0
        this.connectionFailed = false
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
        clearTimeout(connectionTimeout)
        console.log("⚠️ WebSocket connection error (this is normal if the server isn't running)")
        // Don't log the error object as it doesn't contain useful info
        this.handleConnectionFailure()
      }

      this.ws.onclose = (event) => {
        clearTimeout(connectionTimeout)
        console.log(`WebSocket disconnected (code: ${event.code})`)
        this.stopPing()

        // Only attempt reconnect if it wasn't a manual close
        if (event.code !== 1000 && !this.connectionFailed) {
          this.attemptReconnect()
        }
      }
    } catch (error) {
      console.log("⚠️ Failed to create WebSocket connection:", error instanceof Error ? error.message : "Unknown error")
      this.handleConnectionFailure()
    }
  }

  disconnect() {
    this.isEnabled = false
    this.stopPing()
    if (this.ws) {
      this.ws.close(1000, "Manual disconnect")
      this.ws = null
    }
  }

  private handleConnectionFailure() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("ℹ️ WebSocket server not available - running in offline mode")
      this.connectionFailed = true
      this.isEnabled = false
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.connectionFailed) {
      this.handleConnectionFailure()
      return
    }

    this.reconnectAttempts++
    console.log(`Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

    setTimeout(() => {
      this.connect()
    }, this.reconnectDelay)
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
      return true
    }
    return false
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const wsService = new WebSocketService()
export type { ActivityMessage }
