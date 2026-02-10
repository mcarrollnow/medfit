'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, ShoppingCart, DollarSign, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RevenueChart } from '@/components/admin/revenue-chart'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    averageOrderValue: number
  }
  revenueData: Array<{ month: string; revenue: number }>
}

async function fetchAnalyticsData(): Promise<AnalyticsData> {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return {
    overview: {
      totalRevenue: 248567.89,
      totalOrders: 5432,
      totalCustomers: 1823,
      averageOrderValue: 45.76
    },
    revenueData: [
      { month: 'Jul', revenue: 28000 },
      { month: 'Aug', revenue: 32000 },
      { month: 'Sep', revenue: 38000 },
      { month: 'Oct', revenue: 35000 },
      { month: 'Nov', revenue: 42000 },
      { month: 'Dec', revenue: 45231 },
    ]
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData().then(analyticsData => {
      setData(analyticsData)
      setLoading(false)
    })
  }, [])

  const metrics = [
    {
      title: 'Total Revenue',
      value: data ? `$${data.overview.totalRevenue.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      title: 'Total Orders',
      value: data ? data.overview.totalOrders.toLocaleString() : '0',
      icon: ShoppingCart,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'Total Customers',
      value: data ? data.overview.totalCustomers.toLocaleString() : '0',
      icon: Users,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: 'Avg Order Value',
      value: data ? `$${data.overview.averageOrderValue.toFixed(2)}` : '$0',
      icon: TrendingUp,
      color: 'bg-orange-500/20 text-orange-400',
    },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Back Navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Admin</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground md:text-6xl">Analytics</h1>
          <p className="text-xl text-muted-foreground">Deep insights into your business performance.</p>
        </div>

        {/* Stats */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overview</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-36 animate-pulse rounded-2xl bg-foreground/5" />
                ))}
              </>
            ) : (
              <>
                {metrics.map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <div 
                      key={index} 
                      className="group relative overflow-hidden rounded-2xl border border-border bg-foreground/5 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-foreground/[0.08]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${metric.color.split(' ')[0]}`}>
                            <Icon className={`h-5 w-5 ${metric.color.split(' ')[1]}`} />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        </div>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{metric.value}</p>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </section>

        {/* Revenue Chart */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Revenue Trend</h2>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">Revenue</h3>
                <p className="text-muted-foreground mt-1">6-month performance overview</p>
              </div>
              {loading ? (
                <div className="h-[400px] animate-pulse rounded-xl bg-foreground/5" />
              ) : (
                <RevenueChart data={data?.revenueData || []} />
              )}
            </div>
          </div>
        </section>

        {/* Bottom Grid */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* Top Products */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">Top Products</h3>
                <p className="text-muted-foreground mt-1">By revenue</p>
              </div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-foreground/5" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {['Premium Wireless Headphones', 'Ergonomic Office Chair', 'Smart Fitness Watch'].map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                      <p className="font-medium text-foreground">{product}</p>
                      <p className="font-bold text-lg text-emerald-400">${(Math.random() * 5000 + 2000).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground/5 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">Top Customers</h3>
                <p className="text-muted-foreground mt-1">By total spent</p>
              </div>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-foreground/5" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {['Emma Davis', 'Carol White', 'Alice Johnson'].map((customer, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-foreground/5">
                      <p className="font-medium text-foreground">{customer}</p>
                      <p className="font-bold text-lg text-emerald-400">${(Math.random() * 3000 + 2000).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
