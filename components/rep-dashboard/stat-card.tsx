import { GrainyCard } from "./grainy-card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <GrainyCard className="p-6 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <Icon className="h-5 w-5 text-white/80" />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full border ${
              trendUp
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">{title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-light text-white tracking-tight">{value}</span>
        </div>
        {subtitle && <p className="mt-2 text-xs text-white/40">{subtitle}</p>}
      </div>
    </GrainyCard>
  )
}
