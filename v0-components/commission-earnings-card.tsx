"use client"

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CommissionEarningsCardProps {
  earnings: {
    ytd: number
    last90Days: number
    last30Days: number
  }
}

export function CommissionEarningsCard({ earnings }: CommissionEarningsCardProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate trend percentage (30 days vs 90 days average)
  const avgLast90Days = earnings.last90Days / 3 // Average per 30 days
  const trendPercentage = avgLast90Days > 0 ? ((earnings.last30Days - avgLast90Days) / avgLast90Days) * 100 : 0
  const isPositiveTrend = trendPercentage >= 0

  return (
    <Card className="p-6 rounded-lg border-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-6 h-6 text-accent-yellow" />
        <h3 className="text-xl font-semibold">Commission Earnings</h3>
      </div>

      {/* Earnings Sections */}
      <div className="space-y-4">
        {/* YTD */}
        <div className="pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Year to Date</p>
          <p className="text-2xl font-semibold">{formatCurrency(earnings.ytd)}</p>
        </div>

        {/* Last 90 Days */}
        <div className="pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Last 90 Days</p>
          <p className="text-xl font-bold">{formatCurrency(earnings.last90Days)}</p>
        </div>

        {/* Last 30 Days with Trend */}
        <div className="pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Last 30 Days</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{formatCurrency(earnings.last30Days)}</p>
            <div className={`flex items-center gap-1 ${isPositiveTrend ? "text-accent-green" : "text-red-500"}`}>
              {isPositiveTrend ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-xs font-medium">
                {isPositiveTrend ? "+" : ""}
                {trendPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          Commissions are calculated based on completed orders and may take 24-48 hours to reflect.
        </p>
      </div>
    </Card>
  )
}
