import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        customer:customers(
          id,
          customer_type,
          company_name,
          shipping_address_line1,
          shipping_city,
          shipping_state,
          shipping_zip,
          user:users!customers_user_id_fkey(email, phone, first_name, last_name)
        ),
        order:orders(
          order_number,
          status,
          total_amount,
          created_at,
          tracking_number
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Tickets API] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tickets: tickets || [] })
  } catch (error) {
    console.error('[Tickets API] Exception:', error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { ticketId, status, ai_handling } = body

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 })
    }

    const updates: any = {}
    if (status) updates.status = status
    if (ai_handling !== undefined) updates.ai_handling = ai_handling
    
    // Add closed_at timestamp when resolving
    if (status === 'resolved' || status === 'closed') {
      updates.closed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single()

    if (error) {
      console.error('[Tickets API] Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ticket: data })
  } catch (error) {
    console.error('[Tickets API] Exception:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
