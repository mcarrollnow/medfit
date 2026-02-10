"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { TextStyle } from "@tiptap/extension-text-style"
import { FontFamily } from "@tiptap/extension-font-family"
import { EmailToolbar } from "./email-toolbar"
import { cn } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"
import { generateHTML } from "@tiptap/html"

// All extensions for HTML generation
const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-600 underline",
    },
  }),
  Placeholder.configure({
    placeholder: "Start designing your email template...",
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight,
  TextStyle,
  FontFamily.configure({
    types: ['textStyle'],
  }),
]

interface EmailEditorProps {
  content?: any
  onChange?: (content: any, html: string) => void
  className?: string
  templateType?: string
}

export function EmailEditor({ content, onChange, className, templateType }: EmailEditorProps) {
  const [viewMode, setViewMode] = useState<'design' | 'html' | 'preview'>('design')
  const [htmlContent, setHtmlContent] = useState('')
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: content || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const html = editor.getHTML()
      setHtmlContent(html)
      onChange?.(json, html)
    },
  })

  useEffect(() => {
    if (editor && content) {
      const currentHTML = editor.getHTML()
      if (typeof content === 'string' && content !== currentHTML) {
        editor.commands.setContent(content)
        setHtmlContent(content)
      } else if (typeof content === 'object') {
        editor.commands.setContent(content)
        setHtmlContent(editor.getHTML())
      }
    }
  }, [content, editor])

  // Update HTML content when editor initializes
  useEffect(() => {
    if (editor) {
      setHtmlContent(editor.getHTML())
    }
  }, [editor])

  const handleHtmlChange = useCallback((html: string) => {
    setHtmlContent(html)
    if (editor) {
      editor.commands.setContent(html)
      onChange?.(editor.getJSON(), html)
    }
  }, [editor, onChange])

  const insertVariable = useCallback((variable: string) => {
    if (editor) {
      editor.chain().focus().insertContent(variable).run()
    }
  }, [editor])

  const exportHtml = useCallback(() => {
    const fullHtml = wrapInEmailTemplate(htmlContent)
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateType || 'email'}-template.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [htmlContent, templateType])

  const getHtml = useCallback(() => {
    return htmlContent
  }, [htmlContent])

  return (
    <div className={cn("rounded-xl border border-border bg-foreground/5 overflow-hidden", className)}>
      <EmailToolbar 
        editor={editor} 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onInsertVariable={insertVariable}
        onExportHtml={exportHtml}
        templateType={templateType}
      />
      
      {viewMode === 'design' && (
        <div className="bg-primary text-primary-foreground">
          <EditorContent editor={editor} />
        </div>
      )}
      
      {viewMode === 'html' && (
        <div className="p-4">
          <textarea
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="w-full h-[400px] p-4 font-mono text-sm bg-foreground/50 text-green-400 border border-border rounded-lg focus:outline-none focus:border-border resize-none"
            placeholder="Enter HTML code here..."
            spellCheck={false}
          />
        </div>
      )}
      
      {viewMode === 'preview' && (
        <div className="p-4">
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b text-sm text-gray-600 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-2">Email Preview</span>
            </div>
            <div 
              className="p-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Helper to wrap content in a basic email template
function wrapInEmailTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    a {
      color: #3b82f6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
    }
  </style>
</head>
<body>
${content}
</body>
</html>`
}

export { wrapInEmailTemplate }

