"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type ChatInterfaceProps = {
  conversationId?: string
  category: "price-research" | "peptide-research"
}

export function ChatInterface({ conversationId, category }: ChatInterfaceProps) {
  const { messages, sendMessage, isLoading } = useChat({
    api: "/api/chat",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get("message") as string

    if (!message.trim()) return

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: message }],
    })

    e.currentTarget.reset()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to AI Workpanel</h2>
          <p className="mt-2 text-muted-foreground">Select a conversation or start a new one to begin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {category === "price-research" ? "Price & Product Research" : "Peptide Research"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask me anything about{" "}
                  {category === "price-research"
                    ? "pricing, products, or inventory"
                    : "peptides, molecules, or research data"}
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
              {message.role === "assistant" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  AI
                </div>
              )}
              <Card
                className={cn(
                  "max-w-[80%] px-4 py-3",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
                )}
              >
                <div className="text-sm leading-relaxed">
                  {message.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return <p key={partIndex}>{part.text}</p>
                    }
                    return null
                  })}
                </div>
              </Card>
              {message.role === "user" && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                AI
              </div>
              <Card className="px-4 py-3">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              name="message"
              placeholder={`Ask about ${category === "price-research" ? "prices, products, or inventory" : "peptides or research"}...`}
              className="min-h-[60px] flex-1 resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring focus:ring-2"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="size-[60px] shrink-0" disabled={isLoading}>
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
        </form>
      </div>
    </div>
  )
}
