'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, ArrowLeft, Save, RefreshCw, Loader2, Sparkles, Eye, Code,
  Pencil, Copy, Check, ChevronDown, AlertCircle, CheckCircle2, 
  Wand2, X, Send
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EmailTemplate {
  id: string
  template_key: string
  name: string
  description: string | null
  subject: string
  html_content: string
  available_variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  
  // Edit state
  const [editSubject, setEditSubject] = useState('')
  const [editHtml, setEditHtml] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // View mode
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code')
  
  // AI generation state
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiStyle, setAiStyle] = useState<'dark-modern' | 'light-clean' | 'custom'>('dark-modern')

  // Send test email state
  const [showTestEmail, setShowTestEmail] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/email-templates', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch templates')
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error: any) {
      console.error('Failed to fetch templates:', error)
      toast.error('Failed to load email templates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const selectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setEditSubject(template.subject)
    setEditHtml(template.html_content)
    setViewMode('code')
    setShowAiPanel(false)
    setSaved(false)
  }

  const handleSave = async () => {
    if (!selectedTemplate) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: selectedTemplate.id,
          subject: editSubject,
          html_content: editHtml,
        })
      })

      if (!response.ok) throw new Error('Failed to save template')
      
      const data = await response.json()
      
      // Update local state
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, subject: editSubject, html_content: editHtml, updated_at: new Date().toISOString() }
          : t
      ))
      setSelectedTemplate(prev => prev ? { ...prev, subject: editSubject, html_content: editHtml } : null)
      
      setSaved(true)
      toast.success('Template saved!')
      setTimeout(() => setSaved(false), 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handleAiGenerate = async () => {
    if (!selectedTemplate) return
    
    setAiGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: selectedTemplate.template_key,
          templateName: selectedTemplate.name,
          availableVariables: selectedTemplate.available_variables,
          prompt: aiPrompt || `Create a beautiful ${selectedTemplate.name} email template`,
          existingHtml: editHtml || undefined,
          style: aiStyle,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'AI generation failed')
      }
      
      const data = await response.json()
      
      if (data.success && data.html) {
        setEditHtml(data.html)
        setViewMode('preview')
        toast.success('AI generated your email template!')
      } else {
        throw new Error('No HTML returned')
      }
    } catch (error: any) {
      console.error('AI generation error:', error)
      toast.error(error.message || 'Failed to generate email template')
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSendTest = async () => {
    if (!testEmailAddress || !editHtml) return
    
    setSendingTest(true)
    try {
      // Use the internal send endpoint
      const response = await fetch('/api/admin/email-templates/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          to: testEmailAddress,
          subject: `[TEST] ${editSubject}`,
          html: editHtml,
        })
      })

      if (!response.ok) throw new Error('Failed to send test email')
      
      toast.success(`Test email sent to ${testEmailAddress}`)
      setShowTestEmail(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to send test email')
    } finally {
      setSendingTest(false)
    }
  }

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable)
    toast.success(`Copied ${variable}`)
  }

  const insertVariable = (variable: string) => {
    // Insert at cursor position in the textarea
    const textarea = document.getElementById('html-editor') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = editHtml.substring(0, start) + variable + editHtml.substring(end)
      setEditHtml(newValue)
      // Restore cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    } else {
      setEditHtml(prev => prev + variable)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.08_0_0)]">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      <div className="fixed inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 py-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 text-[oklch(0.65_0_0)] hover:text-[oklch(0.95_0_0)] transition-colors mb-12"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-mono tracking-[0.3em] uppercase">Back to Admin</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-[oklch(0.65_0_0)] uppercase mb-4">
            Communications
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-tight leading-[0.9] text-[oklch(0.95_0_0)]">
            Email Templates
          </h1>
          <p className="text-[oklch(0.5_0_0)] mt-4 max-w-xl">
            Edit the HTML email templates sent to customers. Use AI to generate beautiful designs.
          </p>
        </motion.div>

        <div className="flex gap-8 min-h-[calc(100vh-280px)]">
          {/* Template List Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-80 shrink-0"
          >
            <div className="glass-card rounded-2xl overflow-hidden sticky top-8">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-medium text-[oklch(0.95_0_0)] flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[oklch(0.65_0_0)]" />
                  Templates
                </h2>
                <p className="text-xs text-[oklch(0.5_0_0)] mt-1">
                  {templates.length} template{templates.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`w-full text-left p-5 transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-white/10 border-l-2 border-white'
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${
                        selectedTemplate?.id === template.id ? 'text-[oklch(0.95_0_0)]' : 'text-[oklch(0.75_0_0)]'
                      }`}>
                        {template.name}
                      </p>
                      {template.html_content ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[oklch(0.45_0_0)] mt-1 line-clamp-2">
                      {template.description || template.template_key}
                    </p>
                  </button>
                ))}
                {templates.length === 0 && (
                  <div className="p-8 text-center text-[oklch(0.45_0_0)]">
                    <Mail className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No templates found</p>
                    <p className="text-xs mt-1">Run the migration to create default templates</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Editor Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 min-w-0"
          >
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Template Header */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-medium text-[oklch(0.95_0_0)]">
                        {selectedTemplate.name}
                      </h2>
                      <p className="text-sm text-[oklch(0.5_0_0)] mt-1">
                        {selectedTemplate.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* AI Generate Button */}
                      <button
                        onClick={() => setShowAiPanel(!showAiPanel)}
                        className={`h-10 px-4 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                          showAiPanel
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-white/5 border border-white/10 text-[oklch(0.75_0_0)] hover:bg-white/10'
                        }`}
                      >
                        <Sparkles className="h-4 w-4" />
                        AI Generate
                      </button>
                      {/* Send Test */}
                      <button
                        onClick={() => setShowTestEmail(!showTestEmail)}
                        className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-[oklch(0.75_0_0)] hover:bg-white/10 flex items-center gap-2 text-sm font-medium transition-all"
                      >
                        <Send className="h-4 w-4" />
                        Test
                      </button>
                      {/* Save */}
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`h-10 px-6 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all ${
                          saved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white text-black hover:bg-white/90'
                        }`}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : saved ? (
                          <>
                            <Check className="h-4 w-4" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-[oklch(0.5_0_0)] uppercase mb-2">
                      Subject Line
                    </label>
                    <input
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.4_0_0)] focus:outline-none focus:border-white/30 text-sm"
                      placeholder="Email subject..."
                    />
                  </div>
                </div>

                {/* Send Test Email Panel */}
                <AnimatePresence>
                  {showTestEmail && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-[oklch(0.95_0_0)] flex items-center gap-2">
                            <Send className="h-4 w-4 text-[oklch(0.65_0_0)]" />
                            Send Test Email
                          </h3>
                          <button onClick={() => setShowTestEmail(false)} className="text-[oklch(0.5_0_0)] hover:text-[oklch(0.95_0_0)]">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            placeholder="Enter email address..."
                            className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.4_0_0)] focus:outline-none focus:border-white/30 text-sm"
                          />
                          <button
                            onClick={handleSendTest}
                            disabled={sendingTest || !testEmailAddress || !editHtml}
                            className="h-12 px-6 rounded-xl bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 flex items-center gap-2 text-sm"
                          >
                            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Send
                          </button>
                        </div>
                        <p className="text-xs text-[oklch(0.4_0_0)] mt-2">
                          Variables will show as placeholders (e.g. {"{{customer_name}}"})
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Generation Panel */}
                <AnimatePresence>
                  {showAiPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="glass-card rounded-2xl p-6 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-purple-400 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Email Generator — Claude Sonnet 4
                          </h3>
                          <button onClick={() => setShowAiPanel(false)} className="text-[oklch(0.5_0_0)] hover:text-[oklch(0.95_0_0)]">
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Style Selector */}
                        <div className="mb-4">
                          <label className="block text-xs font-mono tracking-widest text-[oklch(0.5_0_0)] uppercase mb-2">Style</label>
                          <div className="flex gap-2">
                            {([
                              { value: 'dark-modern', label: 'Dark Modern' },
                              { value: 'light-clean', label: 'Light Clean' },
                              { value: 'custom', label: 'Custom' },
                            ] as const).map(style => (
                              <button
                                key={style.value}
                                onClick={() => setAiStyle(style.value)}
                                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                                  aiStyle === style.value
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-white/5 border border-white/10 text-[oklch(0.65_0_0)] hover:bg-white/10'
                                }`}
                              >
                                {style.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Prompt */}
                        <div className="mb-4">
                          <label className="block text-xs font-mono tracking-widest text-[oklch(0.5_0_0)] uppercase mb-2">
                            Instructions (optional)
                          </label>
                          <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder={`e.g. "Make it elegant with a gradient header, include the company logo area, and use a green accent for the CTA button"`}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.35_0_0)] focus:outline-none focus:border-purple-500/30 text-sm resize-none"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[oklch(0.4_0_0)]">
                            {editHtml ? 'Will improve your existing template' : 'Will generate a new template from scratch'}
                          </p>
                          <button
                            onClick={handleAiGenerate}
                            disabled={aiGenerating}
                            className="h-10 px-6 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2 text-sm transition-all"
                          >
                            {aiGenerating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="h-4 w-4" />
                                Generate with AI
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Available Variables */}
                {selectedTemplate.available_variables?.length > 0 && (
                  <div className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="h-4 w-4 text-[oklch(0.5_0_0)]" />
                      <span className="text-xs font-mono tracking-widest text-[oklch(0.5_0_0)] uppercase">Available Variables</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.available_variables.map(variable => (
                        <button
                          key={variable}
                          onClick={() => insertVariable(variable)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[oklch(0.7_0_0)] hover:bg-white/10 hover:text-[oklch(0.95_0_0)] transition-all cursor-pointer"
                          title={`Click to insert ${variable}`}
                        >
                          {variable}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                      viewMode === 'code'
                        ? 'bg-white/10 text-[oklch(0.95_0_0)] border border-white/20'
                        : 'text-[oklch(0.5_0_0)] hover:text-[oklch(0.75_0_0)]'
                    }`}
                  >
                    <Code className="h-4 w-4" />
                    HTML Code
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                      viewMode === 'preview'
                        ? 'bg-white/10 text-[oklch(0.95_0_0)] border border-white/20'
                        : 'text-[oklch(0.5_0_0)] hover:text-[oklch(0.75_0_0)]'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                </div>

                {/* Editor / Preview */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  {viewMode === 'code' ? (
                    <textarea
                      id="html-editor"
                      value={editHtml}
                      onChange={(e) => setEditHtml(e.target.value)}
                      className="w-full min-h-[600px] p-6 font-mono text-sm bg-black/50 text-green-400 focus:outline-none resize-y"
                      placeholder="Paste or write your HTML email template here, or use AI Generate to create one..."
                      spellCheck={false}
                    />
                  ) : (
                    <div className="bg-white">
                      {/* Browser-like header */}
                      <div className="bg-gray-100 px-4 py-2.5 border-b flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">Email Preview</span>
                      </div>
                      {editHtml ? (
                        <iframe
                          srcDoc={editHtml}
                          className="w-full min-h-[600px] border-0"
                          title="Email Preview"
                          sandbox="allow-same-origin"
                        />
                      ) : (
                        <div className="flex items-center justify-center min-h-[400px] text-gray-400">
                          <div className="text-center">
                            <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>No HTML content yet</p>
                            <p className="text-sm mt-1">Write HTML or use AI to generate a template</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* No template selected */
              <div className="flex items-center justify-center h-full">
                <div className="glass-card rounded-3xl p-16 text-center max-w-md">
                  <Mail className="h-16 w-16 mx-auto mb-6 text-[oklch(0.3_0_0)]" />
                  <p className="font-serif text-2xl font-light text-[oklch(0.65_0_0)] mb-3">
                    Select a Template
                  </p>
                  <p className="text-sm text-[oklch(0.45_0_0)]">
                    Choose an email template from the sidebar to edit its HTML and subject line.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
