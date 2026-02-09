import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-mobile-api-key, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

function verifyMobileApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-mobile-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  const validKey = process.env.MOBILE_API_KEY
  
  if (!validKey) return false
  return apiKey === validKey
}

// GET customer details
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

    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('[Mobile Customers] Error fetching customer:', error)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json(customer, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Customers] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

// PUT update customer
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

    // First get the customer to find their user_id
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404, headers: corsHeaders })
    }

    // Update user record if user fields are provided
    if (body.first_name || body.last_name || body.email) {
      const userUpdate: any = {}
      if (body.first_name !== undefined) userUpdate.first_name = body.first_name
      if (body.last_name !== undefined) userUpdate.last_name = body.last_name
      if (body.email !== undefined) userUpdate.email = body.email
      if (body.phone !== undefined) userUpdate.phone = body.phone

      const { error: userError } = await supabase
        .from('users')
        .update(userUpdate)
        .eq('id', existingCustomer.user_id)

      if (userError) {
        console.error('[Mobile Customers] Error updating user:', userError)
      }
    }

    // Build customer update object
    const customerUpdate: any = {}
    
    if (body.company_name !== undefined) {
      customerUpdate.company_name = body.company_name
    }
    if (body.phone !== undefined) {
      customerUpdate.phone = body.phone
    }
    if (body.shipping_address_line1 !== undefined) {
      customerUpdate.shipping_address_line1 = body.shipping_address_line1
    }
    if (body.shipping_address_line2 !== undefined) {
      customerUpdate.shipping_address_line2 = body.shipping_address_line2
    }
    if (body.shipping_city !== undefined) {
      customerUpdate.shipping_city = body.shipping_city
    }
    if (body.shipping_state !== undefined) {
      customerUpdate.shipping_state = body.shipping_state
    }
    if (body.shipping_zip !== undefined) {
      customerUpdate.shipping_zip = body.shipping_zip
    }
    if (body.customer_type !== undefined) {
      customerUpdate.customer_type = body.customer_type
    }

    // Update customer record
    const { data: customer, error } = await supabase
      .from('customers')
      .update(customerUpdate)
      .eq('id', id)
      .select(`
        *,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          phone
        )
      `)
      .single()

    if (error) {
      console.error('[Mobile Customers] Error updating customer:', error)
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500, headers: corsHeaders })
    }

    console.log('[Mobile Customers] Customer updated:', id)

    return NextResponse.json({ success: true, customer }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Customers] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
