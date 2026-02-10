"use client"

import { type Editor } from "@tiptap/react"
import { 
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, 
  Quote, Undo, Redo, LinkIcon, Code, Minus, AlignLeft, AlignCenter, 
  AlignRight, Heading1, Heading2, Heading3, Type, Eye, Code2, 
  PenTool, Download, ChevronDown, Plus
} from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Supabase Auth email template variables
const SUPABASE_VARIABLES = {
  common: [
    { label: 'Confirmation URL', value: '{{ .ConfirmationURL }}', description: 'Link to confirm action' },
    { label: 'Email', value: '{{ .Email }}', description: 'User email address' },
    { label: 'Site URL', value: '{{ .SiteURL }}', description: 'Your site URL' },
    { label: 'Token', value: '{{ .Token }}', description: 'Verification token' },
    { label: 'Token Hash', value: '{{ .TokenHash }}', description: 'Hashed token' },
    { label: 'Redirect To', value: '{{ .RedirectTo }}', description: 'Redirect URL after action' },
  ],
  confirmation: [
    { label: 'Confirmation URL', value: '{{ .ConfirmationURL }}', description: 'Email confirmation link' },
  ],
  invite: [
    { label: 'Confirmation URL', value: '{{ .ConfirmationURL }}', description: 'Invitation link' },
  ],
  magic_link: [
    { label: 'Confirmation URL', value: '{{ .ConfirmationURL }}', description: 'Magic link URL' },
  ],
  recovery: [
    { label: 'Confirmation URL', value: '{{ .ConfirmationURL }}', description: 'Password reset link' },
  ],
  email_change: [
    { label: 'Confirmation URL', value: '{{ .ConfirmationURL }}', description: 'Email change confirmation' },
  ],
}

interface EmailToolbarProps {
  editor: Editor | null
  viewMode: 'design' | 'html' | 'preview'
  onViewModeChange: (mode: 'design' | 'html' | 'preview') => void
  onInsertVariable: (variable: string) => void
  onExportHtml: () => void
  templateType?: string
}

export function EmailToolbar({ 
  editor, 
  viewMode, 
  onViewModeChange, 
  onInsertVariable,
  onExportHtml,
  templateType 
}: EmailToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("")

  if (!editor && viewMode === 'design') {
    return null
  }

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
    }
  }

  // Get variables based on template type
  const getVariables = () => {
    const templateVars = templateType ? SUPABASE_VARIABLES[templateType as keyof typeof SUPABASE_VARIABLES] : null
    return templateVars ? [...SUPABASE_VARIABLES.common, ...templateVars] : SUPABASE_VARIABLES.common
  }

  const variables = getVariables()

  return (
    <div className="border-b border-border bg-foreground/30 p-2 flex flex-wrap gap-1 items-center">
      {/* View Mode Tabs */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 text-xs",
            viewMode === 'design' && "bg-foreground/10 text-foreground"
          )}
          onClick={() => onViewModeChange('design')}
        >
          <PenTool className="h-3 w-3 mr-1.5" />
          Design
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 text-xs",
            viewMode === 'html' && "bg-foreground/10 text-foreground"
          )}
          onClick={() => onViewModeChange('html')}
        >
          <Code2 className="h-3 w-3 mr-1.5" />
          HTML
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-3 text-xs",
            viewMode === 'preview' && "bg-foreground/10 text-foreground"
          )}
          onClick={() => onViewModeChange('preview')}
        >
          <Eye className="h-3 w-3 mr-1.5" />
          Preview
        </Button>
      </div>

      {/* Variable Insert Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300"
          >
            <Plus className="h-3 w-3 mr-1.5" />
            Insert Variable
            <ChevronDown className="h-3 w-3 ml-1.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-card border-border">
          <DropdownMenuLabel className="text-muted-foreground text-xs">Supabase Variables</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-foreground/10" />
          {variables.map((variable) => (
            <DropdownMenuItem
              key={variable.value}
              onClick={() => onInsertVariable(variable.value)}
              className="flex flex-col items-start gap-0.5 cursor-pointer"
            >
              <span className="text-foreground font-medium">{variable.label}</span>
              <span className="text-xs text-muted-foreground font-mono">{variable.value}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {viewMode === 'design' && editor && (
        <>
          <div className="w-px h-6 bg-foreground/10 mx-2" />

          {/* Text Formatting */}
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Toggle bold"
            className="data-[state=on]:bg-foreground/20"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Toggle italic"
            className="data-[state=on]:bg-foreground/20"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            aria-label="Toggle underline"
            className="data-[state=on]:bg-foreground/20"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            aria-label="Toggle strikethrough"
            className="data-[state=on]:bg-foreground/20"
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-foreground/10 mx-1" />

          {/* Headings */}
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
            className="data-[state=on]:bg-foreground/20"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
            className="data-[state=on]:bg-foreground/20"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
            className="data-[state=on]:bg-foreground/20"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-foreground/10 mx-1" />

          {/* Lists */}
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Toggle bullet list"
            className="data-[state=on]:bg-foreground/20"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Toggle ordered list"
            className="data-[state=on]:bg-foreground/20"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-foreground/10 mx-1" />

          {/* Alignment */}
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
            aria-label="Align left"
            className="data-[state=on]:bg-foreground/20"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
            aria-label="Align center"
            className="data-[state=on]:bg-foreground/20"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
            aria-label="Align right"
            className="data-[state=on]:bg-foreground/20"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-foreground/10 mx-1" />

          {/* Link */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="bg-foreground/5 border-border text-foreground"
                />
                <Button onClick={addLink} size="sm">Add</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Toggle
            size="sm"
            pressed={editor.isActive("blockquote")}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Toggle blockquote"
            className="data-[state=on]:bg-foreground/20"
          >
            <Quote className="h-4 w-4" />
          </Toggle>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-foreground/10 mx-1" />

          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Export Button - Always visible */}
      <div className="ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs border-border bg-foreground/5 hover:bg-foreground/10"
          onClick={onExportHtml}
        >
          <Download className="h-3 w-3 mr-1.5" />
          Export HTML
        </Button>
      </div>
    </div>
  )
}

