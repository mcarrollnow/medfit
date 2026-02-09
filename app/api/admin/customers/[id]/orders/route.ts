import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const resolvedParams = await context.params
    const customerId = resolvedParams.id

    // Fetch customer orders - use basic columns that definitely exist
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount,
        created_at,
        payment_date
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[Customer Orders] Error:', error)
      // Return empty array instead of error to not break the UI
      return NextResponse.json([])
    }

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error('[Customer Orders] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

