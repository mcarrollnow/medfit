"use client"

import { useEffect, useRef } from "react"
import { User, UserCircle } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderType: "rep" | "customer"
  senderName: string
  text: string
  timestamp: string
  isRead?: boolean
}

interface MessageThreadProps {
  messages: Message[]
  currentUserType: "rep" | "customer"
}

export function MessageThread({ messages, currentUserType }: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffHours < 24) {
      // Less than 24 hours: show time
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    } else if (diffDays < 7) {
      // Less than a week: show day and time
      return date.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })
    } else {
      // More than a week: show date
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="max-h-[500px] overflow-y-auto p-4 rounded-lg bg-muted/30">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start a conversation</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[500px] overflow-y-auto p-4 rounded-lg bg-muted/30 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderType === currentUserType
        const isRep = message.senderType === "rep"

        return (
          <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted flex-shrink-0">
              {isRep ? (
                <UserCircle className="w-5 h-5 text-muted-foreground" />
              ) : (
                <User className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {/* Message container */}
            <div className="max-w-[70%]">
              {/* Sender label */}
              <div className={`text-xs px-1 mb-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                <span className="text-muted-foreground">{message.senderName}</span>
              </div>

              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-lg ${
                  isCurrentUser
                    ? "bg-accent-yellow text-foreground rounded-tr-none"
                    : "bg-background border border-border rounded-tl-none"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              </div>

              {/* Timestamp and unread indicator */}
              <div
                className={`text-xs mt-1 px-1 flex items-center gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <span className="text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                {!message.isRead && !isCurrentUser && <span className="w-2 h-2 rounded-full bg-accent-yellow" />}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}
