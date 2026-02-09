"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

export interface CustomerAssignedDiscount {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  discount_code_id: string | null
  discount_code: string | null
  custom_discount_type: "percentage" | "fixed" | null
  custom_discount_value: number | null
  custom_description: string | null
  status: "active" | "used" | "expired" | "removed"
  expires_at: string | null
  created_at: string
  used_at: string | null
  notes: string | null
}

export interface RepCustomer {
  id: string
  name: string
  email: string
  total_orders: number
  total_spent: number
}

export interface RepProduct {
  id: string
  name: string
  base_name: string
  variant: string | null
  retail_price: number
  b2b_price: number | null
  rep_price: number | null // Custom price assigned by admin for this rep
  color: string
  image_url: string | null
}

export interface RepDiscountCode {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed" | "set_price"
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  created_at: string
  created_by_rep: boolean
  product_pricing: Array<{
    product_id: string
    product_name: string
    custom_price: number
  }>
}

export interface RepSettings {
  can_create_discount_codes: boolean
}

// Get products with rep-specific pricing
export async function getRepProducts(repId: string): Promise<RepProduct[]> {
  const supabase = getSupabaseAdminClient()

  // Get all active products
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, base_name, variant, retail_price, b2b_price, color, image_url")
    .eq("is_active", true)
    .order("base_name", { ascending: true })

  if (error) {
    console.error("[rep-pricing] Error fetching products:", error)
    return []
  }

  // Get rep-specific pricing
  const { data: repPricing } = await supabase
    .from("rep_product_pricing")
    .select("product_id, custom_price")
    .eq("rep_id", repId)

  const repPricingMap = new Map(repPricing?.map(p => [p.product_id, p.custom_price]) || [])

  return (products || []).map(product => ({
    ...product,
    rep_price: repPricingMap.get(product.id) || null,
  }))
}

