"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error("[ErrorBoundary] Caught error:", error)
    console.error("[ErrorBoundary] Error info:", errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Render default error UI
      return (
        <div className="rounded-xl p-6 h-96 flex items-center justify-center border border-red-500/20 bg-red-500/5">
          <div className="text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent-yellow text-black rounded-lg hover:bg-accent-yellow/90 transition-colors text-sm font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
