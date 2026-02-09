import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

// POST - Mark invoice as paid
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    const body = await request.json()
    const { transactionId } = body

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Update invoice status
    const { data: invoice, error } = await supabase
      .from('authorize_net_invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        transaction_id: transactionId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) {
      console.error('[Invoice] Error marking as paid:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[Invoice] Marked as paid:', invoiceId, 'Transaction:', transactionId)

    return NextResponse.json({ success: true, invoice })
  } catch (error: any) {
    console.error('[Invoice] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
