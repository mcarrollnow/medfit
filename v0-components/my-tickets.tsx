"use client"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Ticket {
  id: string
  subject: string
  status: "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  message_count: number
  last_message: string | null
  updated_at: string
}

interface MyTicketsProps {
  tickets: Ticket[]
  onSelectTicket: (ticketId: string) => void
  isLoading: boolean
}

const statusConfig = {
  open: { label: "Open", className: "bg-[var(--accent-yellow)] text-black" },
  "in-progress": { label: "In Progress", className: "bg-[var(--accent-yellow)] text-black" },
  "waiting-customer": { label: "Waiting", className: "bg-muted text-muted-foreground" },
  resolved: { label: "Resolved", className: "bg-[var(--accent-green)] text-black" },
  closed: { label: "Closed", className: "bg-[var(--accent-green)] text-black" },
}

const priorityConfig = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-[var(--accent-yellow)] text-black" },
  high: { label: "High", className: "bg-destructive text-white" },
  urgent: { label: "Urgent", className: "bg-destructive text-white" },
}

export function MyTickets({ tickets, onSelectTicket, isLoading }: MyTicketsProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Support Tickets</CardTitle>
          <CardDescription className="text-sm">View and manage your support requests</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Support Tickets</CardTitle>
          <CardDescription className="text-sm">View and manage your support requests</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">No tickets yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create a new ticket to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Support Tickets</CardTitle>
        <CardDescription className="text-sm">View and manage your support requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tickets.map((ticket) => {
          const statusInfo = statusConfig[ticket.status]
          const priorityInfo = priorityConfig[ticket.priority]
          const truncatedMessage = ticket.last_message
            ? ticket.last_message.length > 100
              ? `${ticket.last_message.slice(0, 100)}...`
              : ticket.last_message
            : "No messages yet"

          return (
            <Card
              key={ticket.id}
              className="p-4 cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => onSelectTicket(ticket.id)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground leading-relaxed flex-1">{ticket.subject}</h3>
                  <Badge className={cn("shrink-0", statusInfo.className)}>{statusInfo.label}</Badge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={priorityInfo.className}>{priorityInfo.label}</Badge>
                  <Badge variant="outline" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {ticket.message_count}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{truncatedMessage}</p>

                <p className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                </p>
              </div>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
