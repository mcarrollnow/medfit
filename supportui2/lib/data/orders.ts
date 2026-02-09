import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export async function getOrderById(orderId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*),
      timeline:order_timeline(*),
      customer:customers(*)
    `)
    .eq("id", orderId)
    .single()

  if (error) {
    console.error("[v0] Error fetching order:", error)
    return null
  }

  return order
}

export async function getOrdersByCustomerId(customerId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*),
      timeline:order_timeline(*)
    `)
    .eq("customer_id", customerId)
    .order("order_date", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching orders:", error)
    return []
  }

  return orders || []
}

export async function searchOrders(query: string) {
  const supabase = getSupabaseBrowserClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:customers(*),
      items:order_items(*)
    `)
    .or(`order_number.ilike.%${query}%,tracking_number.ilike.%${query}%`)
    .limit(20)

  if (error) {
    console.error("[v0] Error searching orders:", error)
    return []
  }

  return orders || []
}

export async function createOrder(orderData: {
  customer_id: string
  order_number: string
  total: number
  subtotal: number
  shipping?: number
  tax?: number
  status?: string
  wallet_address?: string
  tracking_number?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  timeline: Array<{
    status: string
    date: string
    time: string
    completed: boolean
  }>
}) {
  const supabase = getSupabaseBrowserClient()

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: orderData.customer_id,
      order_number: orderData.order_number,
      total: orderData.total,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      status: orderData.status || "processing",
      wallet_address: orderData.wallet_address,
      tracking_number: orderData.tracking_number,
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error("[v0] Error creating order:", orderError)
    return null
  }

  // Create order items
  const itemsWithOrderId = orderData.items.map((item) => ({
    ...item,
    order_id: order.id,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(itemsWithOrderId)

  if (itemsError) {
    console.error("[v0] Error creating order items:", itemsError)
  }

  // Create timeline
  const timelineWithOrderId = orderData.timeline.map((step) => ({
    ...step,
    order_id: order.id,
  }))

  const { error: timelineError } = await supabase.from("order_timeline").insert(timelineWithOrderId)

  if (timelineError) {
    console.error("[v0] Error creating timeline:", timelineError)
  }

  // Update customer stats
  await updateCustomerStats(orderData.customer_id)

  return order
}

async function updateCustomerStats(customerId: string) {
  const supabase = getSupabaseBrowserClient()

  // Get all orders for customer
  const { data: orders } = await supabase.from("orders").select("total").eq("customer_id", customerId)

  if (!orders) return

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

  // Update customer
  await supabase
    .from("customers")
    .update({
      total_orders: totalOrders,
      total_spent: totalSpent,
      average_order_value: averageOrderValue,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId)
}
