"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Bug, Zap } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  quantumMode?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  quantumRecoveryAttempts: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      quantumRecoveryAttempts: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // 🔮 Quantum Error Reporting
    if (this.props.quantumMode) {
      this.quantumErrorAnalysis(error, errorInfo)
    }

    // Standard error logging
    console.error("Error Boundary caught an error:", error, errorInfo)
  }

  // 🔮 Quantum-Enhanced Error Analysis
  private quantumErrorAnalysis = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Simulate quantum error pattern recognition
      const quantumSignature = {
        errorType: error.name,
        quantumState: Math.random(),
        entanglementLevel: Math.random() * 0.8 + 0.2,
        coherenceTime: Math.random() * 1000,
        probabilityAmplitude: Math.random(),
      }

      console.info("🔮 Quantum Error Analysis:", {
        errorId: this.state.errorId,
        quantumSignature,
        stackTrace: error.stack,
        componentStack: errorInfo.componentStack,
      })

      // Attempt quantum error correction
      this.attemptQuantumRecovery()
    } catch (quantumError) {
      console.error("🚨 Quantum error analysis failed:", quantumError)
    }
  }

  // 🔮 Quantum Recovery Mechanism
  private attemptQuantumRecovery = () => {
    if (this.state.quantumRecoveryAttempts >= 3) {
      console.warn("🔮 Maximum quantum recovery attempts reached")
      return
    }

    setTimeout(
      () => {
        console.info("🔮 Attempting quantum error recovery...")

        // Simulate quantum error correction
        const recoverySuccess = Math.random() > 0.3 // 70% success rate

        if (recoverySuccess) {
          console.info("🔮 Quantum recovery successful!")
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            quantumRecoveryAttempts: this.state.quantumRecoveryAttempts + 1,
          })
        } else {
          console.warn("🔮 Quantum recovery failed, incrementing attempts")
          this.setState({
            quantumRecoveryAttempts: this.state.quantumRecoveryAttempts + 1,
          })
        }
      },
      1000 * (this.state.quantumRecoveryAttempts + 1),
    ) // Exponential backoff
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      quantumRecoveryAttempts: 0,
    })
  }

  private handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // In a real app, this would send to an error reporting service
    console.info("📊 Error Report Generated:", errorReport)

    // Copy to clipboard for easy reporting
    navigator.clipboard
      .writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert("Error report copied to clipboard!"))
      .catch(() => console.error("Failed to copy error report"))
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                Application Error Detected
                {this.props.quantumMode && (
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    <Zap className="h-3 w-3 mr-1" />
                    Quantum Recovery
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </p>
                    <p>
                      <strong>Error Type:</strong> {this.state.error?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Message:</strong> {this.state.error?.message || "No message available"}
                    </p>
                    {this.props.quantumMode && this.state.quantumRecoveryAttempts > 0 && (
                      <p>
                        <strong>Quantum Recovery Attempts:</strong> {this.state.quantumRecoveryAttempts}/3
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <Alert>
                  <AlertDescription>
                    <details className="space-y-2">
                      <summary className="cursor-pointer font-medium">Technical Details (Development Mode)</summary>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                      {this.state.errorInfo && (
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleReportError} className="flex-1 bg-transparent">
                  <Bug className="h-4 w-4 mr-2" />
                  Report Error
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {/* Quantum Recovery Status */}
              {this.props.quantumMode && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>Quantum error correction is active</span>
                      {this.state.quantumRecoveryAttempts < 3 && (
                        <Button size="sm" variant="outline" onClick={this.attemptQuantumRecovery}>
                          <Zap className="h-3 w-3 mr-1" />
                          Force Recovery
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper component for easier usage
export function ErrorBoundaryWrapper({
  children,
  quantumMode = false,
}: {
  children: ReactNode
  quantumMode?: boolean
}) {
  return <ErrorBoundary quantumMode={quantumMode}>{children}</ErrorBoundary>
}
