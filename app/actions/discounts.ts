"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

export interface DiscountCode {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed" | "set_price"
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  current_uses: number
  customer_type: "all" | "retail" | "b2b" | "b2bvip"
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  free_shipping: boolean
}

export interface DiscountUsage {
  id: string
  discount_code_id: string
  customer_id: string
  order_id: string
  used_at: string
  discount_amount: number
  customer?: {
    id: string
    user_id: string
    user?: {
      first_name: string
      last_name: string
      email: string
    }
  }
}

export interface DiscountCodeProduct {
  id: string
  discount_code_id: string
  product_id: string
  custom_price: number
  created_at: string
  product?: {
    id: string
    name: string
    base_name: string
    variant: string | null
    retail_price: number
    color: string
  }
}

export interface RepProductPricing {
  id: string
  rep_id: string
  product_id: string
  custom_price: number
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    base_name: string
    variant: string | null
    retail_price: number
    color: string
  }
}

export interface Rep {
  id: string
  first_name: string
  last_name: string
  email: string
  can_create_discount_codes: boolean
}

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[admin] Error fetching discount codes:", error)
    return []
  }

  return data || []
}

export async function getDiscountCodeById(id: string): Promise<DiscountCode | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase.from("discount_codes").select("*").eq("id", id).single()

  if (error) {
    console.error("[admin] Error fetching discount code:", error)
    return null
  }

  return data
}

export async function getDiscountUsage(discountCodeId: string): Promise<DiscountUsage[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("discount_usage")
    .select("*")
    .eq("discount_code_id", discountCodeId)
    .order("used_at", { ascending: false })

  if (error) {
    console.error("[admin] Error fetching discount usage:", error)
    return []
  }

  if (data && data.length > 0) {
    const customerIds = [...new Set(data.map((u) => u.customer_id).filter(Boolean))]

    if (customerIds.length > 0) {
      const { data: customers } = await supabase.from("customers").select("id, user_id").in("id", customerIds)

      if (customers && customers.length > 0) {
        const userIds = customers.map((c) => c.user_id).filter(Boolean)
        const { data: users } = await supabase
          .from("users")
          .select("id, first_name, last_name, email")
          .in("id", userIds)

        const usersMap = new Map(users?.map((u) => [u.id, u]) || [])
        const customersMap = new Map(customers.map((c) => [c.id, { ...c, user: usersMap.get(c.user_id) }]))

        return data.map((usage) => ({
          ...usage,
          customer: customersMap.get(usage.customer_id),
        }))
      }
    }
  }

  return data || []
}

export async function createDiscountCode(
  discountCode: Omit<DiscountCode, "id" | "created_at" | "updated_at" | "current_uses">,
): Promise<DiscountCode | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("discount_codes")
    .insert({
      ...discountCode,
      current_uses: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("[admin] Error creating discount code:", error)
    return null
  }

  return data
}

export async function updateDiscountCode(id: string, updates: Partial<DiscountCode>): Promise<DiscountCode | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("discount_codes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[admin] Error updating discount code:", error)
    return null
  }

  return data
}

export async function deleteDiscountCode(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase.from("discount_codes").delete().eq("id", id)

  if (error) {
    console.error("[admin] Error deleting discount code:", error)
    return false
  }

  return true
}

export async function toggleDiscountCodeStatus(id: string, isActive: boolean): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("discount_codes")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("[admin] Error toggling discount code status:", error)
    return false
  }

  return true
}

export async function getDiscountCodeProducts(discountCodeId: string): Promise<DiscountCodeProduct[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("discount_code_products")
    .select("*")
    .eq("discount_code_id", discountCodeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[admin] Error fetching discount code products:", error)
    return []
  }

  if (data && data.length > 0) {
    const productIds = data.map((p) => p.product_id)
    const { data: products } = await supabase
      .from("products")
      .select("id, name, base_name, variant, retail_price, color")
      .in("id", productIds)

    const productsMap = new Map(products?.map((p) => [p.id, p]) || [])

    return data.map((item) => ({
      ...item,
      product: productsMap.get(item.product_id),
    }))
  }

  return data || []
}

export async function addDiscountCodeProduct(
  discountCodeId: string,
  productId: string,
  customPrice: number,
): Promise<DiscountCodeProduct | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("discount_code_products")
    .insert({
      discount_code_id: discountCodeId,
      product_id: productId,
      custom_price: customPrice,
    })
    .select()
    .single()

  if (error) {
    console.error("[admin] Error adding discount code product:", error)
    return null
  }

  return data
}

