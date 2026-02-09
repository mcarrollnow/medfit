import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  console.log('[Create Custom Order] POST request received')
  
  try {
    // Verify admin authentication
    console.log('[Create Custom Order] Verifying admin auth...')
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      console.log('[Create Custom Order] Auth failed:', authResult.error)
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }
    console.log('[Create Custom Order] Auth successful, user:', authResult.user?.email)

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[Create Custom Order] Supabase admin client not available')
      return NextResponse.json({ error: 'Server configuration error - admin client unavailable' }, { status: 500 })
    }
    console.log('[Create Custom Order] Supabase client ready')

    // Parse request body
    const body = await request.json()
    const {
      customer_id,
      items,
      subtotal,
      shipping_amount,
      discount_amount,
      total_amount,
      notes,
      guest_info,
      capture_payment,
      payment_method
    } = body

    console.log('[Create Custom Order] Request body:', { customer_id, items: items?.length, guest_info })

    // Validate required fields
    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    // Handle guest checkout - store guest info directly on order, don't create customer
    let actualCustomerId: string | null = customer_id
    let customerName = ''
    let isGuestOrder = false
    let guestOrderData: any = {}
    
    if (customer_id === 'guest') {
      console.log('[Create Custom Order] Processing guest order with info:', guest_info)
      
      // Validate guest info
      if (!guest_info?.name || !guest_info?.addressLine1 || !guest_info?.city || !guest_info?.state || !guest_info?.zip) {
        return NextResponse.json({ error: 'Guest order requires name and complete shipping address' }, { status: 400 })
      }
      
      customerName = guest_info.name
      isGuestOrder = true
      actualCustomerId = null // No customer record for guest orders
      
      // Store guest info to be added to order
      guestOrderData = {
        is_guest_order: true,
        guest_name: guest_info.name,
        guest_email: guest_info.email || null,
        guest_phone: guest_info.phone || null,
        shipping_name: guest_info.name,
        shipping_address_line1: guest_info.addressLine1,
        shipping_address_line2: guest_info.addressLine2 || null,
        shipping_city: guest_info.city,
        shipping_state: guest_info.state,
        shipping_zip: guest_info.zip,
        shipping_country: 'USA',
      }
      
      console.log('[Create Custom Order] Guest order - no customer record created')
    }

    console.log('[Create Custom Order] Creating order for:', isGuestOrder ? 'GUEST' : `customer ${actualCustomerId}`)
    console.log('[Create Custom Order] Items:', items.length)

    // Generate order number
    const order_number = generateOrderNumber()

    // Build order notes
    let orderNotes = '[Custom Order]'
    if (customerName) {
      orderNotes += ` - ${customerName}`
    }
    if (capture_payment && payment_method) {
      orderNotes += ` [Paid: ${payment_method.toUpperCase()}]`
    }
    if (notes) {
      orderNotes += ` | ${notes}`
    }

    // Determine payment status
    const paymentStatus = capture_payment ? 'paid' : 'pending'
    const orderStatus = capture_payment ? 'processing' : 'pending'

    // Create the order
    const orderInsertData: any = {
      order_number,
      status: orderStatus,
      payment_status: paymentStatus,
      payment_method: payment_method || 'other',
      payment_date: capture_payment ? new Date().toISOString() : null,
      subtotal: parseFloat(subtotal) || 0,
      shipping_amount: parseFloat(shipping_amount) || 0,
      discount_amount: parseFloat(discount_amount) || 0,
      total_amount: parseFloat(total_amount) || 0,
      tax_amount: 0,
      notes: orderNotes,
      ...guestOrderData, // Include guest info if guest order
    }
    
    // Only add customer_id if not a guest order
    if (actualCustomerId) {
      orderInsertData.customer_id = actualCustomerId
    }
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsertData)
      .select()
      .single()

    if (orderError) {
      console.error('[Create Custom Order] Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order', details: orderError.message }, { status: 500 })
    }

    console.log('[Create Custom Order] Created order:', order.id, order.order_number)

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.is_custom ? `[Custom] ${item.product_name}` : item.product_name,
      quantity: parseInt(item.quantity) || 1,
      unit_price: parseFloat(item.unit_price) || 0,
      total_price: parseFloat(item.total_price) || 0
    }))

    const { data: createdItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (itemsError) {
      console.error('[Create Custom Order] Error creating order items:', itemsError)
      // Try to clean up the order if items fail
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to create order items', details: itemsError.message }, { status: 500 })
    }

    console.log('[Create Custom Order] Created', createdItems.length, 'order items')

    // Update product stock for non-custom items
    for (const item of items) {
      if (item.product_id && !item.is_custom) {
        // Get current stock
        const { data: product } = await supabase
          .from('products')
          .select('current_stock')
          .eq('id', item.product_id)
          .single()

        if (product) {
          const newStock = Math.max(0, product.current_stock - (parseInt(item.quantity) || 1))
          await supabase
            .from('products')
            .update({ 
              current_stock: newStock,
              last_stock_update: new Date().toISOString()
            })
            .eq('id', item.product_id)
        }
      }
    }

    // === PRICING FORMULA: Calculate and store pricing breakdown ===
    try {
      // Get pricing formula settings
      const { data: formulaSettings } = await supabase
        .from('pricing_formula_settings')
        .select('*')
        .eq('is_active', true)
        .single()
      
      const minMarkup = Number(formulaSettings?.min_markup_multiplier) || 2.0
      const maxMarkup = Number(formulaSettings?.max_markup_multiplier) || 4.0
      
      // Get product costs for all items in this order
      const productIds = items.filter((i: any) => i.product_id && !i.is_custom).map((i: any) => i.product_id)
      const { data: productCosts } = await supabase
        .from('products')
        .select('id, cost_price')
        .in('id', productIds)
      
      const costMap = new Map((productCosts || []).map((p: any) => [p.id, Number(p.cost_price) || 0]))
      
      // Calculate totals using actual costs
      let totalCost = 0
      let totalCommissionPool = 0
      
      items.forEach((item: any) => {
        if (!item.product_id || item.is_custom) return
        
        const unitCost = costMap.get(item.product_id) || 0
        const itemCost = unitCost * (parseInt(item.quantity) || 1)
        const itemTotal = (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 1)
        
        totalCost += itemCost
        
        // Calculate commission pool for this item
        const minPrice = itemCost * minMarkup
        const maxPrice = itemCost * maxMarkup
        const maxPool = maxPrice - minPrice
        const rawPool = Math.max(0, itemTotal - minPrice)
        const itemPool = Math.min(rawPool, maxPool)
        
        totalCommissionPool += itemPool
      })
      
      // Get customer's assigned rep and their commission rate (if not a guest order)
      let repCommissionRate = 0
      if (actualCustomerId) {
        const { data: repAssignment } = await supabase
          .from('customer_rep_assignments')
          .select('rep_id')
          .eq('customer_id', actualCustomerId)
          .eq('is_current', true)
          .single()
        
        if (repAssignment?.rep_id) {
          const { data: repUser } = await supabase
            .from('users')
            .select('commission_rate')
            .eq('id', repAssignment.rep_id)
            .single()
          
          repCommissionRate = Number(repUser?.commission_rate) || 10
        }
      }
      
      // Calculate final values
      const minimumPrice = totalCost * minMarkup
      const maximumPrice = totalCost * maxMarkup
      const discountApplied = parseFloat(discount_amount) || 0
      const commissionAfterDiscount = Math.max(0, totalCommissionPool - discountApplied)
      const repCommissionAmount = commissionAfterDiscount * (repCommissionRate / 100)
      
      // Store pricing breakdown for this order
      await supabase
        .from('order_pricing_breakdown')
        .insert({
          order_id: order.id,
          total_cost: totalCost,
          minimum_price: minimumPrice,
          maximum_price: maximumPrice,
          actual_sale_price: parseFloat(total_amount) || 0,
          commission_pool: totalCommissionPool,
          discount_applied: discountApplied,
          commission_after_discount: commissionAfterDiscount,
          rep_commission_rate: repCommissionRate,
          rep_commission_amount: repCommissionAmount,
          formula_id: formulaSettings?.id || null,
          min_markup_used: minMarkup,
          max_markup_used: maxMarkup,
        })
      
      console.log('[Create Custom Order] Pricing breakdown saved:', {
        orderId: order.id,
        totalCost,
        minimumPrice,
        commissionPool: totalCommissionPool,
        discountApplied,
        repCommission: repCommissionAmount
      })
    } catch (pricingError) {
      // Don't fail the order if pricing breakdown fails
      console.error('[Create Custom Order] Error saving pricing breakdown:', pricingError)
    }

    // Return the created order with items
    const { data: fullOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (
          id,
          users:user_id (
            first_name,
            last_name,
            email
          )
        ),
        order_items (*)
      `)
      .eq('id', order.id)
      .single()

    if (fetchError) {
      console.error('[Create Custom Order] Error fetching created order:', fetchError)
    }

    return NextResponse.json({
      success: true,
      order: fullOrder || order,
      message: `Order ${order_number} created successfully`
    })

  } catch (error) {
    console.error('[Create Custom Order] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

