"use server"

import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

// ============================================================
// Types
// ============================================================

export interface SupplierCustomer {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  company_name: string | null
  customer_type: string
  supplier_id: string
  shipping_address_line1: string | null
  shipping_address_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  shipping_country: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined from users table
  user?: {
    first_name: string
    last_name: string
    email: string
    phone: string | null
  }
  // Aggregated stats
  order_count?: number
  total_spent?: number
}

export interface SupplierOrder {
  id: string
  order_number: string
  customer_id: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  discount_amount: number
  shipping_amount: number
  total_amount: number
  tracking_number: string | null
  carrier: string | null
  notes: string | null
  source: string
  supplier_id: string
  created_at: string
  updated_at: string
  shipped_at: string | null
  delivered_at: string | null
  // Joined
  customers?: {
    id: string
    first_name: string | null
    last_name: string | null
    company_name: string | null
    user_id: string
    users?: {
      first_name: string
      last_name: string
      email: string
    }
  }
  order_items?: Array<{
    id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export interface SupplierShipment {
  id: string
  supplier_id: string
  shipment_number: string
  status: 'building' | 'sealed' | 'shipped' | 'received'
  tracking_number: string | null
  carrier: string | null
  notes: string | null
  created_at: string
  updated_at: string
  shipped_at: string | null
  received_at: string | null
  items?: SupplierShipmentItem[]
  photos?: SupplierShipmentPhoto[]
}

export interface SupplierShipmentItem {
  id: string
  shipment_id: string
  product_id: string | null
  supplier_code: string | null
  product_name: string
  quantity: number
  notes: string | null
  created_at: string
  product?: {
    id: string
    name: string
    base_name: string
    variant: string
    supplier_code: string | null
  }
}

export interface SupplierShipmentPhoto {
  id: string
  shipment_id: string
  photo_url: string
  caption: string | null
  uploaded_at: string
}

// ============================================================
// Customer Operations
// ============================================================

export async function getSupplierCustomers(supplierId: string): Promise<SupplierCustomer[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      users:user_id (
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .eq('supplier_id', supplierId)
    .eq('customer_type', 'supplier_customer')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Supplier Portal] Error fetching customers:', error)
    return []
  }

  // Get order counts and totals for each customer
  const customerIds = (data || []).map(c => c.id)
  if (customerIds.length > 0) {
    const { data: orderStats } = await supabase
      .from('orders')
      .select('customer_id, total_amount')
      .in('customer_id', customerIds)

    const statsMap = new Map<string, { count: number; total: number }>()
    for (const order of orderStats || []) {
      const existing = statsMap.get(order.customer_id) || { count: 0, total: 0 }
      existing.count++
      existing.total += Number(order.total_amount) || 0
      statsMap.set(order.customer_id, existing)
    }

    return (data || []).map(c => ({
      ...c,
      order_count: statsMap.get(c.id)?.count || 0,
      total_spent: statsMap.get(c.id)?.total || 0,
    }))
  }

  return data || []
}

export async function createSupplierCustomer(
  supplierId: string,
  data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    companyName?: string
    shippingAddress?: {
      line1: string
      line2?: string
      city: string
      state: string
      zip: string
      country?: string
    }
  }
): Promise<{ success: boolean; customerId?: string; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  try {
    // 1. Create Supabase Auth user
    const tempPassword = `Temp${Date.now()}!${Math.random().toString(36).slice(2, 8)}`
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        role: 'customer'
      }
    })

    if (authError) {
      console.error('[Supplier Portal] Error creating auth user:', authError)
      return { success: false, error: authError.message }
    }

    // 2. Create users table record
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authUser.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        role: 'customer',
      })
      .select()
      .single()

    if (userError) {
      console.error('[Supplier Portal] Error creating user record:', userError)
      return { success: false, error: userError.message }
    }

    // 3. Create customer record with supplier link
    const referralCode = generateReferralCode()
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        user_id: userRecord.id,
        first_name: data.firstName,
        last_name: data.lastName,
        company_name: data.companyName || null,
        customer_type: 'supplier_customer',
        supplier_id: supplierId,
        phone: data.phone || null,
        shipping_address_line1: data.shippingAddress?.line1 || null,
        shipping_address_line2: data.shippingAddress?.line2 || null,
        shipping_city: data.shippingAddress?.city || null,
        shipping_state: data.shippingAddress?.state || null,
        shipping_zip: data.shippingAddress?.zip || null,
        shipping_country: data.shippingAddress?.country || 'US',
        referral_code: referralCode,
      })
      .select()
      .single()

    if (customerError) {
      console.error('[Supplier Portal] Error creating customer:', customerError)
      return { success: false, error: customerError.message }
    }

    // 4. Send password reset email so customer can set their own password
    await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: data.email,
    })

    revalidatePath('/supplier/customers')
    return { success: true, customerId: customer.id }
  } catch (error: any) {
    console.error('[Supplier Portal] Error in createSupplierCustomer:', error)
    return { success: false, error: error.message }
  }
}

