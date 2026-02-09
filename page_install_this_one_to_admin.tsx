"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ListTodo, MessageSquare, Activity, Sparkles } from "lucide-react"
import AdminNav from "../../../components/AdminNav"
import { AdminTicketQueue } from "../../../components/support/admin/AdminTicketQueue"
import { AdminTicketDetail } from "../../../components/support/admin/AdminTicketDetail"
import { AIMonitor } from "../../../components/support/admin/AIMonitor"
import { useSupportAuth } from "../../../hooks/useSupportAuth"
import { useAdminTickets } from "../../../hooks/useAdminTickets"

export default function AdminSupport() {
  const { isAdmin } = useSupportAuth()
  const { tickets, mutate } = useAdminTickets()
  const [activeTab, setActiveTab] = useState<"queue" | "chat" | "monitor">("queue")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setActiveTab("chat")
  }

  const handleCloseTicket = () => {
    setSelectedTicketId(null)
    setActiveTab("queue")
  }

  const handleTicketUpdate = () => {
    mutate()
  }

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background dark">
        <AdminNav />
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-card p-12 rounded-2xl text-center max-w-md space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Access Denied</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Admin privileges are required to access this area.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <AdminNav />

      <div className="border-b border-white/20 bg-card/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Support Dashboard
              </h1>
              <p className="text-sm text-muted-foreground font-mono">Manage tickets and monitor AI assistance</p>
            </div>
            {tickets && tickets.length > 0 && (
              <div className="status-badge bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {tickets.length} Active
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="w-full md:w-auto bg-card/60 border border-white/10 p-0.5 h-auto gap-0.5">
              <TabsTrigger
                value="queue"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-lg px-3 py-2 rounded-lg transition-all"
              >
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Ticket Queue</span>
                <span className="sm:hidden font-medium">Queue</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled={!selectedTicketId}
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-lg px-3 py-2 rounded-lg transition-all disabled:opacity-40"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Ticket Detail</span>
                <span className="sm:hidden font-medium">Detail</span>
              </TabsTrigger>
              <TabsTrigger
                value="monitor"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-lg px-3 py-2 rounded-lg transition-all"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">AI Monitor</span>
                <span className="sm:hidden font-medium">AI</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto h-full px-6">
          {activeTab === "queue" && (
            <div className="h-full py-6">
              <AdminTicketQueue onSelectTicket={handleSelectTicket} />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="h-full py-6">
              {selectedTicket ? (
                <AdminTicketDetail
                  ticketId={selectedTicket.id}
                  chatSessionId={selectedTicket.chat_session_id}
                  ticketSubject={selectedTicket.subject}
                  ticketStatus={selectedTicket.status}
                  ticketPriority={selectedTicket.priority}
                  customerName={selectedTicket.customerName || "Unknown"}
                  customerEmail={selectedTicket.customerEmail || ""}
                  onClose={handleCloseTicket}
                  onUpdate={handleTicketUpdate}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="glass-card p-12 rounded-2xl text-center space-y-3 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium">No ticket selected</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Select a ticket from the queue to view details and chat history
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "monitor" && (
            <div className="h-full py-6">
              <AIMonitor />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
