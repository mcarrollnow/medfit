"use client"

import { useState, type KeyboardEvent } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageInputProps {
  onSend: (message: string) => Promise<void>
  placeholder?: string
  disabled?: boolean
}

export function MessageInput({ onSend, placeholder = "Type your message...", disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const maxChars = 5000
  const charCount = message.length
  const isOverLimit = charCount > maxChars
  const canSend = message.trim().length > 0 && !isOverLimit && !isSending && !disabled

  const handleSend = async () => {
    if (!canSend) return

    setIsSending(true)
    try {
      await onSend(message.trim())
      setMessage("") // Clear input on success
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSend()
      }}
      className="flex gap-2"
    >
      {/* Textarea Container */}
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={3}
          className="w-full px-4 py-3 border-2 rounded-lg resize-none bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-accent-yellow disabled:opacity-50"
        />

        {/* Character Counter */}
        <div className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? "text-red-500" : "text-muted-foreground"}`}>
          {charCount}/{maxChars}
        </div>
      </div>

      {/* Send Button */}
      <Button
        type="submit"
        disabled={!canSend}
        className="px-6 py-3 rounded-lg font-semibold h-fit bg-accent-yellow text-black hover:bg-accent-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {isSending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send</span>
            </>
          )}
        </span>
      </Button>
    </form>
  )
}
