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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    // Get customers with their order stats
    let query = supabase
      .from('customers')
      .select(`
        id,
        company_name,
        phone,
        created_at,
        shipping_city,
        shipping_state,
        users:user_id (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: customers, error } = await query

    if (error) {
      console.error('[Mobile Customers List] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
    }

    // Get order counts for each customer
    const customerIds = customers?.map(c => c.id) || []
    
    const { data: orderStats } = await supabase
      .from('orders')
      .select('customer_id, total_amount')
      .in('customer_id', customerIds)

    // Calculate stats per customer
    const statsMap = new Map<string, { orders: number; totalSpent: number }>()
    orderStats?.forEach((o: any) => {
      const existing = statsMap.get(o.customer_id) || { orders: 0, totalSpent: 0 }
      statsMap.set(o.customer_id, {
        orders: existing.orders + 1,
        totalSpent: existing.totalSpent + (o.total_amount || 0),
      })
    })

    // Format response
    const formattedCustomers = customers?.map((c: any) => {
      const stats = statsMap.get(c.id) || { orders: 0, totalSpent: 0 }
      const name = c.users 
        ? `${c.users.first_name || ''} ${c.users.last_name || ''}`.trim()
        : c.company_name || 'Unknown'
      
      // Determine status based on activity
      let status: 'active' | 'inactive' | 'new' = 'inactive'
      if (stats.orders > 0) {
        status = 'active'
      }
      const createdAt = new Date(c.created_at)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      if (createdAt > thirtyDaysAgo && stats.orders === 0) {
        status = 'new'
      }

      return {
        id: c.id,
        name,
        email: c.users?.email || '',
        phone: c.phone || '',
        company: c.company_name || '',
        city: c.shipping_city || '',
        state: c.shipping_state || '',
        orders: stats.orders,
        totalSpent: stats.totalSpent,
        status,
        created_at: c.created_at,
      }
    }) || []

    // Filter by search if provided
    let filteredCustomers = formattedCustomers
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCustomers = formattedCustomers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.company.toLowerCase().includes(searchLower)
      )
    }

    // Calculate totals
    const totalCustomers = filteredCustomers.length
    const newCustomers = filteredCustomers.filter(c => c.status === 'new').length
    const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length

    return NextResponse.json({ 
      customers: filteredCustomers,
      stats: {
        total: totalCustomers,
        new: newCustomers,
        active: activeCustomers,
      }
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Customers List] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