export async function updateSupplierCustomer(
  supplierId: string,
  customerId: string,
  updates: {
    firstName?: string
    lastName?: string
    phone?: string
    companyName?: string
    shippingAddress?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      zip?: string
      country?: string
    }
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Verify this customer belongs to this supplier
  const { data: customer } = await supabase
    .from('customers')
    .select('id, supplier_id, user_id')
    .eq('id', customerId)
    .eq('supplier_id', supplierId)
    .single()

  if (!customer) {
    return { success: false, error: 'Customer not found or access denied' }
  }

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.firstName) updateData.first_name = updates.firstName
  if (updates.lastName) updateData.last_name = updates.lastName
  if (updates.phone !== undefined) updateData.phone = updates.phone
  if (updates.companyName !== undefined) updateData.company_name = updates.companyName
  if (updates.notes !== undefined) updateData.notes = updates.notes
  if (updates.shippingAddress) {
    if (updates.shippingAddress.line1) updateData.shipping_address_line1 = updates.shippingAddress.line1
    if (updates.shippingAddress.line2 !== undefined) updateData.shipping_address_line2 = updates.shippingAddress.line2
    if (updates.shippingAddress.city) updateData.shipping_city = updates.shippingAddress.city
    if (updates.shippingAddress.state) updateData.shipping_state = updates.shippingAddress.state
    if (updates.shippingAddress.zip) updateData.shipping_zip = updates.shippingAddress.zip
    if (updates.shippingAddress.country) updateData.shipping_country = updates.shippingAddress.country
  }

  const { error } = await supabase
    .from('customers')
    .update(updateData)
    .eq('id', customerId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Also update the users table if name changed
  if (updates.firstName || updates.lastName) {
    const userUpdates: Record<string, any> = {}
    if (updates.firstName) userUpdates.first_name = updates.firstName
    if (updates.lastName) userUpdates.last_name = updates.lastName
    if (updates.phone !== undefined) userUpdates.phone = updates.phone

    await supabase
      .from('users')
      .update(userUpdates)
      .eq('id', customer.user_id)
  }

  revalidatePath('/supplier/customers')
  return { success: true }
}

// ============================================================
// Order Operations
// ============================================================

export async function getSupplierOrders(supplierId: string, status?: string): Promise<SupplierOrder[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  // Get all customers linked to this supplier
  const { data: customers } = await supabase
    .from('customers')
    .select('id')
    .eq('supplier_id', supplierId)

  if (!customers || customers.length === 0) return []

  const customerIds = customers.map(c => c.id)

  let query = supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (
        id,
        first_name,
        last_name,
        company_name,
        user_id,
        users:user_id (
          first_name,
          last_name,
          email
        )
      ),
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .in('customer_id', customerIds)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Supplier Portal] Error fetching orders:', error)
    return []
  }

  return (data || []) as SupplierOrder[]
}

export async function getSupplierOrderDetails(
  supplierId: string,
  orderId: string
): Promise<SupplierOrder | null> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (
        id,
        first_name,
        last_name,
        company_name,
        supplier_id,
        user_id,
        users:user_id (
          first_name,
          last_name,
          email
        )
      ),
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq('id', orderId)
    .single()

  if (error || !data) {
    console.error('[Supplier Portal] Error fetching order:', error)
    return null
  }

  // Verify this order belongs to a supplier customer
  if (data.customers?.supplier_id !== supplierId) {
    console.error('[Supplier Portal] Order does not belong to this supplier')
    return null
  }

  return data as SupplierOrder
}

