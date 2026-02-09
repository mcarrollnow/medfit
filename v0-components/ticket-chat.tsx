"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { format } from "date-fns"
import { ArrowLeft, Clock, AlertCircle, CheckCircle2, Send, Bot, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  senderName: string
  createdAt: Date
}

interface TicketChatProps {
  ticketSubject: string
  ticketStatus: "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
  messages: Message[]
  currentUserName: string
  onBack: () => void
  onSendMessage: (message: string) => void
  isLoading: boolean
  isSending: boolean
}

const statusConfig = {
  open: {
    label: "Open",
    icon: Clock,
    className: "bg-[var(--accent-yellow)] text-black",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    className: "bg-[var(--accent-yellow)] text-black",
  },
  "waiting-customer": {
    label: "Waiting",
    icon: Clock,
    className: "bg-muted text-muted-foreground",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-[var(--accent-green)] text-black",
  },
  closed: {
    label: "Closed",
    icon: CheckCircle2,
    className: "bg-[var(--accent-green)] text-black",
  },
}

export function TicketChat({
  ticketSubject,
  ticketStatus,
  messages,
  currentUserName,
  onBack,
  onSendMessage,
  isLoading,
  isSending,
}: TicketChatProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (messageInput.trim() && !isSending) {
      onSendMessage(messageInput.trim())
      setMessageInput("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "60px"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const statusInfo = statusConfig[ticketStatus]
  const StatusIcon = statusInfo.icon

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1 leading-relaxed">{ticketSubject}</h1>
        <Badge className={cn("gap-1.5 shrink-0", statusInfo.className)}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Bot className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isAssistant = message.role === "assistant"
              return (
                <div key={message.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback
                      className={cn(
                        "text-xs font-medium",
                        isAssistant ? "bg-[var(--accent-yellow)] text-black" : "bg-muted",
                      )}
                    >
                      {isAssistant ? <Bot className="h-4 w-4" /> : getInitials(message.senderName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Container */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{message.senderName}</span>
                      {isAssistant && (
                        <Badge variant="secondary" className="text-xs">
                          AI Assistant
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(message.createdAt, "MMM d, h:mm a")}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "p-3 rounded-lg leading-relaxed",
                        isAssistant ? "bg-muted/50" : "bg-primary/5 border border-primary/10",
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {ticketStatus === "closed" ? (
        <div className="border-t p-4 text-center">
          <p className="text-sm text-muted-foreground">This ticket has been closed</p>
        </div>
      ) : (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="flex-1 min-h-[60px] max-h-[200px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={handleSend}
              disabled={!messageInput.trim() || isSending}
              size="icon"
              className="shrink-0 h-[60px] w-[60px]"
            >
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
