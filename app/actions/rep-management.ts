"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getActivePricingFormula } from "./pricing-formula"

// Helper function to calculate formula-based commission for orders
async function calculateFormulaBasedCommission(
  supabase: ReturnType<typeof createAdminClient>,
  orders: Array<{ id: string; total_amount?: number; discount_amount?: number }>,
  repCommissionRate: number
): Promise<number> {
  if (!supabase || orders.length === 0) return 0
  
  // Get pricing formula
  const pricingFormula = await getActivePricingFormula()
  const minMarkup = pricingFormula?.min_markup_multiplier || 2.0
  const maxMarkup = pricingFormula?.max_markup_multiplier || 4.0
  
  const orderIds = orders.map(o => o.id)
  
  // Get order items
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
  
  // Calculate total commission
  let totalCommission = 0
  
  orders.forEach(order => {
    const items = itemsByOrder.get(order.id) || []
    const discountApplied = Number(order.discount_amount || 0)
    
    let orderCommissionPool = 0
    
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
      
      orderCommissionPool += commissionPool
    })
    
    // Deduct discount from commission pool
    const adjustedPool = Math.max(0, orderCommissionPool - discountApplied)
    
    // Rep gets their percentage
    totalCommission += adjustedPool * repCommissionRate
  })
  
  return totalCommission
}

// ===== TYPES =====

export interface RepProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  phone: string | null
  created_at: string
  crypto_wallet_address: string | null
  commission_rate: number
  bonus_commission: number
  total_customers: number
  total_orders: number
  total_sales: number
  total_commission_earned: number
  total_commission_paid: number
  pending_commission: number
}

export interface RepCustomer {
  id: string
  user_id: string | null
  company_name: string | null
  customer_type: string
  phone: string | null
  created_at: string
  assigned_at: string
  user?: {
    email: string
    first_name: string | null
    last_name: string | null
  }
  total_orders: number
  total_spent: number
  last_order_date: string | null
}

export interface RepOrder {
  id: string
  order_number?: string
  customer_id: string
  customer_name?: string
  status: string
  total_amount: number
  commission_amount: number
  created_at: string
  customer?: {
    company_name: string | null
    user?: {
      first_name: string | null
      last_name: string | null
      email: string
    }
  }
}

export interface DiscountCodeHistory {
  id: string
  code: string
  description: string | null
  discount_type: string
  discount_value: number
  is_active: boolean
  created_at: string
  current_uses: number
  max_uses: number | null
  times_used?: number
  usages: {
    id: string
    used_at: string
    discount_amount: number
    order_id: string
    customer?: {
      company_name: string | null
      user?: {
        first_name: string | null
        last_name: string | null
        email: string
      }
    }
  }[]
}

export interface PriceEditHistory {
  id: string
  product_id: string
  custom_price: number
  created_at: string
  updated_at: string
  product_name?: string
  old_price?: number
  new_price?: number
  product?: {
    name: string
    base_name: string
    variant: string | null
    retail_price: number
    color: string
  }
}

export interface CommissionPayment {
  id: string
  rep_id: string
  amount: number
  payment_method: string
  payment_reference: string | null
  notes: string | null
  created_at: string
  created_by: string | null
}

export interface CommissionReport {
  rep_id: string
  rep_name: string
  period_start: string
  period_end: string
  total_orders: number
  total_sales: number
  commission_rate: number
  bonus_commission: number
  gross_commission: number
  already_paid: number
  net_due: number
  orders: {
    id: string
    date: string
    customer: string
    amount: number
    commission: number
  }[]
}

