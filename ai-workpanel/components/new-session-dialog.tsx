"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSession } from "@/lib/supabase"
import type { ConversationCategory } from "./conversation-sidebar"

type NewSessionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: ConversationCategory
  onSessionCreated: (sessionId: string) => void
}

export function NewSessionDialog({ open, onOpenChange, category, onSessionCreated }: NewSessionDialogProps) {
  const [title, setTitle] = React.useState("")
  const [subtitle, setSubtitle] = React.useState("")
  const [instructions, setInstructions] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return

    setIsCreating(true)
    try {
      const session = await createSession({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        instructions: instructions.trim() || undefined,
        category,
      })

      // Reset form
      setTitle("")
      setSubtitle("")
      setInstructions("")
      onOpenChange(false)
      onSessionCreated(session.id)
    } catch (error) {
      console.error("Failed to create session:", error)
      alert("Failed to create session. Please check your Supabase configuration.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New {category === "price-research" ? "Price" : "Peptide"} Session</DialogTitle>
          <DialogDescription>
            Create a new research session with custom instructions for the AI agent.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., BPC-157 Research"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleCreate()
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              placeholder="e.g., Healing properties and dosage"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">System Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Focus on peer-reviewed studies and clinical trials. Prioritize safety data and contraindications."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These instructions will guide the AI agent throughout this session.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || isCreating}>
            {isCreating ? "Creating..." : "Create Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
