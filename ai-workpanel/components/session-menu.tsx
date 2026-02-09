"use client"

import * as React from "react"
import { MoreVertical, Edit, Share2, Archive, Trash2, FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { updateSession, deleteSession, archiveSession, exportSession } from "@/lib/supabase"

type SessionMenuProps = {
  sessionId: string
  sessionTitle: string
  sessionSubtitle?: string
  sessionInstructions?: string
  onUpdate: () => void
}

export function SessionMenu({
  sessionId,
  sessionTitle,
  sessionSubtitle,
  sessionInstructions,
  onUpdate,
}: SessionMenuProps) {
  const [renameOpen, setRenameOpen] = React.useState(false)
  const [editInstructionsOpen, setEditInstructionsOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)

  const [title, setTitle] = React.useState(sessionTitle)
  const [subtitle, setSubtitle] = React.useState(sessionSubtitle || "")
  const [instructions, setInstructions] = React.useState(sessionInstructions || "")

  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleRename = async () => {
    if (!title.trim()) return

    setIsUpdating(true)
    try {
      await updateSession(sessionId, {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
      })
      setRenameOpen(false)
      onUpdate()
    } catch (error) {
      console.error("Failed to rename session:", error)
      alert("Failed to rename session.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditInstructions = async () => {
    setIsUpdating(true)
    try {
      await updateSession(sessionId, {
        instructions: instructions.trim() || undefined,
      })
      setEditInstructionsOpen(false)
      onUpdate()
    } catch (error) {
      console.error("Failed to update instructions:", error)
      alert("Failed to update instructions.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleArchive = async () => {
    try {
      await archiveSession(sessionId)
      onUpdate()
    } catch (error) {
      console.error("Failed to archive session:", error)
      alert("Failed to archive session.")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSession(sessionId)
      setDeleteConfirmOpen(false)
      onUpdate()
    } catch (error) {
      console.error("Failed to delete session:", error)
      alert("Failed to delete session.")
    }
  }

  const handleExport = async () => {
    try {
      await exportSession(sessionId)
    } catch (error) {
      console.error("Failed to export session:", error)
      alert("Failed to export session.")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <Edit className="mr-2 size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditInstructionsOpen(true)}>
            <FileEdit className="mr-2 size-4" />
            Edit Instructions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Share2 className="mr-2 size-4" />
            Share Project
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="mr-2 size-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteConfirmOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rename Session</DialogTitle>
            <DialogDescription>Update the title and subtitle for this session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-title">Title *</Label>
              <Input
                id="rename-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleRename()
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rename-subtitle">Subtitle</Label>
              <Input id="rename-subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!title.trim() || isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Instructions Dialog */}
      <Dialog open={editInstructionsOpen} onOpenChange={setEditInstructionsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit System Instructions</DialogTitle>
            <DialogDescription>Update the instructions that guide the AI agent in this session.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-instructions">System Instructions</Label>
              <Textarea
                id="edit-instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditInstructionsOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleEditInstructions} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
