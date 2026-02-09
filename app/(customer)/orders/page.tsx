'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Download, Receipt, RefreshCw, TrendingUp as TrendingUpIcon, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { OrderList } from '@/components/dashboard/order-list'

interface RewardsData {
  pointsBalance: number
  currentTier: 'Free' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  nextTier: 'Free' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | null
  amountToNextTier: number
  progress: number
  tierInfo: {
    name: string
    color: string
    pointsPerDollar: number
    benefits: string[]
  }
}

interface Stats {
  totalOrders: number
  totalSpent: number
  averageOrder: number
  pendingOrders: number
  rewards?: RewardsData
}

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  total_price: string | number
}

interface Order {
  id: string
  order_number: string
  created_at: string
  total_amount: string | number
  subtotal: string | number
  shipping_amount: string | number
  discount_amount?: string | number
  discount_code_id?: string
  item_count: number
  items?: OrderItem[]
  shipped_at?: string
  payment_date?: string
  payment_verified_at?: string
  payment_status?: string
  payment_method?: string
  payment_url?: string
  assigned_wallet_id?: string
  transaction_hash?: string
  expected_payment_amount?: string | number
  shipping_address_line1?: string
  shipping_city?: string
  shipping_state?: string
  shipping_zip?: string
  shipping_country?: string
  tracking_number?: string
  shipping_carrier?: string
}

export default function OrdersPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const { toast } = useToast()

  // Fetch customer stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/customer/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders/my-orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders:', response.status)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Download bulk order history
  const downloadBulkHistory = async () => {
    try {
      const response = await fetch(`/api/orders/download-bulk?year=${selectedYear}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `order-history-${selectedYear}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({ title: 'Success', description: 'Order history downloaded successfully' })
      } else {
        toast({ title: 'Error', description: 'Failed to download order history', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Bulk download error:', error)
      toast({ title: 'Error', description: 'Failed to download order history', variant: 'destructive' })
    }
  }

  // Download tax information
  const downloadTaxInfo = async () => {
    try {
      const response = await fetch(`/api/orders/download-tax?year=${selectedYear}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tax-information-${selectedYear}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({ title: 'Success', description: 'Tax information downloaded successfully' })
      } else {
        toast({ title: 'Error', description: 'Failed to download tax information', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Tax download error:', error)
      toast({ title: 'Error', description: 'Failed to download tax information', variant: 'destructive' })
    }
  }

  useEffect(() => {
    Promise.all([fetchStats(), fetchOrders()])
  }, [])

  // Get available years for filtering
  const availableYears = Array.from(
    new Set(orders.map(o => new Date(o.created_at).getFullYear()))
  ).sort((a, b) => b - a)

  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear())
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 md:px-20 py-12 md:py-24 max-w-[1400px]">
        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-16 md:mb-24 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white">Orders</h1>
          <p className="text-xl text-white/50">View your order history and track shipments.</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-4 mb-16 md:mb-24">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <CardHeader className="pb-6">
                  <Skeleton className="h-5 w-32 mb-4 bg-white/10" />
                  <Skeleton className="h-14 w-48 bg-white/10" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : stats && (
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-4 mb-16 md:mb-24">
            <Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-white/50" strokeWidth={2} />
                  <CardDescription className="text-sm md:text-base font-medium uppercase tracking-wider text-white/50">Total Orders</CardDescription>
                </div>
                <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                  {stats.totalOrders}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUpIcon className="h-5 w-5 text-white/50" strokeWidth={2} />
                  <CardDescription className="text-sm md:text-base font-medium uppercase tracking-wider text-white/50">Total Spent</CardDescription>
                </div>
                <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                  ${stats.totalSpent.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUpIcon className="h-5 w-5 text-white/50" strokeWidth={2} />
                  <CardDescription className="text-sm md:text-base font-medium uppercase tracking-wider text-white/50">Average Order</CardDescription>
                </div>
                <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                  ${stats.averageOrder.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-white/50" strokeWidth={2} />
                  <CardDescription className="text-sm md:text-base font-medium uppercase tracking-wider text-white/50">Pending</CardDescription>
                </div>
                <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                  {stats.pendingOrders}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Download Options */}
        <Card id="downloads" className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-16 md:mb-24 scroll-mt-24">
          <CardHeader className="pb-8">
            <CardTitle className="text-4xl md:text-5xl font-bold text-white">Download Options</CardTitle>
            <CardDescription className="text-lg md:text-xl mt-3 font-light text-white/50">Export your order history and tax documents</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex flex-col space-y-4">
                <label className="text-sm font-medium uppercase tracking-wider text-white/50">Select Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-16 px-6 border-0 rounded-2xl bg-white/[0.05] text-white text-lg hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year} style={{ backgroundColor: '#18181b', color: 'white' }}>{year}</option>
                  ))}
                </select>
              </div>
              <div 
                onClick={downloadBulkHistory}
                className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.08] group-hover:bg-white/[0.12]">
                  <Download className="w-6 h-6 text-white/70" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Order History</h4>
                  <p className="text-sm text-white/50">Download all orders as PDF</p>
                </div>
              </div>
              <div 
                onClick={downloadTaxInfo}
                className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] cursor-pointer transition-all duration-300 group"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.08] group-hover:bg-white/[0.12]">
                  <Receipt className="w-6 h-6 text-white/70" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Tax Information</h4>
                  <p className="text-sm text-white/50">Export tax documents</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order List Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Order History</h2>
              <p className="text-base md:text-lg mt-3 font-light text-white/50">View and manage your orders</p>
            </div>
            <button 
              onClick={fetchOrders} 
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white transition-all duration-300 border border-white/10"
            >
              <RefreshCw className="w-5 h-5 text-white/70" />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
          <OrderList 
            orders={orders} 
            loading={loading} 
            totalSpent={stats?.totalSpent ?? 0} 
          />
        </section>
      </main>
    </div>
  )
}