// ===== GET ALL REPS =====
export async function getAllReps(): Promise<RepProfile[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) {
      console.log("[rep-management] No supabase client available")
      return []
    }

    // Get all users with role = 'rep'
    const { data: reps, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "rep")
      .order("created_at", { ascending: false })

    if (error) {
      console.log("[rep-management] Error fetching reps:", error.message)
      return []
    }

    if (!reps || reps.length === 0) {
      console.log("[rep-management] No reps found in database")
      return []
    }

    // Get customer counts, order stats for each rep
    const repProfiles: RepProfile[] = await Promise.all(
      reps.map(async (rep) => {
        // Get customer assignments
        const { data: assignments } = await supabase
          .from("customer_rep_assignments")
          .select("customer_id")
          .eq("rep_id", rep.id)
          .eq("is_current", true)

        const customerIds = (assignments || []).map((a) => a.customer_id)

        let totalOrders = 0
        let totalSales = 0
        let totalCommissionEarned = 0
        let totalCommissionPaid = 0

        if (customerIds.length > 0) {
          // Get orders for these customers
          const { data: orders } = await supabase
            .from("orders")
            .select("id, total_amount, discount_amount, status")
            .in("customer_id", customerIds)

          const allOrders = orders || []
          totalOrders = allOrders.length
          totalSales = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

          // Calculate commission using the pricing formula
          const commissionRate = Number(rep.commission_rate || 10) / 100
          totalCommissionEarned = await calculateFormulaBasedCommission(supabase, allOrders, commissionRate)

          // Get commission payments
          const { data: payments } = await supabase
            .from("rep_commission_payments")
            .select("amount")
            .eq("rep_id", rep.id)

          totalCommissionPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)
        }

        return {
          id: rep.id,
          email: rep.email,
          first_name: rep.first_name,
          last_name: rep.last_name,
          role: rep.role,
          phone: rep.phone,
          created_at: rep.created_at,
          crypto_wallet_address: rep.crypto_wallet_address,
          commission_rate: Number(rep.commission_rate || 10),
          bonus_commission: Number(rep.bonus_commission || 0),
          total_customers: customerIds.length,
          total_orders: totalOrders,
          total_sales: totalSales,
          total_commission_earned: totalCommissionEarned,
          total_commission_paid: totalCommissionPaid,
          pending_commission: totalCommissionEarned - totalCommissionPaid + Number(rep.bonus_commission || 0),
        }
      }),
    )

    return repProfiles
  } catch (error) {
    console.log("[rep-management] Error in getAllReps:", error)
    return []
  }
}

// ===== GET REP BY ID =====
export async function getRepById(repId: string): Promise<RepProfile | null> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return null

    const { data: reps, error } = await supabase.from("users").select("*").eq("id", repId).limit(1)

    if (error || !reps || reps.length === 0) {
      console.log("[rep-management] Error fetching rep:", error?.message || "No rep found")
      return null
    }

    const rep = reps[0]

    // Get customer assignments
    const { data: assignments } = await supabase
      .from("customer_rep_assignments")
      .select("customer_id")
      .eq("rep_id", rep.id)
      .eq("is_current", true)

    const customerIds = (assignments || []).map((a) => a.customer_id)

    let totalOrders = 0
    let totalSales = 0
    let totalCommissionEarned = 0
    let totalCommissionPaid = 0

    if (customerIds.length > 0) {
      const { data: orders } = await supabase
        .from("orders")
        .select("id, total_amount, discount_amount, status")
        .in("customer_id", customerIds)

      const allOrders = orders || []
      totalOrders = allOrders.length
      totalSales = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

      // Calculate commission using the pricing formula
      const commissionRate = Number(rep.commission_rate || 10) / 100
      totalCommissionEarned = await calculateFormulaBasedCommission(supabase, allOrders, commissionRate)

      const { data: payments } = await supabase.from("rep_commission_payments").select("amount").eq("rep_id", rep.id)

      totalCommissionPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0)
    }

    return {
      id: rep.id,
      email: rep.email,
      first_name: rep.first_name,
      last_name: rep.last_name,
      role: rep.role,
      phone: rep.phone,
      created_at: rep.created_at,
      crypto_wallet_address: rep.crypto_wallet_address,
      commission_rate: Number(rep.commission_rate || 10),
      bonus_commission: Number(rep.bonus_commission || 0),
      total_customers: customerIds.length,
      total_orders: totalOrders,
      total_sales: totalSales,
      total_commission_earned: totalCommissionEarned,
      total_commission_paid: totalCommissionPaid,
      pending_commission: totalCommissionEarned - totalCommissionPaid + Number(rep.bonus_commission || 0),
    }
  } catch (error) {
    console.log("[rep-management] Error in getRepById:", error)
    return null
  }
}

