"use client"

import { useState } from "react"
import { MessageSquare, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarHistory } from "@/components/sidebar-history"

interface AppSidebarProps {
  userId?: string
  userEmail?: string
}

export function AppSidebar({ userId, userEmail }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleNewChat = () => {
    // Navigate to new chat
    console.log("[v0] Navigating to new chat")
    // In a real app: router.push('/chat/new')
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  if (!isOpen) {
    return (
      <div className="border-r bg-background">
        <div className="p-3">
          <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-xl bg-transparent">
            <PanelLeft className="w-6 h-6" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full border-r bg-background w-64">
      {/* Header */}
      <div className="p-3 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleNewChat}
          className="flex-1 px-4 py-3 rounded-lg border justify-start bg-transparent"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          New Message
        </Button>
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="p-3 rounded-xl border bg-transparent">
          <PanelLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <SidebarHistory userId={userId} />
      </div>

      {/* Footer */}
      {userEmail && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>
      )}
    </div>
  )
}
