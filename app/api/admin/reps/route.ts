import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'
import { createClient } from '@supabase/supabase-js'

// Admin client for user management
const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// GET - List all reps
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    const supabase = getAdminClient()

    const { data: reps, error } = await supabase
      .from('users')
      .select('id, auth_id, email, first_name, last_name, role, commission_rate, total_commission_earned, created_at')
      .eq('role', 'rep')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reps:', error)
      return NextResponse.json({ error: { message: 'Failed to fetch reps' } }, { status: 500 })
    }

    // Get assigned customer counts for each rep
    const repIds = reps?.map(r => r.id) || []
    
    let customerCounts: Record<string, number> = {}
    if (repIds.length > 0) {
      const { data: customers } = await supabase
        .from('customers')
        .select('rep_id')
        .in('rep_id', repIds)

      if (customers) {
        customerCounts = customers.reduce((acc, c) => {
          if (c.rep_id) {
            acc[c.rep_id] = (acc[c.rep_id] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)
      }
    }

    const repsWithCounts = reps?.map(rep => ({
      ...rep,
      assigned_customers: customerCounts[rep.id] || 0
    }))

    return NextResponse.json({ reps: repsWithCounts })
  } catch (error) {
    console.error('Error in GET /api/admin/reps:', error)
    return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
  }
}

// POST - Create a new rep
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    const body = await request.json()
    const { email, password, firstName, lastName, commissionRate } = body

    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: { message: 'Email, password, and first name are required' } },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: { message: 'Password must be at least 8 characters' } },
        { status: 400 }
      )
    }

    const adminClient = getAdminClient()

    // Step 1: Create auth user with rep role in metadata
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        first_name: firstName,
        last_name: lastName || '',
        role: 'rep'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: { message: authError.message || 'Failed to create user' } },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: { message: 'Failed to create user' } },
        { status: 500 }
      )
    }

    // Step 2: Create users table entry
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName || '',
        role: 'rep',
        commission_rate: commissionRate || 5.00 // Default 5% commission
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user record:', userError)
      // Try to clean up auth user if users table insert fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: { message: 'Failed to create user record' } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Rep created successfully',
      rep: {
        id: userData.id,
        auth_id: authData.user.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        commission_rate: userData.commission_rate
      }
    })
  } catch (error) {
    console.error('Error in POST /api/admin/reps:', error)
    return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
  }
}

// PATCH - Update a rep (commission rate, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    const body = await request.json()
    const { repId, commissionRate, firstName, lastName } = body

    if (!repId) {
      return NextResponse.json(
        { error: { message: 'Rep ID is required' } },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Build update object
    const updates: Record<string, any> = {}
    if (commissionRate !== undefined) updates.commission_rate = commissionRate
    if (firstName !== undefined) updates.first_name = firstName
    if (lastName !== undefined) updates.last_name = lastName

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: { message: 'No fields to update' } },
        { status: 400 }
      )
    }

    const { data: rep, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', repId)
      .eq('role', 'rep')
      .select()
      .single()

    if (error) {
      console.error('Error updating rep:', error)
      return NextResponse.json(
        { error: { message: 'Failed to update rep' } },
        { status: 500 }
      )
    }

    if (!rep) {
      return NextResponse.json(
        { error: { message: 'Rep not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Rep updated successfully',
      rep
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/reps:', error)
    return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
  }
}

// DELETE - Delete a rep
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const repId = searchParams.get('repId')

    if (!repId) {
      return NextResponse.json(
        { error: { message: 'Rep ID is required' } },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Get the rep to find auth_id
    const { data: rep, error: fetchError } = await supabase
      .from('users')
      .select('auth_id')
      .eq('id', repId)
      .eq('role', 'rep')
      .single()

    if (fetchError || !rep) {
      return NextResponse.json(
        { error: { message: 'Rep not found' } },
        { status: 404 }
      )
    }

    // Unassign all customers from this rep first
    await supabase
      .from('customers')
      .update({ rep_id: null })
      .eq('rep_id', repId)

    // Delete from users table
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', repId)

    if (deleteError) {
      console.error('Error deleting rep:', deleteError)
      return NextResponse.json(
        { error: { message: 'Failed to delete rep' } },
        { status: 500 }
      )
    }

    // Delete auth user
    const adminClient = getAdminClient()
    await adminClient.auth.admin.deleteUser(rep.auth_id)

    return NextResponse.json({
      message: 'Rep deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/reps:', error)
    return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
  }
}

