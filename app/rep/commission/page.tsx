"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, subDays, startOfMonth, subMonths } from "date-fns"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Package,
  Users,
  Clock,
  ChevronDown,
  Filter,
  Download,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCurrentRep, getRepOrders, getRepStats, type RepOrder, type RepStats } from "@/app/actions/rep"
import { cn } from "@/lib/utils"

type DateRange = "week" | "month" | "quarter" | "year" | "all"

export default function RepCommissionPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<RepOrder[]>([])
  const [stats, setStats] = useState<RepStats | null>(null)
  const [repName, setRepName] = useState("Representative")
  const [dateRange, setDateRange] = useState<DateRange>("month")
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const rep = await getCurrentRep()
        if (rep) {
          setRepName(rep.name)
          const [repOrders, repStats] = await Promise.all([
            getRepOrders(rep.id),
            getRepStats(rep.id)
          ])
          setOrders(repOrders)
          setStats(repStats)
        }
      } catch (error) {
        console.error("[Rep Commission] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter orders by date range
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date)
    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case "week":
        startDate = subDays(now, 7)
        break
      case "month":
        startDate = startOfMonth(now)
        break
      case "quarter":
        startDate = subMonths(now, 3)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case "all":
      default:
        return true
    }

    return orderDate >= startDate
  })

  // Calculate stats for filtered orders
  const totalCommission = filteredOrders.reduce((sum, o) => sum + o.commission, 0)
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
  const completedOrders = filteredOrders.filter(o => 
    o.status === "completed" || o.status === "delivered"
  )
  const completedCommission = completedOrders.reduce((sum, o) => sum + o.commission, 0)
  const pendingCommission = totalCommission - completedCommission
  const avgCommission = filteredOrders.length > 0 ? totalCommission / filteredOrders.length : 0
  const commissionRate = totalRevenue > 0 ? (totalCommission / totalRevenue) * 100 : 10

  // Group by month for chart data
  const monthlyData = filteredOrders.reduce((acc, order) => {
    const month = format(new Date(order.date), "MMM yyyy")
    if (!acc[month]) {
      acc[month] = { commission: 0, revenue: 0, orders: 0 }
    }
    acc[month].commission += order.commission
    acc[month].revenue += order.total
    acc[month].orders += 1
    return acc
  }, {} as Record<string, { commission: number; revenue: number; orders: number }>)

  const exportToCSV = () => {
    let csvContent = "Order ID,Customer,Date,Order Total,Commission,Status\n"
    filteredOrders.forEach(order => {
      csvContent += `"${order.id}","${order.customer.name}","${format(new Date(order.date), "yyyy-MM-dd")}","$${order.total.toFixed(2)}","$${order.commission.toFixed(2)}","${order.status}"\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `commission-report-${format(new Date(), "yyyy-MM-dd")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 md:py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Commission</h1>
            <p className="text-xl text-muted-foreground">Track your earnings and commission history.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportToCSV}
              className="h-11 px-5 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border hover:border-border rounded-xl font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: "week", label: "Last 7 Days" },
            { value: "month", label: "This Month" },
            { value: "quarter", label: "Last 3 Months" },
            { value: "year", label: "This Year" },
            { value: "all", label: "All Time" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value as DateRange)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                dateRange === range.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground border border-border"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Commission */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Total Commission</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-emerald-400">${totalCommission.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{filteredOrders.length} orders</p>
              </div>
            </div>

            {/* Completed */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground">${completedCommission.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{completedOrders.length} orders paid</p>
              </div>
            </div>

            {/* Pending */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-amber-400">${pendingCommission.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Processing orders</p>
              </div>
            </div>

            {/* Average per Order */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Avg per Order</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground">${avgCommission.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{commissionRate.toFixed(1)}% rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Breakdown */}
        {Object.keys(monthlyData).length > 0 && (
          <section className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Monthly Breakdown</h2>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <div className="relative z-10 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-foreground/60 font-medium">Month</th>
                      <th className="text-right p-4 text-foreground/60 font-medium">Orders</th>
                      <th className="text-right p-4 text-foreground/60 font-medium">Revenue</th>
                      <th className="text-right p-4 text-foreground/60 font-medium">Commission</th>
                      <th className="text-right p-4 text-foreground/60 font-medium">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthlyData).sort((a, b) => 
                      new Date(b[0]).getTime() - new Date(a[0]).getTime()
                    ).map(([month, data]) => (
                      <tr key={month} className="border-b border-border hover:bg-foreground/[0.04] transition-colors">
                        <td className="p-4 font-medium text-foreground">{month}</td>
                        <td className="p-4 text-right text-foreground/60">{data.orders}</td>
                        <td className="p-4 text-right text-foreground">${data.revenue.toFixed(2)}</td>
                        <td className="p-4 text-right text-emerald-400 font-semibold">${data.commission.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <Badge className="bg-foreground/10 text-foreground/70 border-0 rounded-full">
                            {data.revenue > 0 ? ((data.commission / data.revenue) * 100).toFixed(1) : 0}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Commission by Order */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Commission by Order</h2>
            <p className="text-sm text-muted-foreground">{filteredOrders.length} orders</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found for this period</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredOrders.slice(0, 20).map((order) => {
                    const isExpanded = expandedOrderId === order.id
                    return (
                      <div key={order.id}>
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-foreground/[0.04] transition-colors text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-foreground/10 flex items-center justify-center">
                              <Package className="h-5 w-5 text-foreground/60" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{order.customer.name}</p>
                              <p className="text-sm text-muted-foreground">{format(new Date(order.date), "MMM dd, yyyy")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-foreground/60">${order.total.toFixed(2)}</p>
                              <p className="text-emerald-400 font-semibold">+${order.commission.toFixed(2)}</p>
                            </div>
                            <Badge className={cn(
                              "rounded-full",
                              order.status === "completed" || order.status === "delivered"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : order.status === "pending" || order.status === "processing"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-foreground/10 text-foreground/60 border-border"
                            )}>
                              {order.status}
                            </Badge>
                            <ChevronDown className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform",
                              isExpanded && "rotate-180"
                            )} />
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4">
                            <div className="p-4 rounded-xl bg-foreground/[0.04] border border-border space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="font-mono text-foreground/70">{order.id.slice(0, 8)}...</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Customer Email</span>
                                <span className="text-foreground/70">{order.customer.email}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items</span>
                                <span className="text-foreground/70">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="border-t border-border pt-3 space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-foreground/60">{item.productName} x{item.quantity}</span>
                                    <span className="text-emerald-400">+${item.commission.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {filteredOrders.length > 20 && (
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground text-sm">Showing first 20 orders. Export CSV for full report.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

