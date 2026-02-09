"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Plus, MessageSquare, ListTodo, Ticket } from "lucide-react"
import CustomerNav from "../../components/CustomerNav"
import { NewTicketForm } from "../../components/support/NewTicketForm"
import { MyTickets } from "../../components/support/MyTickets"
import { TicketChat } from "../../components/support/TicketChat"
import { useSupportTickets } from "../../hooks/useSupportTickets"
import { getAuthHeaders } from "../../lib/auth-utils"

export default function Support() {
  const { tickets } = useSupportTickets()
  const [activeTab, setActiveTab] = useState<"tickets" | "new" | "chat">("tickets")
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [orders, setOrders] = useState<Array<{ id: string; order_number: string }>>([])
  const [hasProcessedUrlParam, setHasProcessedUrlParam] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = await getAuthHeaders()
        const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/orders`, {
          headers,
        })
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Failed to load orders:", error)
      }
    }

    fetchOrders()
  }, [])

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setActiveTab("chat")
  }

  const handleNewTicketSuccess = () => {
    setActiveTab("tickets")
  }

  const handleCloseChat = () => {
    setSelectedTicketId(null)
    setActiveTab("tickets")
  }

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId)

  useEffect(() => {
    if (hasProcessedUrlParam || !tickets || tickets.length === 0) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const urlTicketId = params.get("ticket")
    if (urlTicketId) {
      const ticketExists = tickets.find((t) => t.id === urlTicketId)
      if (ticketExists) {
        handleSelectTicket(urlTicketId)
        window.history.replaceState({}, "", "/support")
        setHasProcessedUrlParam(true)
        return
      }
    }

    const ticketId = sessionStorage.getItem("openTicketId")
    if (ticketId) {
      const ticketExists = tickets.find((t) => t.id === ticketId)
      if (ticketExists) {
        handleSelectTicket(ticketId)
        sessionStorage.removeItem("openTicketId")
        setHasProcessedUrlParam(true)
      }
    }
  }, [tickets, hasProcessedUrlParam])

  return (
    <div className="min-h-screen bg-background dark">
      <CustomerNav />

      <div className="border-b border-white/20 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 max-w-5xl">
          <div className="space-y-2 mb-4">
            <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              Support Center
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Get help with your orders and account. Our AI assistant is here 24/7.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/60 border border-white/10 p-0.5 h-auto gap-0.5">
              <TabsTrigger
                value="tickets"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-lg py-2 rounded-lg transition-all"
              >
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">My Tickets</span>
                <span className="sm:hidden font-medium">Tickets</span>
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-lg py-2 rounded-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">New Ticket</span>
                <span className="sm:hidden font-medium">New</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled={!selectedTicketId}
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:border data-[state=active]:border-white/20 data-[state=active]:text-foreground data-[state=active]:shadow-lg py-2 rounded-lg transition-all disabled:opacity-40"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Chat</span>
                <span className="sm:hidden font-medium">Chat</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsContent value="tickets" className="mt-0">
            <MyTickets onSelectTicket={handleSelectTicket} />
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <div className="glass-card p-8 rounded-2xl glow-border">
              <NewTicketForm onSuccess={handleNewTicketSuccess} orders={orders} />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            {selectedTicket ? (
              <div className="glass-card rounded-2xl overflow-hidden glow-border">
                <TicketChat
                  ticketId={selectedTicket.id}
                  chatSessionId={selectedTicket.chat_session_id}
                  ticketSubject={selectedTicket.subject}
                  ticketStatus={selectedTicket.status}
                  onClose={handleCloseChat}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center py-24">
                <div className="glass-card p-12 rounded-2xl text-center space-y-3 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">No ticket selected</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Select a ticket from your list to view the conversation
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
