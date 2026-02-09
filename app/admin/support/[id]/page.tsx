"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  User,
  Package,
  Send,
  Loader2,
  RefreshCw,
  Sparkles,
  Info,
  Camera,
  Gift,
  DollarSign,
  RotateCcw,
  XCircle,
  HelpCircle,
  ChevronDown,
  Copy,
  Check,
  Paperclip,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  getSupportTicketById,
  updateTicketStatus,
  updateTicketPriority,
  addTicketMessage,
  type SupportTicket,
  type TicketMessage,
} from "@/app/actions/support"

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Open" },
  in_progress: { bg: "bg-blue-500/20", text: "text-blue-400", label: "In Progress" },
  waiting_on_customer: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Waiting" },
  resolved: { bg: "bg-green-500/20", text: "text-green-400", label: "Resolved" },
  closed: { bg: "bg-zinc-500/20", text: "text-zinc-400", label: "Closed" },
}

const priorityColors: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-zinc-500/20", text: "text-zinc-400" },
  medium: { bg: "bg-blue-500/20", text: "text-blue-400" },
  high: { bg: "bg-orange-500/20", text: "text-orange-400" },
  urgent: { bg: "bg-red-500/20", text: "text-red-400" },
}

type AIResponseIntent = 
  | 'get_more_info'
  | 'ask_for_evidence'
  | 'offer_replacement'
  | 'offer_refund'
  | 'offer_promo_code'
  | 'decline_support'
  | 'general_help'

const AI_INTENT_OPTIONS: { id: AIResponseIntent; label: string; icon: any; description: string; color: string }[] = [
  { id: 'get_more_info', label: 'Get More Info', icon: HelpCircle, description: 'Ask clarifying questions', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'ask_for_evidence', label: 'Request Evidence', icon: Camera, description: 'Ask for photos/screenshots', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'offer_replacement', label: 'Offer Replacement', icon: RotateCcw, description: 'Send a new product', color: 'bg-green-500/20 text-green-400' },
  { id: 'offer_refund', label: 'Offer Refund', icon: DollarSign, description: 'Process a refund', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'offer_promo_code', label: 'Offer Promo Code', icon: Gift, description: 'Discount or credit', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'decline_support', label: 'Decline Request', icon: XCircle, description: 'Politely decline', color: 'bg-red-500/20 text-red-400' },
]

