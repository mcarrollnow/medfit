"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { REWARD_TIERS } from "@/lib/rewards-tiers"
import type { TierInfo } from "@/types"

// Types
export interface TierConfig {
  minSpend: number
  maxSpend: number | null
  pointsPerDollar: number
  color: string
  benefits: string[]
}

export interface RedeemableReward {
  id: string
  name: string
  description: string | null
  points_cost: number
  reward_type: string
  reward_value: Record<string, any>
  image_url: string | null
  is_active: boolean
  stock_limit: number | null
  stock_used: number
  tier_required: string | null
  sort_order: number
}

export interface PointsPromo {
  id: string
  name: string
  description: string | null
  promo_type: string
  multiplier: number
  bonus_points: number
  start_date: string
  end_date: string
  is_active: boolean
  applies_to: string
  target_ids: string[]
  target_tiers: string[]
  min_order_amount: number
  max_uses: number | null
  current_uses: number
}

export interface PointsAdjustment {
  id: string
  created_at: string
  customer_id: string
  admin_id: string | null
  points_amount: number
  reason: string
  notes: string | null
  previous_balance: number
  new_balance: number
  customer?: { email: string; name: string | null }
}

// Get tier configuration
export async function getTierConfig(): Promise<Record<string, TierConfig>> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return {}

    const { data, error } = await supabase
      .from("rewards_config")
      .select("config_value")
      .eq("config_key", "tiers")
      .single()

    if (error) throw error
    return data?.config_value || {}
  } catch (error) {
    console.error("Error fetching tier config:", error)
    return {}
  }
}

// Update tier configuration
export async function updateTierConfig(
  tiers: Record<string, TierConfig>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase.from("rewards_config").upsert(
      {
        config_key: "tiers",
        config_value: tiers,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "config_key" },
    )

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error updating tier config:", error)
    return { success: false, error: String(error) }
  }
}

// Get all redeemable rewards
export async function getRedeemableRewards(): Promise<RedeemableReward[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from("redeemable_rewards")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching rewards:", error)
    return []
  }
}

// Create redeemable reward
export async function createRedeemableReward(
  reward: Omit<RedeemableReward, "id" | "stock_used">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase.from("redeemable_rewards").insert(reward)

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error creating reward:", error)
    return { success: false, error: String(error) }
  }
}

// Update redeemable reward
export async function updateRedeemableReward(
  id: string,
  updates: Partial<RedeemableReward>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase
      .from("redeemable_rewards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error updating reward:", error)
    return { success: false, error: String(error) }
  }
}

// Delete redeemable reward
export async function deleteRedeemableReward(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase.from("redeemable_rewards").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error deleting reward:", error)
    return { success: false, error: String(error) }
  }
}

// Get all promos
export async function getPointsPromos(): Promise<PointsPromo[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("points_promos").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching promos:", error)
    return []
  }
}

// Create points promo
export async function createPointsPromo(
  promo: Omit<PointsPromo, "id" | "current_uses">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase.from("points_promos").insert(promo)

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error creating promo:", error)
    return { success: false, error: String(error) }
  }
}

// Update points promo
export async function updatePointsPromo(
  id: string,
  updates: Partial<PointsPromo>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase
      .from("points_promos")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error updating promo:", error)
    return { success: false, error: String(error) }
  }
}

// Delete points promo
export async function deletePointsPromo(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    const { error } = await supabase.from("points_promos").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin/rewards")
    return { success: true }
  } catch (error) {
    console.error("Error deleting promo:", error)
    return { success: false, error: String(error) }
  }
}