export async function updateSupplierOrder(
  supplierId: string,
  orderId: string,
  updates: {
    notes?: string
    shipping_address_line1?: string
    shipping_address_line2?: string
    shipping_city?: string
    shipping_state?: string
    shipping_zip?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Verify this order belongs to a customer of this supplier
  const { data: order } = await supabase
    .from('orders')
    .select('id, customer_id, customers!inner(supplier_id)')
    .eq('id', orderId)
    .single()

  if (!order || (order.customers as any)?.supplier_id !== supplierId) {
    return { success: false, error: 'Order not found or access denied' }
  }

  const { error } = await supabase
    .from('orders')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/orders')
  return { success: true }
}

// ============================================================
// Shipment Operations (Box Builder)
// ============================================================

function generateShipmentNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SUP-${timestamp}-${random}`
}

export async function getSupplierShipments(supplierId: string, status?: string): Promise<SupplierShipment[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  let query = supabase
    .from('supplier_shipments')
    .select(`
      *,
      items:supplier_shipment_items (
        *,
        product:product_id (
          id,
          name,
          base_name,
          variant,
          supplier_code
        )
      ),
      photos:supplier_shipment_photos (*)
    `)
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Supplier Portal] Error fetching shipments:', error)
    return []
  }

  return (data || []) as SupplierShipment[]
}

export async function createSupplierShipment(
  supplierId: string,
  notes?: string
): Promise<{ success: boolean; shipment?: SupplierShipment; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  const shipmentNumber = generateShipmentNumber()

  const { data, error } = await supabase
    .from('supplier_shipments')
    .insert({
      supplier_id: supplierId,
      shipment_number: shipmentNumber,
      status: 'building',
      notes: notes || null,
    })
    .select(`
      *,
      items:supplier_shipment_items (*),
      photos:supplier_shipment_photos (*)
    `)
    .single()

  if (error) {
    console.error('[Supplier Portal] Error creating shipment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/ship-product')
  return { success: true, shipment: data as SupplierShipment }
}

export async function addItemToShipment(
  supplierId: string,
  shipmentId: string,
  item: {
    productId?: string
    supplierProductId?: string
    supplierCode?: string
    productName: string
    quantity: number
    notes?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Verify shipment belongs to supplier and is in building state
  const { data: shipment } = await supabase
    .from('supplier_shipments')
    .select('id, supplier_id, status')
    .eq('id', shipmentId)
    .eq('supplier_id', supplierId)
    .single()

  if (!shipment) {
    return { success: false, error: 'Shipment not found or access denied' }
  }

  if (shipment.status !== 'building') {
    return { success: false, error: 'Cannot add items to a sealed or shipped shipment' }
  }

  // Try to auto-link to our products table by supplier code
  let productId = item.productId || null
  if (!productId && item.supplierCode) {
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('supplier_code', item.supplierCode)
      .limit(1)
      .maybeSingle()

    if (product) {
      productId = product.id
    }
  }

  const { error } = await supabase
    .from('supplier_shipment_items')
    .insert({
      shipment_id: shipmentId,
      product_id: productId,
      supplier_product_id: item.supplierProductId || null,
      supplier_code: item.supplierCode || null,
      product_name: item.productName,
      quantity: item.quantity,
      notes: item.notes || null,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  // Decrement supplier's own stock if supplier_product_id provided
  if (item.supplierProductId) {
    await decrementSupplierProductStock(supplierId, item.supplierProductId, item.quantity)
  }

  revalidatePath('/supplier/ship-product')
  return { success: true }
}

export async function removeItemFromShipment(
  supplierId: string,
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Verify item belongs to a shipment owned by this supplier
  const { data: item } = await supabase
    .from('supplier_shipment_items')
    .select('id, shipment_id, supplier_shipments!inner(supplier_id, status)')
    .eq('id', itemId)
    .single()

  if (!item || (item.supplier_shipments as any)?.supplier_id !== supplierId) {
    return { success: false, error: 'Item not found or access denied' }
  }

  if ((item.supplier_shipments as any)?.status !== 'building') {
    return { success: false, error: 'Cannot remove items from a sealed or shipped shipment' }
  }

  const { error } = await supabase
    .from('supplier_shipment_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/ship-product')
  return { success: true }
}

export async function addShipmentPhoto(
  supplierId: string,
  shipmentId: string,
  photoUrl: string,
  caption?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Verify shipment belongs to supplier
  const { data: shipment } = await supabase
    .from('supplier_shipments')
    .select('id, supplier_id')
    .eq('id', shipmentId)
    .eq('supplier_id', supplierId)
    .single()

  if (!shipment) {
    return { success: false, error: 'Shipment not found or access denied' }
  }

  const { error } = await supabase
    .from('supplier_shipment_photos')
    .insert({
      shipment_id: shipmentId,
      photo_url: photoUrl,
      caption: caption || null,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/ship-product')
  return { success: true }
}

export async function sealShipment(
  supplierId: string,
  shipmentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  const { data: shipment } = await supabase
    .from('supplier_shipments')
    .select('id, supplier_id, status')
    .eq('id', shipmentId)
    .eq('supplier_id', supplierId)
    .single()

  if (!shipment) {
    return { success: false, error: 'Shipment not found or access denied' }
  }

  if (shipment.status !== 'building') {
    return { success: false, error: 'Shipment is already sealed or shipped' }
  }

  const { error } = await supabase
    .from('supplier_shipments')
    .update({
      status: 'sealed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', shipmentId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/ship-product')
  return { success: true }
}

export async function markShipmentShipped(
  supplierId: string,
  shipmentId: string,
  trackingNumber?: string,
  carrier?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  const { data: shipment } = await supabase
    .from('supplier_shipments')
    .select('id, supplier_id, status')
    .eq('id', shipmentId)
    .eq('supplier_id', supplierId)
    .single()

  if (!shipment) {
    return { success: false, error: 'Shipment not found or access denied' }
  }

  if (shipment.status === 'shipped' || shipment.status === 'received') {
    return { success: false, error: 'Shipment is already shipped or received' }
  }

  const { error } = await supabase
    .from('supplier_shipments')
    .update({
      status: 'shipped',
      tracking_number: trackingNumber || null,
      carrier: carrier || null,
      shipped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', shipmentId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/ship-product')
  return { success: true }
}

// ============================================================
// Dashboard Stats
// ============================================================

export async function getSupplierDashboardStats(supplierId: string): Promise<{
  customerCount: number
  activeOrders: number
  totalOrders: number
  totalRevenue: number
  shipmentsInTransit: number
  shipmentsBuilding: number
  recentOrders: SupplierOrder[]
}> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return {
    customerCount: 0, activeOrders: 0, totalOrders: 0, totalRevenue: 0,
    shipmentsInTransit: 0, shipmentsBuilding: 0, recentOrders: []
  }

  // Get customer IDs
  const { data: customers } = await supabase
    .from('customers')
    .select('id')
    .eq('supplier_id', supplierId)
    .eq('customer_type', 'supplier_customer')

  const customerIds = (customers || []).map(c => c.id)
  const customerCount = customerIds.length

  if (customerIds.length === 0) {
    // Get shipment stats even without customers
    const [buildingRes, transitRes] = await Promise.all([
      supabase.from('supplier_shipments').select('id', { count: 'exact', head: true }).eq('supplier_id', supplierId).eq('status', 'building'),
      supabase.from('supplier_shipments').select('id', { count: 'exact', head: true }).eq('supplier_id', supplierId).eq('status', 'shipped'),
    ])

    return {
      customerCount: 0, activeOrders: 0, totalOrders: 0, totalRevenue: 0,
      shipmentsBuilding: buildingRes.count || 0,
      shipmentsInTransit: transitRes.count || 0,
      recentOrders: []
    }
  }

  // Get order stats
  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_amount')
    .in('customer_id', customerIds)

  const totalOrders = orders?.length || 0
  const activeOrders = orders?.filter(o => !['delivered', 'cancelled'].includes(o.status)).length || 0
  const totalRevenue = orders?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0

  // Get recent orders with details
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (
        id,
        first_name,
        last_name,
        company_name,
        user_id,
        users:user_id (
          first_name,
          last_name,
          email
        )
      ),
      order_items (
        id,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .in('customer_id', customerIds)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get shipment stats
  const [buildingRes, transitRes] = await Promise.all([
    supabase.from('supplier_shipments').select('id', { count: 'exact', head: true }).eq('supplier_id', supplierId).eq('status', 'building'),
    supabase.from('supplier_shipments').select('id', { count: 'exact', head: true }).eq('supplier_id', supplierId).eq('status', 'shipped'),
  ])

  return {
    customerCount,
    activeOrders,
    totalOrders,
    totalRevenue,
    shipmentsBuilding: buildingRes.count || 0,
    shipmentsInTransit: transitRes.count || 0,
    recentOrders: (recentOrders || []) as SupplierOrder[],
  }
}

// ============================================================
// Supplier Product Types
// ============================================================

export interface SupplierProduct {
  id: string
  supplier_id: string
  name: string
  supplier_code: string
  description: string | null
  category: string | null
  unit_price: number
  current_stock: number
  restock_level: number
  image_url: string | null
  is_active: boolean
  product_id: string | null
  created_at: string
  updated_at: string
  // Joined from products table (optional mapping)
  linked_product?: {
    id: string
    name: string
    base_name: string
    variant: string
    current_stock: number
  } | null
}

// ============================================================
// Supplier Product CRUD
// ============================================================

export async function getSupplierProducts(
  supplierId: string,
  options?: { category?: string; search?: string; activeOnly?: boolean }
): Promise<SupplierProduct[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  let query = supabase
    .from('supplier_products')
    .select(`
      *,
      linked_product:product_id (
        id,
        name,
        base_name,
        variant,
        current_stock
      )
    `)
    .eq('supplier_id', supplierId)
    .order('name', { ascending: true })

  if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category)
  }

  if (options?.activeOnly) {
    query = query.eq('is_active', true)
  }

  if (options?.search) {
    const searchTerm = `%${options.search}%`
    query = query.or(`name.ilike.${searchTerm},supplier_code.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Supplier Portal] Error fetching supplier products:', error)
    return []
  }

  return (data || []) as SupplierProduct[]
}

