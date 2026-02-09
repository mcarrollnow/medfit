import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // If not logged in, return empty cart
      return NextResponse.json({ items: [] })
    }

    // Cart items use auth.users.id directly
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)  // Use auth.users.id directly

    if (cartError) throw cartError

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Get all unique product IDs 
    const productIds = cartItems.map(item => item.product_id)
    console.log('[Cart API] Product IDs from cart:', productIds)

    // Separate numeric and string IDs
    const numericIds = productIds.filter(id => /^\d+$/.test(id)).map(id => parseInt(id))
    const stringIds = productIds.filter(id => !/^\d+$/.test(id))
    
    console.log('[Cart API] Numeric IDs:', numericIds)
    console.log('[Cart API] String IDs (barcodes):', stringIds)

    // Try to fetch products by barcode
    let productsByBarcode: any[] = []
    if (stringIds.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('barcode', stringIds)
      
      if (!error && data) {
        productsByBarcode = data
      }
    }

    // Try fetching by numeric ID
    let productsById: any[] = []
    if (numericIds.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', numericIds)
      
      if (!error && data) {
        productsById = data
      }
    }

    // Combine both results
    const products = [...productsByBarcode, ...productsById]
    console.log('[Cart API] Found products:', products.length, 'out of', cartItems.length, 'cart items')

    // Detect pricing tier from customer_type and get customer record
    let customerType = 'retail'
    let customerId: string | null = null
    let pricingTierId: string | null = null

    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (publicUser) {
      const { data: customer } = await supabase
        .from('customers')
        .select('id, customer_type, pricing_tier_id')
        .eq('user_id', publicUser.id)
        .single()

      if (customer) {
        customerType = customer.customer_type
        customerId = customer.id
        pricingTierId = customer.pricing_tier_id
      }
    }

    // Determine which price field to use based on customer type
    const getPriceForType = (product: any): number => {
      switch (customerType) {
        case 'supplier_customer':
          return Number(product.supplier_price) || Number(product.retail_price) || 0
        case 'b2b':
        case 'b2bvip':
        case 'rep':
          return Number(product.b2b_price) || Number(product.retail_price) || 0
        default:
          return Number(product.retail_price) || 0
      }
    }

    // Fetch per-product overrides and tier discount if customer has them
    let productOverrides: Record<string, number> = {}
    let tierDiscountPct = 0

    if (customerId) {
      // Get per-product pricing overrides
      const productIds = products.map(p => p.id)
      if (productIds.length > 0) {
        const { data: overrides } = await supabase
          .from('customer_product_pricing')
          .select('product_id, custom_price')
          .eq('customer_id', customerId)
          .in('product_id', productIds)

        if (overrides) {
          overrides.forEach((o: any) => {
            productOverrides[o.product_id] = Number(o.custom_price)
          })
        }
      }

      // Get tier discount percentage
      if (pricingTierId) {
        const { data: tier } = await supabase
          .from('rep_pricing_tiers')
          .select('discount_percentage')
          .eq('id', pricingTierId)
          .single()

        if (tier) {
          tierDiscountPct = Number(tier.discount_percentage)
        }
      }
    }

    // Map products to cart items, trying both barcode and ID matching
    // Price priority: per-product override > tier discount > customer_type pricing > retail
    const itemsWithProducts = cartItems.map(item => {
      const product = products?.find(p => 
        p.barcode === item.product_id || 
        p.id?.toString() === item.product_id
      ) || null

      if (product) {
        const basePrice = getPriceForType(product)

        // 1. Check per-product override (highest priority)
        if (product.id && productOverrides[product.id] !== undefined) {
          product.display_price = productOverrides[product.id]
          product.price_source = 'product_override'
        }
        // 2. Check tier discount
        else if (tierDiscountPct > 0) {
          product.display_price = Math.round(basePrice * (1 - tierDiscountPct / 100) * 100) / 100
          product.price_source = 'tier_discount'
        }
        // 3. Base customer_type pricing
        else {
          product.display_price = basePrice
          product.price_source = 'base'
        }
      }

      return {
        ...item,
        product,
      }
    })

    return NextResponse.json({ items: itemsWithProducts, customerType })
  } catch (error) {
    console.error('[Cart API] Error fetching cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { product_id, quantity } = await request.json()
    
    console.log('[Cart API] POST request - product_id:', product_id, 'quantity:', quantity)
    
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Cart API] Not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Cart items table uses auth.users.id directly
    const cartUserId = user.id
    console.log('[Cart API] Using auth.users.id for cart:', cartUserId)
    
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', cartUserId)
      .eq('product_id', product_id)
      .maybeSingle()
    
    if (checkError) {
      console.error('[Cart API] Error checking existing item:', checkError)
      throw checkError
    }

    if (existingItem) {
      console.log('[Cart API] Updating existing cart item:', existingItem.id)
      // Update quantity if item exists
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingItem.id)

      if (updateError) {
        console.error('[Cart API] Update error:', updateError)
        throw updateError
      }
    } else {
      console.log('[Cart API] Inserting new cart item for auth user:', cartUserId)
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: cartUserId,  // Use auth.users.id
          product_id,
          quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('[Cart API] Insert error:', insertError)
        throw insertError
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Cart API] Error adding to cart:', error)
    console.error('[Cart API] Error stack:', error?.stack)
    console.error('[Cart API] Error details:', {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { product_id, quantity } = await request.json()
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use auth.users.id directly
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)  // Use auth.users.id
      .eq('product_id', product_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Cart API] Error updating cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { product_id } = await request.json()
    console.log('[Cart API] DELETE request - product_id:', product_id)
    
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Cart API] DELETE - Not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    console.log('[Cart API] DELETE - Removing item for user:', user.id, 'product:', product_id)

    // First check if the item exists
    const { data: existing, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()
    
    if (checkError || !existing) {
      console.log('[Cart API] DELETE - Item not found in cart')
      // Still return success to avoid UI errors
      return NextResponse.json({ success: true })
    }

    // Use auth.users.id directly
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)  // Use auth.users.id
      .eq('product_id', product_id)

    if (error) {
      console.error('[Cart API] DELETE - Error:', error)
      throw error
    }
    
    console.log('[Cart API] DELETE - Successfully removed item')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Cart API] Error removing from cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}