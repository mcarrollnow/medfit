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
    const orderId = resolvedParams.id

    // Get payment events for this order
    const { data: events, error } = await supabase
      .from('stripe_payment_events')
      .select(`
        id,
        stripe_event_id,
        stripe_payment_intent_id,
        stripe_checkout_session_id,
        event_type,
        status,
        amount,
        currency,
        failure_code,
        failure_message,
        payment_method_type,
        payment_method_last4,
        payment_method_brand,
        customer_email,
        receipt_url,
        event_timestamp,
        created_at
      `)
      .eq('order_id', orderId)
      .order('event_timestamp', { ascending: false })

    if (error) {
      console.error('[Payment Events] Error fetching events:', error)
      return NextResponse.json({ error: 'Failed to fetch payment events' }, { status: 500 })
    }

    return NextResponse.json(events || [])
  } catch (error) {
    console.error('[Payment Events] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

