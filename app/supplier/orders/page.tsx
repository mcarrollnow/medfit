"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ShoppingCart,
  ArrowLeft,
  Search,
  Package,
  ChevronDown,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Edit3,
  Save,
  X,
  User,
  ClipboardList,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupplierOrders, updateSupplierOrder, type SupplierOrder } from "@/app/actions/supplier-portal"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

const FILTER_TABS = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
]

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<SupplierOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [supplierId, setSupplierId] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", session.user.id)
          .single()
        if (dbUser) setSupplierId(dbUser.id)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (!supplierId) return
    async function loadOrders() {
      setIsLoading(true)
      try {
        const data = await getSupplierOrders(supplierId!, statusFilter)
        setOrders(data)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrders()
  }, [supplierId, statusFilter])

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const customerName = `${order.customers?.first_name || ""} ${order.customers?.last_name || ""}`.toLowerCase()
    return (
      order.order_number.toLowerCase().includes(q) ||
      customerName.includes(q) ||
      order.customers?.company_name?.toLowerCase().includes(q)
    )
  })

  const handleSaveNotes = async (orderId: string) => {
    if (!supplierId) return
    const result = await updateSupplierOrder(supplierId, orderId, { notes: editNotes })
    if (result.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, notes: editNotes } : o))
      setEditingOrder(null)
    }
  }

  const getCustomerName = (order: SupplierOrder) => {
    const c = order.customers
    if (!c) return "Unknown"
    const first = c.users?.first_name || c.first_name || ""
    const last = c.users?.last_name || c.last_name || ""
    return `${first} ${last}`.trim() || "Unknown"
  }

  // Stats
  const totalOrders = orders.length
  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.status)).length
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-button rounded-2xl p-6 inline-block mb-6">
            <ShoppingCart className="h-8 w-8 animate-pulse" />
          </div>
          <p className="text-muted-foreground font-mono">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/supplier"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mb-16"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-mono tracking-wide">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <p className="text-sm md:text-base font-mono tracking-[0.3em] text-muted-foreground uppercase mb-6">
            Customer Orders
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Orders
            <br />
            <span className="italic text-muted-foreground">Track and manage your customer orders</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 mb-16">
          {[
            { value: totalOrders, label: "Total Orders" },
            { value: activeOrders, label: "Active" },
            { value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label: "Revenue" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="glass-button rounded-2xl p-4 md:p-6 inline-block mb-4">
                <Package className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <p className="font-mono text-2xl md:text-3xl font-light mb-2">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or customer..."
              className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "px-4 py-3 rounded-xl font-mono text-sm whitespace-nowrap transition-all",
                  statusFilter === tab.value
                    ? "bg-foreground text-background"
                    : "glass-button text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const isExpanded = expandedOrder === order.id
            const isEditing = editingOrder === order.id

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-6 md:p-8 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="glass-button rounded-xl p-3">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-mono text-lg font-light">{order.order_number}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.06] border border-white/[0.1]">
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {getCustomerName(order)}
                            {order.customers?.company_name && ` — ${order.customers.company_name}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                      {!['shipped', 'delivered', 'cancelled'].includes(order.status) && (
                        <Link
                          href={`/fulfill/${order.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background font-mono text-sm hover:bg-foreground/90 transition-colors"
                        >
                          <ClipboardList className="h-4 w-4" />
                          <span className="hidden md:inline">Fulfill</span>
                        </Link>
                      )}
                      <div className="text-right">
                        <p className="font-mono text-xl font-light">${Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )} />
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/[0.08] p-6 md:p-8 space-y-8">
                    {/* Order Items */}
                    <div>
                      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
                        Order Items
                      </p>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl p-4"
                          >
                            <div>
                              <p className="text-foreground">{item.product_name}</p>
                              <p className="text-sm text-muted-foreground font-mono">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-mono text-foreground">${Number(item.total_price).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div>
                        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
                          Tracking
                        </p>
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-mono text-foreground">{order.tracking_number}</p>
                              <p className="text-sm text-muted-foreground">{order.carrier || "Unknown carrier"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Status */}
                    <div>
                      <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
                        Payment
                      </p>
                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <span className="font-mono">
                              {order.payment_status === "paid" ? "Paid" : "Pending"}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground font-mono">
                            {order.payment_method || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes (Editable) */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                          Notes
                        </p>
                        {!isEditing ? (
                          <button
                            onClick={() => {
                              setEditingOrder(order.id)
                              setEditNotes(order.notes || "")
                            }}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSaveNotes(order.id)}
                              className="flex items-center gap-1 text-sm text-foreground hover:text-white transition-colors"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingOrder(null)}
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:border-white/20 transition-colors resize-none"
                          placeholder="Add notes..."
                        />
                      ) : (
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                          <p className="text-muted-foreground font-mono text-sm">
                            {order.notes || "No notes"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-white/[0.08] pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-mono">${Number(order.subtotal).toFixed(2)}</span>
                      </div>
                      {Number(order.discount_amount) > 0 && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-mono">-${Number(order.discount_amount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/[0.08]">
                        <span className="text-foreground font-light">Total</span>
                        <span className="font-mono text-xl font-light">${Number(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-24">
            <div className="glass-button rounded-2xl p-6 inline-block mb-6">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-mono">
              {searchQuery ? "No orders match your search" : "No orders yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
