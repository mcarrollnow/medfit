"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

// Types based on actual database schema
export interface Customer {
  id: string
  user_id: string | null
  first_name: string | null
  last_name: string | null
  company_name: string | null
  customer_type: "retail" | "b2b" | "b2bvip"
  phone: string | null
  shipping_address_line1: string | null
  shipping_address_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  shipping_country: string | null
  billing_address_line1: string | null
  billing_address_line2: string | null
  billing_city: string | null
  billing_state: string | null
  billing_zip: string | null
  billing_country: string | null
  notes: string | null
  created_at: string
  updated_at: string
  wallet_addresses: Array<{
    address: string
    last_used: string
    first_used: string
    last_order_id: string
    first_order_id: string
  }>
  rep_id: string | null
  default_wallet_id: string | null
  sms_enabled: boolean
  sms_opted_in_at: string | null
  sms_opted_out_at: string | null
  // Referral fields
  referral_code: string | null
  referred_by_code: string | null
  referred_by_customer_id: string | null
  rewards_tier: string | null
  custom_referral_discount: number | null
  // Reward points fields
  reward_points: number
  lifetime_points_earned: number
  total_points_earned: number
  total_points_redeemed: number
  // Joined data
  user?: { id: string; email: string; first_name?: string; last_name?: string; role?: string }
  rep?: { id: string; email: string; first_name?: string; last_name?: string; role?: string }
  default_wallet?: { id: string; label: string }
}

export interface BusinessWallet {
  id: string
  label: string
  wallet_address: string
  network: string
  is_active: boolean
  description: string | null
  created_at: string
  updated_at: string
}

export interface Rep {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
}

export interface Order {
  id: string
  customer_id: string
  status: string
  total: number
  total_amount?: number
  items: any[]
  created_at: string
  updated_at: string
  admin_notes?: string
  tracking_number?: string
  carrier?: string
  shipped_at?: string
  refunded_at?: string
  refund_reason?: string
  stripe_payment_intent_id?: string
  // Refund tracking fields
  refund_id?: string
  refund_amount?: number
  refund_status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  refund_destination?: 'original_payment' | 'store_credit' | 'manual'
  refund_customer_message?: string
  refund_initiated_at?: string
  refund_completed_at?: string
}

export interface SupportTicket {
  id: string
  customer_id: string
  subject: string
  status: string
  priority: string
  created_at: string
  updated_at: string
}

export async function getCustomers() {
  const supabase = getSupabaseAdminClient()
  const timestamp = new Date().toISOString()
  console.log("[admin] getCustomers - called at:", timestamp, "supabase admin client:", supabase ? "connected" : "null")

  // Only select the columns we need for the list view (avoid large JSONB fields like wallet_addresses)
  const { data: customers, error } = await supabase
    .from("customers")
    .select(`
      id,
      user_id,
      first_name,
      last_name,
      company_name,
      customer_type,
      phone,
      shipping_address_line1,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
      notes,
      rep_id,
      default_wallet_id,
      sms_enabled,
      referral_code,
      reward_points,
      created_at,
      updated_at,
      wallet_addresses
    `)
    .order("created_at", { ascending: false })

  console.log("[admin] getCustomers - query result:", { count: customers?.length, error })
  
  // Log a sample customer to verify fresh data
  if (customers && customers.length > 0) {
    const sample = customers[0]
    console.log("[admin] getCustomers - sample customer:", { 
      id: sample.id, 
      phone: sample.phone, 
      notes: sample.notes?.substring(0, 50),
      updated_at: sample.updated_at 
    })
  }

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  if (!customers || customers.length === 0) return []

  // Fetch user data for all customers
  const userIds = customers.map((c) => c.user_id).filter(Boolean)
  const repIds = customers.map((c) => c.rep_id).filter(Boolean)
  const walletIds = customers.map((c) => c.default_wallet_id).filter(Boolean)

  const allUserIds = [...new Set([...userIds, ...repIds])]

  // Run both queries in PARALLEL instead of sequentially
  const [usersResult, walletsResult] = await Promise.all([
    allUserIds.length > 0 
      ? supabase
          .from("users")
          .select("id, email, first_name, last_name, role")
          .in("id", allUserIds)
      : Promise.resolve({ data: null }),
    walletIds.length > 0
      ? supabase.from("business_wallets").select("id, label").in("id", walletIds)
      : Promise.resolve({ data: null })
  ])

  const usersMap: Record<string, any> = usersResult.data 
    ? Object.fromEntries(usersResult.data.map((u) => [u.id, u]))
    : {}
  
  const walletsMap: Record<string, any> = walletsResult.data
    ? Object.fromEntries(walletsResult.data.map((w) => [w.id, w]))
    : {}

  // Combine data
  return customers.map((customer) => ({
    ...customer,
    user: customer.user_id ? usersMap[customer.user_id] : null,
    rep: customer.rep_id ? usersMap[customer.rep_id] : null,
    default_wallet: customer.default_wallet_id ? walletsMap[customer.default_wallet_id] : null,
  }))
}

