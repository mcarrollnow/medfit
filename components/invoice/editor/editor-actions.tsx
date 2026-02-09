"use client"

import { Eye, Save } from "lucide-react"

interface EditorActionsProps {
  onPreview: () => void
}

export function EditorActions({ onPreview }: EditorActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button className="glass-button px-5 py-3 rounded-full flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
        <Save className="w-4 h-4" />
        Save Draft
      </button>
      <button
        onClick={onPreview}
        className="bg-foreground text-background px-5 py-3 rounded-full flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  )
}