// ===== GET REP CUSTOMERS =====
export async function getRepCustomers(repId: string): Promise<RepCustomer[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data: assignments, error } = await supabase
      .from("customer_rep_assignments")
      .select(
        `
        customer_id,
        assigned_at,
        customers (
          id,
          user_id,
          company_name,
          customer_type,
          phone,
          created_at
        )
      `,
      )
      .eq("rep_id", repId)
      .eq("is_current", true)

    if (error || !assignments) {
      console.log("[rep-management] Error fetching rep customers:", error?.message)
      return []
    }

    const customersWithNulls = await Promise.all(
      assignments.map(async (a: any) => {
        const customer = a.customers
        if (!customer) return null

        // Get user info if available
        let user = null
        if (customer.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("email, first_name, last_name")
            .eq("id", customer.user_id)
            .single()
          user = userData
        }

        // Get order stats
        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, created_at")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })

        const allOrders = orders || []
        const totalSpent = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
        const lastOrderDate = allOrders.length > 0 ? allOrders[0].created_at : null

        return {
          id: customer.id,
          user_id: customer.user_id,
          company_name: customer.company_name,
          customer_type: customer.customer_type,
          phone: customer.phone,
          created_at: customer.created_at,
          assigned_at: a.assigned_at,
          user: user || undefined,
          total_orders: allOrders.length,
          total_spent: totalSpent,
          last_order_date: lastOrderDate,
        }
      }),
    )

    return customersWithNulls.filter(Boolean) as RepCustomer[]
  } catch (error) {
    console.log("[rep-management] Error in getRepCustomers:", error)
    return []
  }
}

