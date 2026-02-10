import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to create a shipping label print job from an order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id } = body
    
    console.log('[Print Job] Received request:', { order_id, hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY })

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      )
    }

    // Fetch order with customer details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        tracking_number,
        shipping_carrier,
        customers (
          id,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_zip,
          shipping_country,
          phone,
          company_name,
          users!customers_user_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        ),
        order_items (
          id,
          product_name,
          product_barcode,
          quantity,
          unit_price
        )
      `)
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      console.error('[Print Job] Order lookup failed:', { order_id, orderError })
      return NextResponse.json(
        { error: 'Order not found', details: orderError?.message, order_id },
        { status: 404 }
      )
    }

    // Extract customer info
    const customer = order.customers
    const user = Array.isArray(customer?.users) ? customer.users[0] : customer?.users

    // Build recipient address
    const recipient = {
      name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Customer',
      company: customer?.company_name,
      address_line1: customer?.shipping_address_line1 || '',
      address_line2: customer?.shipping_address_line2,
      city: customer?.shipping_city || '',
      state: customer?.shipping_state || '',
      zip: customer?.shipping_zip || '',
      country: customer?.shipping_country || 'US',
      phone: user?.phone || customer?.phone
    }

    // Sender address (your business)
    const sender = {
      name: 'Medfit 90',
      company: 'Medfit 90',
      address_line1: process.env.BUSINESS_ADDRESS_LINE1 || '123 Business St',
      city: process.env.BUSINESS_CITY || 'Los Angeles',
      state: process.env.BUSINESS_STATE || 'CA',
      zip: process.env.BUSINESS_ZIP || '90001',
      country: 'US'
    }

    // Create the print job
    const { data: printJob, error: printError } = await supabase
      .from('print_jobs')
      .insert({
        job_type: 'shipping_label',
        order_id: order.id,
        order_number: order.order_number,
        label_data: {
          recipient,
          sender,
          order_number: order.order_number,
          order_date: order.created_at,
          tracking_number: order.tracking_number,
          carrier: order.shipping_carrier,
          items: order.order_items?.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            barcode: item.product_barcode
          }))
        },
        priority: 1, // Shipping labels are high priority
        created_by: 'api:create-shipping-label'
      })
      .select()
      .single()

    if (printError) throw printError

    return NextResponse.json({ 
      success: true,
      job: printJob,
      message: 'Shipping label queued for printing'
    })
  } catch (error) {
    console.error('Error creating shipping label:', error)
    return NextResponse.json(
      { error: 'Failed to create shipping label' },
      { status: 500 }
    )
  }
}
