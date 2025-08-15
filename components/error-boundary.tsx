"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Bug, Zap, Shield, Leaf } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  quantumMode?: boolean
  sustainabilityMode?: boolean
  ethicalMode?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
  quantumAnalysis?: {
    errorType: string
    severity: "low" | "medium" | "high" | "critical"
    quantumSafe: boolean
    ethicalImpact: number
    carbonCost: number
  }
}

// 🔮 Quantum Error Analysis
const analyzeErrorWithQuantum = (error: Error): State["quantumAnalysis"] => {
  const errorMessage = error.message.toLowerCase()

  // Determine error type and severity
  let errorType = "unknown"
  let severity: State["quantumAnalysis"]["severity"] = "medium"

  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    errorType = "network"
    severity = "high"
  } else if (errorMessage.includes("permission") || errorMessage.includes("unauthorized")) {
    errorType = "security"
    severity = "critical"
  } else if (errorMessage.includes("memory") || errorMessage.includes("heap")) {
    errorType = "memory"
    severity = "high"
  } else if (errorMessage.includes("syntax") || errorMessage.includes("parse")) {
    errorType = "syntax"
    severity = "medium"
  } else if (errorMessage.includes("timeout")) {
    errorType = "timeout"
    severity = "medium"
  }

  // Quantum safety assessment
  const quantumSafe = !errorMessage.includes("crypto") && !errorMessage.includes("encryption")

  // Ethical impact assessment (0-100, lower is better)
  let ethicalImpact = 10 // Base impact
  if (errorType === "security") ethicalImpact += 40
  if (errorMessage.includes("user") || errorMessage.includes("privacy")) ethicalImpact += 30

  // Carbon cost estimation (in grams CO2)
  let carbonCost = 0.1 // Base error handling cost
  if (severity === "critical") carbonCost += 0.5
  if (severity === "high") carbonCost += 0.3
  if (errorType === "network") carbonCost += 0.2 // Network retries

  return {
    errorType,
    severity,
    quantumSafe,
    ethicalImpact: Math.min(100, ethicalImpact),
    carbonCost,
  }
}

// 🎯 Ethical Error Reporting
const shouldReportError = (error: Error, ethicalMode: boolean): boolean => {
  if (!ethicalMode) return true

  const errorMessage = error.message.toLowerCase()

  // Don't report errors that might contain sensitive information
  if (
    errorMessage.includes("password") ||
    errorMessage.includes("token") ||
    errorMessage.includes("key") ||
    errorMessage.includes("secret")
  ) {
    return false
  }

  return true
}