// Format labels for wizard answers
const LABEL_MAP: Record<string, string> = {
  checked_tracking: "Checked Tracking",
  checked_neighbors: "Checked Neighbors/Building",
  address_correct: "Address Correct",
  last_update: "Last Tracking Update",
  days_late: "Days Late",
  tracking_status: "Tracking Status",
  urgency: "Urgency Level",
  urgency_reason: "Urgency Reason",
  damage_type: "Damage Type",
  outer_box: "Outer Box Condition",
  photos: "Photos Provided",
  resolution: "Preferred Resolution",
  severity: "Reaction Severity",
  stopped_using: "Stopped Using Product",
  medical_attention: "Sought Medical Attention",
  safety_contact: "Safety Team Contact",
  topic: "Complaint Topic",
  importance: "Importance Level",
  response_needed: "Response Needed",
  details: "Additional Details",
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [selectedIntent, setSelectedIntent] = useState<AIResponseIntent | null>(null)
  const [showIntentMenu, setShowIntentMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Track client-side hydration for timestamps
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Filter for images and limit size (5MB)
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      return isImage && isValidSize
    })
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const uploadAttachments = async (): Promise<string[]> => {
    if (attachments.length === 0) return []
    
    const uploadedUrls: string[] = []
    
    for (const file of attachments) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${ticketId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Upload to Supabase Storage
      const response = await fetch('/api/admin/support/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileType: file.type,
          fileData: await fileToBase64(file)
        })
      })
      
      if (response.ok) {
        const { url } = await response.json()
        uploadedUrls.push(url)
      }
    }
    
    return uploadedUrls
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  useEffect(() => {
    loadTicket()
  }, [ticketId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [ticket?.messages])

  const loadTicket = async () => {
    setLoading(true)
    const data = await getSupportTicketById(ticketId)
    setTicket(data)
    setLoading(false)
  }

  const handleStatusChange = async (newStatus: SupportTicket['status']) => {
    if (!ticket) return
    setUpdatingStatus(true)
    
    const result = await updateTicketStatus(ticket.id, newStatus)
    if (result.success) {
      await loadTicket()
    }
    setUpdatingStatus(false)
  }

  const handlePriorityChange = async (newPriority: SupportTicket['priority']) => {
    if (!ticket) return
    
    const result = await updateTicketPriority(ticket.id, newPriority)
    if (result.success) {
      setTicket({ ...ticket, priority: newPriority })
    }
  }

  const handleSendReply = async () => {
    if (!ticket || (!replyText.trim() && attachments.length === 0)) return
    setSending(true)
    setUploading(attachments.length > 0)
    
    try {
      // Upload attachments first
      const uploadedUrls = await uploadAttachments()
      
      // Build message with attachment URLs
      let messageContent = replyText.trim()
      if (uploadedUrls.length > 0) {
        const attachmentText = uploadedUrls.map(url => `[Attachment](${url})`).join('\n')
        messageContent = messageContent 
          ? `${messageContent}\n\n${attachmentText}`
          : attachmentText
      }
      
      console.log('Sending reply:', { ticketId: ticket.id, messageLength: messageContent.length, attachments: uploadedUrls.length })
      const result = await addTicketMessage(ticket.id, messageContent, true)
      console.log('Send result:', result)
      
      if (result.success) {
        setReplyText("")
        setAiResponse("")
        setAttachments([])
        await loadTicket()
      } else {
        console.error('Failed to send:', result.error)
        alert(`Failed to send message: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
      setUploading(false)
    }
  }

  const handleGenerateAI = async (intent: AIResponseIntent) => {
    setSelectedIntent(intent)
    setShowIntentMenu(false)
    setAiLoading(true)
    setAiResponse("")
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    
    try {
      const response = await fetch('/api/admin/support/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, intent }),
        signal: abortControllerRef.current.signal,
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate response')
      }
      
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }
      
      const decoder = new TextDecoder()
      let fullText = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setAiResponse(fullText)
        setReplyText(fullText)
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error generating AI response:', error)
      }
    } finally {
      setAiLoading(false)
    }
  }
  
  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setAiLoading(false)
    }
  }

  const handleCopyResponse = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getCustomerName = () => {
    if (ticket?.customer?.user) {
      const { first_name, last_name, email } = ticket.customer.user
      if (first_name || last_name) {
        return `${first_name || ""} ${last_name || ""}`.trim()
      }
      return email
    }
    return "Unknown Customer"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatMessageDate = (dateString: string) => {
    // Parse the UTC timestamp and convert to local time
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    // Use explicit locale options to ensure local timezone
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }
    
    if (isToday) {
      return date.toLocaleTimeString(undefined, timeOptions)
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString(undefined, timeOptions)
  }

  const parseWizardAnswers = (message: string): Record<string, string> | null => {
    try {
      return JSON.parse(message)
    } catch {
      return null
    }
  }

  // Get the wizard submission data for summary
  const getWizardSummary = () => {
    if (!ticket?.messages || ticket.messages.length === 0) return null
    
    // First try to find message with wizard metadata
    let wizardMessage = ticket.messages.find(m => 
      !m.is_admin && !m.is_ai
    )
    
    // If no metadata match, try to parse the first customer message as JSON (wizard format)
    if (!wizardMessage) {
      const firstCustomerMessage = ticket.messages.find(m => !m.is_admin && !m.is_ai)
      if (firstCustomerMessage) {
        const parsed = parseWizardAnswers(firstCustomerMessage.message)
        if (parsed && Object.keys(parsed).length > 0) {
          // Looks like wizard JSON data
          wizardMessage = firstCustomerMessage
        }
      }
    }
    
    if (!wizardMessage) return null
    
    const answers = parseWizardAnswers(wizardMessage.message)
    if (!answers) return null
    
    return answers
  }

  // Generate a readable summary from wizard answers
  const generateCustomerSummary = () => {
    const answers = getWizardSummary()
    if (!answers) return null

    const subject = ticket?.subject || ''
    let summary = ''

    // Generate context-aware summary based on the ticket subject/category
    if (subject.includes('Missing')) {
      summary = `Customer reports a missing delivery. `
      if (answers.checked_tracking) summary += `Tracking status: ${answers.checked_tracking}. `
      if (answers.checked_neighbors) summary += `Checked neighbors: ${answers.checked_neighbors}. `
      if (answers.address_correct) summary += `Address verification: ${answers.address_correct}. `
      if (answers.last_update) summary += `Last tracking update: ${answers.last_update}.`
    } else if (subject.includes('Late')) {
      summary = `Customer reports a late delivery. `
      if (answers.days_late) summary += `Delay duration: ${answers.days_late}. `
      if (answers.tracking_status) summary += `Current tracking: ${answers.tracking_status}. `
      if (answers.urgency) summary += `Urgency: ${answers.urgency}. `
      if (answers.urgency_reason) summary += `Reason for urgency: ${answers.urgency_reason}.`
    } else if (subject.includes('Damaged') || subject.includes('Broken')) {
      summary = `Customer received damaged/broken product. `
      if (answers.damage_type) summary += `Damage type: ${answers.damage_type}. `
      if (answers.outer_box) summary += `Shipping box condition: ${answers.outer_box}. `
      if (answers.resolution) summary += `Preferred resolution: ${answers.resolution}.`
    } else if (subject.includes('Adverse')) {
      summary = `⚠️ ADVERSE REACTION REPORT. `
      if (answers.severity) summary += `Severity: ${answers.severity}. `
      if (answers.stopped_using) summary += `Stopped using: ${answers.stopped_using}. `
      if (answers.medical_attention) summary += `Medical attention: ${answers.medical_attention}. `
      if (answers.safety_contact) summary += `Contact permission: ${answers.safety_contact}.`
    } else if (subject.includes('Complaint')) {
      summary = `Customer complaint. `
      if (answers.topic) summary += `Topic: ${answers.topic}. `
      if (answers.importance) summary += `Importance: ${answers.importance}. `
      if (answers.response_needed) summary += `Response needed: ${answers.response_needed}. `
      if (answers.details) summary += `Details: ${answers.details}`
    }

    return summary || null
  }

  const wizardAnswers = getWizardSummary()
  const customerSummary = generateCustomerSummary()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/admin/support"
            className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-base font-medium">Back to Support</span>
          </Link>
          
          <div className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Ticket not found</h2>
            <p className="text-white/50">This ticket may have been deleted or doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const status = statusColors[ticket.status] || statusColors.open
  const priority = priorityColors[ticket.priority] || priorityColors.medium

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Support</span>
        </Link>

        {/* Header */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${status.bg} ${status.text} border-0`}>
                  {status.label}
                </Badge>
                <Badge className={`${priority.bg} ${priority.text} border-0 capitalize`}>
                  {ticket.priority} Priority
                </Badge>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{ticket.subject}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{getCustomerName()}</span>
                </div>
                {ticket.order && (
                  <Link 
                    href={`/admin/orders/${ticket.order.id}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    <span>Order #{ticket.order.order_number}</span>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatDate(ticket.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as SupportTicket['status'])}
                  disabled={updatingStatus}
                  className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                >
                  <option value="open" className="bg-zinc-900">Open</option>
                  <option value="in_progress" className="bg-zinc-900">In Progress</option>
                  <option value="waiting_on_customer" className="bg-zinc-900">Waiting on Customer</option>
                  <option value="resolved" className="bg-zinc-900">Resolved</option>
                  <option value="closed" className="bg-zinc-900">Closed</option>
                </select>
                
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as SupportTicket['priority'])}
                  className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                >
                  <option value="low" className="bg-zinc-900">Low</option>
                  <option value="medium" className="bg-zinc-900">Medium</option>
                  <option value="high" className="bg-zinc-900">High</option>
                  <option value="urgent" className="bg-zinc-900">Urgent</option>
                </select>
              </div>
              
              <Button
                onClick={loadTicket}
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Customer Summary Card - Shows parsed wizard answers */}
        {wizardAnswers && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 mb-6"
          >
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Customer's Issue Summary</h3>
                  <p className="text-sm text-white/50">Information from support request form</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-white/40 transition-transform ${showSummary ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* AI-generated readable summary */}
                  {customerSummary && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/80 leading-relaxed">{customerSummary}</p>
                    </div>
                  )}
                  
                  {/* Detailed answers */}
                  <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {Object.entries(wizardAnswers).map(([key, value]) => (
                      <div 
                        key={key} 
                        className="p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                          {LABEL_MAP[key] || key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-white font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Messages */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation
            </h2>
          </div>
          
          <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
            {ticket.messages && ticket.messages.length > 0 ? (
              ticket.messages.map((message, index) => {
                const isAdmin = message.is_admin
                const isAI = message.is_ai
                // Check if this is a system message (status change, etc.)
                const isSystem = message.is_admin && message.message.startsWith('Ticket status changed')
                // Try to parse first customer message as wizard data
                const wizardAnswers = !isAdmin && !isAI
                  ? parseWizardAnswers(message.message) 
                  : null
                
                if (isSystem) {
                  return (
                    <div key={message.id} className="text-center py-2">
                      <span className="text-sm text-white/40 bg-white/5 px-3 py-1 rounded-full">
                        {message.message}
                      </span>
                    </div>
                  )
                }
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${isAdmin || isAI ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${isAdmin || isAI ? 'order-2' : ''}`}>
                      <div
                        className={`rounded-2xl p-4 ${
                          isAdmin || isAI
                            ? 'bg-white/10 text-white border border-white/20 rounded-br-md'
                            : 'bg-white/5 text-white rounded-bl-md'
                        }`}
                      >
                        {wizardAnswers ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium opacity-70 mb-3">Support Request Details:</p>
                            {Object.entries(wizardAnswers).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{LABEL_MAP[key] || key.replace(/_/g, ' ')}: </span>
                                <span className="opacity-80">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {/* Render text content (excluding attachment links) */}
                            {message.message.split('\n').map((line, i) => {
                              // Check if line is an attachment link
                              const attachMatch = line.match(/\[Attachment\]\((https?:\/\/[^\)]+)\)/)
                              if (attachMatch) {
                                const url = attachMatch[1]
                                return (
                                  <a 
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <img 
                                      src={url}
                                      alt="Attachment"
                                      className="max-w-full max-h-48 rounded-lg border border-white/10 hover:border-white/30 transition-colors"
                                    />
                                  </a>
                                )
                              }
                              // Regular text
                              return line ? (
                                <p key={i} className="text-sm whitespace-pre-wrap">{line}</p>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                      <div className={`mt-1 text-xs text-white/40 ${isAdmin || isAI ? 'text-right' : ''}`}>
                        {isAI ? (
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI Generated
                          </span>
                        ) : (
                          isAdmin ? 'Admin' : 'Customer'
                        )}
                        {' • '}
                        {isClient ? formatMessageDate(message.created_at) : '...'}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-center py-12 text-white/40">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Response Generator */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">AI Response Generator</span>
              </div>
              {aiLoading && (
                <button
                  onClick={stopGenerating}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Stop generating
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {AI_INTENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleGenerateAI(option.id)}
                  disabled={aiLoading}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${selectedIntent === option.id && aiLoading
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : `${option.color.split(' ')[0]} ${option.color.split(' ')[1]} border border-transparent hover:border-white/20`
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                  {selectedIntent === option.id && aiLoading && (
                    <Loader2 className="h-3 w-3 animate-spin ml-1" />
                  )}
                </button>
              ))}
            </div>
            
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">AI Suggested Response:</span>
                    <button
                      onClick={handleCopyResponse}
                      className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{aiResponse}</p>
                </div>
                <p className="text-xs text-white/30 mb-2">
                  Review and edit the response below before sending
                </p>
              </motion.div>
            )}
          </div>

          {/* Reply Box */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((file, index) => (
                  <div 
                    key={index}
                    className="relative group rounded-lg overflow-hidden bg-white/10 border border-white/20"
                  >
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="h-16 w-16 object-cover"
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-1 truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 min-h-[80px] rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSendReply()
                  }
                }}
              />
              
              {/* Attach Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all hover:border-white/40"
                title="Attach images"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              
              {/* Send Button */}
              <Button
                onClick={handleSendReply}
                disabled={sending || (!replyText.trim() && attachments.length === 0)}
                className="rounded-xl bg-white text-black hover:bg-white/90 px-6 h-10"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-white/30 mt-2">
              Press ⌘+Enter to send
              {attachments.length > 0 && ` • ${attachments.length} file(s) attached`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
