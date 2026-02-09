"use client"

import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Calendar, ChevronDown, TrendingUp, CreditCard, Clock, Users, Award, Repeat, DollarSign } from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import type { EarningsData } from "@/app/actions/rep"

interface CustomerInsight {
  id: string
  name: string
  totalSpent: number
  orderCount: number
  lastOrder: string
  isRepeat: boolean
}

interface AnalyticsDashboardProps {
  earningsHistory: EarningsData[]
  orders: any[]
  customers: CustomerInsight[]
}

const CHART_TABS = [
  { id: "earnings", label: "Earnings", icon: TrendingUp },
  { id: "commission", label: "Commission", icon: DollarSign },
  { id: "payment-completion", label: "Payment Success", icon: CreditCard },
  { id: "pending-orders", label: "Pending Orders", icon: Clock },
  { id: "customers", label: "Customer Insights", icon: Users },
]

const PERIODS = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "Last 3 Months", value: "3-months" },
  { label: "Last 6 Months", value: "6-months" },
  { label: "This Year", value: "year" },
  { label: "Custom Range", value: "custom" },
]

export function AnalyticsDashboard({ earningsHistory, orders, customers }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("earnings")
  const [selectedPeriod, setSelectedPeriod] = useState("this-month")
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)

  // Calculate metrics
  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.status === "completed" || o.status === "delivered" || o.status === "paid").length
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length
  const shippedOrders = orders.filter(o => o.status === "shipped").length
  const cancelledOrders = orders.filter(o => o.status === "cancelled" || o.status === "refunded").length
  const paymentCompletionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0
  const pendingRate = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0

  // Commission calculations
  const totalCommission = orders.reduce((sum, o) => sum + (o.commission || 0), 0)
  const paidCommission = orders
    .filter(o => o.status === "completed" || o.status === "delivered" || o.status === "paid")
    .reduce((sum, o) => sum + (o.commission || 0), 0)
  const pendingCommission = orders
    .filter(o => o.status === "pending" || o.status === "processing" || o.status === "shipped")
    .reduce((sum, o) => sum + (o.commission || 0), 0)
  const commissionRate = 0.10 // 10% commission rate

  // Commission history (last 30 days from earnings)
  const commissionHistory = earningsHistory.map(e => ({
    date: e.date,
    commission: e.amount,
  }))

  // Return customers (ordered more than once)
  const repeatCustomers = customers.filter(c => c.orderCount > 1)
  const repeatRate = customers.length > 0 ? (repeatCustomers.length / customers.length) * 100 : 0

  // Top customers by spend
  const topBySpend = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)
  
  // Most frequent customers
  const topByFrequency = [...customers].sort((a, b) => b.orderCount - a.orderCount).slice(0, 5)

  // Payment completion pie data
  const paymentPieData = [
    { name: "Paid", value: paidOrders, color: "#10b981" },
    { name: "Pending", value: pendingOrders, color: "#f59e0b" },
    { name: "Shipped", value: shippedOrders, color: "#3b82f6" },
    { name: "Cancelled", value: cancelledOrders, color: "#ef4444" },
  ].filter(d => d.value > 0)

  // Commission pie data
  const commissionPieData = [
    { name: "Earned", value: paidCommission, color: "#10b981" },
    { name: "Pending", value: pendingCommission, color: "#f59e0b" },
  ].filter(d => d.value > 0)

  // Get period label
  const getPeriodLabel = () => {
    const period = PERIODS.find(p => p.value === selectedPeriod)
    return period?.label || "This Month"
  }

  return (
    <div className="min-h-[500px]">
      <CardHeader className="pb-4 px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-light tracking-tight text-white">Analytics</CardTitle>
            <CardDescription className="text-white/50">Performance metrics and insights</CardDescription>
          </div>
          
          {/* Period Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
            >
              <Calendar className="w-4 h-4 text-white/50" />
              <span className="text-white font-medium">{getPeriodLabel()}</span>
              <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showPeriodDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-black/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50 overflow-hidden">
                {PERIODS.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => {
                      setSelectedPeriod(period.value)
                      setShowPeriodDropdown(false)
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      selectedPeriod === period.value 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {CHART_TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/[0.15] text-white border border-white/20'
                    : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.08] hover:text-white/80 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="pt-4 px-0 bg-transparent">
        {/* Earnings Chart */}
        {activeTab === "earnings" && (
          <div className="h-[350px] bg-transparent">
            {earningsHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/40">
                <p>No earnings data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Area dataKey="amount" type="monotone" fill="url(#fillEarnings)" stroke="#10b981" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Commission Tab */}
        {activeTab === "commission" && (
          <div className="h-[350px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Commission Stats */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Total Commission</p>
                  <p className="text-4xl font-bold text-white">${totalCommission.toFixed(2)}</p>
                  <p className="text-sm text-white/40 mt-1">From {totalOrders} orders</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-xs font-semibold text-emerald-400/70 uppercase tracking-wider mb-1">Earned</p>
                    <p className="text-2xl font-bold text-emerald-400">${paidCommission.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-2xl font-bold text-amber-400">${pendingCommission.toFixed(2)}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Commission Rate</span>
                    <span className="text-xl font-bold text-white">{(commissionRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${commissionRate * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Commission Pie Chart */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={commissionPieData.length > 0 ? commissionPieData : [{ name: "No Data", value: 1, color: "#374151" }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {(commissionPieData.length > 0 ? commissionPieData : [{ name: "No Data", value: 1, color: "#374151" }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#18181b', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{totalCommission > 0 ? `${((paidCommission / totalCommission) * 100).toFixed(0)}%` : '0%'}</p>
                      <p className="text-xs text-white/50 uppercase tracking-wider">Earned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Success Rate */}
        {activeTab === "payment-completion" && (
          <div className="h-[350px] flex items-center justify-center">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative h-[250px] w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {paymentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#18181b', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">{paymentCompletionRate.toFixed(0)}%</p>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Completion</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                  <span className="text-white/80">Paid: {paidOrders} orders</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500" />
                  <span className="text-white/80">Pending: {pendingOrders} orders</span>
                </div>
                {shippedOrders > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-white/80">Shipped: {shippedOrders} orders</span>
                  </div>
                )}
                {cancelledOrders > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-white/80">Cancelled: {cancelledOrders} orders</span>
                  </div>
                )}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50">Total Orders: {totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Orders */}
        {activeTab === "pending-orders" && (
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-amber-500/10 border-4 border-amber-500/30">
                <div>
                  <p className="text-5xl font-bold text-amber-400">{pendingOrders}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wider mt-1">Pending</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg text-white/80">
                  <span className="text-amber-400 font-semibold">{pendingRate.toFixed(1)}%</span> of orders awaiting payment
                </p>
                <p className="text-sm text-white/50">
                  {paidOrders} of {totalOrders} orders have been paid
                </p>
              </div>

              <div className="w-full max-w-xs mx-auto">
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    style={{ width: `${paymentCompletionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-2">
                  <span>0%</span>
                  <span>Payment Progress</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Insights */}
        {activeTab === "customers" && (
          <div className="h-[350px] overflow-y-auto space-y-6 pr-2">
            {/* Return Rate */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Repeat className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-semibold text-white">Return Customers</h4>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-purple-400">{repeatRate.toFixed(0)}%</p>
                  <p className="text-sm text-white/50">{repeatCustomers.length} of {customers.length} customers returned</p>
                </div>
                <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${repeatRate}%` }} />
                </div>
              </div>
            </div>

            {/* Top Customers by Spend */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg font-semibold text-white">Top Customers by Spend</h4>
              </div>
              <div className="space-y-3">
                {topBySpend.length === 0 ? (
                  <p className="text-white/40 text-sm">No customer data yet</p>
                ) : (
                  topBySpend.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-500/20 text-amber-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-300' :
                          index === 2 ? 'bg-orange-600/20 text-orange-400' :
                          'bg-white/10 text-white/50'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-white/80">{customer.name}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-semibold">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Most Frequent Customers */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-semibold text-white">Most Frequent Customers</h4>
              </div>
              <div className="space-y-3">
                {topByFrequency.length === 0 ? (
                  <p className="text-white/40 text-sm">No customer data yet</p>
                ) : (
                  topByFrequency.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-white/10 text-white/50'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-white/80">{customer.name}</span>
                      </div>
                      <span className="text-blue-400 font-mono">{customer.orderCount} orders</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  )
}

