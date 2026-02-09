import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // If not authenticated, return empty array
      return NextResponse.json([])
    }

    // For now, return empty notifications array
    // TODO: Implement proper notifications fetching
    return NextResponse.json([])
  } catch (error) {
    console.error('[Notifications API] Error:', error)
    return NextResponse.json([])
  }
}