// Adjust customer points manually
export async function adjustCustomerPoints(
  customerId: string,
  pointsAmount: number,
  reason: string,
  notes?: string,
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "Database not connected" }

    // Get the current balance and points tracking
    const { data: customer, error: fetchError } = await supabase
      .from("customers")
      .select("reward_points, lifetime_points_earned, total_points_earned, total_points_redeemed")
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

    // Log the adjustment to the points_adjustments table
    // The database trigger will update the customer's reward_points and lifetime_points_earned
    const { error: logError } = await supabase.from("points_adjustments").insert({
      customer_id: customerId,
      points_amount: pointsAmount,
      reason,
      notes,
      previous_balance: currentBalance,
      new_balance: newBalance,
    })

    if (logError) {
      console.error("Error logging adjustment:", logError)

      // If points_adjustments table has issues, update customer directly
      const updateData: Record<string, any> = {
        reward_points: newBalance,
        lifetime_points_earned: pointsAmount > 0
          ? (customer?.lifetime_points_earned || 0) + pointsAmount
          : (customer?.lifetime_points_earned || 0),
        updated_at: new Date().toISOString(),
      }

      // Also track total earned/redeemed
      if (pointsAmount > 0) {
        updateData.total_points_earned = (customer?.total_points_earned || 0) + pointsAmount
      } else {
        updateData.total_points_redeemed = (customer?.total_points_redeemed || 0) + Math.abs(pointsAmount)
      }

      const { error: updateError } = await supabase
        .from("customers")
        .update(updateData)
        .eq("id", customerId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }
    }

    revalidatePath("/admin/rewards")
    revalidatePath("/admin/customers")
    return { success: true, newBalance }
  } catch (error) {
    console.error("Error adjusting points:", error)
    return { success: false, error: String(error) }
  }
}

