"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

export interface RepCommission {
  id: string
  rep_id: string
  order_id: string
  order_total: number
  commission_rate: number
  commission_amount: number
  status: "pending" | "approved" | "paid" | "used" | "cancelled"
  created_at: string
  order?: {
    id: string
    status: string
    created_at: string
    customer?: {
      id: string
      user?: {
        first_name: string
        last_name: string
        email: string
      }
    }
  }
}

export interface RepPayout {
  id: string
  rep_id: string
  amount: number
  payment_type: "crypto" | "bank_transfer" | "check" | "cash" | "store_credit" | "other"
  crypto_currency?: string
  wallet_address?: string
  transaction_hash?: string
  transaction_number?: string
  receipt_url?: string
  notes?: string
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  processed_by?: string
  processed_at?: string
  email_sent: boolean
  email_sent_at?: string
  created_at: string
  rep?: {
    id: string
    first_name: string
    last_name: string
    email: string
    crypto_wallet_address?: string
  }
  commissions?: RepCommission[]
}

export interface RepPayoutSummary {
  rep_id: string
  rep_name: string
  rep_email: string
  crypto_wallet_address?: string
  total_earned: number
  total_paid: number
  pending_amount: number
  approved_amount: number
}

// Get all reps with their payout summaries
export async function getRepPayoutSummaries(): Promise<RepPayoutSummary[]> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return []
  }

  // Get all reps
  const { data: reps, error: repsError } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, crypto_wallet_address")
    .eq("role", "rep")

  if (repsError || !reps) {
    console.error("[Payouts] Error fetching reps:", repsError)
    return []
  }

  const summaries: RepPayoutSummary[] = []

  for (const rep of reps) {
    // Get commissions
    const { data: commissions } = await supabase
      .from("rep_commissions")
      .select("commission_amount, status")
      .eq("rep_id", rep.id)

    // Get payouts
    const { data: payouts } = await supabase
      .from("rep_payouts")
      .select("amount, status")
      .eq("rep_id", rep.id)
      .eq("status", "completed")

    const total_earned = (commissions || [])
      .filter((c) => c.status !== "cancelled")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

    const total_paid = (payouts || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const pending_amount = (commissions || [])
      .filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

    const approved_amount = (commissions || [])
      .filter((c) => c.status === "approved")
      .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)

    summaries.push({
      rep_id: rep.id,
      rep_name: `${rep.first_name || ""} ${rep.last_name || ""}`.trim() || "Unknown",
      rep_email: rep.email || "",
      crypto_wallet_address: rep.crypto_wallet_address,
      total_earned,
      total_paid,
      pending_amount,
      approved_amount,
    })
  }

  return summaries
}

// Get commissions for a specific rep
export async function getRepCommissions(repId: string): Promise<RepCommission[]> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return []
  }

  const { data, error } = await supabase
    .from("rep_commissions")
    .select(`
      *,
      order:orders(
        id, status, created_at,
        customer:customers(
          id,
          user:users(first_name, last_name, email)
        )
      )
    `)
    .eq("rep_id", repId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Payouts] Error fetching commissions:", error)
    return []
  }

  return data || []
}

// Get payouts for a specific rep
export async function getRepPayouts(repId: string): Promise<RepPayout[]> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return []
  }

  const { data, error } = await supabase
    .from("rep_payouts")
    .select("*")
    .eq("rep_id", repId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Payouts] Error fetching payouts:", error)
    return []
  }

  return data || []
}

// Create a new payout
export async function createPayout(data: {
  rep_id: string
  amount: number
  payment_type: string
  crypto_currency?: string
  wallet_address?: string
  transaction_hash?: string
  transaction_number?: string
  receipt_url?: string
  notes?: string
  commission_ids?: string[]
}): Promise<{ success: boolean; payout?: RepPayout; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  // Create the payout
  const { data: payout, error } = await supabase
    .from("rep_payouts")
    .insert({
      rep_id: data.rep_id,
      amount: data.amount,
      payment_type: data.payment_type,
      crypto_currency: data.crypto_currency,
      wallet_address: data.wallet_address,
      transaction_hash: data.transaction_hash,
      transaction_number: data.transaction_number,
      receipt_url: data.receipt_url,
      notes: data.notes,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("[Payouts] Error creating payout:", error)
    return { success: false, error: error.message }
  }

  // Link commissions to this payout if provided
  if (data.commission_ids && data.commission_ids.length > 0) {
    const payoutCommissions = data.commission_ids.map((cid) => ({
      payout_id: payout.id,
      commission_id: cid,
    }))

    await supabase.from("payout_commissions").insert(payoutCommissions)
  }

  return { success: true, payout }
}

// Update payout status (mark as completed, processing, etc.)
export async function updatePayoutStatus(
  payoutId: string,
  status: string,
  processedBy?: string,
  additionalData?: {
    transaction_hash?: string
    transaction_number?: string
    receipt_url?: string
    notes?: string
  },
): Promise<{ success: boolean; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "completed") {
    updateData.processed_at = new Date().toISOString()
    if (processedBy) updateData.processed_by = processedBy
  }

  if (additionalData) {
    if (additionalData.transaction_hash) updateData.transaction_hash = additionalData.transaction_hash
    if (additionalData.transaction_number) updateData.transaction_number = additionalData.transaction_number
    if (additionalData.receipt_url) updateData.receipt_url = additionalData.receipt_url
    if (additionalData.notes) updateData.notes = additionalData.notes
  }

  const { error } = await supabase.from("rep_payouts").update(updateData).eq("id", payoutId)

  if (error) {
    console.error("[Payouts] Error updating payout:", error)
    return { success: false, error: error.message }
  }

  // If completed, update the linked commissions to 'paid'
  if (status === "completed") {
    const { data: linkedCommissions } = await supabase
      .from("payout_commissions")
      .select("commission_id")
      .eq("payout_id", payoutId)

    if (linkedCommissions && linkedCommissions.length > 0) {
      const commissionIds = linkedCommissions.map((lc) => lc.commission_id)
      await supabase
        .from("rep_commissions")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .in("id", commissionIds)
    }
  }

  return { success: true }
}

