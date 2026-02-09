"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot, User, Copy, Wallet, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CryptoAssistantChatProps {
  isOpen: boolean
  onClose: () => void
  inline?: boolean
  orderContext: {
    orderNumber?: string
    orderId?: string
    total: number
    ethAmount: string
    walletAddress: string
    hasMetaMask: boolean
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  quickReplies?: QuickReply[]
}

interface QuickReply {
  label: string
  action: "copy-eth" | "copy-usd" | "open-metamask" | "make-payment"
}

export function CryptoAssistantChat({ isOpen, onClose, inline = false, orderContext }: CryptoAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMetaMask, setHasMetaMask] = useState(orderContext.hasMetaMask)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check MetaMask availability every 2 seconds
  useEffect(() => {
    const checkMetaMask = () => {
      const hasMetaMaskInstalled = typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined"
      setHasMetaMask(hasMetaMaskInstalled)
    }

    const interval = setInterval(checkMetaMask, 2000)
    return () => clearInterval(interval)
  }, [])

  // Load initial message and chat history
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory()
    }
  }, [isOpen])

  const loadChatHistory = async () => {
    // Mock: Load chat history from API
    const initialMessage: Message = {
      id: "1",
      role: "assistant",
      content: `Hi! I'm here to help you complete your crypto payment for order ${orderContext.orderNumber || orderContext.orderId}. The total is $${orderContext.total.toFixed(2)} (${orderContext.ethAmount} ETH). Would you like help sending the payment?`,
      timestamp: new Date(),
      quickReplies: [
        { label: `Copy ${orderContext.ethAmount} ETH`, action: "copy-eth" },
        { label: `Copy $${orderContext.total.toFixed(2)}`, action: "copy-usd" },
        ...(hasMetaMask ? [{ label: "Open MetaMask", action: "open-metamask" as const }] : []),
        { label: "Make Payment", action: "make-payment" },
      ],
    }
    setMessages([initialMessage])
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Mock: Stream AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I can help you with that. Let me know if you need any assistance with the payment process.",
        timestamp: new Date(),
        quickReplies: [
          { label: `Copy ${orderContext.ethAmount} ETH`, action: "copy-eth" },
          { label: "Copy Wallet Address", action: "copy-eth" },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuickReply = (action: QuickReply["action"]) => {
    switch (action) {
      case "copy-eth":
        navigator.clipboard.writeText(orderContext.ethAmount)
        alert(`Copied ${orderContext.ethAmount} ETH to clipboard`)
        break
      case "copy-usd":
        navigator.clipboard.writeText(orderContext.total.toString())
        alert(`Copied $${orderContext.total.toFixed(2)} to clipboard`)
        break
      case "open-metamask":
        if (hasMetaMask) {
          // Open MetaMask
          window.open("https://metamask.io/", "_blank")
        } else {
          alert("MetaMask is not installed")
        }
        break
      case "make-payment":
        // Navigate to payment page
        alert("Navigating to payment page...")
        break
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  if (!isOpen && !inline) return null

  const containerClasses = inline
    ? "flex flex-col h-full"
    : "fixed inset-0 z-50 flex items-center justify-center bg-black/50"

  const chatClasses = inline
    ? "flex flex-col h-full bg-background"
    : "w-full max-w-2xl h-[600px] bg-background rounded-lg shadow-lg flex flex-col"

  return (
    <div className={containerClasses}>
      <div className={chatClasses}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-accent-yellow" />
            <h2 className="font-semibold">Crypto Payment Assistant</h2>
          </div>
          {!inline && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" ? "bg-accent-yellow/20" : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{message.role === "user" ? "You" : "Assistant"}</span>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                  </div>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-accent-yellow text-black" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>

              {/* Quick Reply Buttons */}
              {message.role === "assistant" && message.quickReplies && (
                <div className="flex flex-wrap gap-2 ml-13">
                  {message.quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="px-3 py-1.5 text-sm rounded bg-transparent"
                      onClick={() => handleQuickReply(reply.action)}
                    >
                      {reply.action === "copy-eth" && <Copy className="w-3 h-3 mr-1" />}
                      {reply.action === "copy-usd" && <Copy className="w-3 h-3 mr-1" />}
                      {reply.action === "open-metamask" && <Wallet className="w-3 h-3 mr-1" />}
                      {reply.action === "make-payment" && <CreditCard className="w-3 h-3 mr-1" />}
                      {reply.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-4 py-2 rounded-lg bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask me anything about your crypto payment..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
