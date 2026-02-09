"use client"

import { useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, ChevronRight, Filter } from "lucide-react"

interface AdminTicketQueueProps {
  tickets: Array<{
    id: string
    subject: string
    customerName: string
    customerEmail: string
    status: "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
    priority: "low" | "medium" | "high" | "urgent"
    ai_handling: boolean
    updated_at: string
  }>
  onSelectTicket: (ticketId: string) => void
  onFilterChange: (filters: {
    status?: string
    priority?: string
    ai?: string
  }) => void
  isLoading: boolean
}

export function AdminTicketQueue({ tickets, onSelectTicket, onFilterChange, isLoading }: AdminTicketQueueProps) {
  const [filters, setFilters] = useState<{
    status?: string
    priority?: string
    ai?: string
  }>({})

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "resolved":
      case "closed":
        return "default"
      case "in-progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-[var(--accent-green)] text-black"
      case "in-progress":
      case "open":
        return "bg-[var(--accent-yellow)] text-black"
      case "waiting-customer":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "high":
        return "bg-destructive text-white"
      case "medium":
        return "bg-[var(--accent-yellow)] text-black"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="border-0 shadow-none">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Support Tickets</h2>
            <Badge variant="secondary" className="text-xs">
              {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
            </Badge>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="waiting-customer">Waiting</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority || "all"} onValueChange={(value) => handleFilterChange("priority", value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.ai || "all"} onValueChange={(value) => handleFilterChange("ai", value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="AI Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="true">AI Handling</SelectItem>
                <SelectItem value="false">Human Only</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No tickets match filters</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectTicket(ticket.id)}
            >
              <div className="flex items-start gap-3">
                {ticket.ai_handling && (
                  <div className="shrink-0 mt-0.5">
                    <Bot className="w-5 h-5 text-[var(--accent-yellow)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{ticket.subject}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {ticket.customerName} | {ticket.customerEmail}
                  </p>
                  <div className="flex gap-2 flex-wrap mb-1">
                    <Badge
                      variant={getStatusBadgeVariant(ticket.status)}
                      className={`text-xs ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status.replace("-", " ")}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Updated {formatDate(ticket.updated_at)}</p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-auto" />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