// Get points adjustments history
export async function getPointsAdjustments(limit = 50): Promise<PointsAdjustment[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    // Fetch adjustments with customer data
    const { data: adjustments, error } = await supabase
      .from("points_adjustments")
      .select(`
        *,
        customer:customers(id, user_id, company_name)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching adjustments:", error)
      return []
    }

    if (!adjustments || adjustments.length === 0) return []

    // Get user IDs from the customer data
    const userIds = adjustments
      .map((a: any) => a.customer?.user_id)
      .filter(Boolean)

    let usersMap: Record<string, any> = {}

    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, email, first_name, last_name")
        .in("id", userIds)

      if (users) {
        usersMap = Object.fromEntries(users.map((u) => [u.id, u]))
      }
    }

    // Combine the data
    return adjustments.map((adj: any) => {
      const user = adj.customer?.user_id ? usersMap[adj.customer.user_id] : null
      
      let customerName = "Unknown"
      let customerEmail = "Unknown"
      
      if (user?.first_name && user?.last_name) {
        customerName = `${user.first_name} ${user.last_name}`
        customerEmail = user.email
      } else if (user?.email) {
        customerName = user.email.split("@")[0]
        customerEmail = user.email
      } else if (adj.customer?.company_name) {
        customerName = adj.customer.company_name
      }

      return {
        ...adj,
        customer: {
          email: customerEmail,
          name: customerName,
        },
      }
    })
  } catch (error) {
    console.error("Error fetching adjustments:", error)
    return []
  }
}

// Get all customers with points for admin
export async function getCustomersWithPoints(): Promise<any[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      console.log("[rewards-admin] No supabase client for getCustomersWithPoints")
      return []
    }

    // Fetch all customers including all reward points columns
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("id, user_id, company_name, customer_type, created_at, reward_points, lifetime_points_earned, total_points_earned, total_points_redeemed, rewards_tier, lifetime_spending")
      .order("created_at", { ascending: false })

    if (customersError) {
      console.log("[rewards-admin] Customers query error:", customersError)
      return []
    }

    if (!customers || customers.length === 0) {
      console.log("[rewards-admin] No customers found in database")
      return []
    }

    // Get unique user IDs to fetch user data
    const userIds = customers.map((c) => c.user_id).filter(Boolean)

    let usersMap: Record<string, any> = {}

    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, first_name, last_name")
        .in("id", userIds)

      if (!usersError && users) {
        usersMap = Object.fromEntries(users.map((u) => [u.id, u]))
      }
    }

    // Combine customer and user data
    return customers.map((c: any) => {
      const user = c.user_id ? usersMap[c.user_id] : null
      
      // Build display name
      let displayName = "Unknown Customer"
      if (user?.first_name && user?.last_name) {
        displayName = `${user.first_name} ${user.last_name}`
      } else if (user?.first_name) {
        displayName = user.first_name
      } else if (user?.email) {
        displayName = user.email.split("@")[0]
      } else if (c.company_name) {
        displayName = c.company_name
      }

      return {
        id: c.id,
        user_id: c.user_id,
        email: user?.email || "No email",
        name: displayName,
        company_name: c.company_name,
        customer_type: c.customer_type || "retail",
        rewards_tier: c.rewards_tier || "Free",
        total_points: c.lifetime_points_earned || c.total_points_earned || 0,
        available_points: c.reward_points || 0,
        lifetime_spending: c.lifetime_spending || 0,
      }
    })
  } catch (error) {
    console.error("[rewards-admin] Exception in getCustomersWithPoints:", error)
    return []
  }
}

// Get all products for promo targeting
export async function getProductsForPromo(): Promise<any[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      console.log("[rewards-admin] No supabase client for getProductsForPromo")
      return []
    }

    // First do a raw query to see what's in the table
    const { data: rawData, error: rawError } = await supabase.from("products").select("*").limit(3)

    if (rawError) {
      console.log("[rewards-admin] Products query error:", rawError.message)
      return []
    }

    if (!rawData || rawData.length === 0) {
      console.log("[rewards-admin] No products found in database")
      return []
    }

    // Return all products with flexible column mapping
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true, nullsFirst: false })

    if (error) {
      console.log("[rewards-admin] Full products query error:", error.message)
      return rawData.map((p: any) => ({
        id: p.id,
        name: p.name || p.title || p.product_name || p.base_name || "Unknown",
        price: p.price || p.retail_price || p.base_price || 0,
      }))
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name || p.title || p.product_name || p.base_name || "Unknown",
      price: p.price || p.retail_price || p.base_price || 0,
      image_url: p.image_url || p.image || null,
    }))
  } catch (error) {
    console.error("[rewards-admin] Exception in getProductsForPromo:", error)
    return []
  }
}

// Get rewards stats
export async function getRewardsStats(): Promise<{
  totalPointsIssued: number
  totalPointsRedeemed: number
  activePromos: number
  activeRewards: number
  customersByTier: Record<string, number>
}> {
  try {
    const supabase = createAdminClient()
    if (!supabase)
      return {
        totalPointsIssued: 0,
        totalPointsRedeemed: 0,
        activePromos: 0,
        activeRewards: 0,
        customersByTier: {},
      }

    // Get customer data including points
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("id, customer_type, rewards_tier, total_points_earned, total_points_redeemed")

    const customersByTier: Record<string, number> = {}
    let totalPointsIssued = 0
    let totalPointsRedeemed = 0
    
    if (!customersError && customers) {
      customers.forEach((c: any) => {
        const tier = c.rewards_tier || c.customer_type || "retail"
        customersByTier[tier] = (customersByTier[tier] || 0) + 1
        totalPointsIssued += c.total_points_earned || 0
        totalPointsRedeemed += c.total_points_redeemed || 0
      })
    }

    // Get active promos count
    let activePromos = 0
    try {
      const { count } = await supabase
        .from("points_promos")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
      activePromos = count || 0
    } catch (e) {
      // Table might not exist
    }

    // Get active rewards count
    let activeRewards = 0
    try {
      const { count } = await supabase
        .from("redeemable_rewards")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
      activeRewards = count || 0
    } catch (e) {
      // Table might not exist
    }

    return {
      totalPointsIssued,
      totalPointsRedeemed,
      activePromos,
      activeRewards,
      customersByTier,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      totalPointsIssued: 0,
      totalPointsRedeemed: 0,
      activePromos: 0,
      activeRewards: 0,
      customersByTier: {},
    }
  }
}

// Get tiers from database for use across the app
export async function getRewardTiersFromDB(): Promise<Record<string, TierInfo>> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      return REWARD_TIERS
    }

    const { data, error } = await supabase
      .from("rewards_config")
      .select("config_value")
      .eq("config_key", "tiers")
      .single()

    if (error || !data?.config_value) {
      return REWARD_TIERS
    }

    // Transform the config format to TierInfo format
    const configTiers = data.config_value as Record<string, any>
    const tierMap: Record<string, TierInfo> = {}

    for (const [tierName, config] of Object.entries(configTiers)) {
      tierMap[tierName] = {
        name: tierName as any,
        minSpend: config.minSpend ?? 0,
        maxSpend: config.maxSpend ?? null,
        pointsPerDollar: config.pointsPerDollar ?? 1,
        color: config.color ?? "#666666",
        benefits: config.benefits ?? [],
      }
    }

    return Object.keys(tierMap).length > 0 ? tierMap : REWARD_TIERS
  } catch (error) {
    console.error("[rewards-admin] Error fetching tiers from DB:", error)
    return REWARD_TIERS
  }
}

