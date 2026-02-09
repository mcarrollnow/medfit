"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"

interface AdminTicketDetailProps {
  ticketSubject: string
  ticketStatus: "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
  ticketPriority: "low" | "medium" | "high" | "urgent"
  customerName: string
  customerEmail: string
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    senderName: string
    senderRole: "customer" | "ai"
    createdAt: Date
  }>
  onStatusChange: (status: string) => void
  onPriorityChange: (priority: string) => void
  onSendMessage: (message: string) => void
  onGenerateAI: () => void
  isGenerating: boolean
  isLoading: boolean
}

export function AdminTicketDetail({
  ticketSubject,
  ticketStatus,
  ticketPriority,
  customerName,
  customerEmail,
  messages,
  onStatusChange,
  onPriorityChange,
  onSendMessage,
  onGenerateAI,
  isGenerating,
  isLoading,
}: AdminTicketDetailProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-accent-green/20 text-accent-green border-accent-green/30"
      case "in-progress":
        return "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30"
      case "waiting-customer":
      case "open":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "high":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      case "medium":
        return "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30"
      case "low":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <Card className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="border-b p-6 space-y-3">
        <h2 className="text-xl font-bold text-balance">{ticketSubject}</h2>

        {/* Badge row */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-background">
            <User className="w-3 h-3 mr-1" />
            {customerName}
          </Badge>
          <Badge variant="outline" className="bg-background">
            {customerEmail}
          </Badge>
          <Badge variant="outline" className="bg-accent-green/20 text-accent-green border-accent-green/30">
            <Bot className="w-3 h-3 mr-1" />
            AI Handling
          </Badge>
        </div>

        {/* Controls row */}
        <div className="flex gap-2">
          <Select value={ticketStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="waiting-customer">Waiting Customer</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ticketPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {message.senderRole === "customer" ? (
                    <User className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-accent-green" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{message.senderName}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        message.senderRole === "customer"
                          ? "bg-background"
                          : "bg-accent-green/20 text-accent-green border-accent-green/30"
                      }`}
                    >
                      {message.senderRole === "customer" ? "Customer" : "AI"}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-sm leading-relaxed">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-6 space-y-3">
        {/* Generate AI Response Button */}
        <Button variant="outline" className="w-full bg-transparent" onClick={onGenerateAI} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Response
            </>
          )}
        </Button>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] resize-none"
          />
          <Button size="lg" onClick={handleSend} disabled={!newMessage.trim()} className="self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
