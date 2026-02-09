import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

// GET - List all transactional email templates
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('transactional_email_templates')
      .select('*')
      .order('name')

    if (error) {
      console.error('[Email Templates] Error fetching:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ templates: data || [] })
  } catch (error: any) {
    console.error('[Email Templates] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update a template
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const body = await request.json()
    const { id, subject, html_content, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (subject !== undefined) updateData.subject = subject
    if (html_content !== undefined) updateData.html_content = html_content
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from('transactional_email_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Email Templates] Error updating:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ template: data })
  } catch (error: any) {
    console.error('[Email Templates] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
