"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  User,
  Package,
  Search,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getAllSupportTickets, type SupportTicket } from "@/app/actions/support"

// Label map for wizard answer fields
const LABEL_MAP: Record<string, string> = {
  checked_tracking: "Tracking",
  checked_neighbors: "Neighbors",
  address_correct: "Address",
  last_update: "Last Update",
  days_late: "Days Late",
  tracking_status: "Status",
  urgency: "Urgency",
  damage_type: "Damage",
  resolution: "Resolution",
  severity: "Severity",
  topic: "Topic",
  details: "Details",
}

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

export default function AdminSupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    loadTickets()
  }, [])

  const [error, setError] = useState<string | null>(null)

  const loadTickets = async () => {
    setLoading(true)
    setError(null)
    const result = await getAllSupportTickets()
    if (result.error) {
      setError(result.error)
    }
    setTickets(result.tickets)
    setLoading(false)
  }

  const filteredTickets = tickets.filter((ticket) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const customerName = ticket.customer?.user
        ? `${ticket.customer.user.first_name || ""} ${ticket.customer.user.last_name || ""}`.toLowerCase()
        : ""
      const customerEmail = ticket.customer?.user?.email?.toLowerCase() || ""
      const subject = ticket.subject.toLowerCase()
      
      if (!customerName.includes(query) && !customerEmail.includes(query) && !subject.includes(query)) {
        return false
      }
    }
    
    // Status filter
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false
    }
    
    // Priority filter
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
      return false
    }
    
    return true
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    urgent: tickets.filter(t => t.priority === "urgent").length,
  }

  const getCustomerName = (ticket: SupportTicket) => {
    if (ticket.customer?.user) {
      const { first_name, last_name, email } = ticket.customer.user
      if (first_name || last_name) {
        return `${first_name || ""} ${last_name || ""}`.trim()
      }
      return email
    }
    return "Unknown Customer"
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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Support Tickets</h1>
          <p className="text-lg text-white/50">Manage customer support requests</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            { label: "Total Tickets", value: stats.total, icon: Ticket, color: "bg-white/10 text-white" },
            { label: "Open", value: stats.open, icon: AlertCircle, color: "bg-yellow-500/20 text-yellow-400" },
            { label: "In Progress", value: stats.inProgress, icon: Clock, color: "bg-blue-500/20 text-blue-400" },
            { label: "Urgent", value: stats.urgent, icon: AlertCircle, color: "bg-red-500/20 text-red-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${stat.color.split(" ")[0]} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.split(" ")[1]}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <Input
                placeholder="Search by customer, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
              >
                <option value="all" className="bg-zinc-900">All Status</option>
                <option value="open" className="bg-zinc-900">Open</option>
                <option value="in_progress" className="bg-zinc-900">In Progress</option>
                <option value="waiting_on_customer" className="bg-zinc-900">Waiting</option>
                <option value="resolved" className="bg-zinc-900">Resolved</option>
                <option value="closed" className="bg-zinc-900">Closed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
              >
                <option value="all" className="bg-zinc-900">All Priority</option>
                <option value="urgent" className="bg-zinc-900">Urgent</option>
                <option value="high" className="bg-zinc-900">High</option>
                <option value="medium" className="bg-zinc-900">Medium</option>
                <option value="low" className="bg-zinc-900">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white/40" />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Error Loading Tickets</h3>
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={loadTickets}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center py-20 text-center">
              <Ticket className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
              <p className="text-white/50">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Support tickets will appear here when customers submit them"}
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket, index) => {
              const status = statusColors[ticket.status] || statusColors.open
              const priority = priorityColors[ticket.priority] || priorityColors.medium
              
              return (
                <motion.button
                  key={ticket.id}
                  onClick={() => router.push(`/admin/support/${ticket.id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-6 text-left hover:bg-white/[0.07] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Indicator */}
                    <div className={`h-12 w-12 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                      {ticket.status === "open" || ticket.status === "in_progress" ? (
                        <AlertCircle className={`h-6 w-6 ${status.text}`} />
                      ) : (
                        <CheckCircle2 className={`h-6 w-6 ${status.text}`} />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-white/90">{ticket.subject}</h3>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <div className="flex items-center gap-1.5 text-white/50">
                              <User className="h-4 w-4" />
                              <span className="text-sm">{getCustomerName(ticket)}</span>
                            </div>
                            {ticket.order && (
                              <div className="flex items-center gap-1.5 text-white/50">
                                <Package className="h-4 w-4" />
                                <span className="text-sm">Order #{ticket.order.order_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`${priority.bg} ${priority.text} border-0 capitalize`}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={`${status.bg} ${status.text} border-0`}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Issue Summary */}
                      {ticket.issue_summary && (
                        <div className="flex items-center gap-2 mb-3 py-2 px-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <Info className="h-4 w-4 text-blue-400 shrink-0" />
                          <p className="text-sm text-blue-300 truncate">{ticket.issue_summary}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-white/40">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {formatDate(ticket.created_at)}
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
      </div>
    </div>
  )
}
