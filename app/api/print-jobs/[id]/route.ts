import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PATCH - Update print job status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const updates: Record<string, unknown> = {}

    // Allow updating status
    if (body.status) {
      updates.status = body.status
      
      // Set printed_at when completed
      if (body.status === 'completed') {
        updates.printed_at = new Date().toISOString()
      }
    }

    // Allow updating error message
    if (body.last_error !== undefined) {
      updates.last_error = body.last_error
    }

    // Increment attempts on failure
    if (body.status === 'failed' || body.increment_attempts) {
      const { data: current } = await supabase
        .from('print_jobs')
        .select('attempts, max_attempts')
        .eq('id', id)
        .single()

      if (current) {
        updates.attempts = (current.attempts || 0) + 1
        
        // If max attempts reached, mark as permanently failed
        if (updates.attempts >= current.max_attempts) {
          updates.status = 'failed'
        }
      }
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ job: data })
  } catch (error) {
    console.error('Error updating print job:', error)
    return NextResponse.json(
      { error: 'Failed to update print job' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel/remove a print job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft delete by marking as cancelled
    const { data, error } = await supabase
      .from('print_jobs')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('status', 'pending') // Only cancel pending jobs
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ job: data })
  } catch (error) {
    console.error('Error cancelling print job:', error)
    return NextResponse.json(
      { error: 'Failed to cancel print job' },
      { status: 500 }
    )
  }
}
