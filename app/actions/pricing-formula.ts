"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"

// ============================================
// PRICING FORMULA TYPES
// ============================================

export interface PricingFormula {
  id: string
  name: string
  min_markup_multiplier: number
  max_markup_multiplier: number
  is_active: boolean
  description: string | null
  created_at: string
  updated_at: string
}

export interface PricingBreakdown {
  cost: number
  minimumPrice: number
  maximumPrice: number
  actualSalePrice: number
  commissionPool: number
  discountApplied: number
  commissionAfterDiscount: number
  repCommissionRate: number
  repCommissionAmount: number
  formula: PricingFormula
}

export interface OrderPricingBreakdown {
  id: string
  order_id: string
  total_cost: number
  minimum_price: number
  maximum_price: number
  actual_sale_price: number
  commission_pool: number
  discount_applied: number
  commission_after_discount: number
  rep_commission_rate: number
  rep_commission_amount: number
  formula_id: string | null
  min_markup_used: number
  max_markup_used: number
  calculated_at: string
}

// ============================================
// GET ALL FORMULAS
// ============================================

export async function getAllPricingFormulas(): Promise<PricingFormula[]> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("pricing_formula_settings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[pricing-formula] Error fetching formulas:", error)
    return []
  }

  return (data || []).map((f) => ({
    id: f.id,
    name: f.name,
    min_markup_multiplier: Number(f.min_markup_multiplier),
    max_markup_multiplier: Number(f.max_markup_multiplier),
    is_active: f.is_active,
    description: f.description,
    created_at: f.created_at,
    updated_at: f.updated_at,
  }))
}

// ============================================
// GET ACTIVE FORMULA
// ============================================

