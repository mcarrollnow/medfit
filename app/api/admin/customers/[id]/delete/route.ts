import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const { id: customerId } = await params

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    console.log('[Delete Customer] Starting deletion for customer:', customerId)

    // Step 1: Get the customer record to find the user_id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, user_id')
      .eq('id', customerId)
      .single()

    if (customerError || !customer) {
      console.error('[Delete Customer] Customer not found:', customerError)
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    console.log('[Delete Customer] Found customer, user_id:', customer.user_id)

    let authUserId: string | null = null

    // Step 2: Get the user record to find auth_id
    if (customer.user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, auth_id, email')
        .eq('id', customer.user_id)
        .single()

      if (user) {
        authUserId = user.auth_id
        console.log('[Delete Customer] Found user record, auth_id:', authUserId, 'email:', user.email)
      } else {
        console.log('[Delete Customer] No user record found:', userError?.message)
      }
    }

    // Step 3: Delete related records first (to avoid foreign key constraints)
    
    // Delete customer assigned discounts
    const { error: discountsError } = await supabase
      .from('customer_assigned_discounts')
      .delete()
      .eq('customer_id', customerId)
    
    if (discountsError) {
      console.log('[Delete Customer] Error deleting assigned discounts (may not exist):', discountsError.message)
    }

    // Delete customer messages if exists
    const { error: messagesError } = await supabase
      .from('customer_messages')
      .delete()
      .eq('customer_id', customerId)
    
    if (messagesError) {
      console.log('[Delete Customer] Error deleting customer messages (may not exist):', messagesError.message)
    }

    // Delete reward points log if exists
    const { error: pointsLogError } = await supabase
      .from('reward_points_log')
      .delete()
      .eq('customer_id', customerId)
    
    if (pointsLogError) {
      console.log('[Delete Customer] Error deleting reward points log (may not exist):', pointsLogError.message)
    }

    // Note: We're NOT deleting orders - they should be kept for business records
    // Instead, we'll just nullify the customer_id on orders
    const { error: ordersError } = await supabase
      .from('orders')
      .update({ customer_id: null })
      .eq('customer_id', customerId)
    
    if (ordersError) {
      console.log('[Delete Customer] Error updating orders (may not exist):', ordersError.message)
    }

    // Step 4: Delete the customer record
    const { error: deleteCustomerError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)

    if (deleteCustomerError) {
      console.error('[Delete Customer] Error deleting customer record:', deleteCustomerError)
      return NextResponse.json({ 
        error: 'Failed to delete customer record', 
        details: deleteCustomerError.message 
      }, { status: 500 })
    }

    console.log('[Delete Customer] Deleted customer record')

    // Step 5: Delete the user record from users table
    if (customer.user_id) {
      const { error: deleteUserError } = await supabase
        .from('users')
        .delete()
        .eq('id', customer.user_id)

      if (deleteUserError) {
        console.error('[Delete Customer] Error deleting user record:', deleteUserError)
        // Don't fail here, continue to try to delete auth user
      } else {
        console.log('[Delete Customer] Deleted user record')
      }
    }

    // Step 6: Delete the auth user from Supabase Auth
    if (authUserId) {
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authUserId)

      if (deleteAuthError) {
        console.error('[Delete Customer] Error deleting auth user:', deleteAuthError)
        // Log but don't fail - the main records are deleted
        return NextResponse.json({ 
          success: true,
          warning: 'Customer deleted but auth user may still exist',
          details: deleteAuthError.message
        })
      } else {
        console.log('[Delete Customer] Deleted auth user')
      }
    }

    console.log('[Delete Customer] Complete deletion successful')

    return NextResponse.json({ 
      success: true,
      message: 'Customer completely deleted from all tables',
      deleted: {
        customer_id: customerId,
        user_id: customer.user_id,
        auth_user_id: authUserId
      }
    })

  } catch (error) {
    console.error('[Delete Customer] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

