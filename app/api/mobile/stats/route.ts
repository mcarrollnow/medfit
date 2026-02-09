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
  
  if (!validKey) return false
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

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's orders
    const { data: todayOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, payment_status')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())

    if (ordersError) {
      console.error('[Mobile Stats] Orders error:', ordersError)
    }

    // Get pending orders (all time)
    const { data: pendingOrders, error: pendingError } = await supabase
      .from('orders')
      .select('id')
      .in('status', ['pending', 'confirmed', 'processing'])
      .in('payment_status', ['pending', 'paid'])

    if (pendingError) {
      console.error('[Mobile Stats] Pending error:', pendingError)
    }

    // Calculate stats
    const ordersToday = todayOrders?.length || 0
    const revenueToday = todayOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
    const pendingCount = pendingOrders?.length || 0

    return NextResponse.json({
      ordersToday,
      revenueToday,
      pendingOrders: pendingCount,
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Stats] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
