'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(58,66,51,0.08)" />
        <XAxis 
          dataKey="month" 
          className="text-xs"
          tick={{ fill: 'rgba(58, 66, 51, 0.6)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'rgba(58, 66, 51, 0.6)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-foreground/10 backdrop-blur-md border border-border rounded-lg shadow-2xl p-4">
                  <p className="text-sm font-semibold mb-1.5 text-foreground">{payload[0].payload.month}</p>
                  <p className="text-sm text-foreground/70">
                    Revenue: <span className="text-foreground font-bold text-base">${payload[0].value?.toLocaleString()}</span>
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
            <stop offset="100%" stopColor="#0891b2" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Bar 
          dataKey="revenue" 
          fill="url(#revenueGradient)"
          radius={[8, 8, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
