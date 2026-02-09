import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-mobile-api-key, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

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

export async function GET(request: NextRequest) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const days = parseInt(searchParams.get('days') || '30')

    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        payment_status,
        created_at,
        tracking_number,
        shipping_carrier,
        guest_name,
        customers (
          id,
          company_name,
          users:user_id (
            first_name,
            last_name,
            email
          )
        )
      `)
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('[Mobile Orders List] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
    }

    // Format response
    const formattedOrders = orders?.map((o: any) => {
      const customerName = o.customers?.users 
        ? `${o.customers.users.first_name || ''} ${o.customers.users.last_name || ''}`.trim()
        : o.customers?.company_name || o.guest_name || 'Guest'
      
      return {
        id: o.id,
        order_number: o.order_number,
        customer_name: customerName,
        total: o.total_amount,
        status: o.status,
        payment_status: o.payment_status,
        created_at: o.created_at,
        tracking_number: o.tracking_number,
        shipping_carrier: o.shipping_carrier,
      }
    }) || []

    return NextResponse.json({ orders: formattedOrders }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Orders List] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
