"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Package,
  Send,
  Loader2,
  Plus,
  ChevronRight,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import {
  getMyTickets,
  getMyTicketById,
  addCustomerMessage,
  type SupportTicket,
} from "@/app/actions/support"

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Open" },
  in_progress: { bg: "bg-blue-500/20", text: "text-blue-400", label: "In Progress" },
  waiting_on_customer: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Waiting on You" },
  resolved: { bg: "bg-green-500/20", text: "text-green-400", label: "Resolved" },
  closed: { bg: "bg-zinc-500/20", text: "text-zinc-400", label: "Closed" },
}

export default function CustomerSupportPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  
  const [userId, setUserId] = useState<string | null>(null)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check for ticket to open from notification
  useEffect(() => {
    const checkForTicketToOpen = () => {
      const ticketId = sessionStorage.getItem('openTicketId')
      if (ticketId && userId) {
        sessionStorage.removeItem('openTicketId')
        openTicket(ticketId)
      }
    }

    checkForTicketToOpen()
    window.addEventListener('storage', checkForTicketToOpen)
    return () => window.removeEventListener('storage', checkForTicketToOpen)
  }, [userId])

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Get the user record from our users table
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', session.user.id)
          .single()
        
        if (dbUser) {
          setUserId(dbUser.id)
        }
      } else {
        // Not logged in, redirect to login
        router.push('/login?redirect=/support')
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (userId) {
      loadTickets()
    }
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedTicket?.messages])

  const loadTickets = async () => {
    if (!userId) return
    setLoading(true)
    const data = await getMyTickets(userId)
    setTickets(data)
    setLoading(false)
  }

  const openTicket = async (ticketId: string) => {
    if (!userId) return
    const ticket = await getMyTicketById(ticketId, userId)
    setSelectedTicket(ticket)
  }

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim() || !userId) return
    setSending(true)
    
    const result = await addCustomerMessage(selectedTicket.id, replyText.trim(), userId)
    if (result.success) {
      setReplyText("")
      // Reload the ticket to get the new message
      await openTicket(selectedTicket.id)
      // Also reload ticket list to update counts
      await loadTickets()
    }
    setSending(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Count unread messages (admin messages after last customer message)
  const getUnreadCount = (ticket: SupportTicket) => {
    if (!ticket.messages || ticket.messages.length === 0) return 0
    
    // Find last customer message
    let lastCustomerIndex = -1
    for (let i = ticket.messages.length - 1; i >= 0; i--) {
      if (!ticket.messages[i].is_admin) {
        lastCustomerIndex = i
        break
      }
    }
    
    // Count admin messages after that
    let count = 0
    for (let i = lastCustomerIndex + 1; i < ticket.messages.length; i++) {
      if (ticket.messages[i].is_admin) count++
    }
    return count
  }

  if (loading && !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Back Navigation */}
        <Link
          href="/support-chat"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">My Tickets</h1>
          <p className="text-white/50">View and respond to your support requests</p>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {selectedTicket ? (
            /* Ticket Detail View */
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedTicket(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mb-6"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to tickets</span>
              </button>

              {/* Ticket Header */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{selectedTicket.subject}</h2>
                    {selectedTicket.order && (
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Package className="h-4 w-4" />
                        <span>Order #{selectedTicket.order.order_number}</span>
                      </div>
                    )}
                  </div>
                  <Badge className={`${statusColors[selectedTicket.status]?.bg} ${statusColors[selectedTicket.status]?.text} border-0`}>
                    {statusColors[selectedTicket.status]?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Created {formatDate(selectedTicket.created_at)}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Conversation
                  </h3>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((message, index) => {
                      const isAdmin = message.is_admin
                      const isSystem = message.is_admin && message.message.startsWith('Ticket status changed')
                      
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
                          transition={{ delay: index * 0.03 }}
                          className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%]`}>
                            <div
                              className={`rounded-2xl p-4 ${
                                isAdmin
                                  ? 'bg-white/10 text-white rounded-bl-md'
                                  : 'bg-white text-black rounded-br-md'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            </div>
                            <div className={`mt-1 text-xs text-white/40 ${isAdmin ? '' : 'text-right'}`}>
                              {isAdmin ? 'Support Team' : 'You'} • {formatMessageDate(message.created_at)}
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

                {/* Reply Box - only if ticket is not closed/resolved */}
                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                  <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                    <div className="flex gap-3">
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
                      <Button
                        onClick={handleSendReply}
                        disabled={sending || !replyText.trim()}
                        className="rounded-xl bg-white text-black hover:bg-white/90 px-6 self-end"
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
                    <p className="text-xs text-white/30 mt-2">Press ⌘+Enter to send</p>
                  </div>
                )}

                {/* Closed/Resolved Notice */}
                {(selectedTicket.status === 'closed' || selectedTicket.status === 'resolved') && (
                  <div className="p-4 border-t border-white/10 bg-green-500/5 text-center">
                    <p className="text-sm text-green-400">
                      This ticket has been {selectedTicket.status}. If you need further assistance, please create a new ticket.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Ticket List View */
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Tickets List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center py-20 text-center px-4">
                    <MessageSquare className="h-16 w-16 text-white/20 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No support tickets</h3>
                    <p className="text-white/50 mb-6">
                      Need help with an order? Start a support ticket from your order page.
                    </p>
                    <Link href="/dashboard">
                      <Button className="rounded-xl bg-white text-black hover:bg-white/90">
                        View My Orders
                      </Button>
                    </Link>
                  </div>
                ) : (
                  tickets.map((ticket, index) => {
                    const status = statusColors[ticket.status] || statusColors.open
                    const unreadCount = getUnreadCount(ticket)
                    
                    return (
                      <motion.button
                        key={ticket.id}
                        onClick={() => openTicket(ticket.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full rounded-2xl bg-white/5 border border-white/10 p-6 text-left hover:bg-white/[0.07] transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          {/* Status Indicator */}
                          <div className={`h-12 w-12 rounded-xl ${status.bg} flex items-center justify-center shrink-0 relative`}>
                            {ticket.status === "open" || ticket.status === "in_progress" || ticket.status === "waiting_on_customer" ? (
                              <AlertCircle className={`h-6 w-6 ${status.text}`} />
                            ) : (
                              <CheckCircle2 className={`h-6 w-6 ${status.text}`} />
                            )}
                            {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white truncate group-hover:text-white/90">{ticket.subject}</h3>
                                {ticket.order && (
                                  <div className="flex items-center gap-1.5 text-white/50 mt-1">
                                    <Package className="h-4 w-4" />
                                    <span className="text-sm">Order #{ticket.order.order_number}</span>
                                  </div>
                                )}
                              </div>
                              
                              <Badge className={`${status.bg} ${status.text} border-0 shrink-0`}>
                                {status.label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-white/40">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4" />
                                  {formatDate(ticket.updated_at || ticket.created_at)}
                                </div>
                                {ticket.message_count !== undefined && ticket.message_count > 0 && (
                                  <div className="flex items-center gap-1.5">
                                    <MessageSquare className="h-4 w-4" />
                                    {ticket.message_count} messages
                                  </div>
                                )}
                              </div>
                              
                              <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
