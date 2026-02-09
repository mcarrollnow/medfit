"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/supply-store/glass-card"
import { GlassButton } from "@/components/supply-store/glass-button"
import { formatPrice } from "@/lib/supply-store/cart"
import type { SupplyStoreOrder } from "@/lib/supply-store/types"
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const statusIcons = {
  pending: Clock,
  processing: AlertCircle,
  paid: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle,
}

const statusColors = {
  pending: "text-yellow-400",
  processing: "text-blue-400",
  paid: "text-green-400",
  shipped: "text-blue-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
  refunded: "text-orange-400",
}

export default function SupplyStoreOrdersPage() {
  const [orders, setOrders] = useState<SupplyStoreOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/supply-store/orders")
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-white/5 rounded-xl w-48 mb-8" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen px-6 py-24 flex items-center justify-center">
        <GlassCard padding="lg" className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
          <p className="text-muted-foreground mb-8">
            You haven&apos;t placed any orders yet. Browse our catalog to find professional-grade equipment for your facility.
          </p>
          <Link href="/supply-store/products">
            <GlassButton variant="primary" size="lg" className="gap-2">
              Browse Products
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status]
            const statusColor = statusColors[order.status]
            
            return (
              <Link key={order.id} href={`/supply-store/orders/${order.id}`}>
                <GlassCard hover padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${statusColor}`}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Order {order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} bg-white/5`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                      {order.tracking_number && (
                        <p className="text-xs text-muted-foreground">
                          Tracking: {order.tracking_number}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

