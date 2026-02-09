import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const {
      orderId,
      transactionId,   // Authorize.net transaction ID
      paymentMethod
    } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    // Verify the order belongs to this user
    const { data: order } = await supabase
      .from('orders')
      .select('id, customer_id')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer || customer.id !== order.customer_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Build update object based on payment provider
    const updateData: Record<string, any> = {
      payment_status: 'paid',
      status: 'processing',
      payment_method: paymentMethod || 'card',
      payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Set Authorize.net transaction ID if provided
    if (transactionId) {
      updateData.authorize_net_transaction_id = transactionId
      updateData.payment_provider = 'authorize_net'
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      console.error('[Orders] Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    console.log(`[Orders] Payment confirmed for order ${orderId}`)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[Orders] Confirm payment error:', error)
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 })
  }
}
