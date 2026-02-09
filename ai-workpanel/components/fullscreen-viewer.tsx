"use client"

import * as React from "react"
import { X, Maximize2, Download, MessageSquare, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

type FullscreenViewerProps = {
  children: React.ReactNode
  title: string
  onExport?: () => void
  onSendToChat?: () => void
  onAnalyze?: () => void
}

export function FullscreenViewer({ children, title, onExport, onSendToChat, onAnalyze }: FullscreenViewerProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  return (
    <>
      {/* Fullscreen toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10"
        onClick={() => setIsFullscreen(true)}
        title="Fullscreen"
      >
        <Maximize2 className="size-4" />
      </Button>

      {/* Regular view */}
      <div className="relative size-full">{children}</div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Header with controls */}
          <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="mr-2 size-4" />
                  Export
                </Button>
              )}
              {onSendToChat && (
                <Button variant="outline" size="sm" onClick={onSendToChat}>
                  <MessageSquare className="mr-2 size-4" />
                  Send to Chat
                </Button>
              )}
              {onAnalyze && (
                <Button variant="outline" size="sm" onClick={onAnalyze}>
                  <BarChart3 className="mr-2 size-4" />
                  Analyze
                </Button>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(false)}>
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Viewer content */}
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      )}
    </>
  )
}
