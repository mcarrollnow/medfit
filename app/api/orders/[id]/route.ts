import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    console.log('[Orders API] Fetching order:', orderId)

    // Use admin client to bypass RLS for order lookups
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      // Fallback to regular client
      const regularClient = await getSupabaseServerClient()
      const { data: order, error } = await regularClient
        .from('orders')
        .select(`
          *,
          customer:customers(id, email, name, phone)
        `)
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('[Orders API] Error fetching order:', error)
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(order)
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(id, email, name, phone)
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('[Orders API] Error fetching order:', error)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    console.log('[Orders API] Order found:', {
      id: order.id,
      order_number: order.order_number,
      shipping_address_line1: order.shipping_address_line1,
      shipping_city: order.shipping_city,
      shipping_state: order.shipping_state,
      shipping_zip: order.shipping_zip,
      customer_name: order.customer?.name,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('[Orders API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
