"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

// ============================================================
// Types
// ============================================================

export interface PricingTier {
  id: string
  rep_id: string
  name: string
  discount_percentage: number
  description: string | null
  is_default: boolean
  created_at: string
  updated_at: string
  customer_count?: number
}

export interface CustomerProductPricing {
  id: string
  customer_id: string
  product_id: string
  custom_price: number
  set_by_rep_id: string
  created_at: string
  updated_at: string
  product_name?: string
  product_variant?: string
  product_retail_price?: number
  product_b2b_price?: number
}

// ============================================================
// Pricing Tier CRUD
// ============================================================

export async function getRepTiers(repId: string): Promise<PricingTier[]> {
  const supabase = getSupabaseAdminClient()

  const { data: tiers, error } = await supabase
    .from("rep_pricing_tiers")
    .select("*")
    .eq("rep_id", repId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[Rep Tiers] Error fetching tiers:", error)
    return []
  }

  // Get customer counts per tier
  const { data: customers } = await supabase
    .from("customers")
    .select("pricing_tier_id")
    .eq("rep_id", repId)
    .not("pricing_tier_id", "is", null)

  const tierCounts: Record<string, number> = {}
  if (customers) {
    customers.forEach((c: any) => {
      if (c.pricing_tier_id) {
        tierCounts[c.pricing_tier_id] = (tierCounts[c.pricing_tier_id] || 0) + 1
      }
    })
  }

  return (tiers || []).map((t: any) => ({
    ...t,
    discount_percentage: Number(t.discount_percentage),
    customer_count: tierCounts[t.id] || 0,
  }))
}

export async function createTier(
  repId: string,
  data: { name: string; discount_percentage: number; description?: string; is_default?: boolean }
): Promise<{ success: boolean; tier?: PricingTier; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Validate
  if (!data.name.trim()) {
    return { success: false, error: "Tier name is required" }
  }
  if (data.discount_percentage < 0 || data.discount_percentage > 100) {
    return { success: false, error: "Discount must be between 0 and 100%" }
  }

  const { data: tier, error } = await supabase
    .from("rep_pricing_tiers")
    .insert({
      rep_id: repId,
      name: data.name.trim(),
      discount_percentage: data.discount_percentage,
      description: data.description?.trim() || null,
      is_default: data.is_default || false,
    })
    .select()
    .single()

  if (error) {
    console.error("[Rep Tiers] Error creating tier:", error)
    return { success: false, error: error.message }
  }

  return { success: true, tier: { ...tier, discount_percentage: Number(tier.discount_percentage), customer_count: 0 } }
}

