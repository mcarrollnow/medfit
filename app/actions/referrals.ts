"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { DEFAULT_REFERRAL_DISCOUNT, REFERRAL_DISCOUNTS, REFERRAL_REWARDS, getReferralDiscount } from "@/lib/referral-tiers"
import type { RewardTier } from "@/types"

export interface ReferralCode {
  code: string
  customerId: string
  customerName: string
  tier: RewardTier
  discountPercentage: number
}

export interface ReferralStats {
  totalReferrals: number
  totalReferredOrders: number
  totalReferredSales: number
  totalDiscountsGiven: number
  totalRewardPointsEarned: number
}

export interface ReferredCustomer {
  id: string
  name: string
  email: string
  signupDate: string
  totalOrders: number
  totalSpent: number
}

// Generate a random alphanumeric code
function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluded I, O, 0, 1 to avoid confusion
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate a referral code for a customer
export async function generateReferralCode(
  customerId: string,
  forceRegenerate: boolean = false,
): Promise<{ success: boolean; code?: string; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Check if customer already has a code
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("referral_code, user_id")
      .eq("id", customerId)
      .single()

    if (existingCustomer?.referral_code && !forceRegenerate) {
      return { success: true, code: existingCustomer.referral_code }
    }

    // Generate a random 8-character alphanumeric code
    let code = generateRandomCode()

    // Ensure uniqueness
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await supabase.from("customers").select("id").eq("referral_code", code).single()

      if (!existing) break
      code = generateRandomCode()
      attempts++
    }

    // Update customer with new code
    const { error } = await supabase.from("customers").update({ referral_code: code }).eq("id", customerId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, code }
  } catch (error) {
    console.error("Error generating referral code:", error)
    return { success: false, error: "Failed to generate referral code" }
  }
}

// Update a customer's referral code to a custom value
export async function updateReferralCode(
  customerId: string,
  newCode: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Validate code format (alphanumeric, 4-12 chars)
    const cleanCode = newCode.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (cleanCode.length < 4 || cleanCode.length > 12) {
      return { success: false, error: "Code must be 4-12 alphanumeric characters" }
    }

    // Check if code is already in use by another customer
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("referral_code", cleanCode)
      .neq("id", customerId)
      .single()

    if (existing) {
      return { success: false, error: "This code is already in use by another customer" }
    }

    // Update the customer's referral code
    const { error } = await supabase
      .from("customers")
      .update({ referral_code: cleanCode })
      .eq("id", customerId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating referral code:", error)
    return { success: false, error: "Failed to update referral code" }
  }
}

// Validate a referral code and get discount info
export async function validateReferralCode(code: string): Promise<{
  valid: boolean
  discount?: number
  referrerName?: string
  referrerTier?: RewardTier
  referrerId?: string
  isCustomDiscount?: boolean
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { valid: false, error: "Database connection failed" }
    }

    const { data: referrer, error } = await supabase
      .from("customers")
      .select("id, rewards_tier, custom_referral_discount, referral_code")
      .eq("referral_code", code.toUpperCase())
      .single()

    if (error || !referrer) {
      return { valid: false, error: "Invalid referral code" }
    }

    const tier = (referrer.rewards_tier || "Free") as RewardTier
    // Use custom discount if set, otherwise use the default 15%
    const discount = getReferralDiscount(tier, referrer.custom_referral_discount)
    const isCustomDiscount = referrer.custom_referral_discount !== null

    return {
      valid: true,
      discount,
      referrerName: "A friend",
      referrerTier: tier,
      referrerId: referrer.id,
      isCustomDiscount,
    }
  } catch (error) {
    console.error("Error validating referral code:", error)
    return { valid: false, error: "Failed to validate code" }
  }
}