export async function updateDiscountCodeProduct(id: string, customPrice: number): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase.from("discount_code_products").update({ custom_price: customPrice }).eq("id", id)

  if (error) {
    console.error("[admin] Error updating discount code product:", error)
    return false
  }

  return true
}

export async function removeDiscountCodeProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase.from("discount_code_products").delete().eq("id", id)

  if (error) {
    console.error("[admin] Error removing discount code product:", error)
    return false
  }

  return true
}

export async function bulkUpdateDiscountCodeProducts(
  discountCodeId: string,
  products: Array<{ productId: string; customPrice: number | null }>,
): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  // Get existing products for this discount code
  const { data: existing } = await supabase
    .from("discount_code_products")
    .select("id, product_id")
    .eq("discount_code_id", discountCodeId)

  const existingMap = new Map(existing?.map((e) => [e.product_id, e.id]) || [])

  for (const { productId, customPrice } of products) {
    const existingId = existingMap.get(productId)

    if (customPrice === null || customPrice === 0) {
      // Remove if price is null/0 and exists
      if (existingId) {
        await supabase.from("discount_code_products").delete().eq("id", existingId)
      }
    } else if (existingId) {
      // Update existing
      await supabase.from("discount_code_products").update({ custom_price: customPrice }).eq("id", existingId)
    } else {
      // Insert new
      await supabase.from("discount_code_products").insert({
        discount_code_id: discountCodeId,
        product_id: productId,
        custom_price: customPrice,
      })
    }
  }

  return true
}

export async function getAllProducts(): Promise<
  Array<{
    id: string
    name: string
    base_name: string
    variant: string | null
    retail_price: number
    color: string
  }>
> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("products")
    .select("id, name, base_name, variant, retail_price, color")
    .eq("is_active", true)
    .order("base_name", { ascending: true })

  if (error) {
    console.error("[admin] Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getReps(): Promise<Rep[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, can_create_discount_codes")
    .in("role", ["rep", "admin"])
    .order("first_name", { ascending: true })

  if (error) {
    console.error("[admin] Error fetching reps:", error)
    return []
  }

  return (data || []).map(d => ({
    ...d,
    can_create_discount_codes: d.can_create_discount_codes || false,
  }))
}

export async function toggleRepDiscountPermission(repId: string, canCreate: boolean): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("users")
    .update({ can_create_discount_codes: canCreate })
    .eq("id", repId)

  if (error) {
    console.error("[admin] Error updating rep discount permission:", error)
    return false
  }

  return true
}

export async function assignDiscountCodeToRep(codeId: string, repId: string | null): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("discount_codes")
    .update({ assigned_rep_id: repId })
    .eq("id", codeId)

  if (error) {
    console.error("[admin] Error assigning discount code to rep:", error)
    return false
  }

  return true
}

// Customer Assigned Discounts - Admin Functions

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
  assigned_by_rep_name: string | null
  assigned_by_admin_name: string | null
  notes: string | null
}

export interface Customer {
  id: string
  user_id: string
  name: string
  email: string
  customer_type: string
}

// Get all customers for admin
export async function getAllCustomers(): Promise<Customer[]> {
  const supabase = getSupabaseAdminClient()

  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, user_id, customer_type")
    .order("created_at", { ascending: false })

  if (error || !customers) {
    console.error("[admin] Error fetching customers:", error)
    return []
  }

  const userIds = customers.map(c => c.user_id).filter(Boolean)
  
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

  return customers.map(c => {
    const userInfo = userMap.get(c.user_id)
    return {
      id: c.id,
      user_id: c.user_id,
      name: userInfo?.name || "Unknown",
      email: userInfo?.email || "",
      customer_type: c.customer_type || "retail",
    }
  })
}

