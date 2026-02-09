"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Bot, Clock, Ticket } from "lucide-react"

interface AIMonitorProps {
  stats: {
    total_tickets: number
    ai_handling: number
    resolved_by_ai: number
    avg_response_time: string
  }
  recentActivity: Array<{
    ticket_id: string
    ticket_subject: string
    action: string
    timestamp: string
  }>
}

export function AIMonitor({ stats, recentActivity }: AIMonitorProps) {
  const aiHandlingPercentage = stats.total_tickets > 0 ? Math.round((stats.ai_handling / stats.total_tickets) * 100) : 0

  return (
    <div className="grid gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.total_tickets}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Tickets</div>
            </div>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* AI Handling */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{stats.ai_handling}</div>
                <Badge variant="secondary" className="bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20">
                  {aiHandlingPercentage}%
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">AI Handling</div>
            </div>
            <Bot className="h-5 w-5 text-accent-yellow" />
          </div>
        </Card>

        {/* Resolved by AI */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{stats.resolved_by_ai}</div>
                <CheckCircle className="h-5 w-5 text-accent-green" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Resolved by AI</div>
            </div>
          </div>
        </Card>

        {/* Avg Response Time */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.avg_response_time}</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Response Time</div>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Recent Activity Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent AI Activity</h3>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No recent activity</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.ticket_id}-${activity.timestamp}`}
                className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-1">{activity.action}</div>
                    <div className="text-sm text-muted-foreground truncate">{activity.ticket_subject}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
