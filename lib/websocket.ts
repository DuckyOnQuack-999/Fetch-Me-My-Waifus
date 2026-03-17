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
  private isEnabled = false
  private connectionFailed = false
  private isReconnecting = false
  private networkOnlineHandler: (() => void) | null = null

  constructor() {
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      const hostname = window.location.hostname
      const port = process.env.NEXT_PUBLIC_WS_PORT || "3001"
      this.url = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${hostname}:${port}`

      this.isEnabled = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === "true"
    } else {
      this.url = "ws://localhost:3001"
    }

    if (typeof window !== "undefined" && this.isEnabled) {
      this.networkOnlineHandler = () => {
        if (!this.isConnected() && !this.connectionFailed && !this.isReconnecting) {
          this.connect()
        }
      }
      window.addEventListener("online", this.networkOnlineHandler)
    }
  }

  connect() {
    if (!this.isEnabled || this.connectionFailed || this.isReconnecting) {
      return
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    if (typeof window === "undefined") {
      return
    }

    if (!navigator.onLine) {
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
            return
          }
          const message: ActivityMessage = data
          this.callbacks.forEach((callback) => callback(message))
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
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
    )
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

  isWebSocketEnabled(): boolean {
    return this.isEnabled
  }
}

export const wsService = new WebSocketService()
export type { ActivityMessage }
