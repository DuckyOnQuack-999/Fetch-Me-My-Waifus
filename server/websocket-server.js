const WebSocket = require("ws")
const http = require("http")

const PORT = process.env.WS_PORT || 3001

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("WebSocket Server Running")
})

// Create WebSocket server
const wss = new WebSocket.Server({ server })

// Store connected clients
const clients = new Set()

wss.on("connection", (ws) => {
  console.log("New client connected")
  clients.add(ws)

  // Send welcome message
  ws.send(
    JSON.stringify({
      id: generateId(),
      userId: "system",
      username: "System",
      action: "connected",
      details: "Connected to activity feed",
      timestamp: new Date().toISOString(),
      type: "login",
    }),
  )

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString())

      // Handle ping
      if (data.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }))
        return
      }

      // Broadcast activity to all clients except sender
      const activityMessage = JSON.stringify(data)
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(activityMessage)
        }
      })

      console.log("Activity broadcasted:", data.action)
    } catch (error) {
      console.error("Error processing message:", error)
    }
  })

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected")
    clients.delete(ws)
  })

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
    clients.delete(ws)
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`)
})

// Helper function
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...")
  wss.close(() => {
    server.close(() => {
      console.log("Server closed")
      process.exit(0)
    })
  })
})
