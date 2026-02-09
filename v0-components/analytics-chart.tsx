"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsChartProps {
  data: Array<{ date: string; revenue: number }>
  title?: string
}

export function AnalyticsChart({ data, title }: AnalyticsChartProps) {
  // Format currency for Y axis
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format dates for X axis
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <p className="text-sm font-medium">{formatDate(payload[0].payload.date)}</p>
          <p className="text-lg font-bold text-accent-yellow">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-6 rounded-xl">
      {title && <h3 className="text-xl font-bold mb-6">{title}</h3>}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent-yellow))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent-yellow))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeWidth={1} className="stroke-border" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs text-muted-foreground"
              stroke="hsl(var(--border))"
            />
            <YAxis
              tickFormatter={formatCurrency}
              className="text-xs text-muted-foreground"
              stroke="hsl(var(--border))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--accent-yellow))"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