// Apply referral code to a new customer signup
export async function applyReferralToCustomer(
  newCustomerId: string,
  referralCode: string,
): Promise<{ success: boolean; discount?: number; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Get referrer info
    const codeToFind = referralCode.toUpperCase()
    console.log("[applyReferralToCustomer] Looking for referral_code:", codeToFind)

    const { data: referrer, error: referrerError } = await supabase
      .from("customers")
      .select("id, rewards_tier, custom_referral_discount, referral_code")
      .eq("referral_code", codeToFind)
      .single()

    console.log("[applyReferralToCustomer] Query result:", { referrer, referrerError })

    if (referrerError || !referrer) {
      console.log("[applyReferralToCustomer] Code not found. Error:", referrerError?.message)
      return { success: false, error: `Invalid referral code: ${codeToFind}` }
    }

    // Check customer isn't referring themselves
    if (referrer.id === newCustomerId) {
      return { success: false, error: "Cannot use your own referral code" }
    }

    // Check if customer already has a referral
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("referred_by_code")
      .eq("id", newCustomerId)
      .single()

    if (existingCustomer?.referred_by_code) {
      return { success: false, error: "Already have a referral code applied" }
    }

    const tier = (referrer.rewards_tier || "Free") as RewardTier
    // Use custom discount if set, otherwise default 15%
    const discount = getReferralDiscount(tier, referrer.custom_referral_discount)

    // Update new customer with referral info
    const { error: updateError } = await supabase
      .from("customers")
      .update({
        referred_by_code: referralCode.toUpperCase(),
        referred_by_customer_id: referrer.id,
        referral_signup_date: new Date().toISOString(),
      })
      .eq("id", newCustomerId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, discount }
  } catch (error) {
    console.error("Error applying referral:", error)
    return { success: false, error: "Failed to apply referral code" }
  }
}

// Track an order from a referred customer
export async function trackReferredOrder(
  orderId: string,
  customerId: string,
  orderTotal: number,
): Promise<{ success: boolean; discountApplied?: number; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Get customer's referral info
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("referred_by_code, referred_by_customer_id")
      .eq("id", customerId)
      .single()

    if (customerError || !customer?.referred_by_code) {
      // Customer wasn't referred, nothing to track
      return { success: true }
    }

    // Get referrer's tier
    const { data: referrer, error: referrerError } = await supabase
      .from("customers")
      .select("rewards_tier")
      .eq("id", customer.referred_by_customer_id)
      .single()

    if (referrerError || !referrer) {
      return { success: false, error: "Referrer not found" }
    }

    const tier = (referrer.rewards_tier || "Free") as RewardTier
    const discountPercentage = REFERRAL_DISCOUNTS[tier] || 5
    const discountAmount = (orderTotal * discountPercentage) / 100
    const rewardPoints = REFERRAL_REWARDS[tier] || 50

    // Create referral tracking record
    const { error: trackingError } = await supabase.from("referral_tracking").insert({
      referrer_customer_id: customer.referred_by_customer_id,
      referrer_code: customer.referred_by_code,
      referred_customer_id: customerId,
      order_id: orderId,
      order_total: orderTotal,
      discount_percentage: discountPercentage,
      discount_amount: discountAmount,
      referrer_tier_at_time: tier,
      referrer_reward_points: rewardPoints,
      status: "active",
    })

    if (trackingError) {
      console.error("Error tracking referral:", trackingError)
      return { success: false, error: trackingError.message }
    }

    return { success: true, discountApplied: discountAmount }
  } catch (error) {
    console.error("Error tracking referred order:", error)
    return { success: false, error: "Failed to track referral" }
  }
}

// Get referral stats for a customer
export async function getReferralStats(customerId: string): Promise<{
  stats: ReferralStats | null
  referralCode: string | null
  tier: RewardTier
  discountPercentage: number
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return {
        stats: null,
        referralCode: null,
        tier: "Free",
        discountPercentage: 5,
        error: "Database connection failed",
      }
    }

    // Get customer's referral code and tier
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("referral_code, rewards_tier")
      .eq("id", customerId)
      .single()

    if (customerError) {
      return {
        stats: null,
        referralCode: null,
        tier: "Free",
        discountPercentage: 5,
        error: customerError.message,
      }
    }

    const tier = (customer?.rewards_tier || "Free") as RewardTier
    const discountPercentage = REFERRAL_DISCOUNTS[tier] || 5

    // Get referral tracking stats
    const { data: trackingData, error: trackingError } = await supabase
      .from("referral_tracking")
      .select("referred_customer_id, order_id, order_total, discount_amount, referrer_reward_points")
      .eq("referrer_customer_id", customerId)

    if (trackingError) {
      return {
        stats: null,
        referralCode: customer?.referral_code || null,
        tier,
        discountPercentage,
        error: trackingError.message,
      }
    }

    // Calculate stats
    const uniqueReferrals = new Set(trackingData?.map((t) => t.referred_customer_id) || [])
    const stats: ReferralStats = {
      totalReferrals: uniqueReferrals.size,
      totalReferredOrders: trackingData?.filter((t) => t.order_id).length || 0,
      totalReferredSales: trackingData?.reduce((sum, t) => sum + (t.order_total || 0), 0) || 0,
      totalDiscountsGiven: trackingData?.reduce((sum, t) => sum + (t.discount_amount || 0), 0) || 0,
      totalRewardPointsEarned: trackingData?.reduce((sum, t) => sum + (t.referrer_reward_points || 0), 0) || 0,
    }

    return {
      stats,
      referralCode: customer?.referral_code || null,
      tier,
      discountPercentage,
    }
  } catch (error) {
    console.error("Error getting referral stats:", error)
    return {
      stats: null,
      referralCode: null,
      tier: "Free",
      discountPercentage: 5,
      error: "Failed to get referral stats",
    }
  }
}