// Mark commissions as approved (ready for payout)
export async function approveCommissions(commissionIds: string[]): Promise<{ success: boolean; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  const { error } = await supabase
    .from("rep_commissions")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .in("id", commissionIds)

  if (error) {
    console.error("[Payouts] Error approving commissions:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Record payout email sent
export async function markPayoutEmailSent(payoutId: string): Promise<{ success: boolean; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  const { error } = await supabase
    .from("rep_payouts")
    .update({
      email_sent: true,
      email_sent_at: new Date().toISOString(),
    })
    .eq("id", payoutId)

  if (error) {
    console.error("[Payouts] Error marking email sent:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Use commission for store purchase
export async function useCommissionForPurchase(
  repId: string,
  orderId: string,
  amountUsed: number,
  commissionIds: string[],
): Promise<{ success: boolean; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  // Record the store purchase
  const { error: purchaseError } = await supabase.from("rep_store_purchases").insert({
    rep_id: repId,
    order_id: orderId,
    commission_used: amountUsed,
  })

  if (purchaseError) {
    console.error("[Payouts] Error recording store purchase:", purchaseError)
    return { success: false, error: purchaseError.message }
  }

  // Mark commissions as used
  const { error: commissionError } = await supabase
    .from("rep_commissions")
    .update({ status: "used", updated_at: new Date().toISOString() })
    .in("id", commissionIds)

  if (commissionError) {
    console.error("[Payouts] Error updating commissions:", commissionError)
    return { success: false, error: commissionError.message }
  }

  return { success: true }
}

// Get rep's available balance for store purchases
export async function getRepAvailableBalance(repId: string): Promise<number> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return 0
  }

  const { data: commissions } = await supabase
    .from("rep_commissions")
    .select("commission_amount")
    .eq("rep_id", repId)
    .in("status", ["approved"])

  return (commissions || []).reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
}

// Update rep's wallet address
export async function updateRepWalletAddress(
  repId: string,
  walletAddress: string,
): Promise<{ success: boolean; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  const { error } = await supabase.from("users").update({ crypto_wallet_address: walletAddress }).eq("id", repId)

  if (error) {
    console.error("[Payouts] Error updating wallet address:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Apply commission for store purchase (creates order and uses commission)
export async function applyCommissionForPurchase(
  repId: string,
  commissionAmount: number,
  items: { product_id: string; quantity: number; price: number }[],
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch {
    return { success: false, error: "Database not available" }
  }

  // Get rep's approved commissions
  const { data: commissions } = await supabase
    .from("rep_commissions")
    .select("id, commission_amount")
    .eq("rep_id", repId)
    .eq("status", "approved")
    .order("created_at", { ascending: true })

  if (!commissions || commissions.length === 0) {
    return { success: false, error: "No approved commissions available" }
  }

  const availableBalance = commissions.reduce((sum, c) => sum + Number(c.commission_amount || 0), 0)
  if (availableBalance < commissionAmount) {
    return { success: false, error: "Insufficient commission balance" }
  }

  // Calculate order total
  const orderTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: repId, // Rep is the customer for this order
      status: "pending",
      total_amount: orderTotal,
      payment_method: "commission",
      notes: `Rep store purchase using $${commissionAmount.toFixed(2)} commission`,
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error("[Payouts] Error creating order:", orderError)
    return { success: false, error: orderError?.message || "Failed to create order" }
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_time: item.price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("[Payouts] Error creating order items:", itemsError)
    // Rollback order
    await supabase.from("orders").delete().eq("id", order.id)
    return { success: false, error: itemsError.message }
  }

  // Determine which commissions to mark as used
  let remainingToUse = commissionAmount
  const commissionsToUse: string[] = []

  for (const commission of commissions) {
    if (remainingToUse <= 0) break
    commissionsToUse.push(commission.id)
    remainingToUse -= Number(commission.commission_amount || 0)
  }

  // Record the store purchase
  const { error: purchaseError } = await supabase.from("rep_store_purchases").insert({
    rep_id: repId,
    order_id: order.id,
    commission_used: commissionAmount,
  })

  if (purchaseError) {
    console.error("[Payouts] Error recording store purchase:", purchaseError)
  }

  // Mark used commissions
  if (commissionsToUse.length > 0) {
    await supabase
      .from("rep_commissions")
      .update({ status: "used", updated_at: new Date().toISOString() })
      .in("id", commissionsToUse)
  }

  return { success: true, orderId: order.id }
}
