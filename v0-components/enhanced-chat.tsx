"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Paperclip, Send, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface EnhancedChatProps {
  isOpen: boolean
  onClose: () => void
  conversationType?: string
  contextId?: string
  title?: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface FileAttachment {
  id: string
  name: string
  base64: string
}

export function EnhancedChat({
  isOpen,
  onClose,
  conversationType = "general",
  contextId,
  title = "AI Assistant",
}: EnhancedChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileAttachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load conversation history on mount
  useEffect(() => {
    if (isOpen && contextId) {
      loadConversationHistory()
    }
  }, [isOpen, contextId])

  const loadConversationHistory = async () => {
    // Mock loading conversation history
    // In production, fetch from API: /api/chat/history?contextId=${contextId}
    const mockHistory: Message[] = [
      {
        id: "1",
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date(),
      },
    ]
    setMessages(mockHistory)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const newFiles: FileAttachment[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const reader = new FileReader()

      reader.onload = (event) => {
        const base64 = event.target?.result as string
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          base64,
        })

        if (newFiles.length === selectedFiles.length) {
          setFiles((prev) => [...prev, ...newFiles])
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Mock streaming response
    // In production, use useChat hook or fetch from API
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: `Here's a response to: "${input}"\n\n\`\`\`javascript\nconst example = "code block";\nconsole.log(example);\n\`\`\`\n\nThis is a **markdown** formatted response with *emphasis*.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setFiles([])
      setIsLoading(false)
    }, 1000)
  }

  const copyToClipboard = (text: string, codeId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(codeId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering (in production, use react-markdown with plugins)
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const codeMatch = part.match(/```(\w+)?\n([\s\S]*?)```/)
        if (codeMatch) {
          const language = codeMatch[1] || "text"
          const code = codeMatch[2]
          const codeId = `code-${index}`

          return (
            <div key={index} className="relative my-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <span className="text-sm text-muted-foreground">{language}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code, codeId)} className="h-8 px-2">
                  {copiedCode === codeId ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="overflow-x-auto p-4">
                <code className="text-sm">{code}</code>
              </pre>
            </div>
          )
        }
      }

      // Simple markdown formatting
      return (
        <div
          key={index}
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: part
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/\n/g, "<br />"),
          }}
        />
      )
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user" ? "bg-accent-yellow text-black" : "border bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  renderMarkdown(message.content)
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg border bg-muted px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Attachments */}
        {files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 px-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-1.5 text-sm">
                <Paperclip className="h-4 w-4" />
                <span>{file.name}</span>
                <button onClick={() => removeFile(file.id)} className="hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 border-t p-4">
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && files.length === 0) || isLoading}
            className="bg-accent-yellow text-black hover:bg-accent-yellow/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