export async function getActivePricingFormula(): Promise<PricingFormula | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("pricing_formula_settings")
    .select("*")
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("[pricing-formula] Error fetching active formula:", error)
    // Return default if no formula exists
    return {
      id: "default",
      name: "Default Formula",
      min_markup_multiplier: 2.0,
      max_markup_multiplier: 4.0,
      is_active: true,
      description: "Default pricing formula",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  return {
    id: data.id,
    name: data.name,
    min_markup_multiplier: Number(data.min_markup_multiplier),
    max_markup_multiplier: Number(data.max_markup_multiplier),
    is_active: data.is_active,
    description: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

// ============================================
// CREATE FORMULA
// ============================================

export async function createPricingFormula(
  formula: {
    name: string
    min_markup_multiplier: number
    max_markup_multiplier: number
    description?: string
    is_active?: boolean
  }
): Promise<{ success: boolean; formula?: PricingFormula; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Validation
  if (formula.min_markup_multiplier < 1) {
    return { success: false, error: "Minimum markup must be at least 1x (cost)" }
  }
  
  if (formula.max_markup_multiplier <= formula.min_markup_multiplier) {
    return { success: false, error: "Maximum markup must be greater than minimum markup" }
  }

  const { data, error } = await supabase
    .from("pricing_formula_settings")
    .insert({
      name: formula.name,
      min_markup_multiplier: formula.min_markup_multiplier,
      max_markup_multiplier: formula.max_markup_multiplier,
      description: formula.description || null,
      is_active: formula.is_active || false,
    })
    .select()
    .single()

  if (error) {
    console.error("[pricing-formula] Error creating formula:", error)
    return { success: false, error: "Failed to create pricing formula" }
  }

  return {
    success: true,
    formula: {
      id: data.id,
      name: data.name,
      min_markup_multiplier: Number(data.min_markup_multiplier),
      max_markup_multiplier: Number(data.max_markup_multiplier),
      is_active: data.is_active,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
  }
}

// ============================================
// UPDATE FORMULA
// ============================================

export async function updatePricingFormula(
  formulaId: string,
  updates: {
    name?: string
    min_markup_multiplier?: number
    max_markup_multiplier?: number
    description?: string
    is_active?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Validation
  if (updates.min_markup_multiplier !== undefined && updates.min_markup_multiplier < 1) {
    return { success: false, error: "Minimum markup must be at least 1x (cost)" }
  }
  
  if (
    updates.min_markup_multiplier !== undefined && 
    updates.max_markup_multiplier !== undefined &&
    updates.max_markup_multiplier <= updates.min_markup_multiplier
  ) {
    return { success: false, error: "Maximum markup must be greater than minimum markup" }
  }

  const { error } = await supabase
    .from("pricing_formula_settings")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", formulaId)

  if (error) {
    console.error("[pricing-formula] Error updating formula:", error)
    return { success: false, error: "Failed to update pricing formula" }
  }

  return { success: true }
}

// ============================================
// DELETE FORMULA
// ============================================

export async function deletePricingFormula(
  formulaId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // Check if this is the active formula
  const { data: formula } = await supabase
    .from("pricing_formula_settings")
    .select("is_active")
    .eq("id", formulaId)
    .single()

  if (formula?.is_active) {
    return { success: false, error: "Cannot delete the active pricing formula" }
  }

  const { error } = await supabase
    .from("pricing_formula_settings")
    .delete()
    .eq("id", formulaId)

  if (error) {
    console.error("[pricing-formula] Error deleting formula:", error)
    return { success: false, error: "Failed to delete pricing formula" }
  }

  return { success: true }
}

// ============================================
// SET ACTIVE FORMULA
// ============================================

export async function setActivePricingFormula(
  formulaId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  // The database trigger will handle deactivating other formulas
  const { error } = await supabase
    .from("pricing_formula_settings")
    .update({ 
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", formulaId)

  if (error) {
    console.error("[pricing-formula] Error setting active formula:", error)
    return { success: false, error: "Failed to set active pricing formula" }
  }

  return { success: true }
}

// ============================================
// CALCULATE PRICING BREAKDOWN
// Core pricing logic - this is the key function
// ============================================

export async function calculatePricingBreakdown(
  totalCost: number,
  actualSalePrice: number,
  discountApplied: number,
  repCommissionRate: number, // As percentage, e.g., 10 for 10%
  formula?: PricingFormula
): Promise<PricingBreakdown> {
  // Get active formula if not provided
  const activeFormula = formula || (await getActivePricingFormula())!
  
  const minMarkup = activeFormula.min_markup_multiplier
  const maxMarkup = activeFormula.max_markup_multiplier
  
  // Calculate price boundaries
  const minimumPrice = totalCost * minMarkup  // This is the profit floor - NEVER touched
  const maximumPrice = totalCost * maxMarkup  // This is the ceiling for commission
  
  // Calculate the commission pool
  // Commission pool = how much above minimum price the sale was
  // Capped at (max - min) × cost
  const maxCommissionPool = maximumPrice - minimumPrice
  const rawCommissionPool = Math.max(0, actualSalePrice - minimumPrice)
  const commissionPool = Math.min(rawCommissionPool, maxCommissionPool)
  
  // Apply discount - discounts come out of the commission pool FIRST
  // This protects our cost and guaranteed profit
  const commissionAfterDiscount = Math.max(0, commissionPool - discountApplied)
  
  // Calculate rep commission
  // Rep gets their percentage of whatever's left in the commission pool after discount
  const commissionRateDecimal = repCommissionRate / 100
  const repCommissionAmount = commissionAfterDiscount * commissionRateDecimal
  
  return {
    cost: totalCost,
    minimumPrice,
    maximumPrice,
    actualSalePrice,
    commissionPool,
    discountApplied,
    commissionAfterDiscount,
    repCommissionRate,
    repCommissionAmount,
    formula: activeFormula,
  }
}

// ============================================
// CALCULATE ITEM-LEVEL PRICING
// For individual order items
// ============================================

export interface ItemPricingResult {
  productId: string
  productName: string
  quantity: number
  costPerUnit: number
  pricePerUnit: number
  totalCost: number
  totalPrice: number
  minimumPrice: number
  maximumPrice: number
  commissionPool: number
}

export async function calculateItemPricing(
  items: Array<{
    productId: string
    productName: string
    quantity: number
    costPerUnit: number
    pricePerUnit: number
  }>,
  formula?: PricingFormula
): Promise<ItemPricingResult[]> {
  const activeFormula = formula || (await getActivePricingFormula())!
  
  const minMarkup = activeFormula.min_markup_multiplier
  const maxMarkup = activeFormula.max_markup_multiplier
  
  return items.map((item) => {
    const totalCost = item.costPerUnit * item.quantity
    const totalPrice = item.pricePerUnit * item.quantity
    const minimumPrice = totalCost * minMarkup
    const maximumPrice = totalCost * maxMarkup
    const commissionPool = Math.min(
      Math.max(0, totalPrice - minimumPrice),
      maximumPrice - minimumPrice
    )
    
    return {
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      costPerUnit: item.costPerUnit,
      pricePerUnit: item.pricePerUnit,
      totalCost,
      totalPrice,
      minimumPrice,
      maximumPrice,
      commissionPool,
    }
  })
}

// ============================================
// SAVE ORDER PRICING BREAKDOWN
// Records the pricing for an order
// ============================================

export async function saveOrderPricingBreakdown(
  orderId: string,
  breakdown: PricingBreakdown
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()

  const { error } = await supabase
    .from("order_pricing_breakdown")
    .upsert({
      order_id: orderId,
      total_cost: breakdown.cost,
      minimum_price: breakdown.minimumPrice,
      maximum_price: breakdown.maximumPrice,
      actual_sale_price: breakdown.actualSalePrice,
      commission_pool: breakdown.commissionPool,
      discount_applied: breakdown.discountApplied,
      commission_after_discount: breakdown.commissionAfterDiscount,
      rep_commission_rate: breakdown.repCommissionRate,
      rep_commission_amount: breakdown.repCommissionAmount,
      formula_id: breakdown.formula.id === "default" ? null : breakdown.formula.id,
      min_markup_used: breakdown.formula.min_markup_multiplier,
      max_markup_used: breakdown.formula.max_markup_multiplier,
      calculated_at: new Date().toISOString(),
    }, {
      onConflict: "order_id",
    })

  if (error) {
    console.error("[pricing-formula] Error saving order pricing breakdown:", error)
    return { success: false, error: "Failed to save pricing breakdown" }
  }

  return { success: true }
}

// ============================================
// GET ORDER PRICING BREAKDOWN
// ============================================

export async function getOrderPricingBreakdown(
  orderId: string
): Promise<OrderPricingBreakdown | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from("order_pricing_breakdown")
    .select("*")
    .eq("order_id", orderId)
    .single()

  if (error) {
    if (error.code !== "PGRST116") { // Not a "no rows" error
      console.error("[pricing-formula] Error fetching order pricing:", error)
    }
    return null
  }

  return {
    id: data.id,
    order_id: data.order_id,
    total_cost: Number(data.total_cost),
    minimum_price: Number(data.minimum_price),
    maximum_price: Number(data.maximum_price),
    actual_sale_price: Number(data.actual_sale_price),
    commission_pool: Number(data.commission_pool),
    discount_applied: Number(data.discount_applied),
    commission_after_discount: Number(data.commission_after_discount),
    rep_commission_rate: Number(data.rep_commission_rate),
    rep_commission_amount: Number(data.rep_commission_amount),
    formula_id: data.formula_id,
    min_markup_used: Number(data.min_markup_used),
    max_markup_used: Number(data.max_markup_used),
    calculated_at: data.calculated_at,
  }
}

// ============================================
// PREVIEW COMMISSION FOR REP
// Shows what a rep would earn for a given sale
// ============================================

export interface CommissionPreview {
  salePrice: number
  cost: number
  minimumPrice: number
  maximumPrice: number
  profitGuaranteed: number
  commissionableAmount: number
  repCommissionRate: number
  estimatedCommission: number
  discountImpact: number
}

export async function previewRepCommission(
  salePrice: number,
  cost: number,
  repCommissionRate: number,
  discountAmount: number = 0
): Promise<CommissionPreview> {
  const formula = await getActivePricingFormula()
  
  if (!formula) {
    throw new Error("No active pricing formula found")
  }
  
  const minMarkup = formula.min_markup_multiplier
  const maxMarkup = formula.max_markup_multiplier
  
  const minimumPrice = cost * minMarkup
  const maximumPrice = cost * maxMarkup
  const profitGuaranteed = minimumPrice - cost
  
  const maxCommissionPool = maximumPrice - minimumPrice
  const rawCommissionPool = Math.max(0, salePrice - minimumPrice)
  const commissionableAmount = Math.min(rawCommissionPool, maxCommissionPool)
  
  const commissionableAfterDiscount = Math.max(0, commissionableAmount - discountAmount)
  const estimatedCommission = commissionableAfterDiscount * (repCommissionRate / 100)
  
  const discountImpact = Math.min(discountAmount, commissionableAmount) * (repCommissionRate / 100)
  
  return {
    salePrice,
    cost,
    minimumPrice,
    maximumPrice,
    profitGuaranteed,
    commissionableAmount,
    repCommissionRate,
    estimatedCommission,
    discountImpact,
  }
}
