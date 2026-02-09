"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { format, subDays } from "date-fns"
import { getActivePricingFormula } from "./pricing-formula"

export interface RepOrder {
  id: string
  customer: {
    id: string
    name: string
    email: string
  }
  date: string
  status: string
  total: number
  commission: number
  items: {
    id: string
    productName: string
    quantity: number
    price: number
    commission: number
  }[]
  tracking?: {
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
    timeline: {
      status: string
      date: string
      description: string
      location?: string
    }[]
  }
}

export interface EarningsData {
  date: string
  amount: number
}

export interface CustomerInsight {
  id: string
  name: string
  totalSpent: number
  orderCount: number
  lastOrder: string
  isRepeat: boolean
}

export interface RepStats {
  totalEarnings: number
  pendingCommission: number
  activeOrders: number
  totalCustomers: number
  earningsHistory: EarningsData[]
  customerInsights: CustomerInsight[]
}

// Get orders for a specific rep
export async function getRepOrders(repId: string): Promise<RepOrder[]> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    console.log("[Rep] No supabase client, returning empty orders")
    return []
  }

  // Get customers assigned to this rep
  const { data: assignments, error: assignmentError } = await supabase
    .from("customer_rep_assignments")
    .select("customer_id")
    .eq("rep_id", repId)
    .eq("is_current", true)

  if (assignmentError || !assignments?.length) {
    console.log("[v0] No customer assignments found for rep:", repId)
    return []
  }

  const customerIds = assignments.map((a) => a.customer_id)

  // Get customers table entries to map to user_ids
  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("id, user_id")
    .in("id", customerIds)

  if (customersError || !customers?.length) {
    console.log("[v0] No customers found")
    return []
  }

  const userIds = customers.map((c) => c.user_id).filter(Boolean)
  const customerToUserMap = new Map(customers.map((c) => [c.id, c.user_id]))

  // Get user details
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .in("id", userIds)

  const userMap = new Map(
    (users || []).map((u) => [
      u.id,
      { name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown", email: u.email },
    ]),
  )

  // Get orders for these customers
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .in("customer_id", customerIds)
    .order("created_at", { ascending: false })

  if (ordersError || !orders?.length) {
    console.log("[v0] No orders found for rep's customers")
    return []
  }

  // Get order items for all orders
  const orderIds = orders.map((o) => o.id)
  console.log("[Rep] Fetching items for order IDs:", orderIds.slice(0, 5), "... total:", orderIds.length)
  
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds)

  console.log("[Rep] Order items fetched:", orderItems?.length || 0, "items, error:", itemsError)
  if (orderItems?.length > 0) {
    console.log("[Rep] Sample item fields:", Object.keys(orderItems[0]))
    console.log("[Rep] Sample item:", orderItems[0])
  }

  const itemsMap = new Map<string, any[]>()
  ;(orderItems || []).forEach((item) => {
    const existing = itemsMap.get(item.order_id) || []
    existing.push(item)
    itemsMap.set(item.order_id, existing)
  })

  // Get tracking info
  const { data: tracking, error: trackingError } = await supabase
    .from("order_tracking")
    .select("*")
    .in("order_id", orderIds)
    .order("created_at", { ascending: true })

  console.log("[Rep] Tracking fetched:", tracking?.length || 0, "entries, error:", trackingError)

  const trackingMap = new Map<string, any[]>()
  ;(tracking || []).forEach((t) => {
    const existing = trackingMap.get(t.order_id) || []
    existing.push(t)
    trackingMap.set(t.order_id, existing)
  })

  // Get pricing formula for commission calculation
  const pricingFormula = await getActivePricingFormula()
  const minMarkup = pricingFormula?.min_markup_multiplier || 2.0
  const maxMarkup = pricingFormula?.max_markup_multiplier || 4.0

  // Get rep's commission rate
  const { data: repUser } = await supabase
    .from("users")
    .select("commission_rate")
    .eq("id", repId)
    .single()
  
  const repCommissionRate = (repUser?.commission_rate || 10) / 100 // Convert to decimal

  // Get product costs for commission calculation
  const allProductIds = [...new Set((orderItems || []).map(item => item.product_id).filter(Boolean))]
  const { data: products } = await supabase
    .from("products")
    .select("id, cost_price")
    .in("id", allProductIds)
  
  const productCostMap = new Map((products || []).map(p => [p.id, Number(p.cost_price) || 0]))

  // Build rep orders with formula-based commission
  return orders.map((order) => {
    const userId = customerToUserMap.get(order.customer_id)
    const userInfo = userId ? userMap.get(userId) : null
    const items = itemsMap.get(order.id) || []
    const trackingEvents = trackingMap.get(order.id) || []

    // Get order total from various possible fields
    const orderTotal = Number(order.total_amount || order.subtotal || order.total || 0)
    const discountApplied = Number(order.discount_amount || 0)
    
    // Calculate commission using pricing formula
    let orderCommission = 0
    const itemsWithCommission = items.map((item) => {
      const itemPrice = Number(item.unit_price || item.price_at_time || item.price || item.total_price || 0)
      const itemQuantity = Number(item.quantity || 1)
      const itemTotal = itemPrice * itemQuantity
      
      // Get cost for this product
      const unitCost = productCostMap.get(item.product_id) || 0
      const itemCost = unitCost * itemQuantity
      
      // Calculate commission pool using pricing formula
      // Min price = cost × minMarkup (protected profit)
      // Max price = cost × maxMarkup (commission ceiling)
      const minPrice = itemCost * minMarkup
      const maxPrice = itemCost * maxMarkup
      const maxCommissionPool = maxPrice - minPrice
      
      // Commission pool = how much above min price, capped at max pool
      const rawCommissionPool = Math.max(0, itemTotal - minPrice)
      const commissionPool = Math.min(rawCommissionPool, maxCommissionPool)
      
      // Rep gets their percentage of the commission pool
      const itemCommission = commissionPool * repCommissionRate
      orderCommission += itemCommission
      
      return {
        id: item.id,
        productName: item.product_name || item.name || "Unknown Product",
        quantity: itemQuantity,
        price: itemTotal,
        commission: itemCommission,
      }
    })
    
    // Reduce commission by discount applied (discounts come from rep's pool)
    const discountImpact = discountApplied * repCommissionRate
    orderCommission = Math.max(0, orderCommission - discountImpact)
    
    console.log(`[Rep] Order ${order.id}: total=${orderTotal}, discount=${discountApplied}, commission=${orderCommission.toFixed(2)}`)

    return {
      id: order.id,
      customer: {
        id: order.customer_id,
        name: userInfo?.name || "Unknown Customer",
        email: userInfo?.email || "",
      },
      date: order.created_at,
      status: order.status || "pending",
      total: orderTotal,
      commission: orderCommission,
      items: itemsWithCommission,
      tracking:
        trackingEvents.length > 0
          ? {
              carrier: trackingEvents[0]?.carrier || "Unknown",
              trackingNumber: trackingEvents[0]?.tracking_number || "",
              estimatedDelivery: trackingEvents[0]?.estimated_delivery || "",
              timeline: trackingEvents.map((t) => ({
                status: t.status || "Update",
                date: t.created_at ? format(new Date(t.created_at), "MMM dd, HH:mm") : "",
                description: t.notes || "",
                location: t.location || "",
              })),
            }
          : undefined,
    }
  })
}