export async function updateTier(
  repId: string,
  tierId: string,
  data: { name?: string; discount_percentage?: number; description?: string; is_default?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("rep_pricing_tiers")
    .select("rep_id")
    .eq("id", tierId)
    .single()

  if (!existing || existing.rep_id !== repId) {
    return { success: false, error: "Tier not found or not owned by you" }
  }

  if (data.discount_percentage !== undefined && (data.discount_percentage < 0 || data.discount_percentage > 100)) {
    return { success: false, error: "Discount must be between 0 and 100%" }
  }

  const updateData: any = { updated_at: new Date().toISOString() }
  if (data.name !== undefined) updateData.name = data.name.trim()
  if (data.discount_percentage !== undefined) updateData.discount_percentage = data.discount_percentage
  if (data.description !== undefined) updateData.description = data.description.trim() || null
  if (data.is_default !== undefined) updateData.is_default = data.is_default

  const { error } = await supabase
    .from("rep_pricing_tiers")
    .update(updateData)
    .eq("id", tierId)

  if (error) {
    console.error("[Rep Tiers] Error updating tier:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteTier(
  repId: string,
  tierId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("rep_pricing_tiers")
    .select("rep_id")
    .eq("id", tierId)
    .single()

  if (!existing || existing.rep_id !== repId) {
    return { success: false, error: "Tier not found or not owned by you" }
  }

  // Unassign customers from this tier first
  await supabase
    .from("customers")
    .update({ pricing_tier_id: null })
    .eq("pricing_tier_id", tierId)

  const { error } = await supabase
    .from("rep_pricing_tiers")
    .delete()
    .eq("id", tierId)

  if (error) {
    console.error("[Rep Tiers] Error deleting tier:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================================
// Customer Tier Assignment
// ============================================================

export async function assignCustomerTier(
  repId: string,
  customerId: string,
  tierId: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify rep owns the customer
  const { data: customer } = await supabase
    .from("customers")
    .select("rep_id")
    .eq("id", customerId)
    .single()

  if (!customer || customer.rep_id !== repId) {
    return { success: false, error: "Customer not found or not assigned to you" }
  }

  // If assigning a tier, verify rep owns the tier
  if (tierId) {
    const { data: tier } = await supabase
      .from("rep_pricing_tiers")
      .select("rep_id")
      .eq("id", tierId)
      .single()

    if (!tier || tier.rep_id !== repId) {
      return { success: false, error: "Tier not found or not owned by you" }
    }
  }

  const { error } = await supabase
    .from("customers")
    .update({ pricing_tier_id: tierId })
    .eq("id", customerId)

  if (error) {
    console.error("[Rep Tiers] Error assigning tier:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================================
// Customer Product Pricing (Per-Product Overrides)
// ============================================================

export async function getCustomerProductPricing(
  customerId: string
): Promise<CustomerProductPricing[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("customer_product_pricing")
    .select(`
      *,
      products:product_id (name, variant, retail_price, b2b_price)
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Rep Tiers] Error fetching customer product pricing:", error)
    return []
  }

  return (data || []).map((d: any) => ({
    id: d.id,
    customer_id: d.customer_id,
    product_id: d.product_id,
    custom_price: Number(d.custom_price),
    set_by_rep_id: d.set_by_rep_id,
    created_at: d.created_at,
    updated_at: d.updated_at,
    product_name: d.products?.name || "Unknown Product",
    product_variant: d.products?.variant,
    product_retail_price: d.products ? Number(d.products.retail_price) : undefined,
    product_b2b_price: d.products ? Number(d.products.b2b_price) : undefined,
  }))
}

export async function setCustomerProductPrice(
  repId: string,
  customerId: string,
  productId: string,
  customPrice: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify rep owns the customer
  const { data: customer } = await supabase
    .from("customers")
    .select("rep_id")
    .eq("id", customerId)
    .single()

  if (!customer || customer.rep_id !== repId) {
    return { success: false, error: "Customer not found or not assigned to you" }
  }

  if (customPrice < 0) {
    return { success: false, error: "Price cannot be negative" }
  }

  // Upsert - insert or update on conflict
  const { error } = await supabase
    .from("customer_product_pricing")
    .upsert(
      {
        customer_id: customerId,
        product_id: productId,
        custom_price: customPrice,
        set_by_rep_id: repId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "customer_id,product_id" }
    )

  if (error) {
    console.error("[Rep Tiers] Error setting customer product price:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function removeCustomerProductPrice(
  repId: string,
  pricingId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify ownership
  const { data: pricing } = await supabase
    .from("customer_product_pricing")
    .select("set_by_rep_id")
    .eq("id", pricingId)
    .single()

  if (!pricing || pricing.set_by_rep_id !== repId) {
    return { success: false, error: "Pricing override not found or not set by you" }
  }

  const { error } = await supabase
    .from("customer_product_pricing")
    .delete()
    .eq("id", pricingId)

  if (error) {
    console.error("[Rep Tiers] Error removing customer product price:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ============================================================
// Pricing Resolution (used by cart API and storefront)
// ============================================================

/**
 * Get the resolved price for a customer + product combination.
 * Priority: per-product override > tier discount > customer_type pricing > retail
 */
export async function getResolvedPrice(
  customerId: string,
  productId: string,
  basePrice: number
): Promise<{ price: number; source: "product_override" | "tier_discount" | "base" }> {
  const supabase = getSupabaseAdminClient()

  // 1. Check for per-product override
  const { data: productPricing } = await supabase
    .from("customer_product_pricing")
    .select("custom_price")
    .eq("customer_id", customerId)
    .eq("product_id", productId)
    .single()

  if (productPricing) {
    return {
      price: Number(productPricing.custom_price),
      source: "product_override",
    }
  }

  // 2. Check for pricing tier discount
  const { data: customer } = await supabase
    .from("customers")
    .select("pricing_tier_id")
    .eq("id", customerId)
    .single()

  if (customer?.pricing_tier_id) {
    const { data: tier } = await supabase
      .from("rep_pricing_tiers")
      .select("discount_percentage")
      .eq("id", customer.pricing_tier_id)
      .single()

    if (tier && Number(tier.discount_percentage) > 0) {
      const discountedPrice = basePrice * (1 - Number(tier.discount_percentage) / 100)
      return {
        price: Math.round(discountedPrice * 100) / 100,
        source: "tier_discount",
      }
    }
  }

  // 3. No override or tier - use base price
  return { price: basePrice, source: "base" }
}

/**
 * Batch resolve prices for multiple products for a single customer.
 * More efficient than calling getResolvedPrice for each product.
 */
export async function getBatchResolvedPrices(
  customerId: string,
  products: Array<{ product_id: string; base_price: number }>
): Promise<Record<string, { price: number; source: "product_override" | "tier_discount" | "base" }>> {
  const supabase = getSupabaseAdminClient()
  const results: Record<string, { price: number; source: "product_override" | "tier_discount" | "base" }> = {}

  const productIds = products.map((p) => p.product_id)

  // 1. Batch fetch all product overrides for this customer
  const { data: overrides } = await supabase
    .from("customer_product_pricing")
    .select("product_id, custom_price")
    .eq("customer_id", customerId)
    .in("product_id", productIds)

  const overrideMap: Record<string, number> = {}
  if (overrides) {
    overrides.forEach((o: any) => {
      overrideMap[o.product_id] = Number(o.custom_price)
    })
  }

  // 2. Get tier discount (once per customer)
  let tierDiscount = 0
  const { data: customer } = await supabase
    .from("customers")
    .select("pricing_tier_id")
    .eq("id", customerId)
    .single()

  if (customer?.pricing_tier_id) {
    const { data: tier } = await supabase
      .from("rep_pricing_tiers")
      .select("discount_percentage")
      .eq("id", customer.pricing_tier_id)
      .single()

    if (tier) {
      tierDiscount = Number(tier.discount_percentage)
    }
  }

  // 3. Resolve each product
  for (const product of products) {
    if (overrideMap[product.product_id] !== undefined) {
      results[product.product_id] = {
        price: overrideMap[product.product_id],
        source: "product_override",
      }
    } else if (tierDiscount > 0) {
      const discountedPrice = product.base_price * (1 - tierDiscount / 100)
      results[product.product_id] = {
        price: Math.round(discountedPrice * 100) / 100,
        source: "tier_discount",
      }
    } else {
      results[product.product_id] = {
        price: product.base_price,
        source: "base",
      }
    }
  }

  return results
}

/**
 * Search products for the per-product override UI.
 */
export async function searchProductsForPricing(
  query: string
): Promise<Array<{ id: string; name: string; variant: string | null; retail_price: number; b2b_price: number | null }>> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("products")
    .select("id, name, variant, retail_price, b2b_price, base_name")
    .or(`name.ilike.%${query}%,base_name.ilike.%${query}%,barcode.ilike.%${query}%`)
    .order("base_name")
    .limit(20)

  if (error) {
    console.error("[Rep Tiers] Error searching products:", error)
    return []
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    variant: p.variant,
    retail_price: Number(p.retail_price),
    b2b_price: p.b2b_price ? Number(p.b2b_price) : null,
  }))
}
