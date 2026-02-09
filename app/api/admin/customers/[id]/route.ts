import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    const { id: customerId } = await params

    // Get customer with all related data
    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        users:user_id (
          email,
          first_name,
          last_name,
          role,
          commission_rate
        ),
        rep:rep_id (
          id,
          first_name,
          last_name,
          email
        ),
        default_wallet:default_wallet_id (
          id,
          label,
          address,
          currency
        ),
        orders (
          id,
          order_number,
          status,
          total_amount,
          created_at,
          payment_date,
          shipped_at
        )
      `)
      .eq('id', customerId)
      .single()

    if (error) {
      console.error('Error fetching customer:', error)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleUpdate(
  request: NextRequest,
  customerId: string
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    const body = await request.json()

    console.log('[Customer Update] Received body for customer:', customerId, body)

    // Separate user-only data from customer data
    // first_name and last_name now exist on BOTH customers and users tables
    const { email, ...customerData } = body

    // Add updated_at timestamp
    const updatePayload = {
      ...customerData,
      updated_at: new Date().toISOString()
    }

    console.log('[Customer Update] Update payload:', updatePayload)

    // Update customer data
    const { data: updatedCustomer, error: customerError } = await supabase
      .from('customers')
      .update(updatePayload)
      .eq('id', customerId)
      .select()
      .single()

    console.log('[Customer Update] Result:', { updatedCustomer, customerError })

    if (customerError) {
      console.error('[Customer Update] Error updating customer:', customerError)
      return NextResponse.json({ error: 'Failed to update customer', details: customerError.message }, { status: 500 })
    }

    if (!updatedCustomer) {
      console.error('[Customer Update] No customer found with id:', customerId)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Sync names and email to the associated user record
    if ((email || body.first_name || body.last_name) && updatedCustomer.user_id) {
      const userData: any = {}
      if (email) userData.email = email
      if (body.first_name !== undefined) userData.first_name = body.first_name
      if (body.last_name !== undefined) userData.last_name = body.last_name

      const { error: userError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', updatedCustomer.user_id)

      if (userError) {
        console.error('[Customer Update] Error updating user data:', userError)
        // Don't fail the whole request if user update fails
      }
    }

    console.log('[Customer Update] Successfully updated customer:', customerId)
    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error('[Customer Update] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return handleUpdate(request, id)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return handleUpdate(request, id)
}
