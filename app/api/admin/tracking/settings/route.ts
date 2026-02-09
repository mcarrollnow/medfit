import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

// GET - Load tracking settings
export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get settings from app_settings table
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'tracking_email_settings')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error loading tracking settings:', error)
      return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
    }

    const settings = data?.value || {
      webhook_url: '',
      api_key: '',
      enabled: true
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error in tracking settings GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Save tracking settings
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const settings = await request.json()

    // Upsert settings
    const { error } = await supabase
      .from('app_settings')
      .upsert({
        key: 'tracking_email_settings',
        value: settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })

    if (error) {
      console.error('Error saving tracking settings:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in tracking settings POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

