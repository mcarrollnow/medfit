import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    const supabase = await createServerClient()
    const orderId = params.id
    
    // Parse body
    const body = await request.json()
    const { tracking_number, carrier, ship_date, estimated_delivery } = body

    // Build update object
    const updateData: any = {
      shipped_at: new Date().toISOString(),
      status: 'shipped'
    }

    // Add tracking info if provided
    if (tracking_number) {
      updateData.tracking_number = tracking_number
    }
    if (carrier) {
      updateData.shipping_carrier = carrier
    }
    if (ship_date) {
      updateData.ship_date = ship_date
    }
    if (estimated_delivery) {
      updateData.estimated_delivery = estimated_delivery
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (error) {
      console.error('Error marking as shipped:', error)
      return NextResponse.json({ error: { message: 'Failed to mark as shipped' } }, { status: 500 })
    }

    // Get order details for notification
    const { data: order } = await supabase
      .from('orders')
      .select(`
        order_number,
        customers:customer_id (
          users:user_id (
            id,
            email,
            first_name
          )
        )
      `)
      .eq('id', orderId)
      .single()

    // Create notification for customer
    if (order?.customers?.users?.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: order.customers.users.id,
          type: 'order_update',
          title: `Order #${order.order_number} - Shipped!`,
          message: tracking_number 
            ? `Your order has been shipped with tracking number ${tracking_number}`
            : `Your order has been shipped and is on its way!`,
          order_id: orderId,
          read: false,
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking as shipped:', error)
    return NextResponse.json({ error: { message: 'Failed to mark as shipped' } }, { status: 500 })
  }
}
