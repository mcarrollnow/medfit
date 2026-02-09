"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Paperclip, Mic, Camera, Send, StopCircle, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: Array<{
    type: "image" | "file" | "audio"
    url: string
    name?: string
  }>
}

const HOT_BUTTONS = [
  { icon: Mic, label: "Summarize", prompt: "Summarize this for me" },
  { icon: Camera, label: "Quick Answer", prompt: "Give me a quick answer" },
  { icon: Paperclip, label: "Explain", prompt: "Explain this in detail" },
]

export function MobileChatInterface() {
  const { theme, toggleTheme } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState<Array<{ type: string; url: string; name?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHotButton = (prompt: string) => {
    setInput(prompt)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      setAttachments((prev) => [
        ...prev,
        { type: file.type.startsWith("image/") ? "image" : "file", url, name: file.name },
      ])
    })
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files[0]) return

    const url = URL.createObjectURL(files[0])
    setAttachments((prev) => [...prev, { type: "image", url, name: files[0].name }])
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAttachments((prev) => [...prev, { type: "audio", url, name: "voice-memo.webm" }])
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col h-dvh w-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/eagle-logo.png" alt="Eagle Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="font-semibold text-card-foreground">Modern Health Pro Agent</h1>
            <p className="text-xs text-muted-foreground">Powered by Claude</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0">
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 flex items-center justify-center mb-4">
              <img src="/eagle-logo.png" alt="Eagle Logo" className="w-20 h-20 object-contain" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">Start a conversation</h2>
            <p className="text-sm text-muted-foreground mb-6">{"Ask me anything, share files, or use voice memos"}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {HOT_BUTTONS.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleHotButton(button.prompt)}
                  className="gap-2"
                >
                  <button.icon className="w-4 h-4" />
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <Card
              className={cn(
                "max-w-[85%] p-3",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
              )}
            >
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index}>
                      {attachment.type === "image" && (
                        <img
                          src={attachment.url || "/placeholder.svg"}
                          alt="Attachment"
                          className="rounded-lg max-w-full h-auto"
                        />
                      )}
                      {attachment.type === "audio" && (
                        <audio controls className="w-full">
                          <source src={attachment.url} type="audio/webm" />
                        </audio>
                      )}
                      {attachment.type === "file" && (
                        <div className="flex items-center gap-2 p-2 bg-background/10 rounded">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground p-3">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hot Buttons */}
      {messages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {HOT_BUTTONS.map((button, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                onClick={() => handleHotButton(button.prompt)}
                className="gap-2 shrink-0"
              >
                <button.icon className="w-4 h-4" />
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative shrink-0">
                {attachment.type === "image" && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <Mic className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {attachment.type === "audio" && (
                  <div className="relative w-24 h-16 rounded-lg bg-accent flex items-center justify-center">
                    <Camera className="w-6 h-6 text-accent-foreground" />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <Mic className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {attachment.type === "file" && (
                  <div className="relative w-24 h-16 rounded-lg bg-muted flex items-center justify-center p-2">
                    <Paperclip className="w-6 h-6 text-muted-foreground" />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <Mic className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
            />
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} className="shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCameraCapture}
            />
            <Button variant="outline" size="icon" onClick={() => cameraInputRef.current?.click()} className="shrink-0">
              <Camera className="w-5 h-5" />
            </Button>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className="shrink-0"
            >
              {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />

          <Button
            onClick={handleSend}
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