export async function getCustomerById(id: string) {
  const supabase = getSupabaseAdminClient()

  const { data: customer, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error || !customer) {
    console.error("Error fetching customer:", error)
    return null
  }

  // Fetch related data in parallel
  const [userResult, repResult, walletResult] = await Promise.all([
    customer.user_id
      ? supabase.from("users").select("id, email, first_name, last_name, role").eq("id", customer.user_id).single()
      : Promise.resolve({ data: null }),
    customer.rep_id
      ? supabase.from("users").select("id, email, first_name, last_name, role").eq("id", customer.rep_id).single()
      : Promise.resolve({ data: null }),
    customer.default_wallet_id
      ? supabase.from("business_wallets").select("id, label").eq("id", customer.default_wallet_id).single()
      : Promise.resolve({ data: null }),
  ])

  return {
    ...customer,
    user: userResult.data,
    rep: repResult.data,
    default_wallet: walletResult.data,
  }
}

export async function getReps() {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, role")
    .in("role", ["rep", "admin"])
    .order("first_name")

  if (error) {
    console.error("Error fetching reps:", error)
    return []
  }

  return data || []
}

export async function getBusinessWallets() {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase.from("business_wallets").select("*").eq("is_active", true).order("label")

  if (error) {
    console.error("Error fetching business wallets:", error)
    return []
  }

  return data || []
}

export async function getCustomerOrders(customerId: string) {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      refund_id,
      refund_amount,
      refund_status,
      refund_destination,
      refund_customer_message,
      refund_initiated_at,
      refund_completed_at
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customer orders:", error)
    return []
  }

  return data || []
}

export async function getCustomerSupportTickets(customerId: string) {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching support tickets:", error)
    return []
  }

  return data || []
}

// Consolidated fetch for customer detail page - reduces HTTP roundtrips
export async function getCustomerDetailData(customerId: string) {
  const supabase = getSupabaseAdminClient()

  // Fetch everything in parallel
  const [
    customerResult,
    repsResult,
    walletsResult,
    ordersResult,
    ticketsResult,
    discountsResult,
    availableDiscountsResult,
  ] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).single(),
    supabase.from("users").select("id, email, first_name, last_name, role").in("role", ["rep", "admin"]).order("first_name"),
    supabase.from("business_wallets").select("*").eq("is_active", true).order("label"),
    supabase.from("orders").select("*, refund_id, refund_amount, refund_status, refund_destination, refund_customer_message, refund_initiated_at, refund_completed_at").eq("customer_id", customerId).order("created_at", { ascending: false }),
    supabase.from("support_tickets").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
    supabase.from("customer_assigned_discounts").select("*, discount_codes(code)").eq("customer_id", customerId).order("created_at", { ascending: false }),
    supabase.from("discount_codes").select("*").order("code"),
  ])

  const customer = customerResult.data
  if (!customer) {
    return null
  }

  // Fetch user/rep/wallet data for the customer in parallel
  const [userResult, repResult, walletResult] = await Promise.all([
    customer.user_id
      ? supabase.from("users").select("id, email, first_name, last_name, role").eq("id", customer.user_id).single()
      : Promise.resolve({ data: null }),
    customer.rep_id
      ? supabase.from("users").select("id, email, first_name, last_name, role").eq("id", customer.rep_id).single()
      : Promise.resolve({ data: null }),
    customer.default_wallet_id
      ? supabase.from("business_wallets").select("id, label").eq("id", customer.default_wallet_id).single()
      : Promise.resolve({ data: null }),
  ])

  const assignedDiscounts = (discountsResult.data || []).map((d: any) => ({
    id: d.id,
    customer_id: d.customer_id,
    discount_code_id: d.discount_code_id,
    discount_code: d.discount_codes?.code || null,
    custom_discount_type: d.custom_discount_type,
    custom_discount_value: d.custom_discount_value,
    custom_description: d.custom_description,
    status: d.status,
    expires_at: d.expires_at,
    created_at: d.created_at,
    assigned_by_admin_id: d.assigned_by_admin_id,
    assigned_by_rep_id: d.assigned_by_rep_id,
  }))

  return {
    customer: {
      ...customer,
      user: userResult.data,
      rep: repResult.data,
      default_wallet: walletResult.data,
    },
    reps: repsResult.data || [],
    wallets: walletsResult.data || [],
    orders: ordersResult.data || [],
    tickets: ticketsResult.data || [],
    assignedDiscounts,
    availableDiscounts: availableDiscountsResult.data || [],
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("customers")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating customer:", error)
    return { error: error.message }
  }

  return { data }
}

