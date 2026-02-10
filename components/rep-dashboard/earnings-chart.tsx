"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { GrainyCard } from "./grainy-card"
import type { EarningsData } from "@/app/actions/rep"

const chartConfig = {
  amount: {
    label: "Earnings",
    color: "#10b981", // Emerald green - matches commission color
  },
} satisfies ChartConfig

interface EarningsChartProps {
  earningsHistory: EarningsData[]
}

export function EarningsChart({ earningsHistory }: EarningsChartProps) {
  return (
    <GrainyCard className="col-span-4 lg:col-span-3 h-full min-h-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl font-light tracking-tight text-foreground">Earnings Overview</CardTitle>
        <CardDescription className="text-foreground/60">Your commission performance over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        {earningsHistory.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No earnings data yet</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={earningsHistory}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(58,66,51,0.06)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "rgba(58,66,51,0.5)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "rgba(58,66,51,0.5)", fontSize: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
              <Area
                dataKey="amount"
                type="monotone"
                fill="url(#fillAmount)"
                fillOpacity={1}
                stroke="#10b981"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </GrainyCard>
  )
}