// Get rep statistics with formula-based commission calculation
export async function getRepStats(repId: string): Promise<RepStats> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return {
      totalEarnings: 0,
      pendingCommission: 0,
      activeOrders: 0,
      totalCustomers: 0,
      earningsHistory: [],
      customerInsights: [],
    }
  }

  // Get pricing formula and rep's commission rate
  const pricingFormula = await getActivePricingFormula()
  const minMarkup = pricingFormula?.min_markup_multiplier || 2.0
  const maxMarkup = pricingFormula?.max_markup_multiplier || 4.0

  const { data: repUser } = await supabase
    .from("users")
    .select("commission_rate")
    .eq("id", repId)
    .single()
  
  const repCommissionRate = (repUser?.commission_rate || 10) / 100

  // Get customers assigned to this rep
  const { data: assignments } = await supabase
    .from("customer_rep_assignments")
    .select("customer_id")
    .eq("rep_id", repId)
    .eq("is_current", true)

  const customerIds = (assignments || []).map((a) => a.customer_id)
  const totalCustomers = customerIds.length

  if (!customerIds.length) {
    return {
      totalEarnings: 0,
      pendingCommission: 0,
      activeOrders: 0,
      totalCustomers: 0,
      earningsHistory: [],
      customerInsights: [],
    }
  }

  // Get customer details
  const { data: customersData } = await supabase
    .from("customers")
    .select("id, user_id")
    .in("id", customerIds)

  const userIds = (customersData || []).map(c => c.user_id).filter(Boolean)
  const customerToUserMap = new Map((customersData || []).map(c => [c.id, c.user_id]))

  // Get user names
  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name")
    .in("id", userIds)

  const userMap = new Map(
    (users || []).map(u => [u.id, `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown"])
  )

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_amount, discount_amount, created_at, customer_id")
    .in("customer_id", customerIds)
    .order("created_at", { ascending: false })

  const allOrders = orders || []
  const orderIds = allOrders.map(o => o.id)

  // Get order items for all orders to calculate proper commission
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("order_id, product_id, unit_price, quantity")
    .in("order_id", orderIds)

  // Get product costs
  const allProductIds = [...new Set((orderItems || []).map(item => item.product_id).filter(Boolean))]
  const { data: products } = await supabase
    .from("products")
    .select("id, cost_price")
    .in("id", allProductIds)
  
  const productCostMap = new Map((products || []).map(p => [p.id, Number(p.cost_price) || 0]))

  // Group items by order
  const itemsByOrder = new Map<string, typeof orderItems>()
  ;(orderItems || []).forEach(item => {
    const existing = itemsByOrder.get(item.order_id) || []
    existing.push(item)
    itemsByOrder.set(item.order_id, existing)
  })

  // Calculate commission for each order using the pricing formula
  function calculateOrderCommission(order: { id: string; discount_amount?: number }): number {
    const items = itemsByOrder.get(order.id) || []
    const discountApplied = Number(order.discount_amount || 0)
    
    let totalCommissionPool = 0
    
    items.forEach(item => {
      const itemPrice = Number(item.unit_price || 0)
      const itemQuantity = Number(item.quantity || 1)
      const itemTotal = itemPrice * itemQuantity
      
      const unitCost = productCostMap.get(item.product_id) || 0
      const itemCost = unitCost * itemQuantity
      
      // Calculate commission pool using formula
      const minPrice = itemCost * minMarkup
      const maxPrice = itemCost * maxMarkup
      const maxCommissionPool = maxPrice - minPrice
      
      const rawCommissionPool = Math.max(0, itemTotal - minPrice)
      const commissionPool = Math.min(rawCommissionPool, maxCommissionPool)
      
      totalCommissionPool += commissionPool
    })
    
    // Deduct discount from commission pool
    const adjustedPool = Math.max(0, totalCommissionPool - discountApplied)
    
    // Rep gets their percentage
    return adjustedPool * repCommissionRate
  }

  // Calculate totals using formula-based commission
  const totalEarnings = allOrders
    .filter((o) => o.status === "completed" || o.status === "delivered")
    .reduce((acc, o) => acc + calculateOrderCommission(o), 0)

  const pendingCommission = allOrders
    .filter((o) => o.status === "processing" || o.status === "pending" || o.status === "shipped")
    .reduce((acc, o) => acc + calculateOrderCommission(o), 0)

  const activeOrders = allOrders.filter(
    (o) => o.status === "processing" || o.status === "pending" || o.status === "shipped",
  ).length

  // Calculate earnings history (last 30 days)
  const earningsHistory: EarningsData[] = []
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, "yyyy-MM-dd")
    const dayOrders = allOrders.filter((o) => {
      const orderDate = format(new Date(o.created_at), "yyyy-MM-dd")
      return orderDate === dateStr
    })
    const dayEarnings = dayOrders.reduce((acc, o) => acc + calculateOrderCommission(o), 0)
    earningsHistory.push({
      date: format(date, "MMM dd"),
      amount: dayEarnings,
    })
  }

  // Calculate customer insights
  const customerOrderMap = new Map<string, { totalSpent: number; orderCount: number; lastOrder: string }>()
  
  allOrders.forEach(order => {
    const existing = customerOrderMap.get(order.customer_id) || { totalSpent: 0, orderCount: 0, lastOrder: "" }
    existing.totalSpent += Number(order.total_amount || 0)
    existing.orderCount += 1
    if (!existing.lastOrder || new Date(order.created_at) > new Date(existing.lastOrder)) {
      existing.lastOrder = order.created_at
    }
    customerOrderMap.set(order.customer_id, existing)
  })

  const customerInsights: CustomerInsight[] = customerIds.map(customerId => {
    const userId = customerToUserMap.get(customerId)
    const name = userId ? userMap.get(userId) || "Unknown" : "Unknown"
    const orderData = customerOrderMap.get(customerId) || { totalSpent: 0, orderCount: 0, lastOrder: "" }
    
    return {
      id: customerId,
      name,
      totalSpent: orderData.totalSpent,
      orderCount: orderData.orderCount,
      lastOrder: orderData.lastOrder,
      isRepeat: orderData.orderCount > 1,
    }
  })

  return {
    totalEarnings,
    pendingCommission,
    activeOrders,
    totalCustomers,
    earningsHistory,
    customerInsights,
  }
}

// Get current rep info from authenticated session
export async function getCurrentRep(): Promise<{ id: string; name: string } | null> {
  const { getSupabaseServerClient } = await import("@/lib/supabase-server")
  
  try {
    const supabase = await getSupabaseServerClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log("[getCurrentRep] No authenticated user found")
      return null
    }
    
    console.log("[getCurrentRep] Auth user id:", user.id)
    
    // Look up the user in our users table by auth_id
    const { data: repUser, error: userError } = await supabase
      .from("users")
      .select("id, first_name, last_name, role")
      .eq("auth_id", user.id)
      .single()
    
    if (userError || !repUser) {
      console.log("[getCurrentRep] No user found for auth_id:", user.id, userError)
      return null
    }
    
    console.log("[getCurrentRep] Found user:", repUser.id, "role:", repUser.role)
    
    return {
      id: repUser.id,
      name: `${repUser.first_name || ""} ${repUser.last_name || ""}`.trim() || "Representative",
    }
  } catch (error) {
    console.error("[getCurrentRep] Error:", error)
    return null
  }
}

