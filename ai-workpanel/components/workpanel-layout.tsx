"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileWorkpanelLayout } from "@/components/mobile-workpanel-layout"

type WorkpanelLayoutProps = {
  children: React.ReactNode
  leftSidebar: React.ReactNode
  rightSidebar: React.ReactNode
}

export function WorkpanelLayout({ children, leftSidebar, rightSidebar }: WorkpanelLayoutProps) {
  const isMobile = useIsMobile()
  const [leftSidebarOpen, setLeftSidebarOpen] = React.useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = React.useState(false)

  if (isMobile) {
    return (
      <MobileWorkpanelLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
        {children}
      </MobileWorkpanelLayout>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar - Conversation History */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-80 border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-out",
          leftSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Conversations</h2>
            <Button variant="ghost" size="icon-sm" onClick={() => setLeftSidebarOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">{leftSidebar}</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}>
              <Menu className="size-5" />
            </Button>
            <h1 className="text-lg font-semibold">AI Workpanel</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" onClick={() => setRightSidebarOpen(!rightSidebarOpen)}>
              <Menu className="size-5" />
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>

      {/* Right Sidebar - Tools Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-96 border-l border-sidebar-border bg-sidebar transition-transform duration-300 ease-out",
          rightSidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Tools</h2>
            <Button variant="ghost" size="icon-sm" onClick={() => setRightSidebarOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">{rightSidebar}</div>
        </div>
      </aside>

      {/* Overlay for mobile/tablet */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => {
            setLeftSidebarOpen(false)
            setRightSidebarOpen(false)
          }}
        />
      )}
    </div>
  )
}
