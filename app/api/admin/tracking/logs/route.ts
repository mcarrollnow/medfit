import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

// GET - Load recent tracking email processing logs
export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get recent tracking logs from tracking_email_logs table
    const { data, error } = await supabase
      .from('tracking_email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet - return empty logs
      if (error.code === '42P01') {
        return NextResponse.json({ logs: [] })
      }
      console.error('Error loading tracking logs:', error)
      return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 })
    }

    return NextResponse.json({ logs: data || [] })
  } catch (error) {
    console.error('Error in tracking logs GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