export async function assignRepToCustomer(customerId: string, repId: string | null) {
  const supabase = getSupabaseAdminClient()

  // Update the customer's rep_id
  const { error: updateError } = await supabase
    .from("customers")
    .update({
      rep_id: repId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId)

  if (updateError) {
    console.error("Error assigning rep:", updateError)
    return { error: updateError.message }
  }

  // Also update customer_rep_assignments table
  if (repId) {
    // Mark any existing assignments as not current
    await supabase
      .from("customer_rep_assignments")
      .update({ is_current: false, unassigned_at: new Date().toISOString() })
      .eq("customer_id", customerId)
      .eq("is_current", true)

    // Create new assignment
    await supabase.from("customer_rep_assignments").insert({
      customer_id: customerId,
      rep_id: repId,
      assigned_at: new Date().toISOString(),
      is_current: true,
    })
  } else {
    // Unassign - mark current assignment as not current
    await supabase
      .from("customer_rep_assignments")
      .update({ is_current: false, unassigned_at: new Date().toISOString() })
      .eq("customer_id", customerId)
      .eq("is_current", true)
  }

  return { success: true }
}

export async function assignWalletToCustomer(customerId: string, walletId: string | null) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("customers")
    .update({
      default_wallet_id: walletId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId)

  if (error) {
    console.error("Error assigning wallet:", error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getOrderItems(orderId: string) {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId)

  if (error) {
    console.error("Error fetching order items:", error)
    return []
  }

  return data || []
}

export async function getOrderTimeline(orderId: string) {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("order_tracking")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching order timeline:", error)
    return []
  }

  return data || []
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    return { error: error.message }
  }

  await supabase.from("order_tracking").insert({
    order_id: orderId,
    status,
    notes: `Order status changed to ${status}`,
    created_at: new Date().toISOString(),
  })

  return { success: true }
}

export async function addOrderNote(orderId: string, note: string) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("orders")
    .update({
      admin_notes: note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error adding order note:", error)
    return { error: error.message }
  }

  return { success: true }
}

export async function updateOrderTracking(orderId: string, trackingNumber: string, carrier: string) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      carrier: carrier,
      shipped_at: new Date().toISOString(),
      status: "shipped",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating tracking:", error)
    return { error: error.message }
  }

  await supabase.from("order_tracking").insert({
    order_id: orderId,
    status: "shipped",
    carrier: carrier,
    tracking_number: trackingNumber,
    shipped_date: new Date().toISOString(),
    notes: `Shipped via ${carrier} - Tracking: ${trackingNumber}`,
    created_at: new Date().toISOString(),
  })

  return { success: true }
}

export async function refundOrder(orderId: string, reason: string) {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("orders")
    .update({
      status: "refunded",
      refund_reason: reason,
      refunded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error refunding order:", error)
    return { error: error.message }
  }

  await supabase.from("order_tracking").insert({
    order_id: orderId,
    status: "refunded",
    notes: `Order refunded. Reason: ${reason}`,
    created_at: new Date().toISOString(),
  })

  return { success: true }
}

// Update customer reward points directly
export async function updateCustomerRewardPoints(
  customerId: string,
  pointsAmount: number,
  reason: string,
  notes?: string
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
  const supabase = getSupabaseAdminClient()

  // Get current balance
  const { data: customer, error: fetchError } = await supabase
    .from("customers")
    .select("reward_points")
    .eq("id", customerId)
    .single()

  if (fetchError) {
    console.error("Error fetching customer:", fetchError)
    return { success: false, error: fetchError.message }
  }

  const currentBalance = customer?.reward_points || 0
  const newBalance = currentBalance + pointsAmount

  // Don't allow negative balance
  if (newBalance < 0) {
    return { success: false, error: "Cannot reduce points below 0" }
  }

  // Log the adjustment - the trigger will update the actual balance
  const { error: logError } = await supabase.from("points_adjustments").insert({
    customer_id: customerId,
    points_amount: pointsAmount,
    reason,
    notes: notes || null,
    previous_balance: currentBalance,
    new_balance: newBalance,
  })

  if (logError) {
    console.error("Error logging adjustment:", logError)
    // If the points_adjustments table doesn't exist or has an error, 
    // update the customer directly
    const { error: updateError } = await supabase
      .from("customers")
      .update({
        reward_points: newBalance,
        lifetime_points_earned: pointsAmount > 0 
          ? (customer?.lifetime_points_earned || 0) + pointsAmount 
          : (customer?.lifetime_points_earned || 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", customerId)

    if (updateError) {
      console.error("Error updating customer points:", updateError)
      return { success: false, error: updateError.message }
    }
  }

  return { success: true, newBalance }
}

// Set customer reward points to a specific value (admin only)
export async function setCustomerRewardPoints(
  customerId: string,
  newPoints: number,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Get current balance
  const { data: customer, error: fetchError } = await supabase
    .from("customers")
    .select("reward_points, lifetime_points_earned")
    .eq("id", customerId)
    .single()

  if (fetchError) {
    console.error("Error fetching customer:", fetchError)
    return { success: false, error: fetchError.message }
  }

  const currentBalance = customer?.reward_points || 0
  const adjustment = newPoints - currentBalance

  if (adjustment === 0) {
    return { success: true } // No change needed
  }

  // Use the adjustment function for proper tracking
  return updateCustomerRewardPoints(customerId, adjustment, reason)
}

