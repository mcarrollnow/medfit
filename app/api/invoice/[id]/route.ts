import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Get the invoice first
    let query = supabase
      .from('authorize_net_invoices')
      .select('*')

    // Check if it looks like a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    if (isUuid) {
      query = query.eq('id', id)
    } else {
      query = query.eq('invoice_number', id)
    }

    const { data: invoice, error } = await query.single()

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // --- ACCESS CONTROL ---
    let isAuthorized = false
    let isAdmin = false
    let viewerEmail: string | null = null

    try {
      const authClient = await createServerClient()
      const { data: { user } } = await authClient.auth.getUser()
      
      if (user) {
        viewerEmail = user.email || null

        // Get user profile to check role
        const { data: profile } = await supabase
          .from('users')
          .select('id, role, email')
          .eq('auth_id', user.id)
          .single()

        if (profile) {
          // Admins and superadmins can see all invoices
          if (profile.role === 'admin' || profile.role === 'superadmin') {
            isAuthorized = true
            isAdmin = true
          }

          // Reps can see invoices for their assigned customers
          if (profile.role === 'rep') {
            // Check if this rep is assigned to the customer
            const { data: assignment } = await supabase
              .from('customers')
              .select('id')
              .eq('id', invoice.customer_id)
              .eq('assigned_rep_id', profile.id)
              .single()

            if (assignment) {
              isAuthorized = true
              isAdmin = true // Reps get admin-like view
            }
          }

          // Customer access: email must match invoice customer_email
          if (profile.email?.toLowerCase() === invoice.customer_email?.toLowerCase()) {
            isAuthorized = true
          }
        }

        // Fallback: check auth email directly against invoice
        if (!isAuthorized && user.email?.toLowerCase() === invoice.customer_email?.toLowerCase()) {
          isAuthorized = true
        }
      }
    } catch {
      // Not logged in
    }

    // If not authorized, check if this is a new customer who hasn't set up yet
    if (!isAuthorized) {
      // If the invoice has an account_setup_token and hasn't been completed,
      // the customer needs to go through account setup first
      if (invoice.account_setup_token && !invoice.account_setup_completed) {
        return NextResponse.json({ 
          error: 'Account setup required',
          requires_setup: true,
          setup_token: invoice.account_setup_token,
        }, { status: 403 })
      }

      // Otherwise, they just need to sign in
      return NextResponse.json({ 
        error: 'Please sign in to view this invoice',
        requires_auth: true,
      }, { status: 401 })
    }

    // Mark as viewed only if customer viewing (not admin) and not already viewed/paid
    if (!isAdmin && invoice.status === 'sent' && !invoice.viewed_at) {
      await supabase
        .from('authorize_net_invoices')
        .update({ 
          viewed_at: new Date().toISOString(),
          status: 'viewed'
        })
        .eq('id', invoice.id)
    }

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error('[Invoice API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
