"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import crypto from "crypto"

// ============================================================
// Types
// ============================================================

export interface FulfillmentOrder {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  fulfillment_token: string | null
  fulfillment_started_at: string | null
  packed_by: string | null
  pack_verified_at: string | null
  created_at: string
  customer_name: string | null
  shipping_name: string | null
  shipping_address_line1: string | null
  shipping_address_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  shipping_country: string | null
  admin_notes: string | null
  customers: {
    id: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
    phone: string | null
    users: {
      first_name: string | null
      last_name: string | null
      email: string | null
      phone: string | null
    } | null
  } | null
  order_items: {
    id: string
    product_name: string
    product_barcode: string | null
    quantity: number
    unit_price: number
    total_price: number
  }[]
}

export interface OrderPhoto {
  id: string
  order_id: string
  url: string
  filename: string | null
  created_at: string
}

// ============================================================
// Get Order for Fulfillment
// ============================================================

export async function getOrderForFulfillment(
  orderId: string
): Promise<{ success: boolean; order?: FulfillmentOrder; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: "Database unavailable" }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      subtotal,
      discount_amount,
      tax_amount,
      shipping_amount,
      total_amount,
      tracking_number,
      shipping_carrier,
      shipped_at,
      fulfillment_token,
      fulfillment_started_at,
      packed_by,
      pack_verified_at,
      created_at,
      customer_name,
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
      admin_notes,
      customers:customer_id (
        id,
        first_name,
        last_name,
        company_name,
        phone,
        users:user_id (
          first_name,
          last_name,
          email,
          phone
        )
      ),
      order_items (
        id,
        product_name,
        product_barcode,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq("id", orderId)
    .single()

  if (error || !data) {
    console.error("[Fulfillment] Error fetching order:", error)
    return { success: false, error: "Order not found" }
  }

  return { success: true, order: data as unknown as FulfillmentOrder }
}

// ============================================================
// Generate Fulfillment Token (for QR code photo uploads)
// ============================================================

export async function generateFulfillmentToken(
  orderId: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: "Database unavailable" }

  // Check if token already exists
  const { data: existing } = await supabase
    .from("orders")
    .select("fulfillment_token")
    .eq("id", orderId)
    .single()

  if (existing?.fulfillment_token) {
    return { success: true, token: existing.fulfillment_token }
  }

  // Generate a secure token
  const token = crypto.randomUUID()

  const { error } = await supabase
    .from("orders")
    .update({
      fulfillment_token: token,
      fulfillment_started_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("[Fulfillment] Error generating token:", error)
    return { success: false, error: "Failed to generate token" }
  }

  return { success: true, token }
}

// ============================================================
// Update Fulfillment Step
// ============================================================

export async function updateFulfillmentStep(
  orderId: string,
  step: "start_packing" | "pack_complete" | "ship",
  data?: {
    packedBy?: string
    trackingNumber?: string
    shippingCarrier?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: "Database unavailable" }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  switch (step) {
    case "start_packing":
      updates.status = "processing"
      if (!updates.fulfillment_started_at) {
        updates.fulfillment_started_at = new Date().toISOString()
      }
      break

    case "pack_complete":
      updates.packed_by = data?.packedBy || null
      updates.pack_verified_at = new Date().toISOString()
      break

    case "ship":
      updates.status = "shipped"
      updates.shipped_at = new Date().toISOString()
      if (data?.trackingNumber) updates.tracking_number = data.trackingNumber
      if (data?.shippingCarrier) updates.shipping_carrier = data.shippingCarrier
      break
  }

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId)

  if (error) {
    console.error("[Fulfillment] Error updating step:", error)
    return { success: false, error: "Failed to update order" }
  }

  return { success: true }
}

// ============================================================
// Get Order Photos
// ============================================================

export async function getOrderPhotos(
  orderId: string
): Promise<OrderPhoto[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("order_photos")
    .select("id, order_id, url, filename, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Fulfillment] Error fetching photos:", error)
    return []
  }

  return data || []
}

// ============================================================
// Save Order Photo (from wizard direct upload)
// ============================================================

export async function saveOrderPhoto(
  orderId: string,
  url: string,
  filename: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: "Database unavailable" }

  const { error } = await supabase
    .from("order_photos")
    .insert({
      order_id: orderId,
      url,
      filename,
      storage_path: storagePath,
      uploaded_by: "fulfillment_wizard",
      content_type: "image/jpeg",
    })

  if (error) {
    console.error("[Fulfillment] Error saving photo:", error)
    return { success: false, error: "Failed to save photo" }
  }

  return { success: true }
}

// ============================================================
// Validate Fulfillment Token (for public QR upload)
// ============================================================

export async function validateFulfillmentToken(
  orderId: string,
  token: string
): Promise<{ valid: boolean; orderNumber?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { valid: false }

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, fulfillment_token")
    .eq("id", orderId)
    .single()

  if (error || !data) return { valid: false }
  if (data.fulfillment_token !== token) return { valid: false }

  return { valid: true, orderNumber: data.order_number }
}
