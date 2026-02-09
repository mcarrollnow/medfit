"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export interface Shipment {
  id: string
  shipped_date: string | null
  tracking_number: string | null
  carrier: string | null
  status: 'in_transit' | 'delivered' | 'stopped' | 'lost' | 'seized' | 'returned'
  notes: string | null
  counted_in_inventory: boolean
  created_at: string
  updated_at: string
  items?: ShipmentItem[]
}

export interface ShipmentItem {
  id: string
  shipment_id: string
  product_code: string | null
  product_id: string | null
  quantity: number
  description: string | null
  product?: {
    id: string
    name: string
    base_name: string
    variant: string
  }
}

export async function getShipments(status?: string): Promise<Shipment[]> {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from('incoming_shipments')
    .select(`
      *,
      items:shipment_items(
        *,
        product:products(id, name, base_name, variant)
      )
    `)
    .order('shipped_date', { ascending: false, nullsFirst: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching shipments:', error)
    return []
  }

  // For items without product_id, try to match by supplier_code
  const shipments = data as Shipment[]
  
  // Collect all unlinked product codes
  const unlinkedCodes: string[] = []
  for (const shipment of shipments) {
    for (const item of shipment.items || []) {
      if (!item.product_id && item.product_code) {
        unlinkedCodes.push(item.product_code)
      }
    }
  }

  if (unlinkedCodes.length > 0) {
    // Fetch products that might match these codes by supplier_code
    const { data: products } = await supabase
      .from('products')
      .select('id, name, base_name, variant, supplier_code')
      .not('supplier_code', 'is', null)

    if (products && products.length > 0) {
      // Build lookup map
      const productMap = new Map<string, { id: string; name: string; base_name: string; variant: string }>()
      for (const p of products) {
        if (p.supplier_code) {
          productMap.set(p.supplier_code.toLowerCase().trim(), {
            id: p.id,
            name: p.name,
            base_name: p.base_name,
            variant: p.variant
          })
        }
      }

      // Enrich shipment items with matched products
      for (const shipment of shipments) {
        for (const item of shipment.items || []) {
          if (!item.product && item.product_code) {
            const cleanCode = item.product_code.toLowerCase().trim()
            const matched = productMap.get(cleanCode)
            if (matched) {
              item.product = matched
            } else {
              // Try partial match (last 6 digits)
              if (cleanCode.length >= 6) {
                const last6 = cleanCode.slice(-6)
                for (const [code, prod] of productMap.entries()) {
                  if (code.endsWith(last6) || code.includes(cleanCode)) {
                    item.product = prod
                    break
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return shipments
}

export async function getShipmentById(id: string): Promise<Shipment | null> {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from('incoming_shipments')
    .select(`
      *,
      items:shipment_items(
        *,
        product:products(id, name, base_name, variant)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching shipment:', error)
    return null
  }

  return data as Shipment
}

export async function createShipment(data: {
  shipped_date?: string
  tracking_number?: string
  carrier?: string
  status?: string
  notes?: string
  items?: { product_code: string; quantity: number; description?: string }[]
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  const { data: shipment, error: shipmentError } = await supabase
    .from('incoming_shipments')
    .insert({
      shipped_date: data.shipped_date || null,
      tracking_number: data.tracking_number || null,
      carrier: data.carrier || null,
      status: data.status || 'in_transit',
      notes: data.notes || null,
    })
    .select()
    .single()

  if (shipmentError) {
    return { success: false, error: shipmentError.message }
  }

  // Add items if provided
  if (data.items && data.items.length > 0) {
    const itemsToInsert = data.items.map(item => ({
      shipment_id: shipment.id,
      product_code: item.product_code,
      quantity: item.quantity,
      description: item.description || null,
    }))

    const { error: itemsError } = await supabase
      .from('shipment_items')
      .insert(itemsToInsert)

    if (itemsError) {
      console.error('Error adding shipment items:', itemsError)
    }
  }

  revalidatePath('/admin/shipments')
  return { success: true, id: shipment.id }
}

export async function updateShipment(
  id: string,
  data: {
    shipped_date?: string
    tracking_number?: string
    carrier?: string
    status?: string
    notes?: string
    counted_in_inventory?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  const { error } = await supabase
    .from('incoming_shipments')
    .update(data)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/shipments')
  return { success: true }
}

export async function deleteShipment(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  const { error } = await supabase
    .from('incoming_shipments')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/shipments')
  return { success: true }
}

export async function addShipmentItem(
  shipmentId: string,
  item: { product_code: string; quantity: number; description?: string; product_id?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  const { error } = await supabase
    .from('shipment_items')
    .insert({
      shipment_id: shipmentId,
      product_code: item.product_code,
      quantity: item.quantity,
      description: item.description || null,
      product_id: item.product_id || null,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/shipments')
  return { success: true }
}

export async function removeShipmentItem(itemId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  const { error } = await supabase
    .from('shipment_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/shipments')
  return { success: true }
}

export async function markShipmentDelivered(
  id: string,
  addToInventory: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  // Update shipment status
  const { error: updateError } = await supabase
    .from('incoming_shipments')
    .update({ 
      status: 'delivered',
      counted_in_inventory: addToInventory 
    })
    .eq('id', id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  // If adding to inventory, update product stock
  if (addToInventory) {
    const { data: items } = await supabase
      .from('shipment_items')
      .select('product_id, quantity')
      .eq('shipment_id', id)
      .not('product_id', 'is', null)

    if (items && items.length > 0) {
      for (const item of items) {
        if (item.product_id) {
          // Get current stock
          const { data: product } = await supabase
            .from('products')
            .select('current_stock')
            .eq('id', item.product_id)
            .single()

          if (product) {
            await supabase
              .from('products')
              .update({ 
                current_stock: (product.current_stock || 0) + item.quantity 
              })
              .eq('id', item.product_id)
          }
        }
      }
    }
  }

  revalidatePath('/admin/shipments')
  revalidatePath('/admin/inventory')
  return { success: true }
}

export async function linkItemToProduct(
  itemId: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, error: 'Could not connect to database' }
  }

  const { error } = await supabase
    .from('shipment_items')
    .update({ product_id: productId })
    .eq('id', itemId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/shipments')
  return { success: true }
}

// Get shipment stats for dashboard
export async function getShipmentStats(): Promise<{
  inTransit: number
  delivered: number
  issues: number
}> {
  const supabase = await getSupabaseServerClient()

  const [inTransitRes, deliveredRes, issuesRes] = await Promise.all([
    supabase.from('incoming_shipments').select('id', { count: 'exact' }).eq('status', 'in_transit'),
    supabase.from('incoming_shipments').select('id', { count: 'exact' }).eq('status', 'delivered'),
    supabase.from('incoming_shipments').select('id', { count: 'exact' }).in('status', ['stopped', 'lost', 'seized', 'returned']),
  ])

  return {
    inTransit: inTransitRes.count || 0,
    delivered: deliveredRes.count || 0,
    issues: issuesRes.count || 0,
  }
}

// Auto-link shipment items to products by matching product_code to supplier_code
export async function autoLinkShipmentItems(): Promise<{ 
  success: boolean
  linked: number
  errors: string[]
}> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { success: false, linked: 0, errors: ['Could not connect to database'] }
  }

  // Get all shipment items without a product_id
  const { data: unlinkedItems, error: fetchError } = await supabase
    .from('shipment_items')
    .select('id, product_code')
    .is('product_id', null)
    .not('product_code', 'is', null)

  if (fetchError) {
    return { success: false, linked: 0, errors: [fetchError.message] }
  }

  if (!unlinkedItems || unlinkedItems.length === 0) {
    return { success: true, linked: 0, errors: [] }
  }

  // Get all products with supplier_code
  const { data: products } = await supabase
    .from('products')
    .select('id, supplier_code, base_name, variant')
    .not('supplier_code', 'is', null)

  if (!products || products.length === 0) {
    return { success: true, linked: 0, errors: ['No products with supplier codes found'] }
  }

  // Create a map for quick lookup - handle multiple formats
  const productMap = new Map<string, string>()
  for (const product of products) {
    if (product.supplier_code) {
      // Store exact match
      productMap.set(product.supplier_code.toLowerCase().trim(), product.id)
      // Also try without leading zeros
      const noLeadingZeros = product.supplier_code.replace(/^0+/, '')
      if (noLeadingZeros !== product.supplier_code) {
        productMap.set(noLeadingZeros.toLowerCase().trim(), product.id)
      }
    }
  }

  let linked = 0
  const errors: string[] = []

  for (const item of unlinkedItems) {
    if (!item.product_code) continue

    // Clean the product code
    const cleanCode = item.product_code.toLowerCase().trim()
    
    // Try to find a match
    let productId = productMap.get(cleanCode)
    
    // Try without leading zeros
    if (!productId) {
      const noLeadingZeros = item.product_code.replace(/^0+/, '').toLowerCase().trim()
      productId = productMap.get(noLeadingZeros)
    }

    // Try partial match (last 6 digits)
    if (!productId && cleanCode.length >= 6) {
      const last6 = cleanCode.slice(-6)
      for (const [code, id] of productMap.entries()) {
        if (code.endsWith(last6)) {
          productId = id
          break
        }
      }
    }

    if (productId) {
      const { error: updateError } = await supabase
        .from('shipment_items')
        .update({ product_id: productId })
        .eq('id', item.id)

      if (updateError) {
        errors.push(`Failed to link ${item.product_code}: ${updateError.message}`)
      } else {
        linked++
      }
    }
  }

  revalidatePath('/admin/shipments')
  revalidatePath('/supplier/shipments')
  
  return { success: true, linked, errors }
}

