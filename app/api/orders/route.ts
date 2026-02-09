import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { randomBytes } from 'crypto'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { trackReferredOrder } from '@/app/actions/referrals'

// Generate a unique random referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluded I, O, 0, 1 to avoid confusion
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Orders API] POST /api/orders - Starting order creation')
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Orders API] Auth error:', authError)
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('[Orders API] Authenticated user:', user.id)

    const body = await request.json()
    const { 
      items,
      customer_info,
      shipping_address,
      discount_code_id,
      discount_amount,
      payment_method,
      notes
    } = body

    console.log('[Orders API] Order request data:', {
      itemsCount: items?.length,
      hasCustomerInfo: !!customer_info,
      hasShippingAddress: !!shipping_address,
      discountCodeId: discount_code_id,
      discountAmount: discount_amount,
      paymentMethod: payment_method
    })

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`

    // First, try to find the customer by auth.users.id
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // If no customer found by auth ID, try to find by public.users.id
    if (customerError || !customer) {
      console.log('[Orders API] No customer found by auth ID, checking by public user ID')
      
      // Get the public user record
      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      
      if (publicUser) {
        // Try to find customer by public user ID
        const { data: customerByPublicId } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', publicUser.id)
          .single()
        
        customer = customerByPublicId
      }
    }

    // If still no customer found, create one
    if (!customer) {
      console.log('[Orders API] Creating new customer record for user:', user.id)
      
      // Get or create public user first
      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      
      const userIdForCustomer = publicUser?.id || user.id
      
      const referralCode = generateReferralCode();
      
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          user_id: userIdForCustomer,
          customer_type: 'retail',
          shipping_address_line1: shipping_address?.line1,
          shipping_address_line2: shipping_address?.line2 || null,
          shipping_city: shipping_address?.city,
          shipping_state: shipping_address?.state,
          shipping_zip: shipping_address?.zip,
          shipping_country: shipping_address?.country || 'US',
          referral_code: referralCode
        })
        .select()
        .single()
      
      console.log('[Orders API] Customer created with referral code:', referralCode)
      
      if (createError) {
        console.error('[Orders API] Error creating customer:', createError)
        return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 })
      }
      
      customer = newCustomer
    } else if (shipping_address) {
      // Update existing customer's shipping address with the address from this order
      console.log('[Orders API] Updating existing customer shipping address:', customer.id)
      
      const updateData: any = {
        shipping_address_line1: shipping_address.line1,
        shipping_address_line2: shipping_address.line2 || null,
        shipping_city: shipping_address.city,
        shipping_state: shipping_address.state,
        shipping_zip: shipping_address.zip,
        shipping_country: shipping_address.country || 'US',
        updated_at: new Date().toISOString()
      }
      
      // Also update phone if provided in customer_info
      if (customer_info?.phone) {
        updateData.phone = customer_info.phone
      }
      
      const { error: updateError } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', customer.id)
      
      if (updateError) {
        console.error('[Orders API] Error updating customer shipping address:', updateError)
        // Don't fail the order, just log the error
      } else {
        console.log('[Orders API] Customer shipping address updated successfully')
      }
    }

    // Validate items array
    if (!items || items.length === 0) {
      console.error('[Orders API] No items provided in order')
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    // Log items details for debugging
    console.log('[Orders API] Order items:', items.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    })))

    // Calculate total amount from items
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.unit_price * item.quantity), 0
    )
    const totalAmount = subtotal - (discount_amount || 0)

    console.log('[Orders API] Order totals:', {
      subtotal,
      discountAmount: discount_amount,
      totalAmount
    })
    
    // Skip saving shipping address separately for now - it's slowing things down
    // We can save it after the order is created if needed

    // Check if this is a supplier customer - auto-tag the order
    let orderSource = 'direct'
    let orderSupplierId = null
    let orderNotePrefix = ''
    
    const { data: customerDetails } = await supabase
      .from('customers')
      .select('customer_type, supplier_id')
      .eq('id', customer.id)
      .single()
    
    if (customerDetails?.customer_type === 'supplier_customer' && customerDetails?.supplier_id) {
      orderSource = 'supplier'
      orderSupplierId = customerDetails.supplier_id
      orderNotePrefix = '[Supplier Order] '
      console.log('[Orders API] Auto-tagging as supplier order, supplier_id:', orderSupplierId)
    }

    // Prepare order data - only include fields that actually exist
    const orderData: any = {
      order_number: orderNumber,
      customer_id: customer.id,
      total_amount: totalAmount,
      subtotal: subtotal,
      discount_amount: discount_amount || 0,
      status: 'pending',
      payment_status: 'pending',
      payment_method: payment_method || 'crypto',
      notes: orderNotePrefix + (notes || ''),
      source: orderSource,
      supplier_id: orderSupplierId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    
    // Only add discount_code_id if it's provided and not undefined
    if (discount_code_id) {
      orderData.discount_code_id = discount_code_id
    }

    console.log('[Orders API] Creating order with minimal data:', orderData)

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('[Orders API] Error creating order:', {
        error: orderError,
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code
      })
      return NextResponse.json({ 
        error: 'Failed to create order',
        details: orderError.message,
        hint: orderError.hint,
        code: orderError.code,
        // Include debug info in development
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            hasCustomer: !!customer?.id,
            hasItems: items?.length > 0,
            orderNumber,
            discountCodeId: discount_code_id || null
          }
        })
      }, { status: 500 })
    }

    console.log('[Orders API] Order created successfully:', order.id)

    // Create order items
    if (items && items.length > 0) {
      // First, we need to get the actual product UUIDs and names from barcodes
      const barcodes = items.map((item: any) => item.product_id)
      
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, barcode, name')
        .in('barcode', barcodes)
      
      if (productsError) {
        console.error('[Orders API] Error fetching products:', productsError)
        return NextResponse.json({ 
          error: 'Failed to fetch products for order items',
          details: productsError.message 
        }, { status: 500 })
      }
      
      // Map items with actual product UUIDs and names
      const orderItems = items.map((item: any) => {
        const product = products?.find(p => p.barcode === item.product_id)
        if (!product) {
          console.error('[Orders API] Product not found for barcode:', item.product_id)
          return null
        }
        return {
          order_id: order.id,
          product_id: product.id,  // Use the UUID from products table
          product_name: product.name,  // Include the product name
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
          created_at: new Date().toISOString()
        }
      }).filter(item => item !== null)

      if (orderItems.length === 0) {
        console.error('[Orders API] No valid products found for order items')
        return NextResponse.json({ 
          error: 'No valid products found for order items' 
        }, { status: 500 })
      }

      console.log('[Orders API] Creating order items with UUIDs:', orderItems)

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('[Orders API] Error creating order items:', {
          error: itemsError,
          message: itemsError.message,
          details: itemsError.details,
          orderItems: orderItems
        })
        // Return error if order items creation fails
        return NextResponse.json({ 
          error: 'Failed to create order items',
          details: itemsError.message 
        }, { status: 500 })
      }
      
      console.log('[Orders API] Order items created successfully')
    }

    // Clear the cart after successful order
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (cartError) {
      console.error('[Orders API] Error clearing cart:', cartError)
    }

    // === PRICING FORMULA: Calculate and store pricing breakdown ===
    try {
      const adminSupabase = getSupabaseAdminClient()
      
      // Get pricing formula settings
      const { data: formulaSettings } = await adminSupabase
        .from('pricing_formula_settings')
        .select('*')
        .eq('is_active', true)
        .single()
      
      const minMarkup = Number(formulaSettings?.min_markup_multiplier) || 2.0
      const maxMarkup = Number(formulaSettings?.max_markup_multiplier) || 4.0
      
      // Get product costs for all items in this order
      const productIds = products?.map(p => p.id) || []
      const { data: productCosts } = await adminSupabase
        .from('products')
        .select('id, cost_price')
        .in('id', productIds)
      
      const costMap = new Map((productCosts || []).map(p => [p.id, Number(p.cost_price) || 0]))
      
      // Calculate totals using actual costs
      let totalCost = 0
      let totalCommissionPool = 0
      
      items.forEach((item: any) => {
        const product = products?.find(p => p.barcode === item.product_id)
        if (!product) return
        
        const unitCost = costMap.get(product.id) || 0
        const itemCost = unitCost * item.quantity
        const itemTotal = item.unit_price * item.quantity
        
        totalCost += itemCost
        
        // Calculate commission pool for this item
        const minPrice = itemCost * minMarkup
        const maxPrice = itemCost * maxMarkup
        const maxPool = maxPrice - minPrice
        const rawPool = Math.max(0, itemTotal - minPrice)
        const itemPool = Math.min(rawPool, maxPool)
        
        totalCommissionPool += itemPool
      })
      
      // Get customer's assigned rep and their commission rate
      const { data: repAssignment } = await adminSupabase
        .from('customer_rep_assignments')
        .select('rep_id')
        .eq('customer_id', customer.id)
        .eq('is_current', true)
        .single()
      
      let repCommissionRate = 0
      if (repAssignment?.rep_id) {
        const { data: repUser } = await adminSupabase
          .from('users')
          .select('commission_rate')
          .eq('id', repAssignment.rep_id)
          .single()
        
        repCommissionRate = Number(repUser?.commission_rate) || 10
      }
      
      // Calculate final values
      const minimumPrice = totalCost * minMarkup
      const maximumPrice = totalCost * maxMarkup
      const discountApplied = discount_amount || 0
      const commissionAfterDiscount = Math.max(0, totalCommissionPool - discountApplied)
      const repCommissionAmount = commissionAfterDiscount * (repCommissionRate / 100)
      
      // Store pricing breakdown for this order
      await adminSupabase
        .from('order_pricing_breakdown')
        .insert({
          order_id: order.id,
          total_cost: totalCost,
          minimum_price: minimumPrice,
          maximum_price: maximumPrice,
          actual_sale_price: totalAmount,
          commission_pool: totalCommissionPool,
          discount_applied: discountApplied,
          commission_after_discount: commissionAfterDiscount,
          rep_commission_rate: repCommissionRate,
          rep_commission_amount: repCommissionAmount,
          formula_id: formulaSettings?.id || null,
          min_markup_used: minMarkup,
          max_markup_used: maxMarkup,
        })
      
      console.log('[Orders API] Pricing breakdown saved:', {
        orderId: order.id,
        totalCost,
        minimumPrice,
        commissionPool: totalCommissionPool,
        discountApplied,
        repCommission: repCommissionAmount
      })
    } catch (pricingError) {
      // Don't fail the order if pricing breakdown fails
      console.error('[Orders API] Error saving pricing breakdown:', pricingError)
    }

    // Track referral if customer was referred
    try {
      const referralResult = await trackReferredOrder(order.id, customer.id, totalAmount)
      if (referralResult.success && referralResult.discountApplied) {
        console.log('[Orders API] Referral tracked:', {
          orderId: order.id,
          customerId: customer.id,
          discountApplied: referralResult.discountApplied
        })
      }
    } catch (referralError) {
      // Don't fail the order if referral tracking fails
      console.error('[Orders API] Error tracking referral:', referralError)
    }

    // Get a business wallet for the order (usually for crypto payments)
    let assignedWallet = null
    if (payment_method === 'crypto' || !payment_method) {
      // Get the first available business wallet (in production, this should be more sophisticated)
      const { data: wallet, error: walletError } = await supabase
        .from('business_wallets')
        .select('id, address, label')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (!walletError && wallet) {
        assignedWallet = wallet
        
        // Update the order with the assigned wallet
        await supabase
          .from('orders')
          .update({ assigned_wallet_id: wallet.id })
          .eq('id', order.id)
      }
    }

    // Return the created order in the expected format
    return NextResponse.json({
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_id: order.customer_id,
        status: order.status,
        subtotal: order.subtotal,
        discount_amount: order.discount_amount,
        tax_amount: 0,
        shipping_amount: 0,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        assigned_wallet_id: assignedWallet?.id
      },
      wallet: assignedWallet
    })

  } catch (error) {
    console.error('[Orders API] Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