export async function getSupplierProduct(
  supplierId: string,
  productId: string
): Promise<SupplierProduct | null> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('supplier_products')
    .select(`
      *,
      linked_product:product_id (
        id,
        name,
        base_name,
        variant,
        current_stock
      )
    `)
    .eq('id', productId)
    .eq('supplier_id', supplierId)
    .single()

  if (error) {
    console.error('[Supplier Portal] Error fetching supplier product:', error)
    return null
  }

  return data as SupplierProduct
}

export async function createSupplierProduct(
  supplierId: string,
  product: {
    name: string
    supplierCode: string
    description?: string
    category?: string
    unitPrice: number
    currentStock: number
    restockLevel: number
    imageUrl?: string
    isActive?: boolean
  }
): Promise<{ success: boolean; product?: SupplierProduct; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Try to auto-link to our products table by supplier_code
  let productId: string | null = null
  const { data: linkedProduct } = await supabase
    .from('products')
    .select('id')
    .eq('supplier_code', product.supplierCode)
    .limit(1)
    .maybeSingle()

  if (linkedProduct) {
    productId = linkedProduct.id
  }

  const { data, error } = await supabase
    .from('supplier_products')
    .insert({
      supplier_id: supplierId,
      name: product.name,
      supplier_code: product.supplierCode,
      description: product.description || null,
      category: product.category || null,
      unit_price: product.unitPrice,
      current_stock: product.currentStock,
      restock_level: product.restockLevel,
      image_url: product.imageUrl || null,
      is_active: product.isActive ?? true,
      product_id: productId,
    })
    .select(`
      *,
      linked_product:product_id (
        id,
        name,
        base_name,
        variant,
        current_stock
      )
    `)
    .single()

  if (error) {
    console.error('[Supplier Portal] Error creating supplier product:', error)
    if (error.code === '23505') {
      return { success: false, error: `A product with code "${product.supplierCode}" already exists` }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/inventory')
  return { success: true, product: data as SupplierProduct }
}

export async function updateSupplierProduct(
  supplierId: string,
  productId: string,
  updates: {
    name?: string
    supplierCode?: string
    description?: string
    category?: string
    unitPrice?: number
    currentStock?: number
    restockLevel?: number
    imageUrl?: string
    isActive?: boolean
    linkedProductId?: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Verify ownership
  const { data: existing } = await supabase
    .from('supplier_products')
    .select('id')
    .eq('id', productId)
    .eq('supplier_id', supplierId)
    .single()

  if (!existing) {
    return { success: false, error: 'Product not found or access denied' }
  }

  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.supplierCode !== undefined) updateData.supplier_code = updates.supplierCode
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.unitPrice !== undefined) updateData.unit_price = updates.unitPrice
  if (updates.currentStock !== undefined) updateData.current_stock = updates.currentStock
  if (updates.restockLevel !== undefined) updateData.restock_level = updates.restockLevel
  if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive
  if (updates.linkedProductId !== undefined) updateData.product_id = updates.linkedProductId

  const { error } = await supabase
    .from('supplier_products')
    .update(updateData)
    .eq('id', productId)

  if (error) {
    console.error('[Supplier Portal] Error updating supplier product:', error)
    if (error.code === '23505') {
      return { success: false, error: 'A product with that code already exists' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/inventory')
  return { success: true }
}

export async function deleteSupplierProduct(
  supplierId: string,
  productId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  const { error } = await supabase
    .from('supplier_products')
    .delete()
    .eq('id', productId)
    .eq('supplier_id', supplierId)

  if (error) {
    console.error('[Supplier Portal] Error deleting supplier product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/inventory')
  return { success: true }
}

export async function getSupplierProductCategories(supplierId: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('supplier_products')
    .select('category')
    .eq('supplier_id', supplierId)
    .not('category', 'is', null)

  if (error) {
    console.error('[Supplier Portal] Error fetching supplier product categories:', error)
    return []
  }

  const categories = [...new Set((data || []).map(d => d.category).filter(Boolean))] as string[]
  return categories.sort()
}

export async function searchSupplierProductsForShipment(
  supplierId: string,
  query: string
): Promise<SupplierProduct[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const searchTerm = `%${query}%`

  const { data, error } = await supabase
    .from('supplier_products')
    .select(`
      *,
      linked_product:product_id (
        id,
        name,
        base_name,
        variant,
        current_stock
      )
    `)
    .eq('supplier_id', supplierId)
    .eq('is_active', true)
    .or(`name.ilike.${searchTerm},supplier_code.ilike.${searchTerm},category.ilike.${searchTerm}`)
    .order('name', { ascending: true })
    .limit(20)

  if (error) {
    console.error('[Supplier Portal] Error searching supplier products:', error)
    return []
  }

  return (data || []) as SupplierProduct[]
}

export async function decrementSupplierProductStock(
  supplierId: string,
  supplierProductId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  const { data: product } = await supabase
    .from('supplier_products')
    .select('id, current_stock')
    .eq('id', supplierProductId)
    .eq('supplier_id', supplierId)
    .single()

  if (!product) {
    return { success: false, error: 'Product not found' }
  }

  const newStock = Math.max(0, product.current_stock - quantity)

  const { error } = await supabase
    .from('supplier_products')
    .update({
      current_stock: newStock,
      updated_at: new Date().toISOString(),
    })
    .eq('id', supplierProductId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/supplier/inventory')
  return { success: true }
}

// ============================================================
// Helpers
// ============================================================

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ============================================================
// Admin: Supplier Shipment Management
// ============================================================

export async function getAllSupplierShipments(status?: string): Promise<SupplierShipment[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  let query = supabase
    .from('supplier_shipments')
    .select(`
      *,
      items:supplier_shipment_items (
        *,
        product:product_id (
          id,
          name,
          base_name,
          variant,
          supplier_code
        )
      ),
      photos:supplier_shipment_photos (*)
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[Supplier Portal] Error fetching all shipments:', error)
    return []
  }

  return (data || []) as SupplierShipment[]
}

export async function markShipmentReceived(
  shipmentId: string,
  addToInventory: boolean = false
): Promise<{ success: boolean; itemsAdded?: number; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database connection error' }

  // Update shipment status
  const { error: updateError } = await supabase
    .from('supplier_shipments')
    .update({
      status: 'received',
      received_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', shipmentId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  let itemsAdded = 0

  // If adding to inventory, update product stock
  if (addToInventory) {
    const { data: items } = await supabase
      .from('supplier_shipment_items')
      .select('product_id, quantity')
      .eq('shipment_id', shipmentId)
      .not('product_id', 'is', null)

    if (items && items.length > 0) {
      for (const item of items) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from('products')
            .select('current_stock')
            .eq('id', item.product_id)
            .single()

          if (product) {
            await supabase
              .from('products')
              .update({
                current_stock: (product.current_stock || 0) + item.quantity,
                last_stock_update: new Date().toISOString(),
              })
              .eq('id', item.product_id)
            itemsAdded += item.quantity
          }
        }
      }
    }
  }

  revalidatePath('/admin/supplier-shipments')
  revalidatePath('/admin/inventory')
  return { success: true, itemsAdded }
}

// Get products for the shipment builder search
export async function searchProductsForShipment(query: string): Promise<Array<{
  id: string
  name: string
  base_name: string
  variant: string
  supplier_code: string | null
  current_stock: number
}>> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const searchTerm = `%${query}%`

  const { data, error } = await supabase
    .from('products')
    .select('id, name, base_name, variant, supplier_code, current_stock')
    .eq('is_active', true)
    .or(`name.ilike.${searchTerm},supplier_code.ilike.${searchTerm},barcode.ilike.${searchTerm}`)
    .order('base_name', { ascending: true })
    .limit(20)

  if (error) {
    console.error('[Supplier Portal] Error searching products:', error)
    return []
  }

  return data || []
}
