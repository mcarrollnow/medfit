import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    // Use service role client for admin access (bypasses RLS)
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('Failed to get admin client')
      return NextResponse.json({ error: { message: 'Server configuration error' } }, { status: 500 })
    }

    // Get all orders with customer info and item counts
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        subtotal,
        shipping_amount,
        total_amount,
        discount_amount,
        discount_code_id,
        created_at,
        invoice_sent_at,
        payment_date,
        payment_failed_at,
        payment_failure_reason,
        shipped_at,
        payment_url,
        approved_amount,
        tracking_number,
        shipping_carrier,
        customer_id,
        payment_method,
        payment_provider,
        card_brand,
        card_last_four,
        authorize_net_transaction_id,
        source,
        customers:customer_id (
          users:user_id (
            first_name,
            last_name,
            email
          )
        ),
        order_items (
          id
        )
      `)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Error fetching admin orders:', ordersError)
      return NextResponse.json({ error: { message: 'Failed to fetch orders' } }, { status: 500 })
    }

    // Helper function to ensure timestamps are in ISO format with UTC indicator
    const formatTimestamp = (timestamp: string | null) => {
      if (!timestamp) return null
      const date = new Date(timestamp)
      return date.toISOString() // Returns format: 2025-10-14T21:49:00.000Z
    }

    // Apply status filter if provided
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    let filteredOrders = orders || []
    
    if (statusFilter && statusFilter !== 'all') {
      filteredOrders = orders?.filter(order => {
        switch (statusFilter) {
          case 'new':
            // New orders: not yet approved (no invoice_sent_at)
            return !order.invoice_sent_at
          case 'pending_payment':
            // Pending payment: approved but not paid (has invoice_sent_at but no payment_date)
            return order.invoice_sent_at && !order.payment_date
          case 'paid':
            // Paid orders: payment received but not shipped (has payment_date but no shipped_at)
            return order.payment_date && !order.shipped_at
          default:
            return true
        }
      }) || []
    }

    // Transform data to match expected structure
    const transformedOrders = filteredOrders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status || 'pending',
      subtotal: order.subtotal,
      shipping_amount: order.shipping_amount,
      total_amount: order.total_amount,
      discount_amount: order.discount_amount || 0,
      discount_code_id: order.discount_code_id || null,
      created_at: formatTimestamp(order.created_at),
      invoice_sent_at: formatTimestamp(order.invoice_sent_at),
      payment_date: formatTimestamp(order.payment_date),
      payment_failed_at: formatTimestamp(order.payment_failed_at),
      payment_failure_reason: order.payment_failure_reason || null,
      shipped_at: formatTimestamp(order.shipped_at),
      payment_url: order.payment_url,
      approved_amount: order.approved_amount,
      tracking_number: order.tracking_number,
      shipping_carrier: order.shipping_carrier,
      customer_id: order.customer_id,
      stripe_payment_intent_id: null,
      stripe_checkout_session_id: null,
      stripe_receipt_url: null,
      payment_method: order.payment_method,
      payment_provider: order.payment_provider,
      card_brand: order.card_brand,
      card_last_four: order.card_last_four,
      authorize_net_transaction_id: order.authorize_net_transaction_id,
      item_count: order.order_items?.length || 0,
      customer_name: (() => {
        const customer = order.customers as any
        const user = customer?.users
        if (Array.isArray(user) && user[0]) {
          return `${user[0].first_name || ''} ${user[0].last_name || ''}`.trim() || 'Guest'
        }
        if (user && !Array.isArray(user)) {
          return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Guest'
        }
        return 'Guest'
      })(),
      customer_email: (() => {
        const customer = order.customers as any
        const user = customer?.users
        if (Array.isArray(user) && user[0]) {
          return user[0].email || 'N/A'
        }
        if (user && !Array.isArray(user)) {
          return user.email || 'N/A'
        }
        return 'N/A'
      })()
    }))

    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json({ error: { message: 'Failed to fetch orders' } }, { status: 500 })
  }
}
