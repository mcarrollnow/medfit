import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: { message: authResult.error || 'Unauthorized' } }, { status: 401 })
    }

    const body = await request.json()
    const { customerId, repId } = body

    if (!customerId) {
      return NextResponse.json({ error: { message: 'Customer ID is required' } }, { status: 400 })
    }

    const supabase = await createServerClient()

    // If repId is provided, verify it's a valid rep
    if (repId) {
      const { data: rep, error: repError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', repId)
        .single()

      if (repError || !rep || rep.role !== 'rep') {
        return NextResponse.json({ error: { message: 'Invalid rep ID' } }, { status: 400 })
      }
    }

    // Update customer with rep assignment (or remove assignment if repId is null)
    const { data: customer, error: updateError } = await supabase
      .from('customers')
      .update({ rep_id: repId || null })
      .eq('id', customerId)
      .select()
      .single()

    if (updateError) {
      console.error('Error assigning rep:', updateError)
      return NextResponse.json({ error: { message: 'Failed to assign rep' } }, { status: 500 })
    }

    if (!customer) {
      return NextResponse.json({ error: { message: 'Customer not found' } }, { status: 404 })
    }

    return NextResponse.json({ 
      message: repId ? 'Rep assigned successfully' : 'Rep unassigned successfully',
      customer 
    })
  } catch (error) {
    console.error('Error assigning rep:', error)
    return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 })
  }
}
