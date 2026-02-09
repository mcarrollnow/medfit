import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    const resolvedParams = await context.params
    const orderId = resolvedParams.id
    
    // Parse body
    const body = await request.json()
    const {
      items,
      shipping_address,
      tracking_number,
      shipping_carrier,
      notes,
      subtotal,
      shipping_amount,
      discount_amount,
      tax_amount,
      total_amount,
      discount_code_id,
      stripe_payment_intent_id,
      status,
      payment_status
    } = body

    console.log('[Update Order] Updating order:', orderId)

    // Start a transaction-like update process
    
    // 1. Update order items if provided
    if (items && Array.isArray(items)) {
      // Get existing items
      const { data: existingItems } = await supabase
        .from('order_items')
        .select('id')
        .eq('order_id', orderId)

      const existingItemIds = existingItems?.map(i => i.id) || []
      const updatedItemIds = items.filter(i => i.id).map(i => i.id)

      // Delete removed items
      const itemsToDelete = existingItemIds.filter(id => !updatedItemIds.includes(id))
      if (itemsToDelete.length > 0) {
        await supabase
          .from('order_items')
          .delete()
          .in('id', itemsToDelete)
      }

      // Update or insert items
      for (const item of items) {
        const itemData = {
          order_id: orderId,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price),
          total_price: parseFloat(item.quantity) * parseFloat(item.unit_price)
        }

        if (item.id) {
          // Update existing item
          await supabase
            .from('order_items')
            .update(itemData)
            .eq('id', item.id)
        } else {
          // Insert new item
          await supabase
            .from('order_items')
            .insert(itemData)
        }
      }

      console.log('[Update Order] Updated order items')
    }

    // 2. Update shipping address if provided
    if (shipping_address) {
      const { data: order } = await supabase
        .from('orders')
        .select('customer_id')
        .eq('id', orderId)
        .single()

      if (order?.customer_id) {
        await supabase
          .from('customers')
          .update({
            shipping_address_line1: shipping_address.line1,
            shipping_city: shipping_address.city,
            shipping_state: shipping_address.state,
            shipping_zip: shipping_address.zip,
            shipping_country: shipping_address.country || 'USA'
          })
          .eq('id', order.customer_id)

        console.log('[Update Order] Updated shipping address')
      }
    }

    // 3. Calculate new totals if amounts provided
    let updateData: any = {}

    if (subtotal !== undefined) {
      updateData.subtotal = parseFloat(subtotal)
    }
    if (shipping_amount !== undefined) {
      updateData.shipping_amount = parseFloat(shipping_amount)
    }
    if (discount_amount !== undefined) {
      updateData.discount_amount = parseFloat(discount_amount)
    }
    if (tax_amount !== undefined) {
      updateData.tax_amount = parseFloat(tax_amount)
    }
    if (discount_code_id !== undefined) {
      updateData.discount_code_id = discount_code_id || null
    }

    // Use provided total or calculate it
    if (total_amount !== undefined) {
      updateData.total_amount = parseFloat(total_amount)
    } else if (subtotal !== undefined || shipping_amount !== undefined || discount_amount !== undefined || tax_amount !== undefined) {
      const finalSubtotal = subtotal !== undefined ? parseFloat(subtotal) : 0
      const finalShipping = shipping_amount !== undefined ? parseFloat(shipping_amount) : 0
      const finalDiscount = discount_amount !== undefined ? parseFloat(discount_amount) : 0
      const finalTax = tax_amount !== undefined ? parseFloat(tax_amount) : 0
      
      updateData.total_amount = finalSubtotal + finalShipping + finalTax - finalDiscount
    }
    
    // Update status fields
    if (status !== undefined) {
      updateData.status = status
    }
    if (payment_status !== undefined) {
      updateData.payment_status = payment_status
    }

    // 4. Update tracking info if provided
    if (tracking_number !== undefined) {
      updateData.tracking_number = tracking_number
    }
    if (shipping_carrier !== undefined) {
      updateData.shipping_carrier = shipping_carrier
    }

    // 5. Update notes if provided
    if (notes !== undefined) {
      updateData.notes = notes
    }

    // 6. Update Stripe payment intent ID if provided
    if (stripe_payment_intent_id !== undefined) {
      updateData.stripe_payment_intent_id = stripe_payment_intent_id || null
    }

    // Update order
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
      }

      console.log('[Update Order] Updated order details')
    }

    // Return updated order
    const { data: updatedOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (fetchError) {
      console.error('Error fetching updated order:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch updated order' }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    const resolvedParams = await context.params
    const orderId = resolvedParams.id
    
    console.log('[Admin Order GET] Fetching order:', orderId)

    // Get order details with related data
    // Note: Using * already includes all columns including refund fields if they exist
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (
          id,
          customer_type,
          company_name,
          phone,
          users:user_id (
            first_name,
            last_name,
            email,
            phone
          ),
          shipping_address_line1,
          shipping_city,
          shipping_state,
          shipping_zip,
          shipping_country
        ),
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('[Admin Order GET] Error fetching order:', orderId, error)
      return NextResponse.json({ error: 'Order not found', details: error.message }, { status: 404 })
    }

    console.log('[Admin Order GET] Found order:', order?.order_number)
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    const resolvedParams = await context.params
    const orderId = resolvedParams.id
    
    console.log('[Admin Order DELETE] Deleting order:', orderId)

    // Delete or nullify all related records before deleting the order
    // Some tables have ON DELETE CASCADE/SET NULL, but we handle them explicitly for reliability
    
    // 1. Delete order items (has ON DELETE CASCADE, but explicit is safer)
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('[Admin Order DELETE] Error deleting order items:', itemsError)
    }

    // 2. Delete payment events
    const { error: eventsError } = await supabase
      .from('payment_events')
      .delete()
      .eq('order_id', orderId)

    if (eventsError) {
      console.log('[Admin Order DELETE] Error deleting payment events (may not exist):', eventsError.message)
    }

    // 3. Delete payment events (legacy table)
    const { error: stripeEventsError } = await supabase
      .from('stripe_payment_events')
      .delete()
      .eq('order_id', orderId)

    if (stripeEventsError) {
      console.log('[Admin Order DELETE] Error deleting payment events (may not exist):', stripeEventsError.message)
    }

    // 4. Delete notifications
    const { error: notificationsError } = await supabase
      .from('notifications')
      .delete()
      .eq('order_id', orderId)

    if (notificationsError) {
      console.log('[Admin Order DELETE] Error deleting notifications (may not exist):', notificationsError.message)
    }

    // 5. Delete discount usage
    const { error: discountError } = await supabase
      .from('discount_usage')
      .delete()
      .eq('order_id', orderId)

    if (discountError) {
      console.log('[Admin Order DELETE] Error deleting discount usage (may not exist):', discountError.message)
    }

    // 6. Delete refund timeline
    const { error: refundError } = await supabase
      .from('refund_timeline')
      .delete()
      .eq('order_id', orderId)

    if (refundError) {
      console.log('[Admin Order DELETE] Error deleting refund timeline (may not exist):', refundError.message)
    }

    // 7. Delete order pricing breakdown
    const { error: pricingError } = await supabase
      .from('order_pricing_breakdown')
      .delete()
      .eq('order_id', orderId)

    if (pricingError) {
      console.log('[Admin Order DELETE] Error deleting order pricing (may not exist):', pricingError.message)
    }

    // 8. Set order_id to null for tables with SET NULL behavior
    // wallet_transactions
    await supabase
      .from('wallet_transactions')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // customer_wallet_transactions
    await supabase
      .from('customer_wallet_transactions')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // support_tickets
    await supabase
      .from('support_tickets')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // sms_logs
    await supabase
      .from('sms_logs')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // crypto_assistant_sessions
    await supabase
      .from('crypto_assistant_sessions')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // print_jobs
    await supabase
      .from('print_jobs')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // unmatched_tracking
    await supabase
      .from('unmatched_tracking')
      .update({ matched_order_id: null })
      .eq('matched_order_id', orderId)

    // ai_agent_activity
    await supabase
      .from('ai_agent_activity')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // customer_assigned_discounts
    await supabase
      .from('customer_assigned_discounts')
      .update({ used_on_order_id: null })
      .eq('used_on_order_id', orderId)

    // invoices (if they have order_id)
    await supabase
      .from('invoices')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // rep_commissions - delete these as they won't make sense without the order
    await supabase
      .from('rep_commissions')
      .delete()
      .eq('order_id', orderId)

    // message_threads
    await supabase
      .from('message_threads')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // points_transactions
    await supabase
      .from('points_transactions')
      .update({ order_id: null })
      .eq('order_id', orderId)

    // referral_tracking
    await supabase
      .from('referral_tracking')
      .update({ order_id: null })
      .eq('order_id', orderId)

    console.log('[Admin Order DELETE] Cleaned up related records')

    // Finally delete the order
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (orderError) {
      console.error('[Admin Order DELETE] Error deleting order:', orderError)
      return NextResponse.json({ error: 'Failed to delete order', details: orderError.message }, { status: 500 })
    }

    console.log('[Admin Order DELETE] Order deleted successfully:', orderId)
    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
