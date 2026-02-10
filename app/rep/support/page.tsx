"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  HeadphonesIcon,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Paperclip,
  ChevronRight,
  Search,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { getCurrentRep } from "@/app/actions/rep"
import { cn } from "@/lib/utils"

interface SupportTicket {
  id: string
  subject: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  category: string
  created_at: string
  updated_at: string
  messages: {
    id: string
    content: string
    sender: "rep" | "support"
    timestamp: string
  }[]
}

type ViewMode = "list" | "detail" | "create"

const CATEGORIES = [
  "Account Issue",
  "Commission Question",
  "Order Problem",
  "Product Information",
  "Technical Support",
  "Wallet/Payment",
  "Other",
]

const PRIORITY_COLORS = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
}

const STATUS_COLORS = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  resolved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  closed: "bg-foreground/10 text-muted-foreground border-border",
}

const STATUS_ICONS = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: CheckCircle,
}

export default function RepSupportPage() {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [repId, setRepId] = useState<string | null>(null)
  const [repName, setRepName] = useState("Representative")

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [submitting, setSubmitting] = useState(false)

  // Reply form
  const [replyContent, setReplyContent] = useState("")
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const rep = await getCurrentRep()
        if (rep) {
          setRepId(rep.id)
          setRepName(rep.name)
          // TODO: Load actual tickets from database
          // For now, show empty state
          setTickets([])
        }
      } catch (error) {
        console.error("[Rep Support] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateTicket = async () => {
    if (!repId || !newTicket.subject || !newTicket.description || !newTicket.category) {
      return
    }

    setSubmitting(true)
    try {
      // TODO: Create ticket in database
      // For now, simulate creating a ticket
      const ticket: SupportTicket = {
        id: `ticket-${Date.now()}`,
        subject: newTicket.subject,
        description: newTicket.description,
        status: "open",
        priority: newTicket.priority,
        category: newTicket.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      }
      setTickets([ticket, ...tickets])
      setViewMode("list")
      setNewTicket({ subject: "", description: "", category: "", priority: "medium" })
    } catch (error) {
      console.error("Error creating ticket:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendReply = async () => {
    if (!selectedTicket || !replyContent.trim()) return

    setSendingReply(true)
    try {
      // TODO: Send reply to database
      const newMessage = {
        id: `msg-${Date.now()}`,
        content: replyContent,
        sender: "rep" as const,
        timestamp: new Date().toISOString(),
      }
      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        updated_at: new Date().toISOString(),
      }
      setSelectedTicket(updatedTicket)
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t))
      setReplyContent("")
    } catch (error) {
      console.error("Error sending reply:", error)
    } finally {
      setSendingReply(false)
    }
  }

  const openTicketsCount = tickets.filter(t => t.status === "open" || t.status === "in_progress").length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {viewMode === "list" && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Support</h1>
                <p className="text-xl text-muted-foreground">Get help and submit support tickets.</p>
              </div>
              <Button
                onClick={() => setViewMode("create")}
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Ticket
              </Button>
            </div>

            {/* Stats */}
            <section className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                      <p className="text-3xl font-bold tracking-tight text-foreground">{openTicketsCount}</p>
                    </div>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                      <p className="text-3xl font-bold tracking-tight text-foreground">
                        {tickets.filter(t => t.status === "resolved" || t.status === "closed").length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <HeadphonesIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                      <p className="text-3xl font-bold tracking-tight text-foreground">{tickets.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Search & Filter */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tickets..."
                    className="h-12 pl-12 bg-foreground/5 border-border rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "open", "in_progress", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize",
                        statusFilter === status
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 border border-border"
                      )}
                    >
                      {status === "all" ? "All" : status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Tickets List */}
            <section className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Tickets</h2>
              {filteredTickets.length === 0 ? (
                <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-12 backdrop-blur-xl text-center">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                  <div className="relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center mx-auto mb-4">
                      <HeadphonesIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg">No support tickets yet</p>
                    <p className="text-muted-foreground text-sm mt-2">Create a ticket if you need help</p>
                    <Button
                      onClick={() => setViewMode("create")}
                      className="mt-6 h-11 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl"
                    >
                      Create Ticket
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => {
                    const StatusIcon = STATUS_ICONS[ticket.status]
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicket(ticket)
                          setViewMode("detail")
                        }}
                        className="w-full group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-5 backdrop-blur-xl transition-all hover:bg-foreground/[0.08] hover:border-border text-left"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                        <div className="relative z-10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center",
                              STATUS_COLORS[ticket.status].split(" ")[0]
                            )}>
                              <StatusIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-foreground">{ticket.subject}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{ticket.category} • {format(new Date(ticket.created_at), "MMM dd, yyyy")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={cn("rounded-full capitalize", PRIORITY_COLORS[ticket.priority])}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={cn("rounded-full capitalize", STATUS_COLORS[ticket.status])}>
                              {ticket.status.replace("_", " ")}
                            </Badge>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground/60" />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {viewMode === "create" && (
          <>
            {/* Create Header */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setViewMode("list")}
                variant="ghost"
                className="h-11 w-11 rounded-full hover:bg-foreground/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold tracking-tighter text-foreground">New Support Ticket</h1>
                <p className="text-xl text-muted-foreground">Describe your issue and we'll help you</p>
              </div>
            </div>

            {/* Create Form */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-8 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">Subject</label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="h-12 bg-foreground/5 border-border rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewTicket({ ...newTicket, category: cat })}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                          newTicket.category === cat
                            ? "bg-foreground/10 border-border text-foreground"
                            : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">Priority</label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewTicket({ ...newTicket, priority: p })}
                        className={cn(
                          "flex-1 h-12 rounded-xl text-sm font-medium transition-all border capitalize",
                          newTicket.priority === p
                            ? PRIORITY_COLORS[p]
                            : "bg-foreground/5 border-border text-foreground/60 hover:bg-foreground/10"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">Description</label>
                  <Textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Please provide details about your issue..."
                    className="min-h-[150px] bg-foreground/5 border-border rounded-xl resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateTicket}
                    disabled={submitting || !newTicket.subject || !newTicket.description || !newTicket.category}
                    className="h-12 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    Submit Ticket
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    className="h-12 px-6 bg-foreground/5 hover:bg-foreground/10 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {viewMode === "detail" && selectedTicket && (
          <>
            {/* Detail Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    setViewMode("list")
                    setSelectedTicket(null)
                  }}
                  variant="ghost"
                  className="h-11 w-11 rounded-full hover:bg-foreground/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter text-foreground">{selectedTicket.subject}</h1>
                  <p className="text-muted-foreground">{selectedTicket.category} • Created {format(new Date(selectedTicket.created_at), "MMM dd, yyyy")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={cn("rounded-full capitalize", PRIORITY_COLORS[selectedTicket.priority])}>
                  {selectedTicket.priority}
                </Badge>
                <Badge className={cn("rounded-full capitalize", STATUS_COLORS[selectedTicket.status])}>
                  {selectedTicket.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Original Description */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10">
                <p className="text-sm text-muted-foreground mb-2">Original Message</p>
                <p className="text-foreground/80 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>
            </div>

            {/* Messages */}
            {selectedTicket.messages.length > 0 && (
              <div className="space-y-4">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-5",
                      msg.sender === "rep"
                        ? "bg-foreground/10 border border-border ml-12"
                        : "bg-blue-500/10 border border-blue-500/20 mr-12"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className={cn(
                        "text-sm font-medium",
                        msg.sender === "rep" ? "text-foreground/60" : "text-blue-400"
                      )}>
                        {msg.sender === "rep" ? repName : "Support Team"}
                      </p>
                      <p className="text-xs text-muted-foreground">{format(new Date(msg.timestamp), "MMM dd, h:mm a")}</p>
                    </div>
                    <p className="text-foreground/80">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Form */}
            {(selectedTicket.status === "open" || selectedTicket.status === "in_progress") && (
              <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-4">
                  <p className="text-sm text-muted-foreground">Reply to this ticket</p>
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply..."
                    className="min-h-[100px] bg-foreground/5 border-border rounded-xl resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyContent.trim()}
                      className="h-11 px-6 bg-primary text-primary-foreground hover:bg-card/90 rounded-xl font-semibold disabled:opacity-50"
                    >
                      {sendingReply ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