// Get discount codes associated with this rep
export async function getRepDiscountCodes(repId: string): Promise<RepDiscountCode[]> {
  const supabase = getSupabaseAdminClient()

  // Get discount codes created by this rep OR assigned to this rep
  const { data: codes, error } = await supabase
    .from("discount_codes")
    .select("*")
    .or(`created_by_rep_id.eq.${repId},assigned_rep_id.eq.${repId}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[rep-pricing] Error fetching discount codes:", error)
    return []
  }

  if (!codes || codes.length === 0) return []

  // Get product pricing for each code
  const codeIds = codes.map(c => c.id)
  const { data: productPricing } = await supabase
    .from("discount_code_products")
    .select("discount_code_id, product_id, custom_price")
    .in("discount_code_id", codeIds)

  // Get product names
  const productIds = [...new Set(productPricing?.map(p => p.product_id) || [])]
  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .in("id", productIds)

  const productMap = new Map(products?.map(p => [p.id, p.name]) || [])
  const pricingByCode = new Map<string, Array<{ product_id: string; product_name: string; custom_price: number }>>()

  productPricing?.forEach(p => {
    const existing = pricingByCode.get(p.discount_code_id) || []
    existing.push({
      product_id: p.product_id,
      product_name: productMap.get(p.product_id) || "Unknown",
      custom_price: p.custom_price,
    })
    pricingByCode.set(p.discount_code_id, existing)
  })

  return codes.map(code => ({
    id: code.id,
    code: code.code,
    description: code.description,
    discount_type: code.discount_type,
    discount_value: code.discount_value,
    min_order_amount: code.min_order_amount,
    max_uses: code.max_uses,
    current_uses: code.current_uses,
    valid_from: code.valid_from,
    valid_until: code.valid_until,
    is_active: code.is_active,
    created_at: code.created_at,
    created_by_rep: code.created_by_rep_id === repId,
    product_pricing: pricingByCode.get(code.id) || [],
  }))
}

// Check if rep can create discount codes
export async function getRepSettings(repId: string): Promise<RepSettings> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("users")
    .select("can_create_discount_codes")
    .eq("id", repId)
    .single()

  if (error) {
    console.error("[rep-pricing] Error fetching rep settings:", error)
    return { can_create_discount_codes: false }
  }

  return {
    can_create_discount_codes: data?.can_create_discount_codes || false,
  }
}

// Create a discount code (rep-created)
export async function createRepDiscountCode(
  repId: string,
  discountCode: {
    code: string
    description?: string
    discount_type: "percentage" | "fixed" | "set_price"
    discount_value: number
    min_order_amount?: number
    max_uses?: number | null
    valid_from?: string | null
    valid_until?: string | null
  },
  productPricing: Array<{ productId: string; customPrice: number }>
): Promise<{ success: boolean; code?: RepDiscountCode; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Check if rep can create discount codes
  const settings = await getRepSettings(repId)
  if (!settings.can_create_discount_codes) {
    return { success: false, error: "You don't have permission to create discount codes" }
  }

  // Create the discount code
  const { data: newCode, error: createError } = await supabase
    .from("discount_codes")
    .insert({
      code: discountCode.code.toUpperCase(),
      description: discountCode.description || null,
      discount_type: discountCode.discount_type,
      discount_value: discountCode.discount_value,
      min_order_amount: discountCode.min_order_amount || 0,
      max_uses: discountCode.max_uses || null,
      current_uses: 0,
      customer_type: "all",
      valid_from: discountCode.valid_from || null,
      valid_until: discountCode.valid_until || null,
      is_active: true,
      created_by_rep_id: repId,
      assigned_rep_id: repId,
    })
    .select()
    .single()

  if (createError) {
    console.error("[rep-pricing] Error creating discount code:", createError)
    return { success: false, error: "Failed to create discount code" }
  }

  // Add product pricing if provided
  if (productPricing.length > 0) {
    const pricingInserts = productPricing.map(p => ({
      discount_code_id: newCode.id,
      product_id: p.productId,
      custom_price: p.customPrice,
    }))

    const { error: pricingError } = await supabase
      .from("discount_code_products")
      .insert(pricingInserts)

    if (pricingError) {
      console.error("[rep-pricing] Error adding product pricing:", pricingError)
    }
  }

  return {
    success: true,
    code: {
      ...newCode,
      created_by_rep: true,
      product_pricing: productPricing.map(p => ({
        product_id: p.productId,
        product_name: "Product",
        custom_price: p.customPrice,
      })),
    },
  }
}

// Update a rep-created discount code
export async function updateRepDiscountCode(
  repId: string,
  codeId: string,
  updates: {
    description?: string
    discount_type?: "percentage" | "fixed" | "set_price"
    discount_value?: number
    min_order_amount?: number
    max_uses?: number | null
    valid_from?: string | null
    valid_until?: string | null
    is_active?: boolean
  },
  productPricing?: Array<{ productId: string; customPrice: number | null }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("discount_codes")
    .select("created_by_rep_id")
    .eq("id", codeId)
    .single()

  if (!existing || existing.created_by_rep_id !== repId) {
    return { success: false, error: "You can only edit codes you created" }
  }

  // Update the code
  const { error: updateError } = await supabase
    .from("discount_codes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", codeId)

  if (updateError) {
    console.error("[rep-pricing] Error updating discount code:", updateError)
    return { success: false, error: "Failed to update discount code" }
  }

  // Update product pricing if provided
  if (productPricing) {
    // Get existing
    const { data: existingPricing } = await supabase
      .from("discount_code_products")
      .select("id, product_id")
      .eq("discount_code_id", codeId)

    const existingMap = new Map(existingPricing?.map(e => [e.product_id, e.id]) || [])

    for (const { productId, customPrice } of productPricing) {
      const existingId = existingMap.get(productId)

      if (customPrice === null) {
        if (existingId) {
          await supabase.from("discount_code_products").delete().eq("id", existingId)
        }
      } else if (existingId) {
        await supabase.from("discount_code_products").update({ custom_price: customPrice }).eq("id", existingId)
      } else {
        await supabase.from("discount_code_products").insert({
          discount_code_id: codeId,
          product_id: productId,
          custom_price: customPrice,
        })
      }
    }
  }

  return { success: true }
}

// Delete a rep-created discount code
export async function deleteRepDiscountCode(
  repId: string,
  codeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("discount_codes")
    .select("created_by_rep_id")
    .eq("id", codeId)
    .single()

  if (!existing || existing.created_by_rep_id !== repId) {
    return { success: false, error: "You can only delete codes you created" }
  }

  // Delete product pricing first
  await supabase.from("discount_code_products").delete().eq("discount_code_id", codeId)

  // Delete the code
  const { error } = await supabase.from("discount_codes").delete().eq("id", codeId)

  if (error) {
    console.error("[rep-pricing] Error deleting discount code:", error)
    return { success: false, error: "Failed to delete discount code" }
  }

  return { success: true }
}

// Get customers assigned to this rep
export async function getRepCustomers(repId: string): Promise<RepCustomer[]> {
  const supabase = getSupabaseAdminClient()

  // Get customer assignments for this rep
  const { data: assignments } = await supabase
    .from("customer_rep_assignments")
    .select("customer_id")
    .eq("rep_id", repId)
    .eq("is_current", true)

  if (!assignments || assignments.length === 0) return []

  const customerIds = assignments.map(a => a.customer_id)

  // Get customer details
  const { data: customers } = await supabase
    .from("customers")
    .select("id, user_id")
    .in("id", customerIds)

  if (!customers || customers.length === 0) return []

  const userIds = customers.map(c => c.user_id).filter(Boolean)
  const customerToUserMap = new Map(customers.map(c => [c.id, c.user_id]))

  // Get user names
  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .in("id", userIds)

  const userMap = new Map(
    (users || []).map(u => [u.id, { 
      name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown",
      email: u.email 
    }])
  )

  // Get order stats for each customer
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_id, total_amount")
    .in("customer_id", customerIds)

  const orderStats = new Map<string, { count: number; total: number }>()
  ;(orders || []).forEach(o => {
    const existing = orderStats.get(o.customer_id) || { count: 0, total: 0 }
    existing.count += 1
    existing.total += Number(o.total_amount || 0)
    orderStats.set(o.customer_id, existing)
  })

  return customerIds.map(customerId => {
    const userId = customerToUserMap.get(customerId)
    const userInfo = userId ? userMap.get(userId) : null
    const stats = orderStats.get(customerId) || { count: 0, total: 0 }

    return {
      id: customerId,
      name: userInfo?.name || "Unknown",
      email: userInfo?.email || "",
      total_orders: stats.count,
      total_spent: stats.total,
    }
  })
}

// Get discounts assigned to customers by this rep
export async function getRepAssignedDiscounts(repId: string): Promise<CustomerAssignedDiscount[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("customer_assigned_discounts")
    .select(`
      *,
      discount_codes(code)
    `)
    .eq("assigned_by_rep_id", repId)
    .order("created_at", { ascending: false })

  if (error) {
    // Table might not exist yet
    console.error("[rep-pricing] Error fetching assigned discounts:", error)
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.log("[rep-pricing] Table customer_assigned_discounts does not exist yet")
    }
    return []
  }

  if (!data || data.length === 0) return []

  // Get customer details
  const customerIds = [...new Set(data.map(d => d.customer_id))]
  const { data: customers } = await supabase
    .from("customers")
    .select("id, user_id")
    .in("id", customerIds)

  const userIds = (customers || []).map(c => c.user_id).filter(Boolean)
  const customerToUserMap = new Map((customers || []).map(c => [c.id, c.user_id]))

  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .in("id", userIds)

  const userMap = new Map(
    (users || []).map(u => [u.id, { 
      name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown",
      email: u.email 
    }])
  )

  return data.map(d => {
    const userId = customerToUserMap.get(d.customer_id)
    const userInfo = userId ? userMap.get(userId) : null

    return {
      id: d.id,
      customer_id: d.customer_id,
      customer_name: userInfo?.name || "Unknown",
      customer_email: userInfo?.email || "",
      discount_code_id: d.discount_code_id,
      discount_code: d.discount_codes?.code || null,
      custom_discount_type: d.custom_discount_type,
      custom_discount_value: d.custom_discount_value,
      custom_description: d.custom_description,
      status: d.status,
      expires_at: d.expires_at,
      created_at: d.created_at,
      used_at: d.used_at,
      notes: d.notes,
    }
  })
}

// Assign a discount to a customer's next order
export async function assignDiscountToCustomer(
  repId: string,
  customerId: string,
  discount: {
    discountCodeId?: string // Use existing discount code
    customDiscountType?: "percentage" | "fixed" // OR create custom one-time discount
    customDiscountValue?: number
    customDescription?: string
    expiresAt?: string
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  console.log("[rep-pricing] assignDiscountToCustomer called:", { repId, customerId, discount })
  
  const supabase = getSupabaseAdminClient()

  // Verify the customer is assigned to this rep
  const { data: assignment, error: assignmentError } = await supabase
    .from("customer_rep_assignments")
    .select("id")
    .eq("rep_id", repId)
    .eq("customer_id", customerId)
    .eq("is_current", true)
    .single()

  if (assignmentError) {
    console.log("[rep-pricing] Assignment check error:", assignmentError)
  }

  if (!assignment) {
    console.log("[rep-pricing] Customer not assigned to rep")
    return { success: false, error: "This customer is not assigned to you" }
  }

  // Check if customer already has an active discount
  const { data: existing, error: existingError } = await supabase
    .from("customer_assigned_discounts")
    .select("id")
    .eq("customer_id", customerId)
    .eq("status", "active")
    .single()

  if (existingError && existingError.code !== "PGRST116") {
    // PGRST116 = no rows returned, which is fine
    console.log("[rep-pricing] Existing check error:", existingError)
    // If table doesn't exist, we need to create it
    if (existingError.code === "42P01" || existingError.message?.includes("does not exist")) {
      return { success: false, error: "Database table not set up. Please run migrations." }
    }
  }

  if (existing) {
    return { success: false, error: "Customer already has an active discount. Remove it first." }
  }

  // Create the assignment
  const insertData = {
    customer_id: customerId,
    discount_code_id: discount.discountCodeId || null,
    custom_discount_type: discount.customDiscountType || null,
    custom_discount_value: discount.customDiscountValue || null,
    custom_description: discount.customDescription || null,
    assigned_by_rep_id: repId,
    expires_at: discount.expiresAt ? new Date(discount.expiresAt).toISOString() : null,
    notes: discount.notes || null,
    status: "active",
  }
  
  console.log("[rep-pricing] Inserting discount assignment:", insertData)

  const { error } = await supabase
    .from("customer_assigned_discounts")
    .insert(insertData)

  if (error) {
    console.error("[rep-pricing] Error assigning discount:", error)
    return { success: false, error: `Failed to assign discount: ${error.message}` }
  }

  console.log("[rep-pricing] Discount assigned successfully")
  return { success: true }
}

// Remove an assigned discount
export async function removeAssignedDiscount(
  repId: string,
  assignmentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("customer_assigned_discounts")
    .select("assigned_by_rep_id, status")
    .eq("id", assignmentId)
    .single()

  if (!existing) {
    return { success: false, error: "Discount assignment not found" }
  }

  if (existing.assigned_by_rep_id !== repId) {
    return { success: false, error: "You can only remove discounts you assigned" }
  }

  if (existing.status !== "active") {
    return { success: false, error: "Only active discounts can be removed" }
  }

  const { error } = await supabase
    .from("customer_assigned_discounts")
    .update({
      status: "removed",
      removed_at: new Date().toISOString(),
      removed_by_id: repId,
    })
    .eq("id", assignmentId)

  if (error) {
    console.error("[rep-pricing] Error removing discount:", error)
    return { success: false, error: "Failed to remove discount" }
  }

  return { success: true }
}

// Get active discount for a customer (used at checkout)
export async function getCustomerActiveDiscount(customerId: string): Promise<CustomerAssignedDiscount | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("customer_assigned_discounts")
    .select(`
      *,
      discount_codes(code, discount_type, discount_value)
    `)
    .eq("customer_id", customerId)
    .eq("status", "active")
    .single()

  if (error || !data) return null

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    // Mark as expired
    await supabase
      .from("customer_assigned_discounts")
      .update({ status: "expired" })
      .eq("id", data.id)
    return null
  }

  return {
    id: data.id,
    customer_id: data.customer_id,
    customer_name: "",
    customer_email: "",
    discount_code_id: data.discount_code_id,
    discount_code: data.discount_codes?.code || null,
    custom_discount_type: data.custom_discount_type || data.discount_codes?.discount_type,
    custom_discount_value: data.custom_discount_value || data.discount_codes?.discount_value,
    custom_description: data.custom_description,
    status: data.status,
    expires_at: data.expires_at,
    created_at: data.created_at,
    used_at: data.used_at,
    notes: data.notes,
  }
}

// Mark discount as used (called after successful order)
export async function markDiscountAsUsed(
  assignmentId: string,
  orderId: string
): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("customer_assigned_discounts")
    .update({
      status: "used",
      used_at: new Date().toISOString(),
      used_on_order_id: orderId,
    })
    .eq("id", assignmentId)

  if (error) {
    console.error("[rep-pricing] Error marking discount as used:", error)
    return false
  }

  return true
}

