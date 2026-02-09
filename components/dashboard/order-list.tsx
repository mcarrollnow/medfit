"use client"

import { OrderCard } from "@/components/dashboard/order-card"
import { Package } from "lucide-react"
import { calculateTier, REWARD_TIERS } from "@/lib/rewards-tiers"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  total_price: string | number
  unit_price?: string | number
}

interface ApiOrder {
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
  status?: string
  shipped_at?: string
  payment_date?: string
  payment_verified_at?: string
  payment_status?: string
  payment_method?: string
  payment_url?: string
  assigned_wallet_id?: string
  shipping_address_line1?: string
  shipping_city?: string
  shipping_state?: string
  shipping_zip?: string
  shipping_country?: string
  tracking_number?: string
  shipping_carrier?: string
  transaction_hash?: string
  expected_payment_amount?: string | number
}

interface OrderListProps {
  orders: ApiOrder[]
  loading?: boolean
  totalSpent?: number
}

// Format payment method for display
function formatPaymentMethod(method?: string): string {
  if (!method) return 'Pending'
  
  switch (method.toLowerCase()) {
    case 'card':
      return 'Credit Card'
    case 'crypto':
      return 'Cryptocurrency'
    case 'zelle':
      return 'Zelle'
    case 'ach':
      return 'Bank Transfer'
    case 'paypal':
      return 'PayPal'
    case 'venmo':
      return 'Venmo'
    default:
      // Handle wallet payments like 'wallet_usdc', 'wallet_eth'
      if (method.startsWith('wallet_')) {
        const currency = method.replace('wallet_', '').toUpperCase()
        return `Crypto Wallet (${currency})`
      }
      return method
  }
}

// Transform API order to OrderCard format
function transformOrder(order: ApiOrder, totalSpentBefore: number) {
  const total = typeof order.total_amount === 'string' 
    ? parseFloat(order.total_amount) 
    : (order.total_amount || 0)

  // Calculate points for this order based on tier at time of purchase
  const tierAtPurchase = calculateTier(totalSpentBefore)
  const tierInfo = REWARD_TIERS[tierAtPurchase]
  const pointsEarned = Math.floor(total * tierInfo.pointsPerDollar)

  // Determine status display
  const getStatusDisplay = () => {
    if (order.shipped_at) return "Shipped"
    if (order.status === 'delivered') return "Delivered"
    if (order.payment_date || order.payment_verified_at || order.payment_status === 'confirmed' || order.payment_status === 'paid') return "Paid"
    if (order.payment_url || order.payment_method === 'crypto' || order.assigned_wallet_id) return "Awaiting Payment"
    if (order.status === 'cancelled') return "Cancelled"
    return "Preparing to ship"
  }

  // Build timeline based on order state
  const buildTimeline = () => {
    const timeline = [
      { 
        status: "Order Placed", 
        date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), 
        completed: true 
      },
      { 
        status: "Payment Confirmed", 
        date: order.payment_date ? new Date(order.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null, 
        completed: !!(order.payment_date || order.payment_verified_at || order.payment_status === 'confirmed' || order.payment_status === 'paid')
      },
      { 
        status: "Preparing to ship", 
        date: null, 
        completed: !!(order.payment_date || order.payment_verified_at || order.payment_status === 'confirmed' || order.payment_status === 'paid') 
      },
      { 
        status: "Shipped", 
        date: order.shipped_at ? new Date(order.shipped_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null, 
        completed: !!order.shipped_at 
      },
      { 
        status: "Delivered", 
        date: null, 
        completed: order.status === 'delivered' 
      },
    ]
    return timeline
  }

  // Transform items
  const transformedItems = (order.items || []).map(item => ({
    name: item.product_name,
    quantity: item.quantity,
    price: `$${(typeof item.total_price === 'string' ? parseFloat(item.total_price) : item.total_price).toFixed(2)}`
  }))

  // If no items loaded yet, show placeholder
  if (transformedItems.length === 0) {
    transformedItems.push({
      name: `${order.item_count} item${order.item_count !== 1 ? 's' : ''}`,
      quantity: order.item_count,
      price: `$${total.toFixed(2)}`
    })
  }

  return {
    id: order.order_number || order.id,
    dbId: order.id, // Actual database UUID for API calls
    date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: getStatusDisplay(),
    total: `$${total.toFixed(2)}`,
    items: transformedItems,
    tracking: {
      carrier: order.shipping_carrier || "USPS",
      number: order.tracking_number || "Pending",
      estimated_delivery: order.shipped_at 
        ? new Date(new Date(order.shipped_at).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : "TBD",
    },
    payment: {
      method: formatPaymentMethod(order.payment_method),
      hash: order.transaction_hash || (order.assigned_wallet_id ? 'Pending...' : 'N/A'),
      amount: order.payment_method === 'card' 
        ? `$${total.toFixed(2)}`
        : (order.expected_payment_amount 
          ? `${order.expected_payment_amount} ETH` 
          : `$${total.toFixed(2)}`),
      status: order.payment_status === 'confirmed' || order.payment_status === 'paid' || order.payment_date ? 'Confirmed' : 'Pending',
    },
    timeline: buildTimeline(),
    points_earned: pointsEarned,
    // Keep original data for any additional needs
    _original: order,
  }
}

export function OrderList({ orders, loading = false, totalSpent = 0 }: OrderListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-white/60 text-base font-light">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mx-auto mb-6">
          <Package className="h-10 w-10 text-white/60" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
        <p className="text-white/60 font-light">Your orders will appear here once you make a purchase.</p>
      </div>
    )
  }

  // Sort orders by date (newest first) and calculate running total for points
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  // Calculate running totals for accurate points calculation
  let runningTotal = 0
  const ordersWithRunningTotal = sortedOrders.map(order => {
    const orderWithTotal = { order, totalBefore: runningTotal }
    const amount = typeof order.total_amount === 'string' 
      ? parseFloat(order.total_amount) 
      : (order.total_amount || 0)
    
    // Only add to running total if order is paid
    if (order.payment_date || order.payment_verified_at || order.payment_status === 'confirmed' || order.payment_status === 'paid') {
      runningTotal += amount
    }
    return orderWithTotal
  })

  // Reverse to show newest first
  ordersWithRunningTotal.reverse()

  return (
    <div className="grid gap-6">
      {ordersWithRunningTotal.map(({ order, totalBefore }) => (
        <OrderCard key={order.id} order={transformOrder(order, totalBefore)} />
      ))}
    </div>
  )
}
