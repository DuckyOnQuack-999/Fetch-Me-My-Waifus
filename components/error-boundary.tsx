"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, Heart, Bug } from "lucide-react"
import { motion } from "framer-motion"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-primary/5" />

      {/* Floating hearts animation */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10"
          initial={{ y: "100vh", x: `${20 + i * 15}vw`, opacity: 0 }}
          animate={{
            y: "-20vh",
            opacity: [0, 0.3, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Heart className="h-8 w-8" fill="currentColor" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md glass-card border-destructive/20">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(220, 38, 38, 0)",
                  "0 0 0 10px rgba(220, 38, 38, 0.1)",
                  "0 0 0 0 rgba(220, 38, 38, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </motion.div>
            <CardTitle className="text-xl text-gradient">Oops! Something went wrong</CardTitle>
            <CardDescription>Don't worry, your waifus are safe! We encountered an unexpected error.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === "development" && error && (
              <motion.div
                className="rounded-lg bg-muted/50 p-4 border border-destructive/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-destructive">Error Details</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded">{error.message}</p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                      View Stack Trace
                    </summary>
                    <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap overflow-auto max-h-32 bg-background/50 p-2 rounded">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={resetError} className="flex-1 bg-transparent hover:bg-primary/10" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = "/")} className="flex-1 btn-glow">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              If this problem persists, please{" "}
              <a href="mailto:support@waifuhub.com" className="text-primary hover:underline">
                contact support
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("Error caught by hook:", error, errorInfo)
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
