import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

// CORS headers for mobile app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-mobile-api-key, Authorization',
}

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Verify mobile API key
function verifyMobileApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-mobile-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  const validKey = process.env.MOBILE_API_KEY
  
  if (!validKey) {
    console.warn('[Mobile API] MOBILE_API_KEY not configured')
    return false
  }
  
  return apiKey === validKey
}

// GET order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const { id } = await params
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customers (
          id,
          company_name,
          phone,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_zip,
          users:user_id (
            id,
            email,
            first_name,
            last_name
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('[Mobile Orders] Error fetching order:', error)
      return NextResponse.json({ error: 'Order not found' }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json(order, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Orders] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

// PUT update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const { id } = await params
    const body = await request.json()
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    // Build update object
    const updateData: any = {}
    
    if (body.status) {
      updateData.status = body.status
    }
    
    if (body.tracking_number) {
      updateData.tracking_number = body.tracking_number
    }
    
    if (body.shipping_carrier) {
      updateData.shipping_carrier = body.shipping_carrier
    }
    
    if (body.payment_status) {
      updateData.payment_status = body.payment_status
    }

    if (body.notes) {
      updateData.notes = body.notes
    }

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        order_items (*),
        customers (
          id,
          company_name,
          phone,
          shipping_address_line1,
          shipping_city,
          shipping_state,
          shipping_zip,
          users:user_id (
            id,
            email,
            first_name,
            last_name
          )
        )
      `)
      .single()

    if (error) {
      console.error('[Mobile Orders] Error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500, headers: corsHeaders })
    }

    console.log('[Mobile Orders] Order updated:', id, updateData)

    return NextResponse.json({ success: true, order }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Orders] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
