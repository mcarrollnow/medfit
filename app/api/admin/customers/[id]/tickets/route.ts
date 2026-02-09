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

    // Fetch customer support tickets
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select(`
        id,
        subject,
        status,
        priority,
        created_at
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[Customer Tickets] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }

    return NextResponse.json(tickets || [])
  } catch (error) {
    console.error('[Customer Tickets] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