// 🌱 Sustainable Error Recovery
const getSustainableRetryDelay = (retryCount: number, sustainabilityMode: boolean): number => {
  const baseDelay = 1000 // 1 second
  const exponentialBackoff = Math.pow(2, retryCount) * baseDelay

  if (sustainabilityMode) {
    // Increase delay to reduce server load and energy consumption
    return Math.min(exponentialBackoff * 1.5, 30000) // Max 30 seconds
  }

  return Math.min(exponentialBackoff, 10000) // Max 10 seconds
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      hasError: true,
      error,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 🔮 Quantum-enhanced error analysis
    const quantumAnalysis = this.props.quantumMode ? analyzeErrorWithQuantum(error) : undefined

    this.setState({
      error,
      errorInfo,
      quantumAnalysis,
    })

    // 🎯 Ethical error reporting
    if (shouldReportError(error, this.props.ethicalMode || false)) {
      // Log error for debugging (in production, send to monitoring service)
      console.group("🚨 Error Boundary Caught Error")
      console.error("Error:", error)
      console.error("Error Info:", errorInfo)
      if (quantumAnalysis) {
        console.info("Quantum Analysis:", quantumAnalysis)
      }
      console.groupEnd()
    }

    // 🌱 Sustainable error tracking
    if (this.props.sustainabilityMode) {
      // Track carbon cost of error handling
      const carbonCost = quantumAnalysis?.carbonCost || 0.1
      console.info(`🌱 Error handling carbon cost: ${carbonCost.toFixed(3)}g CO₂`)
    }
  }

  handleRetry = () => {
    const { sustainabilityMode } = this.props
    const { retryCount } = this.state

    // Limit retries to prevent infinite loops and reduce resource consumption
    const maxRetries = sustainabilityMode ? 3 : 5

    if (retryCount >= maxRetries) {
      console.warn("Maximum retry attempts reached")
      return
    }

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }

    // Calculate sustainable retry delay
    const delay = getSustainableRetryDelay(retryCount, sustainabilityMode || false)

    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        quantumAnalysis: undefined,
      })
    }, delay)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
      quantumAnalysis: undefined,
    })
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, quantumAnalysis } = this.state
    const { children, fallback, quantumMode, sustainabilityMode, ethicalMode } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      const maxRetries = sustainabilityMode ? 3 : 5
      const canRetry = retryCount < maxRetries

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div className="flex-1">
                  <CardTitle className="text-xl">Something went wrong</CardTitle>
                  <CardDescription>An unexpected error occurred. Error ID: {errorId}</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  {quantumMode && (
                    <Badge variant="outline" className="text-purple-600 border-purple-300">
                      <Zap className="h-3 w-3 mr-1" />
                      Quantum
                    </Badge>
                  )}
                  {ethicalMode && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      <Shield className="h-3 w-3 mr-1" />
                      Ethical
                    </Badge>
                  )}
                  {sustainabilityMode && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Leaf className="h-3 w-3 mr-1" />
                      Eco
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message */}
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription className="font-mono text-sm">{error.message}</AlertDescription>
              </Alert>

              {/* Quantum Analysis */}
              {quantumAnalysis && quantumMode && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-purple-600" />
                      Quantum Error Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {quantumAnalysis.errorType}
                      </div>
                      <div>
                        <span className="font-medium">Severity:</span>{" "}
                        <Badge
                          variant={
                            quantumAnalysis.severity === "critical"
                              ? "destructive"
                              : quantumAnalysis.severity === "high"
                                ? "default"
                                : quantumAnalysis.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {quantumAnalysis.severity}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Quantum Safe:</span>{" "}
                        <Badge variant={quantumAnalysis.quantumSafe ? "default" : "destructive"}>
                          {quantumAnalysis.quantumSafe ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Ethical Impact:</span>{" "}
                        <span
                          className={
                            quantumAnalysis.ethicalImpact <= 20
                              ? "text-green-600"
                              : quantumAnalysis.ethicalImpact <= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
                        >
                          {quantumAnalysis.ethicalImpact}/100
                        </span>
                      </div>
                    </div>
                    {sustainabilityMode && (
                      <div className="text-sm">
                        <span className="font-medium">Carbon Cost:</span>{" "}
                        <span className="text-green-600">{quantumAnalysis.carbonCost.toFixed(3)}g CO₂</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Error Stack (Development) */}
              {process.env.NODE_ENV === "development" && errorInfo && (
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium mb-2">Technical Details (Development Only)</summary>
                  <pre className="bg-muted p-3 rounded-md overflow-auto max-h-40 text-xs">
                    {error.stack}
                    {"\n\nComponent Stack:"}
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {retryCount > 0 && (
                    <span>
                      Retry attempts: {retryCount}/{maxRetries}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={this.handleReset}>
                    Reset
                  </Button>
                  {canRetry && (
                    <Button onClick={this.handleRetry} className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>

              {/* Sustainability Notice */}
              {sustainabilityMode && !canRetry && (
                <Alert>
                  <Leaf className="h-4 w-4" />
                  <AlertDescription>
                    Maximum retry attempts reached to minimize resource consumption and environmental impact. Please
                    refresh the page manually if needed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
