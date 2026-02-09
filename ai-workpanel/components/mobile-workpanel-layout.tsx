"use client"

import * as React from "react"
import { MessageSquare, FlaskConical, DollarSign, History, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

type MobileWorkpanelLayoutProps = {
  children: React.ReactNode
  leftSidebar: React.ReactNode
  rightSidebar: React.ReactNode
}

type MobileTab = "chat" | "peptides" | "price" | "sessions"

export function MobileWorkpanelLayout({ children, leftSidebar, rightSidebar }: MobileWorkpanelLayoutProps) {
  const [activeTab, setActiveTab] = React.useState<MobileTab>("chat")
  const [showMenu, setShowMenu] = React.useState(false)

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <h1 className="text-lg font-semibold">AI Workpanel</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon-sm" onClick={() => setShowMenu(!showMenu)}>
            <Menu className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Content - Full Screen Tabs */}
      <div className="flex-1 overflow-hidden">
        {/* Chat Tab */}
        <div className={cn("h-full", activeTab === "chat" ? "block" : "hidden")}>{children}</div>

        {/* Peptides Tab */}
        <div className={cn("h-full overflow-y-auto", activeTab === "peptides" ? "block" : "hidden")}>
          {rightSidebar}
        </div>

        {/* Price Tab */}
        <div className={cn("h-full overflow-y-auto", activeTab === "price" ? "block" : "hidden")}>{rightSidebar}</div>

        {/* Sessions Tab */}
        <div className={cn("h-full overflow-y-auto", activeTab === "sessions" ? "block" : "hidden")}>{leftSidebar}</div>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex h-16 shrink-0 items-center justify-around border-t border-border bg-card">
        <Button
          variant="ghost"
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none",
            activeTab === "chat" && "bg-accent text-accent-foreground",
          )}
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare className="size-5" />
          <span className="text-xs">Chat</span>
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none",
            activeTab === "peptides" && "bg-accent text-accent-foreground",
          )}
          onClick={() => setActiveTab("peptides")}
        >
          <FlaskConical className="size-5" />
          <span className="text-xs">Peptides</span>
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none",
            activeTab === "price" && "bg-accent text-accent-foreground",
          )}
          onClick={() => setActiveTab("price")}
        >
          <DollarSign className="size-5" />
          <span className="text-xs">Price</span>
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none",
            activeTab === "sessions" && "bg-accent text-accent-foreground",
          )}
          onClick={() => setActiveTab("sessions")}
        >
          <History className="size-5" />
          <span className="text-xs">Sessions</span>
        </Button>
      </nav>
    </div>
  )
}
