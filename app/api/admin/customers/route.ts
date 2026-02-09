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

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[Admin Customers] Supabase admin client not available')
      return NextResponse.json({ error: { message: 'Server configuration error' } }, { status: 500 })
    }

    // Get all customers with user info, rep info, orders, and default wallet
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        company_name,
        customer_type,
        phone,
        shipping_address_line1,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        notes,
        rep_id,
        default_wallet_id,
        created_at,
        users:user_id (
          email,
          first_name,
          last_name,
          role,
          commission_rate
        ),
        rep:rep_id (
          first_name,
          last_name,
          email
        ),
        default_wallet:default_wallet_id (
          id,
          label,
          address,
          currency
        ),
        orders (
          id,
          total_amount,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (customersError) {
      console.error('Error fetching customers:', customersError)
      return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
    }

    // Transform data and calculate aggregates
    const transformedCustomers = customers?.map(customer => {
      const orders = customer.orders || []
      const totalOrders = orders.length
      const totalSpent = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)
      const lastOrderDate = orders.length > 0 
        ? orders.reduce((latest, order) => {
            const orderDate = new Date(order.created_at)
            return orderDate > new Date(latest) ? order.created_at : latest
          }, orders[0].created_at)
        : null

      // Handle users being an array or object
      const userInfo = Array.isArray(customer.users) 
        ? customer.users[0] 
        : customer.users
      
      // Handle rep being an array or object  
      const repInfo = Array.isArray(customer.rep)
        ? customer.rep[0]
        : customer.rep

      return {
        id: customer.id,
        user_id: customer.user_id,
        company_name: customer.company_name,
        customer_type: customer.customer_type,
        phone: customer.phone,
        shipping_address_line1: customer.shipping_address_line1,
        shipping_city: customer.shipping_city,
        shipping_state: customer.shipping_state,
        shipping_zip: customer.shipping_zip,
        shipping_country: customer.shipping_country,
        notes: customer.notes,
        rep_id: customer.rep_id,
        rep_name: repInfo ? `${repInfo.first_name} ${repInfo.last_name}` : null,
        default_wallet_id: customer.default_wallet_id,
        default_wallet: customer.default_wallet,
        created_at: customer.created_at,
        email: userInfo?.email || null,
        first_name: userInfo?.first_name || null,
        last_name: userInfo?.last_name || null,
        user_role: userInfo?.role || 'customer',
        commission_rate: userInfo?.commission_rate || 0,
        total_orders: totalOrders,
        total_spent: totalSpent,
        last_order_date: lastOrderDate
      }
    }) || []

    // Return with no-cache headers
    return NextResponse.json(transformedCustomers, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
  }
}
