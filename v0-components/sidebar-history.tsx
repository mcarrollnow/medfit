"use client"

import { useState } from "react"
import { MessageSquare, Trash2 } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  created_at: string
}

interface SidebarHistoryProps {
  userId?: string
}

export function SidebarHistory({ userId }: SidebarHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Mock data fetching - replace with real SWR hook
  useState(() => {
    setTimeout(() => {
      setSessions([
        { id: "1", title: "How to use crypto payments", created_at: new Date().toISOString() },
        { id: "2", title: "Support ticket question", created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: "3", title: "Product inquiry", created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: "4", title: "Shipping information", created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
        { id: "5", title: "Account settings help", created_at: new Date(Date.now() - 86400000 * 40).toISOString() },
      ])
      setIsLoading(false)
    }, 500)
  })

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete chat "${title}"?`)) {
      setSessions((prev) => prev.filter((s) => s.id !== id))
      if (activeId === id) {
        setActiveId(null)
        // Navigate away if current chat is deleted
      }
    }
  }

  const handleClick = (id: string) => {
    setActiveId(id)
    // Navigate to chat
  }

  // Date grouping helpers
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isYesterday = (date: Date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return date.toDateString() === yesterday.toDateString()
  }

  const isLastWeek = (date: Date) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date > weekAgo && !isToday(date) && !isYesterday(date)
  }

  const isLastMonth = (date: Date) => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date > monthAgo && date <= weekAgo
  }

  // Group sessions
  const groupedSessions = {
    today: sessions.filter((s) => isToday(new Date(s.created_at))),
    yesterday: sessions.filter((s) => isYesterday(new Date(s.created_at))),
    lastWeek: sessions.filter((s) => isLastWeek(new Date(s.created_at))),
    lastMonth: sessions.filter((s) => isLastMonth(new Date(s.created_at))),
    older: sessions.filter((s) => {
      const date = new Date(s.created_at)
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      return date <= monthAgo
    }),
  }

  if (isLoading) {
    return (
      <div className="px-2 py-1 space-y-2">
        <div className="h-8 rounded-md animate-pulse bg-muted" style={{ width: "44%" }} />
        <div className="h-8 rounded-md animate-pulse bg-muted" style={{ width: "32%" }} />
        <div className="h-8 rounded-md animate-pulse bg-muted" style={{ width: "28%" }} />
        <div className="h-8 rounded-md animate-pulse bg-muted" style={{ width: "64%" }} />
        <div className="h-8 rounded-md animate-pulse bg-muted" style={{ width: "52%" }} />
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="px-4 py-8">
        <p className="text-sm text-muted-foreground">No chat history yet</p>
      </div>
    )
  }

  const renderGroup = (title: string, chats: ChatSession[]) => {
    if (chats.length === 0) return null

    return (
      <div key={title}>
        <div className="px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleClick(chat.id)}
              className={`group px-2 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors ${
                activeId === chat.id ? "border-l-2 border-accent-yellow bg-accent" : ""
              }`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate flex-1">{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(chat.id, chat.title)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {renderGroup("Today", groupedSessions.today)}
      {renderGroup("Yesterday", groupedSessions.yesterday)}
      {renderGroup("Last 7 days", groupedSessions.lastWeek)}
      {renderGroup("Last 30 days", groupedSessions.lastMonth)}
      {renderGroup("Older", groupedSessions.older)}
    </div>
  )
}