// Get list of referred customers for a referrer
export async function getReferredCustomers(referrerId: string): Promise<{
  customers: ReferredCustomer[]
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { customers: [], error: "Database connection failed" }
    }

    // Get all customers referred by this customer, joining with users for name/email
    const { data: referred, error: referredError } = await supabase
      .from("customers")
      .select(`
        id,
        referral_signup_date,
        lifetime_spending,
        users:user_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq("referred_by_customer_id", referrerId)

    if (referredError) {
      return { customers: [], error: referredError.message }
    }

    // Get order counts for each referred customer
    const customers: ReferredCustomer[] = await Promise.all(
      (referred || []).map(async (customer: any) => {
        const { count } = await supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("customer_id", customer.id)

        const user = customer.users
        const firstName = user?.first_name || ""
        const lastName = user?.last_name || ""
        const fullName = `${firstName} ${lastName}`.trim()
        const email = user?.email || ""

        return {
          id: customer.id,
          name: fullName || email?.split("@")[0] || "Unknown",
          email: email,
          signupDate: customer.referral_signup_date || "",
          totalOrders: count || 0,
          totalSpent: customer.lifetime_spending || 0,
        }
      }),
    )

    return { customers }
  } catch (error) {
    console.error("Error getting referred customers:", error)
    return { customers: [], error: "Failed to get referred customers" }
  }
}

// Admin: Get all referral data (includes all customers, with or without referral codes)
export async function getAllReferralData(includeAllCustomers: boolean = false): Promise<{
  referrers: Array<{
    customerId: string
    customerName: string
    referralCode: string | null
    tier: RewardTier
    customDiscount: number | null
    effectiveDiscount: number
    totalReferrals: number
    totalSales: number
  }>
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { referrers: [], error: "Database connection failed" }
    }

    // Join with users table to get name and email
    let query = supabase
      .from("customers")
      .select(`
        id,
        user_id,
        referral_code,
        rewards_tier,
        custom_referral_discount,
        users:user_id (
          first_name,
          last_name,
          email
        )
      `)

    // Only filter if we don't want all customers
    if (!includeAllCustomers) {
      query = query.not("referral_code", "is", null)
    }

    const { data: customers, error } = await query

    if (error) {
      console.error("Error fetching customers:", error)
      return { referrers: [], error: error.message }
    }

    const referrers = await Promise.all(
      (customers || []).map(async (customer: any) => {
        const { data: tracking } = await supabase
          .from("referral_tracking")
          .select("referred_customer_id, order_total")
          .eq("referrer_customer_id", customer.id)

        const uniqueReferrals = new Set(tracking?.map((t) => t.referred_customer_id) || [])
        const totalSales = tracking?.reduce((sum, t) => sum + (t.order_total || 0), 0) || 0
        const tier = (customer.rewards_tier || "Free") as RewardTier
        const effectiveDiscount = getReferralDiscount(tier, customer.custom_referral_discount)

        // Get name from joined users table
        const user = customer.users
        const firstName = user?.first_name || ""
        const lastName = user?.last_name || ""
        const fullName = `${firstName} ${lastName}`.trim()
        const email = user?.email || ""

        return {
          customerId: customer.id,
          customerName: fullName || email?.split("@")[0] || "Unknown",
          referralCode: customer.referral_code,
          tier,
          customDiscount: customer.custom_referral_discount,
          effectiveDiscount,
          totalReferrals: uniqueReferrals.size,
          totalSales,
        }
      }),
    )

    return { referrers }
  } catch (error) {
    console.error("Error getting all referral data:", error)
    return { referrers: [], error: "Failed to get referral data" }
  }
}

// Admin: Update a customer's custom referral discount
export async function updateCustomReferralDiscount(
  customerId: string,
  customDiscount: number | null,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, error: "Database connection failed" }
    }

    // Validate discount range
    if (customDiscount !== null && (customDiscount < 1 || customDiscount > 100)) {
      return { success: false, error: "Discount must be between 1 and 100 percent" }
    }

    const { error } = await supabase
      .from("customers")
      .update({ custom_referral_discount: customDiscount })
      .eq("id", customerId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating custom referral discount:", error)
    return { success: false, error: "Failed to update discount" }
  }
}

// Get the referral discount a customer should receive (as a referred customer)
export async function getCustomerReferralDiscount(customerId: string): Promise<{
  hasReferral: boolean
  discount: number
  referrerName?: string
  referralCode?: string
  error?: string
}> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { hasReferral: false, discount: 0, error: "Database connection failed" }
    }

    // Get customer's referral info
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("referred_by_code, referred_by_customer_id")
      .eq("id", customerId)
      .single()

    if (customerError || !customer?.referred_by_code) {
      // Customer wasn't referred
      return { hasReferral: false, discount: 0 }
    }

    // Get referrer's info including custom discount
    const { data: referrer, error: referrerError } = await supabase
      .from("customers")
      .select("rewards_tier, custom_referral_discount")
      .eq("id", customer.referred_by_customer_id)
      .single()

    if (referrerError || !referrer) {
      return { hasReferral: false, discount: 0, error: "Referrer not found" }
    }

    const tier = (referrer.rewards_tier || "Free") as RewardTier
    const discount = getReferralDiscount(tier, referrer.custom_referral_discount)

    return {
      hasReferral: true,
      discount,
      referrerName: "A friend",
      referralCode: customer.referred_by_code,
    }
  } catch (error) {
    console.error("Error getting customer referral discount:", error)
    return { hasReferral: false, discount: 0, error: "Failed to get referral discount" }
  }
}

// Admin: Back-sync all orders to referral tracking
// This creates referral_tracking records for all orders from referred customers
export async function backSyncReferralOrders(): Promise<{
  success: boolean
  processed: number
  created: number
  skipped: number
  errors: string[]
}> {
  const errors: string[] = []
  let processed = 0
  let created = 0
  let skipped = 0

  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return { success: false, processed: 0, created: 0, skipped: 0, errors: ["Database connection failed"] }
    }

    // Get all customers who were referred (have referred_by_code set)
    const { data: referredCustomers, error: customersError } = await supabase
      .from("customers")
      .select("id, referred_by_code, referred_by_customer_id, rewards_tier")
      .not("referred_by_code", "is", null)
      .not("referred_by_customer_id", "is", null)

    if (customersError) {
      return { success: false, processed: 0, created: 0, skipped: 0, errors: [customersError.message] }
    }

    console.log(`[backSyncReferralOrders] Found ${referredCustomers?.length || 0} referred customers`)

    for (const customer of referredCustomers || []) {
      // Get referrer's tier and custom discount
      const { data: referrer } = await supabase
        .from("customers")
        .select("rewards_tier, custom_referral_discount")
        .eq("id", customer.referred_by_customer_id)
        .single()

      const tier = (referrer?.rewards_tier || "Free") as RewardTier
      const discountPercentage = getReferralDiscount(tier, referrer?.custom_referral_discount || null)
      const rewardPoints = REFERRAL_REWARDS[tier] || 50

      // Get all orders for this customer
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount")
        .eq("customer_id", customer.id)

      if (ordersError) {
        errors.push(`Error fetching orders for customer ${customer.id}: ${ordersError.message}`)
        continue
      }

      for (const order of orders || []) {
        processed++

        // Check if tracking record already exists
        const { data: existing } = await supabase
          .from("referral_tracking")
          .select("id")
          .eq("order_id", order.id)
          .single()

        if (existing) {
          skipped++
          continue
        }

        const orderTotal = order.total_amount || 0
        const discountAmount = (orderTotal * discountPercentage) / 100

        // Create tracking record
        const { error: insertError } = await supabase.from("referral_tracking").insert({
          referrer_customer_id: customer.referred_by_customer_id,
          referrer_code: customer.referred_by_code,
          referred_customer_id: customer.id,
          order_id: order.id,
          order_total: orderTotal,
          discount_percentage: discountPercentage,
          discount_amount: discountAmount,
          referrer_tier_at_time: tier,
          referrer_reward_points: rewardPoints,
          status: "active",
        })

        if (insertError) {
          errors.push(`Error creating tracking for order ${order.id}: ${insertError.message}`)
        } else {
          created++
        }
      }
    }

    console.log(`[backSyncReferralOrders] Done. Processed: ${processed}, Created: ${created}, Skipped: ${skipped}`)

    return { success: true, processed, created, skipped, errors }
  } catch (error) {
    console.error("Error back-syncing referral orders:", error)
    return { success: false, processed, created, skipped, errors: ["Failed to back-sync referral orders"] }
  }
}