// Get all customer assigned discounts for admin
export async function getAllAssignedDiscounts(): Promise<CustomerAssignedDiscount[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("customer_assigned_discounts")
    .select(`
      *,
      discount_codes(code)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[admin] Error fetching assigned discounts:", error)
    return []
  }

  if (!data || data.length === 0) return []

  // Get customer details
  const customerIds = [...new Set(data.map(d => d.customer_id))]
  const { data: customers } = await supabase
    .from("customers")
    .select("id, user_id")
    .in("id", customerIds)

  const userIds = [
    ...(customers || []).map(c => c.user_id),
    ...data.map(d => d.assigned_by_rep_id).filter(Boolean),
    ...data.map(d => d.assigned_by_admin_id).filter(Boolean),
  ].filter(Boolean)

  const customerToUserMap = new Map((customers || []).map(c => [c.id, c.user_id]))

  const { data: users } = await supabase
    .from("users")
    .select("id, first_name, last_name, email")
    .in("id", [...new Set(userIds)])

  const userMap = new Map(
    (users || []).map(u => [u.id, {
      name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || "Unknown",
      email: u.email
    }])
  )

  return data.map(d => {
    const userId = customerToUserMap.get(d.customer_id)
    const userInfo = userId ? userMap.get(userId) : null
    const repInfo = d.assigned_by_rep_id ? userMap.get(d.assigned_by_rep_id) : null
    const adminInfo = d.assigned_by_admin_id ? userMap.get(d.assigned_by_admin_id) : null

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
      assigned_by_rep_name: repInfo?.name || null,
      assigned_by_admin_name: adminInfo?.name || null,
      notes: d.notes,
    }
  })
}

// Admin assign discount to customer
export async function adminAssignDiscountToCustomer(
  adminId: string,
  customerId: string,
  discount: {
    discountCodeId?: string
    customDiscountType?: "percentage" | "fixed"
    customDiscountValue?: number
    customDescription?: string
    expiresAt?: string
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Check if customer already has an active discount
  const { data: existing } = await supabase
    .from("customer_assigned_discounts")
    .select("id")
    .eq("customer_id", customerId)
    .eq("status", "active")
    .single()

  if (existing) {
    return { success: false, error: "Customer already has an active discount. Remove it first." }
  }

  const { error } = await supabase
    .from("customer_assigned_discounts")
    .insert({
      customer_id: customerId,
      discount_code_id: discount.discountCodeId || null,
      custom_discount_type: discount.customDiscountType || null,
      custom_discount_value: discount.customDiscountValue || null,
      custom_description: discount.customDescription || null,
      assigned_by_admin_id: adminId,
      expires_at: discount.expiresAt || null,
      notes: discount.notes || null,
      status: "active",
    })

  if (error) {
    console.error("[admin] Error assigning discount:", error)
    return { success: false, error: "Failed to assign discount" }
  }

  return { success: true }
}

// Admin remove assigned discount
export async function adminRemoveAssignedDiscount(
  adminId: string,
  assignmentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  const { data: existing } = await supabase
    .from("customer_assigned_discounts")
    .select("status")
    .eq("id", assignmentId)
    .single()

  if (!existing) {
    return { success: false, error: "Discount assignment not found" }
  }

  if (existing.status !== "active") {
    return { success: false, error: "Only active discounts can be removed" }
  }

  const { error } = await supabase
    .from("customer_assigned_discounts")
    .update({
      status: "removed",
      removed_at: new Date().toISOString(),
      removed_by_id: adminId,
    })
    .eq("id", assignmentId)

  if (error) {
    console.error("[admin] Error removing discount:", error)
    return { success: false, error: "Failed to remove discount" }
  }

  return { success: true }
}

export async function getRepProductPricing(repId: string): Promise<RepProductPricing[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("rep_product_pricing")
    .select("*")
    .eq("rep_id", repId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[admin] Error fetching rep product pricing:", error)
    return []
  }

  if (data && data.length > 0) {
    const productIds = data.map((p) => p.product_id)
    const { data: products } = await supabase
      .from("products")
      .select("id, name, base_name, variant, retail_price, color")
      .in("id", productIds)

    const productsMap = new Map(products?.map((p) => [p.id, p]) || [])

    return data.map((item) => ({
      ...item,
      product: productsMap.get(item.product_id),
    }))
  }

  return data || []
}

export async function bulkUpdateRepProductPricing(
  repId: string,
  products: Array<{ productId: string; customPrice: number | null }>,
): Promise<boolean> {
  const supabase = getSupabaseAdminClient()

  // Get existing products for this rep
  const { data: existing } = await supabase.from("rep_product_pricing").select("id, product_id").eq("rep_id", repId)

  const existingMap = new Map(existing?.map((e) => [e.product_id, e.id]) || [])

  for (const { productId, customPrice } of products) {
    const existingId = existingMap.get(productId)

    if (customPrice === null || customPrice === 0) {
      // Remove if price is null/0 and exists
      if (existingId) {
        await supabase.from("rep_product_pricing").delete().eq("id", existingId)
      }
    } else if (existingId) {
      // Update existing
      await supabase.from("rep_product_pricing").update({ custom_price: customPrice }).eq("id", existingId)
    } else {
      // Insert new
      await supabase.from("rep_product_pricing").insert({
        rep_id: repId,
        product_id: productId,
        custom_price: customPrice,
      })
    }
  }

  return true
}

