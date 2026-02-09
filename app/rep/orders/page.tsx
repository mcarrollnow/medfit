'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, ChevronUp, Copy, ExternalLink, TrendingUp, TrendingDown, DollarSign, Package, Clock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getRepOrders, getRepStats, getCurrentRep, type RepOrder, type RepStats } from '@/app/actions/rep'
import { format } from 'date-fns'

interface OrderStats {
  totalOrders: number
  totalRevenue: number
  totalCommission: number
  pendingOrders: number
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    created: 'bg-white/10 text-white border-white/20',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    payment_received: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    payment_pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    payment_processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    payment_failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return colors[status] || colors.pending
}

export default function RepOrdersPage() {
  const [orders, setOrders] = useState<RepOrder[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const rep = await getCurrentRep()
      if (rep) {
        const [ordersData, repStats] = await Promise.all([
          getRepOrders(rep.id),
          getRepStats(rep.id)
        ])
        setOrders(ordersData)
        
        // Calculate order stats
        const totalRevenue = ordersData.reduce((sum, o) => sum + o.total, 0)
        const totalCommission = ordersData.reduce((sum, o) => sum + o.commission, 0)
        const pendingOrders = ordersData.filter(o => 
          o.status === 'pending' || o.status === 'processing' || o.status === 'payment_pending'
        ).length
        
        setStats({
          totalOrders: ordersData.length,
          totalRevenue,
          totalCommission,
          pendingOrders
        })
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusTabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-12 md:px-12 lg:px-24 md:py-16">
        {/* Back Navigation */}
        <Link
          href="/rep"
          className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-base font-medium">Back to Rep Portal</span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tighter text-white md:text-6xl">Orders</h1>
          <p className="text-xl text-white/50">Track and manage your customer orders.</p>
        </div>

        {/* Stats Cards */}
        {!loading && stats && (
          <section className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Overview</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-white/50">Total Revenue</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-white/40">From your customers</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-white/50">Total Orders</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">{stats.totalOrders}</p>
                  <p className="text-sm text-white/40">All time</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-sm font-medium text-white/50">Total Commission</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-emerald-400">${stats.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-white/40">Your earnings</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-400" />
                    </div>
                    <p className="text-sm font-medium text-white/50">Pending Orders</p>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">{stats.pendingOrders}</p>
                  <p className="text-sm text-white/40">Awaiting fulfillment</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
            <div className="relative z-10 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <Input
                  placeholder="Search by order ID, customer, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 rounded-xl"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap gap-3">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      statusFilter === tab.value
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Orders List */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Orders</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const isExpanded = expandedOrderId === order.id
                
                return (
                  <div 
                    key={order.id} 
                    className={`group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                      isExpanded 
                        ? 'border-white/20 bg-white/[0.08]' 
                        : 'border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/15'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
                    
                    {/* Collapsed View */}
                    {!isExpanded && (
                      <div 
                        className="relative z-10 p-6 cursor-pointer"
                        onClick={() => setExpandedOrderId(order.id)}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4 flex-wrap">
                              <h3 className="font-bold text-2xl tracking-tight text-white">#{order.id.slice(0, 8)}</h3>
                              <Badge className={`${getStatusColor(order.status)} text-xs font-bold px-3 py-1 uppercase tracking-wider border`}>
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <ChevronDown className="h-6 w-6 text-white/30 group-hover:text-white/50 transition-colors" />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Customer</p>
                              <p className="font-medium text-white">{order.customer.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Date</p>
                              <p className="font-medium text-white">{format(new Date(order.date), 'MMM dd, yyyy')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total</p>
                              <p className="font-bold text-lg text-white">${order.total.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Commission</p>
                              <p className="font-bold text-lg text-emerald-400">${order.commission.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expanded View */}
                    {isExpanded && (
                      <div className="relative z-10 p-8 space-y-8">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 flex-wrap">
                              <h3 className="font-bold text-4xl tracking-tight text-white">#{order.id.slice(0, 8)}</h3>
                              <Badge className={`${getStatusColor(order.status)} text-sm font-bold px-4 py-1.5 uppercase tracking-wider border`}>
                                {order.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-white/50 text-lg">{order.customer.name} • {order.customer.email}</p>
                          </div>
                          <Button
                            size="lg"
                            variant="ghost"
                            onClick={() => setExpandedOrderId(null)}
                            className="h-12 w-12 p-0 hover:bg-white/10 text-white/50 hover:text-white"
                          >
                            <ChevronUp className="h-6 w-6" />
                          </Button>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                          <h5 className="font-bold text-xl text-white">Items</h5>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-white/30" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{item.productName}</p>
                                <p className="text-sm text-white/50">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-white">${item.price.toFixed(2)}</p>
                                <p className="text-sm text-emerald-400">+${item.commission.toFixed(2)} commission</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Customer Info */}
                          <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                            <h5 className="font-bold text-lg text-white">Customer</h5>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-white/60" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{order.customer.name}</p>
                                <p className="text-sm text-white/50">{order.customer.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Commission Summary */}
                          <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                            <h5 className="font-bold text-lg text-white">Your Earnings</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-white/50">Order Total</span>
                                <span className="font-semibold text-white">${order.total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/50">Commission Rate</span>
                                <span className="font-semibold text-white">10%</span>
                              </div>
                              <div className="pt-3 border-t border-white/10">
                                <div className="flex justify-between">
                                  <span className="text-white/50">Your Commission</span>
                                  <span className="text-2xl font-bold text-emerald-400">${order.commission.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tracking Info */}
                        {order.tracking && (
                          <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                            <h5 className="font-bold text-lg text-white">Shipping</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-white/50">Carrier</span>
                                <span className="font-semibold text-white">{order.tracking.carrier}</span>
                              </div>
                              {order.tracking.trackingNumber && (
                                <>
                                  <p className="text-sm text-white/40">Tracking Number</p>
                                  <code className="bg-black/30 px-3 py-2 rounded-lg text-white font-mono text-sm block break-all">
                                    {order.tracking.trackingNumber}
                                  </code>
                                  <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                      variant="outline"
                                      onClick={() => copyToClipboard(order.tracking!.trackingNumber)}
                                      className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => window.open(`https://track.example.com/${order.tracking!.trackingNumber}`, '_blank')}
                                      className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Track
                                    </Button>
                                  </div>
                                </>
                              )}
                              {order.tracking.estimatedDelivery && (
                                <div className="flex justify-between pt-3 border-t border-white/10">
                                  <span className="text-white/50">Est. Delivery</span>
                                  <span className="font-semibold text-emerald-400">{order.tracking.estimatedDelivery}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timeline */}
                        {order.tracking?.timeline && order.tracking.timeline.length > 0 && (
                          <div className="space-y-4">
                            <h5 className="font-bold text-xl text-white">Order Timeline</h5>
                            <div className="relative ml-4">
                              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10" />
                              <div className="space-y-6">
                                {order.tracking.timeline.map((step, idx) => (
                                  <div key={idx} className="relative pl-10">
                                    <div 
                                      className={`absolute left-[-8px] top-[6px] w-[18px] h-[18px] rounded-full border-2 transition-all ${
                                        step.status ? 'bg-white border-white' : 'bg-black border-white/20'
                                      }`} 
                                    />
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                      <span className="font-medium text-white">
                                        {step.status}
                                      </span>
                                      {step.date && (
                                        <span className="text-sm font-mono text-white/60">
                                          {step.date}
                                        </span>
                                      )}
                                    </div>
                                    {step.description && (
                                      <p className="text-sm text-white/40 mt-1">{step.description}</p>
                                    )}
                                    {step.location && (
                                      <p className="text-sm text-white/40">{step.location}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!loading && filteredOrders.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur-xl text-center">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
              <Package className="h-12 w-12 text-white/20 mx-auto mb-4 relative z-10" />
              <p className="relative z-10 text-2xl font-light text-white/50">
                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
              </p>
              <p className="relative z-10 text-white/30 mt-2">
                {orders.length === 0 ? 'Orders from your customers will appear here' : 'Try adjusting your search or filters'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

