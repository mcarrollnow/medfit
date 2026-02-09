"use client"

import type React from "react"

import { Paperclip, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

interface MultimodalInputProps {
  input: string
  setInput: (input: string) => void
  status: string
  onSubmit: (e: React.FormEvent) => void
  attachments?: File[]
  onAttachmentsChange?: (attachments: File[]) => void
}

export function MultimodalInput({
  input,
  setInput,
  status,
  onSubmit,
  attachments = [],
  onAttachmentsChange,
}: MultimodalInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isLoading = status === "loading" || status === "submitting"

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0 && onAttachmentsChange) {
      onAttachmentsChange([...attachments, ...files])
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveAttachment = (index: number) => {
    if (onAttachmentsChange) {
      onAttachmentsChange(attachments.filter((_, i) => i !== index))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit on Enter (not Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        onSubmit(e as any)
      }
    }
  }

  return (
    <div>
      {/* Attachments Display */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            >
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(index)}
                className="text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <form onSubmit={onSubmit} className="flex gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.csv,.txt"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        {/* Attach Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Text Input */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
          className="flex-1"
        />

        {/* Send Button */}
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