// ===== GET REP ORDERS =====
export async function getRepRecentOrders(repId: string, limit = 50): Promise<RepOrder[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    // Get customer IDs for this rep
    const { data: assignments } = await supabase
      .from("customer_rep_assignments")
      .select("customer_id")
      .eq("rep_id", repId)
      .eq("is_current", true)

    if (!assignments || assignments.length === 0) return []

    const customerIds = assignments.map((a) => a.customer_id)

    // Get rep's commission rate
    const { data: rep } = await supabase.from("users").select("commission_rate").eq("id", repId).single()

    const commissionRate = Number(rep?.commission_rate || 10) / 100

    // Get orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        customer_id,
        customer_name,
        status,
        total_amount,
        created_at,
        customers (
          company_name,
          user_id
        )
      `,
      )
      .in("customer_id", customerIds)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error || !orders) {
      console.log("[rep-management] Error fetching orders:", error?.message)
      return []
    }

    // Get user info for each customer
    const repOrders: RepOrder[] = await Promise.all(
      orders.map(async (order: any) => {
        let user = null
        if (order.customers?.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("first_name, last_name, email")
            .eq("id", order.customers.user_id)
            .single()
          user = userData
        }

        const customerName =
          user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : order.customers?.company_name || user?.email || "Unknown"

        return {
          id: order.id,
          order_number: order.order_number || order.id.slice(0, 8),
          customer_id: order.customer_id,
          customer_name: customerName,
          status: order.status,
          total_amount: Number(order.total_amount || 0),
          commission_amount: Number(order.total_amount || 0) * commissionRate,
          created_at: order.created_at,
          customer: {
            company_name: order.customers?.company_name,
            user: user || undefined,
          },
        }
      }),
    )

    return repOrders
  } catch (error) {
    console.log("[rep-management] Error in getRepRecentOrders:", error)
    return []
  }
}

// ===== ASSIGN CUSTOMER TO REP =====
export async function assignCustomerToRep(
  customerId: string,
  repId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Check if already assigned
    const { data: existing } = await supabase
      .from("customer_rep_assignments")
      .select("id")
      .eq("rep_id", repId)
      .eq("customer_id", customerId)
      .eq("is_current", true)
      .single()

    if (existing) {
      return { success: false, error: "Customer already assigned to this rep" }
    }

    // Deactivate any current assignment for this customer
    await supabase.from("customer_rep_assignments").update({ is_current: false }).eq("customer_id", customerId)

    // Create new assignment
    const { error } = await supabase.from("customer_rep_assignments").insert({
      rep_id: repId,
      customer_id: customerId,
      assigned_at: new Date().toISOString(),
      is_current: true,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in assignCustomerToRep:", error)
    return { success: false, error: "Failed to assign customer" }
  }
}

// ===== UNASSIGN CUSTOMER FROM REP =====
export async function unassignCustomerFromRep(
  customerId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    const { error } = await supabase
      .from("customer_rep_assignments")
      .update({ is_current: false })
      .eq("customer_id", customerId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in unassignCustomerFromRep:", error)
    return { success: false, error: "Failed to unassign customer" }
  }
}

// ===== GET UNASSIGNED CUSTOMERS =====
export async function getUnassignedCustomers(): Promise<RepCustomer[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    // Get all customer IDs that are currently assigned
    const { data: assignments } = await supabase
      .from("customer_rep_assignments")
      .select("customer_id")
      .eq("is_current", true)

    const assignedIds = (assignments || []).map((a) => a.customer_id)

    // Get all customers
    const { data: customers, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !customers) return []

    // Filter out assigned customers
    const unassigned = customers.filter((c) => !assignedIds.includes(c.id))

    // Get user info and order stats
    const result: RepCustomer[] = await Promise.all(
      unassigned.map(async (customer) => {
        let user = null
        if (customer.user_id) {
          const { data: userData } = await supabase
            .from("users")
            .select("email, first_name, last_name")
            .eq("id", customer.user_id)
            .single()
          user = userData
        }

        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, created_at")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })

        const allOrders = orders || []

        return {
          id: customer.id,
          user_id: customer.user_id,
          company_name: customer.company_name,
          customer_type: customer.customer_type,
          phone: customer.phone,
          created_at: customer.created_at,
          assigned_at: "",
          user: user || undefined,
          total_orders: allOrders.length,
          total_spent: allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
          last_order_date: allOrders.length > 0 ? allOrders[0].created_at : null,
        }
      }),
    )

    return result
  } catch (error) {
    console.log("[rep-management] Error in getUnassignedCustomers:", error)
    return []
  }
}

// ===== GET REP DISCOUNT CODE HISTORY =====
export async function getRepDiscountCodeHistory(repId: string): Promise<DiscountCodeHistory[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data: codes, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("created_by", repId)
      .order("created_at", { ascending: false })

    if (error || !codes) return []

    const history: DiscountCodeHistory[] = await Promise.all(
      codes.map(async (code) => {
        // Get usage history
        const { data: usages } = await supabase
          .from("discount_code_usage")
          .select(
            `
            id,
            used_at,
            discount_amount,
            order_id,
            customer_id,
            customers (
              company_name,
              user_id
            )
          `,
          )
          .eq("discount_code_id", code.id)
          .order("used_at", { ascending: false })

        const usagesWithCustomer = await Promise.all(
          (usages || []).map(async (usage: any) => {
            let user = null
            if (usage.customers?.user_id) {
              const { data: userData } = await supabase
                .from("users")
                .select("first_name, last_name, email")
                .eq("id", usage.customers.user_id)
                .single()
              user = userData
            }
            return {
              id: usage.id,
              used_at: usage.used_at,
              discount_amount: Number(usage.discount_amount || 0),
              order_id: usage.order_id,
              customer: {
                company_name: usage.customers?.company_name,
                user: user || undefined,
              },
            }
          }),
        )

        return {
          id: code.id,
          code: code.code,
          description: code.description,
          discount_type: code.discount_type,
          discount_value: Number(code.discount_value || 0),
          is_active: code.is_active,
          created_at: code.created_at,
          current_uses: code.current_uses || 0,
          max_uses: code.max_uses,
          times_used: usagesWithCustomer.length,
          usages: usagesWithCustomer,
        }
      }),
    )

    return history
  } catch (error) {
    console.log("[rep-management] Error in getRepDiscountCodeHistory:", error)
    return []
  }
}

// ===== GET REP PRICE EDIT HISTORY =====
export async function getRepPriceEditHistory(repId: string): Promise<PriceEditHistory[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data: pricing, error } = await supabase
      .from("rep_product_pricing")
      .select(
        `
        id,
        product_id,
        custom_price,
        created_at,
        updated_at,
        products (
          name,
          base_name,
          variant,
          retail_price,
          color
        )
      `,
      )
      .eq("rep_id", repId)
      .order("updated_at", { ascending: false })

    if (error || !pricing) return []

    return pricing.map((p: any) => ({
      id: p.id,
      product_id: p.product_id,
      custom_price: Number(p.custom_price || 0),
      created_at: p.created_at,
      updated_at: p.updated_at,
      product_name: p.products?.name || "Unknown",
      old_price: Number(p.products?.retail_price || 0),
      new_price: Number(p.custom_price || 0),
      product: p.products
        ? {
            name: p.products.name,
            base_name: p.products.base_name,
            variant: p.products.variant,
            retail_price: Number(p.products.retail_price || 0),
            color: p.products.color,
          }
        : undefined,
    }))
  } catch (error) {
    console.log("[rep-management] Error in getRepPriceEditHistory:", error)
    return []
  }
}

// ===== UPDATE REP COMMISSION RATE =====
export async function updateRepCommissionRate(
  repId: string,
  rate: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    const { error } = await supabase.from("users").update({ commission_rate: rate }).eq("id", repId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in updateRepCommissionRate:", error)
    return { success: false, error: "Failed to update commission rate" }
  }
}

// ===== UPDATE REP BONUS COMMISSION =====
export async function updateRepBonusCommission(
  repId: string,
  amount: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    const { error } = await supabase.from("users").update({ bonus_commission: amount }).eq("id", repId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in updateRepBonusCommission:", error)
    return { success: false, error: "Failed to update bonus commission" }
  }
}

// ===== RECORD COMMISSION PAYMENT =====
export async function recordCommissionPayment(
  repId: string,
  amount: number,
  paymentMethod: string,
  paymentReference?: string,
  notes?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    const { error } = await supabase.from("rep_commission_payments").insert({
      rep_id: repId,
      amount,
      payment_method: paymentMethod,
      payment_reference: paymentReference || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in recordCommissionPayment:", error)
    return { success: false, error: "Failed to record payment" }
  }
}

// ===== GET COMMISSION PAYMENTS =====
export async function getCommissionPayments(repId: string): Promise<CommissionPayment[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data: payments, error } = await supabase
      .from("rep_commission_payments")
      .select("*")
      .eq("rep_id", repId)
      .order("created_at", { ascending: false })

    if (error || !payments) return []

    return payments.map((p) => ({
      id: p.id,
      rep_id: p.rep_id,
      amount: Number(p.amount || 0),
      payment_method: p.payment_method,
      payment_reference: p.payment_reference,
      notes: p.notes,
      created_at: p.created_at,
      created_by: p.created_by,
    }))
  } catch (error) {
    console.log("[rep-management] Error in getCommissionPayments:", error)
    return []
  }
}

// ===== CREATE REP WITH PASSWORD =====
export async function createRepWithPassword(data: {
  email: string
  password: string
  first_name: string
  last_name: string
  commission_rate: number
}): Promise<{ success: boolean; error?: string; temporaryPassword?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Check if user already exists
    const { data: existing } = await supabase.from("users").select("id").eq("email", data.email).single()

    if (existing) {
      return { success: false, error: "User with this email already exists" }
    }

    // Validate password
    if (!data.password || data.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }

    // Create user in auth with password (email auto-confirmed for admin-created users)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm so they can login immediately
      user_metadata: {
        first_name: data.first_name,
        last_name: data.last_name,
        role: "rep",
      },
    })

    if (authError) {
      console.log("[rep-management] Error creating auth user:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create auth user" }
    }

    // Create user in users table
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: "rep",
      commission_rate: data.commission_rate,
      bonus_commission: 0,
      created_at: new Date().toISOString(),
    })

    if (userError) {
      console.log("[rep-management] Error creating user record:", userError)
      // Clean up auth user if users table insert fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: userError.message }
    }

    // Create customer record with B2B pricing (reps get B2B pricing by default)
    const { error: customerError } = await supabase.from("customers").insert({
      user_id: authData.user.id,
      customer_type: "b2b",
      created_at: new Date().toISOString(),
    })

    if (customerError) {
      console.log("[rep-management] Warning: Failed to create customer record for rep:", customerError.message)
      // Don't fail - rep is still created, they just won't have a customer record yet
    }

    return { 
      success: true,
      temporaryPassword: data.password // Return so admin can share with rep
    }
  } catch (error) {
    console.log("[rep-management] Error in createRepWithPassword:", error)
    return { success: false, error: "Failed to create rep" }
  }
}

// ===== INVITE REP =====
export async function inviteRep(data: {
  email: string
  first_name: string
  last_name: string
  commission_rate: number
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Check if user already exists
    const { data: existing } = await supabase.from("users").select("id").eq("email", data.email).single()

    if (existing) {
      return { success: false, error: "User with this email already exists" }
    }

    // Create user in auth (this will send invite email)
    // The redirectTo URL is where users land after clicking the invite link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
      : "http://localhost:3000"
    
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(data.email, {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        role: "rep",
      },
      redirectTo: `${siteUrl}/set-password`,
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    // Create user in users table
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: "rep",
      commission_rate: data.commission_rate,
      bonus_commission: 0,
      created_at: new Date().toISOString(),
    })

    if (userError) {
      return { success: false, error: userError.message }
    }

    // Create customer record with B2B pricing (reps get B2B pricing by default)
    const { error: customerError } = await supabase.from("customers").insert({
      user_id: authData.user.id,
      customer_type: "b2b",
      created_at: new Date().toISOString(),
    })

    if (customerError) {
      console.log("[rep-management] Warning: Failed to create customer record for rep:", customerError.message)
      // Don't fail - rep is still created, they just won't have a customer record yet
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in inviteRep:", error)
    return { success: false, error: "Failed to invite rep" }
  }
}

// ===== PROMOTE CUSTOMER TO REP =====
export async function promoteCustomerToRep(
  customerId: string,
  commissionRate: number = 10
): Promise<{ success: boolean; error?: string; repId?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Get the customer to find their user_id
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("user_id")
      .eq("id", customerId)
      .single()

    if (customerError || !customer) {
      return { success: false, error: "Customer not found" }
    }

    if (!customer.user_id) {
      return { success: false, error: "Customer does not have an associated user account" }
    }

    // Check if user is already a rep
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", customer.user_id)
      .single()

    if (userError || !user) {
      return { success: false, error: "User account not found" }
    }

    if (user.role === "rep" || user.role === "admin") {
      return { success: false, error: `User is already a ${user.role}` }
    }

    // Update user role to rep
    const { error: updateError } = await supabase
      .from("users")
      .update({
        role: "rep",
        commission_rate: commissionRate,
        bonus_commission: 0,
      })
      .eq("id", customer.user_id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Update customer pricing tier to b2b (reps get B2B pricing by default)
    const { error: customerUpdateError } = await supabase
      .from("customers")
      .update({
        customer_type: "b2b",
      })
      .eq("id", customerId)

    if (customerUpdateError) {
      console.log("[rep-management] Warning: Failed to update customer type to b2b:", customerUpdateError.message)
      // Don't fail the whole operation, rep role is already set
    }

    return { success: true, repId: customer.user_id }
  } catch (error) {
    console.log("[rep-management] Error in promoteCustomerToRep:", error)
    return { success: false, error: "Failed to promote customer to rep" }
  }
}

// ===== DELETE REP =====
export async function deleteRep(repId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Deactivate all customer assignments
    await supabase.from("customer_rep_assignments").update({ is_current: false }).eq("rep_id", repId)

    // Delete the rep user
    const { error } = await supabase.from("users").delete().eq("id", repId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in deleteRep:", error)
    return { success: false, error: "Failed to delete rep" }
  }
}

// ===== GET ALL PRODUCTS =====
export async function getAllProducts(): Promise<
  { id: string; name: string; base_name: string; variant: string | null; retail_price: number; color: string }[]
> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, base_name, variant, retail_price, color")
      .order("name")

    if (error || !products) return []

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      base_name: p.base_name,
      variant: p.variant,
      retail_price: Number(p.retail_price || 0),
      color: p.color || "",
    }))
  } catch (error) {
    console.log("[rep-management] Error in getAllProducts:", error)
    return []
  }
}

// ===== GET REP PRODUCT PRICING =====
export async function getRepProductPricing(repId: string): Promise<{ product_id: string; custom_price: number }[]> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return []

    const { data: pricing, error } = await supabase
      .from("rep_product_pricing")
      .select("product_id, custom_price")
      .eq("rep_id", repId)

    if (error || !pricing) return []

    return pricing.map((p) => ({
      product_id: p.product_id,
      custom_price: Number(p.custom_price || 0),
    }))
  } catch (error) {
    console.log("[rep-management] Error in getRepProductPricing:", error)
    return []
  }
}

// ===== BULK UPDATE REP PRODUCT PRICING =====
export async function bulkUpdateRepProductPricing(
  repId: string,
  pricing: { productId: string; customPrice: number | null }[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Process each price update
    for (const p of pricing) {
      if (p.customPrice === null) {
        // Delete the pricing entry
        await supabase
          .from("rep_product_pricing")
          .delete()
          .eq("rep_id", repId)
          .eq("product_id", p.productId)
      } else {
        // Upsert the pricing entry
        const { error } = await supabase
          .from("rep_product_pricing")
          .upsert({
            rep_id: repId,
            product_id: p.productId,
            custom_price: p.customPrice,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "rep_id,product_id"
          })

        if (error) {
          console.log("[rep-management] Error upserting price:", error)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in bulkUpdateRepProductPricing:", error)
    return { success: false, error: "Failed to update pricing" }
  }
}

// ===== UPDATE USER ROLE =====
// This uses admin client to bypass RLS when updating user roles
export async function updateUserRole(
  userId: string,
  newRole: string,
  firstName?: string,
  lastName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()
    if (!supabase) return { success: false, error: "No database connection" }

    // Update the user's role
    const { error: userError } = await supabase
      .from("users")
      .update({
        role: newRole,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (userError) {
      return { success: false, error: userError.message }
    }

    // If role is changed to rep, update customer_type to b2b
    if (newRole === "rep") {
      const { error: customerError } = await supabase
        .from("customers")
        .update({ customer_type: "b2b" })
        .eq("user_id", userId)

      if (customerError) {
        console.log("[rep-management] Note: Could not update customer type to b2b:", customerError.message)
        // Don't fail - user role was updated successfully
      }
    }

    return { success: true }
  } catch (error) {
    console.log("[rep-management] Error in updateUserRole:", error)
    return { success: false, error: "Failed to update user role" }
  }
}

