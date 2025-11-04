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
  private isReconnecting = false
  private networkOnlineHandler: (() => void) | null = null

  constructor() {
    this.url =
      typeof window !== "undefined"
        ? process.env.NEXT_PUBLIC_WS_URL || `ws://${window.location.hostname}:3001`
        : "ws://localhost:3001"

    if (typeof window !== "undefined") {
      this.networkOnlineHandler = () => {
        if (!this.isConnected() && !this.connectionFailed && !this.isReconnecting) {
          console.log("[v0] Network back online, attempting to reconnect WebSocket...")
          this.connect()
        }
      }
      window.addEventListener("online", this.networkOnlineHandler)
    }
  }

  connect() {
    if (this.connectionFailed || !this.isEnabled || this.isReconnecting) {
      return
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    if (typeof window === "undefined") {
      return
    }

    if (!navigator.onLine) {
      console.log("[v0] No network connection, skipping WebSocket connection")
      return
    }

    try {
      this.isReconnecting = true
      this.ws = new WebSocket(this.url)

      const connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState !== WebSocket.OPEN) {
          this.ws?.close()
          this.handleConnectionFailure()
        }
      }, 5000)

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout)
        this.reconnectAttempts = 0
        this.connectionFailed = false
        this.isReconnecting = false
        this.startPing()
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "pong") {
            return // Heartbeat response, ignore
          }
          const message: ActivityMessage = data
          this.callbacks.forEach((callback) => callback(message))
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onerror = () => {
        clearTimeout(connectionTimeout)
        this.isReconnecting = false
        this.handleConnectionFailure()
      }

      this.ws.onclose = (event) => {
        clearTimeout(connectionTimeout)
        this.isReconnecting = false
        this.stopPing()

        if (event.code !== 1000 && !this.connectionFailed) {
          this.attemptReconnect()
        }
      }
    } catch (error) {
      this.isReconnecting = false
      this.handleConnectionFailure()
    }
  }

  disconnect() {
    this.isEnabled = false
    this.stopPing()

    if (this.networkOnlineHandler && typeof window !== "undefined") {
      window.removeEventListener("online", this.networkOnlineHandler)
      this.networkOnlineHandler = null
    }

    if (this.ws) {
      this.ws.close(1000, "Manual disconnect")
      this.ws = null
    }
  }

  private handleConnectionFailure() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.connectionFailed = true
      this.isEnabled = false
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.connectionFailed || this.isReconnecting) {
      this.handleConnectionFailure()
      return
    }

    this.reconnectAttempts++

    setTimeout(
      () => {
        this.connect()
      },
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
    ) // Exponential backoff
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }))
      }
    }, 30000)
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

  retryConnection() {
    if (this.connectionFailed) {
      this.connectionFailed = false
      this.reconnectAttempts = 0
      this.isEnabled = true
      this.connect()
    }
  }
}

export const wsService = new WebSocketService()
export type { ActivityMessage }
