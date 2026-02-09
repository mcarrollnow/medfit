import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error } }, { status: 401 })
    }

    const supabase = await createServerClient()
    const userId = authResult.user?.id

    console.log('[my-orders] Fetching orders for user:', userId)

    // First, get the customer ID for this user
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (customerError || !customer) {
      console.log('[my-orders] No customer record found for user:', userId)
      return NextResponse.json([])
    }

    console.log('[my-orders] Found customer:', customer.id)

    // Query orders directly by customer_id - this catches all orders
    // including those that were originally guest orders and later linked
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        subtotal,
        shipping_amount,
        total_amount,
        discount_amount,
        discount_code_id,
        created_at,
        invoice_sent_at,
        payment_date,
        payment_verified_at,
        shipped_at,
        payment_url,
        payment_status,
        payment_method,
        transaction_hash,
        assigned_wallet_id,
        expected_payment_amount,
        approved_amount,
        tracking_number,
        shipping_carrier,
        notes,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
    
    console.log('[my-orders] Query result:', { count: ordersData?.length || 0, error: ordersError?.message })

    if (ordersError) {
      console.error('Orders query error:', ordersError)
      return NextResponse.json({ error: { message: 'Failed to fetch orders' } }, { status: 500 })
    }

    // Helper function to ensure timestamps are in ISO format with UTC indicator
    const formatTimestamp = (timestamp: string | null) => {
      if (!timestamp) return null
      const date = new Date(timestamp)
      return date.toISOString()
    }

    // Process orders - items are already included from the join
    const ordersWithItems = (ordersData || []).map((order) => {
      // Calculate status display
      const statusMap: Record<string, string> = {
        'pending': 'Order Received',
        'pending_payment': 'Awaiting Payment',
        'payment_processing': 'Payment Processing',
        'paid': 'Payment Confirmed',
        'processing': 'Being Prepared',
        'shipped': 'On Its Way',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
      }

      const { order_items, ...orderData } = order

      return {
        ...orderData,
        created_at: formatTimestamp(order.created_at),
        invoice_sent_at: formatTimestamp(order.invoice_sent_at),
        payment_date: formatTimestamp(order.payment_date),
        payment_verified_at: formatTimestamp(order.payment_verified_at),
        shipped_at: formatTimestamp(order.shipped_at),
        items: order_items || [],
        item_count: order_items?.length || 0,
        status_display: statusMap[order.status] || order.status,
        calculated_total: order.subtotal + (order.shipping_amount || 0)
      }
    })

    console.log('Order fetch completed:', {
      orderCount: ordersWithItems.length,
      userId: userId?.substring(0, 8) + '...'
    })

    return NextResponse.json(ordersWithItems)
  } catch (error: any) {
    console.error('Error fetching orders:', {
      message: error.message,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({ error: { message: 'Unable to fetch orders' } }, { status: 500 })
  }
}
